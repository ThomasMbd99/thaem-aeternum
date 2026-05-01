import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return new Response('Configuration manquante', { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Signature manquante', { status: 400 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Signature invalide: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const session = event.data.object as Stripe.Checkout.Session;
  const commandeId = session.client_reference_id;

  if (!commandeId) {
    return new Response('OK — pas de commande liée', { status: 200 });
  }

  if (event.type === 'checkout.session.completed') {
    await supabase
      .from('commandes')
      .update({ statut: 'paid' })
      .eq('id', commandeId);
  } else if (event.type === 'checkout.session.expired') {
    await supabase
      .from('commandes')
      .update({ statut: 'cancelled' })
      .eq('id', commandeId);
  }

  return new Response('OK', { status: 200 });
});
