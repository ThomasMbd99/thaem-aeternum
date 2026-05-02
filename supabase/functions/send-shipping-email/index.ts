const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) throw new Error('Resend API key manquante.');

    const { userEmail, orderId, trackingNumber, items } = await req.json() as {
      userEmail: string;
      orderId: string;
      trackingNumber: string;
      items?: { parfum_nom?: string; format?: string; quantite?: number }[];
    };

    if (!userEmail) throw new Error('Email manquant.');

    const orderRef = String(orderId).slice(0, 8).toUpperCase();

    const itemsHtml = items && items.length > 0
      ? items.map(item => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #2a2218;font-family:Georgia,serif;font-style:italic;color:#e8ddd0">${item.parfum_nom ?? 'Article'}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2a2218;font-family:Arial,sans-serif;font-size:12px;color:#9a8878;text-align:right">${item.format ?? ''} × ${item.quantite ?? 1}</td>
        </tr>`).join('')
      : '';

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0d0b08;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">

    <div style="text-align:center;margin-bottom:40px">
      <h1 style="font-family:Georgia,serif;font-weight:300;font-style:italic;color:#C4956A;font-size:32px;margin:0;letter-spacing:0.1em">Thæm Æternum</h1>
      <div style="width:60px;height:1px;background:linear-gradient(to right,transparent,#C4956A,transparent);margin:16px auto"></div>
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0">Votre commande est en route</p>
    </div>

    <div style="margin-bottom:32px">
      <p style="font-family:Georgia,serif;font-style:italic;color:#e8ddd0;font-size:18px;margin:0 0 8px">Bonne nouvelle,</p>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#9a8878;line-height:1.7;margin:0">
        Votre commande <strong style="color:#e8ddd0">#${orderRef}</strong> vient d'être expédiée. Vous pouvez suivre votre colis avec le numéro ci-dessous.
      </p>
    </div>

    <div style="background:#141209;border:1px solid #3B82F680;border-radius:8px;padding:24px;margin-bottom:24px;text-align:center">
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0 0 12px">Numéro de suivi</p>
      <p style="font-family:monospace;font-size:22px;color:#3B82F6;letter-spacing:0.1em;margin:0">${trackingNumber}</p>
    </div>

    ${itemsHtml ? `
    <div style="background:#141209;border:1px solid #2a2218;border-radius:8px;padding:24px;margin-bottom:24px">
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0 0 16px">Votre commande</p>
      <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
    </div>` : ''}

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
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Thæm Æternum <commandes@thaem-aeternum.com>',
        to: userEmail,
        subject: `Votre commande #${orderRef} est en route !`,
        html,
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
