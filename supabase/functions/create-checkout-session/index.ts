import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';

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
}

interface Address {
  prenom: string;
  nom: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
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

    const { items, shippingCost, address, promoCode, successUrl, cancelUrl } = await req.json() as {
      items: CartItem[];
      shippingCost: number;
      address: Address;
      promoCode?: string;
      successUrl: string;
      cancelUrl: string;
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

    const deliveryName = address ? `${address.prenom} ${address.nom}`.trim() : undefined;
    const deliveryLine = address
      ? `${address.adresse}, ${address.code_postal} ${address.ville}, ${address.pays}`
      : undefined;

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(promoCode ? { discounts: [{ coupon: promoCode }] } : {}),
      ...(deliveryName && {
        metadata: {
          delivery_name: deliveryName,
          delivery_address: deliveryLine ?? '',
          delivery_phone: address?.telephone ?? '',
        },
      }),
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
