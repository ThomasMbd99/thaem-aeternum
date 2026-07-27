import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Grille de prix officielle : source de vérité côté serveur. Le prix envoyé par le
// client n'est jamais utilisé pour facturer — il ne servait qu'à falsifier le montant.
const SERVER_PRICES: Record<string, number> = {
  '10ml': 9.99,
  '50ml': 44.99,
  'recharge': 34.99,
};
const DISCOVERY_BOX_PRICE = 39.99;
const BUNDLE_UNIT_DISCOUNT = 9.99;

interface CartItem {
  productId: string;
  format: string;
  quantity: number;
  price: number;
  name: string;
  isDiscoveryBox?: boolean;
  selectedPerfumes?: string[];
}

function serverPriceFor(item: CartItem): number {
  if (item.isDiscoveryBox) return DISCOVERY_BOX_PRICE;
  const price = SERVER_PRICES[item.format];
  if (price === undefined) throw new Error(`Format inconnu: ${item.format}`);
  return price;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Configuration Stripe manquante.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { items, shippingCost, address, promoCode, successUrl, cancelUrl, mode_livraison, userId, userEmail } = await req.json() as {
      items: CartItem[];
      shippingCost: number;
      address: any;
      promoCode?: string;
      successUrl: string;
      cancelUrl: string;
      mode_livraison: string;
      userId: string | null;
      userEmail: string;
    };

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    let pricedItems: (CartItem & { serverPrice: number })[];
    try {
      pricedItems = items.map((item) => ({ ...item, serverPrice: serverPriceFor(item) }));
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subtotalCents = pricedItems.reduce(
      (sum, item) => sum + Math.round(item.serverPrice * 100) * item.quantity,
      0
    );

    // Remise "offre duo" (2 flacons 50ml) recalculée côté serveur — jamais celle du client
    const total50ml = pricedItems
      .filter((i) => i.format === '50ml' && !i.isDiscoveryBox)
      .reduce((sum, i) => sum + i.quantity, 0);
    const bundleDiscountCents = Math.floor(total50ml / 2) * Math.round(BUNDLE_UNIT_DISCOUNT * 100);

    const lineItems = pricedItems.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: `${item.name} — ${item.format}` },
        unit_amount: Math.round(item.serverPrice * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Livraison standard' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Compact items: [[name, format, qty, price, isBox(0/1), selectedPerfumes?], ...]
    const compactItems = pricedItems.map((item) => {
      const base: any[] = [item.name, item.format, item.quantity, item.serverPrice, item.isDiscoveryBox ? 1 : 0];
      if (item.isDiscoveryBox && item.selectedPerfumes?.length) {
        base.push(item.selectedPerfumes);
      }
      return base;
    });

    const metadata: Record<string, string> = {
      user_email: userEmail ?? '',
      mode_livraison: mode_livraison ?? 'home',
      shipping_cost: String(shippingCost ?? 0),
      bundle_discount: String(bundleDiscountCents / 100),
      items_json: JSON.stringify(compactItems),
    };

    if (userId) metadata.user_id = userId;
    if (address) metadata.address_json = JSON.stringify(address);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

    let promoDiscountCents = 0;
    let appliedPromoCode: string | null = null;

    if (promoCode) {
      if (!supabase) {
        return new Response(JSON.stringify({ error: 'Configuration Supabase manquante.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const now = new Date();
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.trim().toUpperCase())
        .maybeSingle();

      const promoValid = promo
        && promo.active
        && new Date(promo.valid_from) <= now
        && (!promo.valid_until || new Date(promo.valid_until) >= now)
        && (promo.max_uses === null || promo.used_count < promo.max_uses);

      if (!promoValid) {
        return new Response(JSON.stringify({ error: 'Code promo invalide ou expiré.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // L'usage du code n'est PAS comptabilisé ici : seulement au paiement confirmé,
      // côté webhook, de façon atomique (voir stripe-webhook + increment_promo_usage).
      promoDiscountCents = Math.round((subtotalCents - bundleDiscountCents) * promo.percentage / 100);
      appliedPromoCode = promo.code;
      metadata.promo_code = promo.code;
      metadata.promo_id = promo.id;
      metadata.promo_percentage = String(promo.percentage);
    }

    metadata.promo_discount = String(promoDiscountCents / 100);

    const totalDiscountCents = bundleDiscountCents + promoDiscountCents;
    let stripeCouponId: string | null = null;
    if (totalDiscountCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: totalDiscountCents,
        currency: 'eur',
        duration: 'once',
        name: appliedPromoCode ? `Remise (dont code ${appliedPromoCode})` : 'Remise offre duo',
      });
      stripeCouponId = coupon.id;
    }

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      ...(stripeCouponId ? { discounts: [{ coupon: stripeCouponId }] } : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
