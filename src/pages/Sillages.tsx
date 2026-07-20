import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import PageTransition from '@/components/PageTransition';
import { useState } from 'react';

const CATEGORIES = ['tous', 'actualité', 'collection', 'événement', 'collaboration', 'conseil'];

const categoryColor: Record<string, string> = {
  'actualité':     '#C4956A',
  'collection':    '#C4956A',
  'événement':     '#A8D4F0',
  'collaboration': '#F0A0B8',
  'conseil':       '#8B6914',
};

const Sillages = () => {
  const { articles, loading } = useArticles();
  const [cat, setCat] = useState('tous');

  const filtered = cat === 'tous' ? articles : articles.filter(a => a.categorie === cat);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const [hero, ...rest] = filtered;

  return (
    <PageTransition>
      <Helmet>
        <title>Le Journal Æ, THÆM ÆTERNUM</title>
        <meta name="description" content="Le journal de la maison THÆM ÆTERNUM , actualités, collections, événements et collaborations." />
        <link rel="canonical" href="https://www.thaem-aeternum.com/journal" />
      </Helmet>

      <div className="min-h-screen pt-24 lg:pt-28 pb-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="font-body text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(196,149,106,0.6)' }}>
              La Maison
            </p>
            <h1 className="font-display text-4xl lg:text-6xl italic font-light mb-4">
              Le Journal <span style={{ color: 'hsl(43,50%,54%)' }}>Æ</span>
            </h1>
            <p className="font-display italic text-foreground/40 text-base lg:text-lg max-w-md mx-auto">
              Actualités, collections, événements et collaborations.
            </p>
            <div className="h-px max-w-[60px] mx-auto mt-8" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />
          </motion.div>

          {/* Filtres */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2 mb-14">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-4 py-1.5 font-body text-[10px] uppercase tracking-[0.25em] rounded transition-all duration-300"
                style={{
                  border: '1px solid',
                  borderColor: cat === c ? 'hsl(43,50%,54%)' : 'var(--c-w10)',
                  color: cat === c ? 'hsl(43,50%,54%)' : 'var(--c-w35)',
                  background: cat === c ? 'rgba(196,149,106,0.08)' : 'transparent',
                }}
              >
                {c}
              </button>
            ))}
          </motion.div>

          {/* Contenu */}
          {loading ? (
            <div className="space-y-8">
              <div className="animate-pulse rounded-xl overflow-hidden border border-white/8 h-72 bg-white/5" />
              {[1,2].map(i => (
                <div key={i} className="animate-pulse flex gap-6">
                  <div className="w-48 h-32 rounded-xl bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-3 bg-white/5 rounded w-1/4" />
                    <div className="h-5 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <p className="font-display italic text-2xl text-foreground/30 mb-2">Bientôt.</p>
              <p className="font-body text-xs text-foreground/25 uppercase tracking-widest">Les premières pages arrivent.</p>
            </motion.div>
          ) : (
            <div className="space-y-0">

              {/* Hero — premier article pleine largeur */}
              {hero && (() => {
                const acc = categoryColor[hero.categorie] ?? '#C4956A';
                return (
                  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <Link to={`/journal/${hero.slug}`} className="group block rounded-xl overflow-hidden border border-white/8 hover:border-white/16 transition-all duration-300 relative" style={{ background: 'var(--c-w02)' }}>
                      <div className="relative h-72 lg:h-96 overflow-hidden" style={{ background: 'var(--c-bg8)' }}>
                        {hero.image_url
                          ? <img src={hero.image_url} alt={hero.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          : <div className="w-full h-full flex items-center justify-center"><span className="font-display text-8xl font-bold" style={{ color: `${acc}10` }}>Æ</span></div>
                        }
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded font-body text-[9px] uppercase tracking-widest" style={{ background: `${acc}25`, color: acc, border: `1px solid ${acc}40`, backdropFilter: 'blur(8px)' }}>
                          {hero.categorie}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                          {formatDate(hero.published_at) && <p className="font-body text-[10px] text-white/40 uppercase tracking-widest mb-2">{formatDate(hero.published_at)}</p>}
                          <h2 className="font-display italic text-2xl lg:text-4xl font-light text-white group-hover:text-primary transition-colors leading-snug mb-2">{hero.titre}</h2>
                          {hero.extrait && <p className="font-body text-xs text-white/50 leading-relaxed line-clamp-2 max-w-xl">{hero.extrait}</p>}
                          <p className="font-body text-[10px] uppercase tracking-widest mt-4" style={{ color: acc }}>Lire →</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })()}

              {/* Séparateur */}
              {rest.length > 0 && (
                <div className="h-px mb-12" style={{ background: 'linear-gradient(to right, transparent, var(--c-w06), transparent)' }} />
              )}

              {/* Articles suivants — alternance gauche/droite */}
              <div className="space-y-10">
                {rest.map((article, i) => {
                  const acc = categoryColor[article.categorie] ?? '#C4956A';
                  const imageRight = i % 2 !== 0;
                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        to={`/journal/${article.slug}`}
                        className={`group flex flex-col md:flex-row gap-6 items-center ${imageRight ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* Image */}
                        <div className="w-full md:w-2/5 rounded-xl overflow-hidden shrink-0 border border-white/8 group-hover:border-white/16 transition-all duration-300" style={{ aspectRatio: '4/3', background: 'var(--c-bg8)' }}>
                          {article.image_url
                            ? <img src={article.image_url} alt={article.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                            : <div className="w-full h-full flex items-center justify-center"><span className="font-display text-5xl font-bold" style={{ color: `${acc}15` }}>Æ</span></div>
                          }
                        </div>

                        {/* Texte */}
                        <div className="flex-1 py-2">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-body text-[9px] uppercase tracking-widest px-2.5 py-1 rounded" style={{ background: `${acc}15`, color: acc, border: `1px solid ${acc}30` }}>
                              {article.categorie}
                            </span>
                            {formatDate(article.published_at) && (
                              <span className="font-body text-[10px] text-foreground/25 uppercase tracking-widest">{formatDate(article.published_at)}</span>
                            )}
                          </div>
                          <h2 className="font-display italic text-xl lg:text-2xl font-light mb-3 group-hover:text-primary transition-colors leading-snug">{article.titre}</h2>
                          {article.extrait && (
                            <p className="font-body text-xs text-foreground/45 leading-relaxed line-clamp-3 mb-4">{article.extrait}</p>
                          )}
                          <p className="font-body text-[10px] uppercase tracking-widest" style={{ color: acc }}>Lire →</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Sillages;
