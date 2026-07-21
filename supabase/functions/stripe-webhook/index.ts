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
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Signature invalide: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const session = event.data.object as Stripe.Checkout.Session;
  const meta = session.metadata ?? {};

  if (event.type === 'checkout.session.completed') {
    const userEmail = meta.user_email ?? '';
    const userId = meta.user_id ?? null;
    const modeLivraison = meta.mode_livraison ?? 'home';
    const shippingCost = parseFloat(meta.shipping_cost ?? '0');
    const bundleDiscount = parseFloat(meta.bundle_discount ?? '0');
    const address = meta.address_json ? JSON.parse(meta.address_json) : null;
    const compactItems: any[][] = meta.items_json ? JSON.parse(meta.items_json) : [];

    const items = compactItems.map(ci => ({
      name: ci[0] as string,
      format: ci[1] as string,
      quantity: ci[2] as number,
      price: ci[3] as number,
      isDiscoveryBox: ci[4] === 1,
      selectedPerfumes: ci[5] as string[] | undefined,
    }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal - bundleDiscount + shippingCost;

    // Create order (statut = 'paid' directly since payment is confirmed)
    const { data: commande, error: cmdError } = await supabase
      .from('commandes')
      .insert({
        ...(userId ? { user_id: userId } : {}),
        email: userEmail,
        statut: 'paid',
        total,
        mode_livraison: modeLivraison,
      })
      .select()
      .single();

    if (cmdError || !commande) {
      console.error('Failed to create commande:', cmdError);
      return new Response('Erreur création commande', { status: 500 });
    }

    // Create order items
    await supabase.from('commande_items').insert(
      items.map(item => ({
        commande_id: commande.id,
        parfum_nom: item.name,
        format: item.isDiscoveryBox ? 'Coffret 5×10ml' : item.format,
        quantite: item.quantity,
        prix_unitaire: item.price,
      }))
    );

    // Decrement stock
    const { data: parfumsData } = await supabase.from('parfums').select('nom, stock');
    if (parfumsData) {
      const slugToNom = new Map<string, string>();
      const nomToStock = new Map<string, number>();
      for (const p of parfumsData) {
        const slug = (p.nom as string).toLowerCase()
          .replace(/æ/g, 'ae').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        slugToNom.set(slug, p.nom as string);
        nomToStock.set(p.nom as string, p.stock as number);
      }

      const decrements = new Map<string, number>();
      for (const item of items) {
        if (item.isDiscoveryBox && item.selectedPerfumes) {
          for (const slug of item.selectedPerfumes) {
            const nom = slugToNom.get(slug);
            if (nom) decrements.set(nom, (decrements.get(nom) ?? 0) + item.quantity);
          }
        } else {
          decrements.set(item.name, (decrements.get(item.name) ?? 0) + item.quantity);
        }
      }

      await Promise.all(
        Array.from(decrements.entries()).map(([nom, qty]) => {
          const newStock = Math.max(0, (nomToStock.get(nom) ?? 0) - qty);
          return supabase.from('parfums').update({ stock: newStock }).eq('nom', nom);
        })
      );
    }

    // Send confirmation email
    const emailPayload = {
      userEmail,
      items: items.map(i => ({
        name: i.name,
        format: i.isDiscoveryBox ? 'Coffret 5×10ml' : i.format,
        quantity: i.quantity,
        price: i.price,
      })),
      address,
      shippingCost,
      finalTotal: total,
      mode_livraison: modeLivraison,
    };

    if (userEmail) {
      await fetch(`${supabaseUrl}/functions/v1/send-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify(emailPayload),
      });
    }

    // Notify admin of the new order
    await fetch(`${supabaseUrl}/functions/v1/send-confirmation-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ ...emailPayload, isAdminCopy: true }),
    });
  }

  return new Response('OK', { status: 200 });
});
