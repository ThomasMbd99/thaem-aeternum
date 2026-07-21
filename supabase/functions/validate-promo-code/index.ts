import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ valid: false, message: 'Configuration manquante.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { code } = await req.json() as { code?: string };
    if (!code || !code.trim()) {
      return new Response(JSON.stringify({ valid: false, message: 'Code manquant.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .maybeSingle();

    if (error || !promo) {
      return new Response(JSON.stringify({ valid: false, message: 'Code promo invalide.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    if (!promo.active) {
      return new Response(JSON.stringify({ valid: false, message: 'Ce code promo n\'est plus actif.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (new Date(promo.valid_from) > now) {
      return new Response(JSON.stringify({ valid: false, message: 'Ce code promo n\'est pas encore valide.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (promo.valid_until && new Date(promo.valid_until) < now) {
      return new Response(JSON.stringify({ valid: false, message: 'Ce code promo a expiré.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
      return new Response(JSON.stringify({ valid: false, message: 'Ce code promo a atteint son nombre maximum d\'utilisations.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ valid: true, percentage: promo.percentage, code: promo.code }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ valid: false, message: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
