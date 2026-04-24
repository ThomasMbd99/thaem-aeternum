import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getCollection, type Collection } from '@/data/products';
import { useParfums } from '@/hooks/useParfums';
import { collectionStories } from '@/data/collectionStories';
import { useTheme } from '@/context/ThemeContext';
import ProductCard from '@/components/ProductCard';
import PageTransition from '@/components/PageTransition';
import NotFound from './NotFound';
import CollectionSplash from '@/components/CollectionSplash';

const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { setTheme } = useTheme();
  const collection = id ? getCollection(id as Collection) : undefined;
  const { getByCollection, loading } = useParfums();
  const prods = id ? getByCollection(id as Collection) : [];
  const story = id ? collectionStories[id as keyof typeof collectionStories] : undefined;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  useEffect(() => {
    if (id && collection) setTheme(id as Collection);
  }, [id]);

  if (!collection) return <NotFound />;

  const acc = collection.colors.accent;

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}` : '196,149,106';
  };
  const rgb = hexToRgb(acc);

  const letters = collection.name.split('');

  return (
    <PageTransition>
      <CollectionSplash collection={collection} />
      <div className="min-h-screen bg-background relative">

        {/* ── DÉGRADÉ GLOBAL — suit toute la page ── */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(ellipse 120% 55% at 50% 0%, rgba(${rgb}, 0.11) 0%, rgba(${rgb}, 0.04) 50%, transparent 75%)`,
            transition: 'background 1s ease',
          }}
        />

        {/* ── HERO ── */}
        <div ref={heroRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

          {/* Glow fort hero */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 85% 70% at 50% 40%, rgba(${rgb}, 0.38) 0%, rgba(${rgb}, 0.14) 45%, transparent 70%)`,
            }}
          />

          {/* Fine grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(${rgb},1) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Æ filigrane géant */}
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ y: heroY }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <span
              className="font-display text-[28vw] font-bold leading-none"
              style={{ color: `rgba(${rgb}, 0.05)`, letterSpacing: '-0.02em' }}
            >
              Æ
            </span>
          </motion.div>

          {/* Hero content */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 text-center px-6"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="font-body text-xs uppercase mb-8"
              style={{ color: `rgba(${rgb}, 0.7)` }}
            >
              Collection
            </motion.p>

            <h1 className="font-display text-[13vw] lg:text-[10vw] leading-none tracking-widest mb-6 flex justify-center">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={letter === 'Æ' ? { color: acc } : {}}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="font-display italic text-lg lg:text-xl text-foreground/50 mb-10"
            >
              {collection.mood}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 1.2, ease: 'easeOut' }}
              className="h-px max-w-[120px] mx-auto origin-center"
              style={{ backgroundColor: acc }}
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="font-body text-[10px] uppercase tracking-[0.3em]" style={{ color: `rgba(${rgb}, 0.5)` }}>
              Découvrir
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-px h-10"
              style={{ background: `linear-gradient(to bottom, rgba(${rgb}, 0.6), transparent)` }}
            />
          </motion.div>
        </div>

        {/* ── HISTOIRE ── */}
        {story && (
          <div className="relative py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-16 relative z-10 max-w-3xl">

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="h-px mb-16 origin-left"
                style={{ background: `linear-gradient(to right, rgba(${rgb}, 0.6), transparent)` }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="font-display text-3xl lg:text-4xl italic text-center mb-16"
                style={{ color: acc }}
              >
                {story.title}
              </motion.h2>

              <div className="space-y-8">
                {story.paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="font-display text-base lg:text-lg italic leading-relaxed text-foreground/75 whitespace-pre-line"
                    style={{ textAlign: 'center' }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="h-px mt-16 origin-right"
                style={{ background: `linear-gradient(to left, rgba(${rgb}, 0.6), transparent)` }}
              />
            </div>
          </div>
        )}

        {/* ── GRILLE PRODUITS ── */}
        <div className="container mx-auto px-4 lg:px-8 pb-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p
              className="font-body text-xs uppercase tracking-[0.4em] mb-4"
              style={{ color: `rgba(${rgb}, 0.7)` }}
            >
              La collection
            </p>
            <h3 className="font-display text-2xl lg:text-3xl tracking-wider">
              Nos Fragrances
            </h3>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {prods.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default CollectionPage;