import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  productId: string;
  format: string;
  quantity: number;
  price: number;
  name: string;
  isDiscoveryBox?: boolean;
  selectedPerfumes?: string[];
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

    const { items, shippingCost, bundleDiscount, address, promoCode, successUrl, cancelUrl, mode_livraison, userId, userEmail } = await req.json() as {
      items: CartItem[];
      shippingCost: number;
      bundleDiscount: number;
      address: any;
      promoCode?: string;
      successUrl: string;
      cancelUrl: string;
      mode_livraison: string;
      userId: string | null;
      userEmail: string;
    };

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: `${item.name} — ${item.format}` },
        unit_amount: Math.round(item.price * 100),
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
    const compactItems = items.map((item) => {
      const base: any[] = [item.name, item.format, item.quantity, item.price, item.isDiscoveryBox ? 1 : 0];
      if (item.isDiscoveryBox && item.selectedPerfumes?.length) {
        base.push(item.selectedPerfumes);
      }
      return base;
    });

    const metadata: Record<string, string> = {
      user_email: userEmail ?? '',
      mode_livraison: mode_livraison ?? 'home',
      shipping_cost: String(shippingCost ?? 0),
      bundle_discount: String(bundleDiscount ?? 0),
      items_json: JSON.stringify(compactItems),
    };

    if (userId) metadata.user_id = userId;
    if (address) metadata.address_json = JSON.stringify(address);

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      ...(promoCode ? { discounts: [{ coupon: promoCode }] } : {}),
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
