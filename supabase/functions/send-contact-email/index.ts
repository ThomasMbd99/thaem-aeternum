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

    const { nom, email, message } = await req.json() as {
      nom: string;
      email: string;
      message: string;
    };

    if (!nom || !email || !message) throw new Error('Champs manquants.');

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0d0b08;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">

    <div style="text-align:center;margin-bottom:32px">
      <h1 style="font-family:Georgia,serif;font-weight:300;font-style:italic;color:#C4956A;font-size:28px;margin:0">Thæm Æternum</h1>
      <div style="width:60px;height:1px;background:linear-gradient(to right,transparent,#C4956A,transparent);margin:12px auto"></div>
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0">Nouveau message de contact</p>
    </div>

    <div style="background:#141209;border:1px solid #2a2218;border-radius:8px;padding:24px;margin-bottom:24px">
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0 0 6px">De</p>
      <p style="font-family:Georgia,serif;font-style:italic;color:#e8ddd0;font-size:16px;margin:0 0 4px">${nom}</p>
      <a href="mailto:${email}" style="font-family:Arial,sans-serif;font-size:12px;color:#C4956A;">${email}</a>
    </div>

    <div style="background:#141209;border:1px solid #2a2218;border-radius:8px;padding:24px">
      <p style="font-family:Arial,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.3em;color:#9a8878;margin:0 0 12px">Message</p>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#e8ddd0;line-height:1.8;margin:0;white-space:pre-wrap">${message}</p>
    </div>

  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Thæm Æternum <contact@thaem-aeternum.com>',
        to: 'thaemaeternum@gmail.com',
        reply_to: email,
        subject: `Nouveau message de ${nom}`,
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
