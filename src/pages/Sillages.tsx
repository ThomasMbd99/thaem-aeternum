import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import PageTransition from '@/components/PageTransition';

const CATEGORIES = ['tous', 'actualité', 'collection', 'événement', 'collaboration', 'conseil'];

const categoryColor: Record<string, string> = {
  'actualité':     '#C4956A',
  'collection':    '#C4956A',
  'événement':     '#A8D4F0',
  'collaboration': '#F0A0B8',
  'conseil':       '#8B6914',
};

import { useState } from 'react';

const Sillages = () => {
  const { articles, loading } = useArticles();
  const [cat, setCat] = useState('tous');

  const filtered = cat === 'tous' ? articles : articles.filter(a => a.categorie === cat);

  return (
    <PageTransition>
      <Helmet>
        <title>Le Journal Æ — THÆM ÆTERNUM</title>
        <meta name="description" content="Le journal de la maison THÆM ÆTERNUM — actualités, collections, événements et collaborations." />
      </Helmet>

      <div className="min-h-screen pt-24 lg:pt-28 pb-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

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
                  borderColor: cat === c ? 'hsl(43,50%,54%)' : 'rgba(255,255,255,0.1)',
                  color: cat === c ? 'hsl(43,50%,54%)' : 'rgba(255,255,255,0.35)',
                  background: cat === c ? 'rgba(196,149,106,0.08)' : 'transparent',
                }}
              >
                {c}
              </button>
            ))}
          </motion.div>

          {/* Contenu */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden border border-white/8">
                  <div className="h-52 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => {
                const acc = categoryColor[article.categorie] ?? '#C4956A';
                const date = article.published_at
                  ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                  : '';
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link to={`/sillages/${article.slug}`} className="group block rounded-xl border border-white/8 overflow-hidden hover:border-white/16 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {/* Image */}
                      <div className="h-52 overflow-hidden relative" style={{ background: 'hsl(0 0% 8%)' }}>
                        {article.image_url ? (
                          <img src={article.image_url} alt={article.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-display text-6xl font-bold" style={{ color: `${acc}15` }}>Æ</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded font-body text-[9px] uppercase tracking-widest" style={{ background: `${acc}20`, color: acc, border: `1px solid ${acc}40`, backdropFilter: 'blur(8px)' }}>
                          {article.categorie}
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-5">
                        {date && <p className="font-body text-[10px] text-foreground/30 uppercase tracking-widest mb-2">{date}</p>}
                        <h2 className="font-display italic text-xl mb-2 group-hover:text-primary transition-colors leading-snug">{article.titre}</h2>
                        {article.extrait && (
                          <p className="font-body text-xs text-foreground/45 leading-relaxed line-clamp-3">{article.extrait}</p>
                        )}
                        <p className="font-body text-[10px] uppercase tracking-widest mt-4" style={{ color: acc }}>
                          Lire →
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Sillages;
