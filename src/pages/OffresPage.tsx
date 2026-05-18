import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useParfums, type ParfumFull } from '@/hooks/useParfums';
import { useCart } from '@/context/CartContext';
import { formats } from '@/data/products';
import PageTransition from '@/components/PageTransition';

const toSlug = (nom: string) =>
  nom.toLowerCase().replace(/æ/g, 'ae').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const familleGradients: Record<string, string> = {
  'SACRÆ':  'linear-gradient(160deg, #1A0E06 0%, #3D2B1F 60%, #6B4227 100%)',
  'VITÆA':  'linear-gradient(160deg, #1A0800 0%, #5A1800 55%, #C03000 100%)',
  'UMBRÆ':  'linear-gradient(160deg, #0A0300 0%, #1A0A00 55%, #3D1A00 100%)',
  'NEROLÆ': 'linear-gradient(160deg, #1A0A12 0%, #4A2030 55%, #8B3060 100%)',
  'ÆRA':    'linear-gradient(160deg, #0A1420 0%, #1A2A3A 55%, #2A4060 100%)',
};

const familleAccents: Record<string, string> = {
  'SACRÆ':  '#C4956A',
  'VITÆA':  '#FF6B2B',
  'UMBRÆ':  '#8B6914',
  'NEROLÆ': '#F0A0B8',
  'ÆRA':    '#A8D4F0',
};

const familleFromCollection: Record<string, string> = {
  sacrae: 'SACRÆ', vitae: 'VITÆA', umbrae: 'UMBRÆ', nerolae: 'NEROLÆ', aera: 'ÆRA',
};

const OffresPage = () => {
  const { parfums, loading } = useParfums();
  const promos = parfums.filter(p => p.en_promo);
  const { addItem } = useCart();
  const originalPrice50ml = formats.find(f => f.id === '50ml')?.price ?? 44.99;

  const grouped = promos.reduce((acc: Record<string, ParfumFull[]>, p) => {
    const f = familleFromCollection[p.collection] ?? 'Autres';
    if (!acc[f]) acc[f] = [];
    acc[f].push(p);
    return acc;
  }, {});

  const handleAdd = (p: ParfumFull) => {
    addItem({ productId: p.id, format: '50ml', name: p.nom, price: p.prix_promo ?? originalPrice50ml });
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Les Offres Æ — Thæm Æternum</title>
        <meta name="description" content="Créations sélectionnées à des tarifs privilégiés." />
      </Helmet>

      <div className="min-h-screen pt-28 pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.4em] text-foreground/40 mb-4">Sélection exclusive</p>
            <h1 className="font-display text-3xl lg:text-6xl italic font-light mb-5">
              Les Offres <span style={{ color: '#C4956A' }}>Æ</span>
            </h1>
            <div className="flex items-center gap-4 justify-center mb-6">
              <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4))' }} />
              <Sparkles className="w-4 h-4" style={{ color: '#C4956A' }} />
              <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(to left, transparent, rgba(196,149,106,0.4))' }} />
            </div>
            <p className="font-body text-sm text-foreground/50 max-w-lg mx-auto leading-relaxed">
              Des créations sélectionnées, proposées à des tarifs privilégiés.
            </p>
          </motion.div>

          {/* Contenu */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl border border-white/8 overflow-hidden animate-pulse">
                  <div className="h-72 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : promos.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <Sparkles className="w-10 h-10 mx-auto mb-5 text-foreground/15" />
              <p className="font-display italic text-2xl text-foreground/30 mb-2">Aucune offre en cours</p>
              <p className="font-body text-xs text-foreground/25 uppercase tracking-widest">Revenez bientôt</p>
            </motion.div>
          ) : (
            Object.entries(grouped).map(([famille, items], gi) => {
              const accent = familleAccents[famille] ?? '#C4956A';
              return (
                <div key={famille} className="mb-16">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: gi * 0.1 }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${accent}40, transparent)` }} />
                    <p className="font-body text-[11px] uppercase tracking-[0.35em]" style={{ color: accent }}>{famille}</p>
                    <div className="h-px w-8" style={{ background: `${accent}40` }} />
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {items.map((p, idx) => {
                      const famille = familleFromCollection[p.collection] ?? 'SACRÆ';
                      const hasPromo = !!p.prix_promo && p.prix_promo < originalPrice50ml;
                      const price = hasPromo ? p.prix_promo! : originalPrice50ml;
                      const discount = hasPromo ? Math.round((1 - p.prix_promo! / originalPrice50ml) * 100) : 0;

                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: gi * 0.1 + idx * 0.07 }}
                          className="rounded-xl border border-white/8 overflow-hidden hover:border-white/16 transition-all duration-300 group flex flex-col"
                          style={{ background: 'var(--c-w02)' }}
                        >
                          {/* Image cliquable → page produit */}
                          <Link to={`/produit/${toSlug(p.nom)}`} className="block">
                            <div
                              className="relative h-52 sm:h-72 overflow-hidden flex items-center justify-center"
                              style={{ background: familleGradients[famille] ?? familleGradients['SACRÆ'] }}
                            >
                              {p.image_url ? (
                                <img
                                  src={p.image_url} alt={p.nom}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                              ) : (
                                <p className="font-display italic text-5xl font-light select-none" style={{ color: accent, opacity: 0.18 }}>{p.nom}</p>
                              )}
                              <div
                                className="absolute top-4 right-4 px-3 py-1 rounded-full"
                                style={{ background: `${accent}18`, border: `1px solid ${accent}50`, backdropFilter: 'blur(8px)' }}
                              >
                                <p className="font-body text-[9px] uppercase tracking-[0.25em]" style={{ color: accent }}>Offre Æ</p>
                              </div>
                            </div>
                          </Link>

                          {/* Contenu carte */}
                          <div className="p-5 flex flex-col flex-1">
                            <Link to={`/produit/${toSlug(p.nom)}`} className="flex-1 mb-4 block hover:opacity-80 transition-opacity">
                              <p className="font-display italic text-xl mb-1" style={{ color: accent }}>{p.nom}</p>
                              {p.texte_court && (
                                <p className="font-body text-xs text-foreground/40 leading-relaxed">{p.texte_court}</p>
                              )}
                            </Link>

                            {/* Prix */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-baseline gap-2">
                                <span className="font-body text-[10px] uppercase tracking-widest text-foreground/30 mr-1">50ml</span>
                                {hasPromo && (
                                  <span className="font-body text-sm text-foreground/30 line-through">{originalPrice50ml.toFixed(2)}€</span>
                                )}
                                <span className="font-display italic text-2xl" style={{ color: hasPromo ? accent : 'var(--c-w75)' }}>
                                  {price.toFixed(2)}€
                                </span>
                              </div>
                              {hasPromo && discount > 0 && (
                                <div className="px-2 py-0.5 rounded" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                                  <p className="font-body text-[9px] uppercase tracking-widest" style={{ color: accent }}>-{discount}%</p>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <button
                              onClick={() => handleAdd(p)}
                              className="w-full flex items-center justify-center gap-2 py-3 font-body text-xs uppercase tracking-widest rounded transition-all duration-200 hover:opacity-80"
                              style={{ background: `${accent}15`, border: `1px solid ${accent}40`, color: accent }}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Ajouter au panier
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default OffresPage;
