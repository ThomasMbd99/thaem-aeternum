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

    const { nom, email, message } = await req.json();
    if (!nom || !email || !message) throw new Error('Champs manquants.');

    const html = `<p>De : ${nom} (${email})</p><p>${message}</p>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Thaem Aeternum <contact@thaem-aeternum.com>',
        to: 'contact@thaem-aeternum.com',
        reply_to: email,
        subject: `Nouveau message de ${nom}`,
        html,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
  }
});
