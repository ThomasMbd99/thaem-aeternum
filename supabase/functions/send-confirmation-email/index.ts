const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  name: string;
  format: string;
  quantity: number;
  price: number;
}

interface Address {
  prenom: string;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
  telephone?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'Resend API key manquante.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userEmail, items, address, shippingCost, finalTotal } = await req.json() as {
      userEmail: string;
      items: OrderItem[];
      address: Address;
      shippingCost: number;
      finalTotal: number;
    };

    if (!userEmail) {
      return new Response(JSON.stringify({ error: 'Email manquant.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #2a2218;font-family:Georgia,serif;font-style:italic;color:#e8ddd0">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2218;font-family:Arial,sans-serif;font-size:12px;color:#9a8878;text-align:center">${item.format}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2218;font-family:Arial,sans-serif;font-size:12px;color:#9a8878;text-align:center">× ${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2218;font-family:Arial,sans-serif;font-size:12px;color:#C4956A;text-align:right">${(item.price * item.quantity).toFixed(2)}€</td>
      </tr>
    `).join('');

    const deliveryAddress = address
      ? `${address.prenom} ${address.nom}<br>${address.adresse}<br>${address.code_postal} ${address.ville}<br>${address.pays}`
      : 'Non renseignée';

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0d0b08;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px">
      <h1 style="font-family:Georgia,serif;font-weight:300;font-style:italic;color:#C4956A;font-size:32px;margin:0;letter-spacing:0.1em">Thæm Æternum</h1>
      <div style="width:60px;height:1px;background:linear-gradient(to right,transparent,#C4956A,transparent);margin:16px auto"></div>
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0">Confirmation de commande</p>
    </div>

    <!-- Message -->
    <div style="margin-bottom:32px">
      <p style="font-family:Georgia,serif;font-style:italic;color:#e8ddd0;font-size:18px;margin:0 0 8px">Merci ${address?.prenom ?? ''},</p>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#9a8878;line-height:1.7;margin:0">
        Votre commande a bien été reçue. Nous préparons votre colis avec soin et vous informerons dès son expédition.
      </p>
    </div>

    <!-- Articles -->
    <div style="background:#141209;border:1px solid #2a2218;border-radius:8px;padding:24px;margin-bottom:24px">
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0 0 16px">Votre commande</p>
      <table style="width:100%;border-collapse:collapse">
        ${itemsHtml}
        <tr>
          <td colspan="3" style="padding:12px 0 4px;font-family:Arial,sans-serif;font-size:11px;color:#9a8878">Livraison</td>
          <td style="padding:12px 0 4px;font-family:Arial,sans-serif;font-size:11px;color:#9a8878;text-align:right">
            ${shippingCost === 0 ? 'Offerte' : `${shippingCost.toFixed(2)}€`}
          </td>
        </tr>
        <tr>
          <td colspan="3" style="padding:12px 0 0;font-family:Georgia,serif;font-style:italic;color:#e8ddd0;font-size:16px;border-top:1px solid #2a2218">Total</td>
          <td style="padding:12px 0 0;font-family:Georgia,serif;color:#C4956A;font-size:16px;text-align:right;border-top:1px solid #2a2218">${finalTotal.toFixed(2)}€</td>
        </tr>
      </table>
    </div>

    <!-- Adresse -->
    <div style="background:#141209;border:1px solid #2a2218;border-radius:8px;padding:24px;margin-bottom:32px">
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0 0 12px">Adresse de livraison</p>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#e8ddd0;line-height:1.8;margin:0">${deliveryAddress}</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #2a2218;padding-top:24px">
      <p style="font-family:Arial,sans-serif;font-size:11px;color:#9a8878;line-height:1.7;margin:0">
        Une question ? Contactez-nous via notre site.<br>
        <span style="color:#C4956A;font-style:italic">L'équipe Thæm Æternum</span>
      </p>
    </div>

  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Thæm Æternum <commandes@thaem-aeternum.com>',
        to: userEmail,
        subject: 'Votre commande Thæm Æternum est confirmée',
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return new Response(JSON.stringify({ success: true }), {
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
