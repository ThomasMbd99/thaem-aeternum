import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Printer, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const InvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [commande, setCommande] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) return;
    const load = async () => {
      const [cmdRes, profileRes] = await Promise.all([
        supabase.from('commandes').select('*, commande_items(*)').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ]);
      if (cmdRes.error || !cmdRes.data) {
        setError('Commande introuvable.');
      } else {
        setCommande(cmdRes.data);
        setProfile(profileRes.data);
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display italic text-foreground/40">Chargement...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="font-body text-sm text-foreground/40">{error}</p>
      <Link to="/account" className="font-body text-xs uppercase tracking-widest text-primary">← Mon compte</Link>
    </div>
  );

  const date = new Date(commande.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const invoiceNumber = `INV-${String(commande.id).slice(0, 8).toUpperCase()}`;

  return (
    <>
      <Helmet>
        <title>Facture {invoiceNumber}, THÆM ÆTERNUM</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {/* Barre d'actions (masquée à l'impression) */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-background border-b border-white/8">
        <Link to="/account" className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft className="w-3 h-3" /> Mon compte
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
          style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.3)', color: '#C4956A' }}
        >
          <Printer className="w-4 h-4" />
          Télécharger PDF
        </button>
      </div>

      {/* Facture */}
      <div className="invoice-page min-h-screen pt-20 pb-12 px-8 bg-background">
        <div className="max-w-2xl mx-auto">

          {/* En-tête */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="font-display text-3xl italic font-light" style={{ color: '#C4956A' }}>Thæm Æternum</h1>
              <p className="font-body text-xs text-foreground/40 mt-1 uppercase tracking-widest">Maison de parfumerie</p>
            </div>
            <div className="text-right">
              <p className="font-body text-xs uppercase tracking-widest text-foreground/40">Facture</p>
              <p className="font-display italic text-xl text-foreground mt-1">{invoiceNumber}</p>
              <p className="font-body text-xs text-foreground/40 mt-1">{date}</p>
            </div>
          </div>

          <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, #C4956A, transparent)' }} />

          {/* Infos client */}
          {profile && (
            <div className="mb-10">
              <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-3">Facturé à</p>
              <p className="font-body text-sm text-foreground">
                {[profile.prenom, profile.nom].filter(Boolean).join(' ') || 'Client'}
              </p>
              {profile.adresse && <p className="font-body text-sm text-foreground/60">{profile.adresse}</p>}
              {(profile.code_postal || profile.ville) && (
                <p className="font-body text-sm text-foreground/60">{[profile.code_postal, profile.ville].filter(Boolean).join(' ')}</p>
              )}
              {profile.pays && <p className="font-body text-sm text-foreground/60">{profile.pays}</p>}
              <p className="font-body text-sm text-foreground/60 mt-1">{user?.email}</p>
            </div>
          )}

          {/* Articles */}
          <div className="mb-8">
            <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-4">Détail de la commande</p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left pb-3 font-body text-xs uppercase tracking-widest text-foreground/30">Article</th>
                  <th className="text-center pb-3 font-body text-xs uppercase tracking-widest text-foreground/30">Format</th>
                  <th className="text-center pb-3 font-body text-xs uppercase tracking-widest text-foreground/30">Qté</th>
                  <th className="text-right pb-3 font-body text-xs uppercase tracking-widest text-foreground/30">Prix</th>
                </tr>
              </thead>
              <tbody>
                {commande.commande_items?.map((item: any, i: number) => (
                  <tr key={item.id ?? i} className="border-b border-white/5">
                    <td className="py-3 font-display italic text-foreground">
                      {item.parfum_nom ?? item.name ?? item.nom ?? 'Article'}
                    </td>
                    <td className="py-3 font-body text-xs text-foreground/50 text-center">{item.format ?? '—'}</td>
                    <td className="py-3 font-body text-xs text-foreground/50 text-center">
                      {item.quantite ?? item.quantity ?? 1}
                    </td>
                    <td className="py-3 font-body text-sm text-right" style={{ color: '#C4956A' }}>
                      {((item.prix_unitaire ?? item.price ?? item.prix ?? 0) * (item.quantite ?? item.quantity ?? 1)).toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 font-body text-sm text-foreground/50">
                <span>Sous-total</span>
                <span>{commande.total}€</span>
              </div>
              <div className="flex justify-between py-2 font-body text-sm text-foreground/50 border-b border-white/10">
                <span>Livraison</span>
                <span>Incluse</span>
              </div>
              <div className="flex justify-between pt-3 font-display italic text-xl">
                <span>Total TTC</span>
                <span style={{ color: '#C4956A' }}>{commande.total}€</span>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-16 pt-8 border-t border-white/8 text-center">
            <p className="font-body text-xs text-foreground/30">
              Thæm Æternum — Merci pour votre confiance.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .invoice-page { padding-top: 2rem !important; background: white !important; color: black !important; }
        }
      `}</style>
    </>
  );
};

export default InvoicePage;
