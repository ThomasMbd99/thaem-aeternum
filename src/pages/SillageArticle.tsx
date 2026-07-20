import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { type Article } from '@/hooks/useArticles';
import PageTransition from '@/components/PageTransition';

const categoryColor: Record<string, string> = {
  'actualité':     '#C4956A',
  'collection':    '#C4956A',
  'événement':     '#A8D4F0',
  'collaboration': '#F0A0B8',
  'conseil':       '#8B6914',
};

async function fetchArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('publie', true)
    .single();
  if (error) return null;
  return data as Article;
}

const SillageArticle = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticle(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-28">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="animate-pulse space-y-6 mt-16">
              <div className="h-3 bg-white/5 rounded w-20 mx-auto" />
              <div className="h-10 bg-white/5 rounded w-2/3 mx-auto" />
              <div className="h-64 bg-white/5 rounded-xl" />
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-4 bg-white/5 rounded" />)}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!article) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 pb-28 flex items-center justify-center">
          <div className="text-center">
            <p className="font-display italic text-2xl text-foreground/30 mb-4">Article introuvable.</p>
            <Link to="/journal" className="font-body text-xs uppercase tracking-widest text-primary hover:underline">
              ← Retour aux Sillages
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const acc = categoryColor[article.categorie] ?? '#C4956A';
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const paragraphs = article.contenu?.split('\n\n').filter(Boolean) ?? [];

  return (
    <PageTransition>
      <Helmet>
        <title>{article.titre}, THÆM ÆTERNUM</title>
        <meta name="description" content={article.extrait ?? article.titre} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="og:title" content={`${article.titre}, THÆM ÆTERNUM`} />
        {article.extrait && <meta property="og:description" content={article.extrait} />}
        <link rel="canonical" href={`https://www.thaem-aeternum.com/journal/${slug}`} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-28">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
            <Link
              to="/journal"
              className="font-body text-[10px] uppercase tracking-[0.3em] transition-colors hover:text-primary"
              style={{ color: 'var(--c-w30)' }}
            >
              ← Le Journal Æ
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <div
              className="inline-flex items-center px-3 py-1 rounded font-body text-[9px] uppercase tracking-widest mb-6"
              style={{ background: `${acc}20`, color: acc, border: `1px solid ${acc}40` }}
            >
              {article.categorie}
            </div>
            <h1 className="font-display italic text-3xl lg:text-5xl font-light leading-tight mb-6">
              {article.titre}
            </h1>
            {article.extrait && (
              <p className="font-display italic text-lg text-foreground/45 max-w-xl mx-auto leading-relaxed">
                {article.extrait}
              </p>
            )}
            {date && (
              <p className="font-body text-[10px] uppercase tracking-widest text-foreground/25 mt-6">{date}</p>
            )}
            <div className="h-px max-w-[60px] mx-auto mt-8" style={{ background: `linear-gradient(to right, transparent, ${acc}, transparent)` }} />
          </motion.header>

          {/* Image */}
          {article.image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="rounded-xl overflow-hidden mb-12"
              style={{ aspectRatio: '16/9' }}
            >
              <img src={article.image_url} alt={article.titre} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Contenu */}
          {paragraphs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6"
            >
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-sm lg:text-base leading-relaxed text-foreground/70"
                >
                  {para}
                </p>
              ))}
            </motion.div>
          )}

          {/* Footer article */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 pt-10 border-t flex items-center justify-between"
            style={{ borderColor: 'var(--c-w06)' }}
          >
            <Link
              to="/journal"
              className="font-body text-[10px] uppercase tracking-[0.3em] transition-colors hover:text-primary"
              style={{ color: 'var(--c-w35)' }}
            >
              ← Tous les articles
            </Link>
            <span
              className="font-display italic text-lg"
              style={{ color: `${acc}60` }}
            >
              Æ
            </span>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
};

export default SillageArticle;
