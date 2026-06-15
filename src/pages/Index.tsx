import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collections, type Product } from '@/data/products';
import { useParfums } from '@/hooks/useParfums';
import ProductCard from '@/components/ProductCard';
import { Recycle, Gift, Sparkles } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import almaePromo from '@/assets/bottles/almae-promo.png';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useTheme } from '@/context/ThemeContext';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

// ── CANVAS : encre / fumée sombre + particules dorées
const InkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let t = 0;

    // Volutes de fumée
    const blobs = Array.from({ length: 7 }, (_, i) => ({
      x: W * (0.15 + i * 0.12),
      y: H * (0.4 + Math.random() * 0.3),
      r: 80 + Math.random() * 140,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(0.08 + Math.random() * 0.12),
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.5 ? '196,149,106' : '80,50,20',
    }));

    // Particules fines
    const dust = Array.from({ length: 35 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.05 + Math.random() * 0.18),
      opacity: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.004;

      // Lueur centrale très douce
      const pulse = 0.04 + Math.sin(t * 0.8) * 0.015;
      const radial = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.5);
      radial.addColorStop(0, `rgba(196,149,106,${pulse})`);
      radial.addColorStop(0.6, `rgba(80,40,10,0.02)`);
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);

      // Volutes de fumée / encre
      for (const b of blobs) {
        b.x += b.vx + Math.sin(t * 0.5 + b.phase) * 0.3;
        b.y += b.vy;
        if (b.y < -b.r * 2) {
          b.y = H + b.r;
          b.x = Math.random() * W;
        }
        const wobble = 1 + Math.sin(t * 0.7 + b.phase) * 0.15;
        const alpha = 0.018 + Math.sin(t * 0.6 + b.phase) * 0.008;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * wobble);
        g.addColorStop(0, `rgba(${b.hue},${alpha * 2})`);
        g.addColorStop(0.4, `rgba(${b.hue},${alpha})`);
        g.addColorStop(1, `rgba(${b.hue},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.r * wobble, b.r * 1.4 * wobble, Math.sin(t * 0.3 + b.phase) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Poussière dorée
      for (const p of dust) {
        p.x += p.vx + Math.sin(t * 1.5 + p.phase) * 0.1;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        const flicker = p.opacity * (0.6 + Math.sin(t * 3 + p.phase) * 0.4);
        const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g2.addColorStop(0, `rgba(220,175,110,${flicker * 0.5})`);
        g2.addColorStop(1, 'rgba(220,175,110,0)');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(240,210,160,${flicker})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const cleanup = draw();
    return cleanup;
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

// ── GRAIN cinématographique (overlay sur tout le site)
const FilmGrain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas offscreen à demi-résolution → CPU ÷ 4
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      off.width = Math.floor(window.innerWidth / 2);
      off.height = Math.floor(window.innerHeight / 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = off.width;
      const H = off.height;
      const imageData = offCtx.createImageData(W, H);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v; data[i + 1] = v; data[i + 2] = v;
        data[i + 3] = (Math.random() * 18) | 0;
      }
      offCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
      // Throttle à ~20fps
      setTimeout(() => { animRef.current = requestAnimationFrame(draw); }, 50);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[999]"
      style={{ mixBlendMode: 'overlay', opacity: 0.45 }}
    />
  );
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const { parfums: parfumsDB } = useParfums();
  const { articles } = useArticles();
  const { lightMode } = useTheme();
  const bestSellers = useMemo((): Product[] => {
    return parfumsDB.filter(p => p.flagship && !p.en_promo) as unknown as Product[];
  }, [parfumsDB]);

  return (
    <PageTransition>
      <Helmet>
        <title>THÆM ÆTERNUM, Parfumerie d'Exception</title>
        <meta name="description" content="Le souffle de l'âme. Découvrez nos créations parfumées artisanales à travers 5 univers olfactifs uniques. Extraits de parfum 100% français." />
        <meta property="og:title" content="THÆM ÆTERNUM, Parfumerie d'Exception" />
        <meta property="og:description" content="Le souffle de l'âme. Extraits de parfum artisanaux d'exception." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen">

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">

          {/* Canvas animation — masquée en mode clair */}
          {!lightMode && <InkCanvas />}

          {/* Grand Æ en fond — subtil */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-display"
              style={{
                fontSize: 'clamp(280px, 55vw, 700px)',
                color: 'transparent',
                WebkitTextStroke: lightMode ? '1px rgba(196,149,106,0.12)' : '1px rgba(196,149,106,0.07)',
                lineHeight: 1,
                userSelect: 'none',
                opacity: 0.9,
              }}
            >
              Æ
            </span>
          </div>

          {/* Overlay haut/bas — adapté au mode */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: lightMode
                ? 'linear-gradient(to bottom, rgba(245,240,230,0.6) 0%, transparent 30%, transparent 70%, rgba(245,240,230,0.8) 100%)'
                : 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, transparent 30%, transparent 70%, rgba(10,10,10,0.7) 100%)',
            }}
          />

          {/* Contenu hero */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 text-center px-4"
          >


            {/* Nom sur une ligne */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-baseline justify-center gap-2 lg:gap-3 flex-wrap"
            >
              {['T','H','Æ','M','SPACE','Æ','T','E','R','N','U','M'].map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display leading-none"
                  style={{
                    fontSize: l === 'SPACE' ? 'clamp(1rem, 3vw, 3rem)' : 'clamp(2.8rem, 7vw, 8rem)',
                    letterSpacing: '0.05em',
                    color: 'hsl(43, 50%, 62%)',
                    textShadow: (i === 2 || i === 5)
                      ? '0 0 30px hsl(43 60% 65% / 0.7), 0 0 60px hsl(43 60% 65% / 0.3)'
                      : 'none',
                    fontWeight: (i === 2 || i === 5) ? '500' : '300',
                    display: 'inline-block',
                    width: l === 'SPACE' ? '2rem' : 'auto',
                    visibility: l === 'SPACE' ? 'hidden' : 'visible',
                  }}
                >
                  {l === 'SPACE' ? '\u00A0' : l}
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="font-display italic text-base lg:text-xl mt-10"
              style={{ color: lightMode ? 'rgba(196,149,106,0.6)' : 'rgba(196,149,106,0.35)' }}
            >
              Le souffle de l’âme.
            </motion.p>

            {/* Ligne dorée */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
              className="h-px max-w-[100px] mx-auto mt-8 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="flex gap-4 justify-center flex-wrap mt-10"
            >
              <Link
                to="/collections"
                className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300"
                style={{ border: '1px solid hsl(43,50%,54%)', color: 'hsl(43,50%,54%)' }}
              >
                Découvrir les gammes
              </Link>
              <Link
                to="/histoire"
                className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300 text-foreground/50 hover:text-foreground"
                style={{ border: '1px solid var(--c-w10)' }}
              >
                Notre histoire
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <span className="font-body text-[9px] tracking-[0.3em] uppercase" style={{ color: lightMode ? 'rgba(196,149,106,0.65)' : 'rgba(196,149,106,0.4)' }}>
              Défiler
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-px h-10"
              style={{ background: 'linear-gradient(to bottom, hsl(43,50%,54%), transparent)' }}
            />
          </motion.div>
        </section>

        {/* ── MANIFESTE ── */}
        <section className="relative py-10 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[30vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.03)' }}>Æ</span>
          </div>
          <div className="container mx-auto px-4 lg:px-16 relative z-10 max-w-2xl text-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="h-px mb-10 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-display italic text-xl lg:text-3xl leading-relaxed"
              style={{ color: 'hsl(var(--foreground) / 0.75)' }}
            >
              "Chaque parfum est une empreinte.<br />
              <span style={{ color: 'hsl(43,50%,54%)' }}>Chaque sillage, une présence.</span>"
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="h-px mt-16 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />
          </div>
        </section>

        {/* ── 4 COLLECTIONS ── */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(196,149,106,0.6)' }}>
                Nos Univers
              </p>
              <h2 className="font-display text-3xl lg:text-5xl italic font-light mb-6">
                Une maison.<br />
                <span className="text-foreground/40">Cinq sillages.</span>
              </h2>
              <p className="font-display text-base lg:text-lg italic font-light leading-relaxed max-w-2xl mx-auto mb-6" style={{ color: 'var(--c-w50)' }}>
                THÆM ÆTERNUM façonne ses créations en cinq gammes, chacune une facette de son âme : une gourmande, sucrée et enveloppante ; une fruitée, lumineuse et solaire ; une ambrée, portée par l'oud, intense et profonde ; une florale, délicate et raffinée ; une dernière, pure et aérienne, comme un souffle propre.
              </p>
              <p className="font-body text-xs text-muted-foreground/40 mb-10" style={{ letterSpacing: '0.08em' }}>
                Cinq écritures olfactives. Une seule signature. À découvrir juste ci-dessous.
              </p>

              <div className="h-px w-16 mx-auto mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4), transparent)' }} />
            </motion.div>

            {(() => {
              const themeBgs: Record<string, string> = {
                sacrae: 'linear-gradient(150deg, #F5EFE0 0%, #EFE5CC 40%, #E8D8B8 70%, #F0E8D5 100%)',
                vitae: 'linear-gradient(160deg, #7a1500 0%, #c03000 25%, #e05500 55%, #cc7700 80%, #a08800 100%)',
                umbrae: 'radial-gradient(ellipse at 30% 60%, #3D1A00 0%, #1A0A00 45%, #0D0500 100%)',
                nerolae: 'linear-gradient(135deg, #FFF0F5 0%, #FFD6E7 40%, #FFCCE0 70%, #FFF0F5 100%)',
                aera:    'linear-gradient(135deg, #0D2A42 0%, #1A4A6E 35%, #1E5C8A 65%, #0D2A42 100%)',
              };
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {collections.map((col, i) => (
                    <motion.div
                      key={col.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <Link to={`/collection/${col.id}`} className="block h-full">
                        <div
                          className="relative p-6 min-h-[220px] sm:min-h-[320px] flex flex-col items-center justify-center text-center overflow-hidden rounded transition-all duration-700"
                          style={{ background: 'var(--c-bg7)', border: '1px solid var(--c-w06)' }}
                        >
                          {/* Fond thème complet au hover */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded"
                            style={{ background: themeBgs[col.id] }}
                          />
                          {(() => {
                            const lightThemes = ['sacrae', 'nerolae'];
                            const isLight = lightThemes.includes(col.id);
                            const textColor = isLight ? col.colors.text : 'hsl(var(--foreground))';
                            const subColor = isLight ? col.colors.text + '99' : 'var(--c-w50)';
                            return (
                              <div className="relative z-10 flex flex-col items-center">
                                <h3
                                  className="font-display text-3xl lg:text-4xl italic font-light mb-3 transition-colors duration-500"
                                  dangerouslySetInnerHTML={{ __html: col.displayName }}
                                  style={{ color: textColor }}
                                />
                                <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-4 transition-colors duration-500" style={{ color: col.colors.accent }}>
                                  {col.mood.split(', ').map((m: string, i: number) => <p key={i}>{m}</p>)}
                                </p>
                                <p className="font-body text-xs leading-relaxed opacity-50 group-hover:opacity-90 transition-opacity duration-500" style={{ color: textColor }}>
                                  {col.description}
                                </p>
                                <span
                                  className="mt-8 font-body text-[10px] uppercase tracking-[0.3em] transition-all duration-500 group-hover:tracking-[0.5em]"
                                  style={{ color: col.colors.accent }}
                                >
                                  Explorer →
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── BEST SELLERS ── */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="flex items-center gap-4 justify-center mb-4">
                <div className="h-px w-16" style={{ background: 'rgba(196,149,106,0.3)' }} />
                <p className="font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(196,149,106,0.6)' }}>
                  Sélection
                </p>
                <div className="h-px w-16" style={{ background: 'rgba(196,149,106,0.3)' }} />
              </div>
              <h2 className="font-display text-3xl lg:text-5xl italic font-light">
                Les signatures<br />
                <span className="text-foreground/40">de la maison.</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── EXTRAIT DE PARFUM ── */}
        <section className="relative py-14 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[25vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.03)' }}>Æ</span>
          </div>

          <div className="container mx-auto px-6 lg:px-16 max-w-2xl relative z-10 text-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="h-px mb-10 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-body text-[10px] uppercase tracking-[0.5em] mb-6"
              style={{ color: 'rgba(196,149,106,0.6)' }}
            >
              Notre engagement
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.9 }}
              className="font-display text-3xl lg:text-5xl italic font-light mb-8"
            >
              Extrait de <span style={{ color: 'hsl(43,50%,54%)' }}>Parfum</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="font-display italic text-base lg:text-lg leading-relaxed mb-6"
              style={{ color: 'hsl(var(--foreground) / 0.55)' }}
            >
              La concentration la plus haute. La signature la plus longue.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="font-body text-sm leading-relaxed mb-10"
              style={{ color: 'hsl(var(--foreground) / 0.4)' }}
            >
              Toutes nos créations sont formulées en extrait de parfum pur. Pas d&apos;eau de toilette, pas de compromis. Chaque fragrance THÆM ÆTERNUM tient sur la peau et laisse un sillage que l&apos;on remarque sans chercher à l&apos;imposer.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="font-display italic text-base"
              style={{ color: 'hsl(43,50%,54%)' }}
            >
              C&apos;est notre seul format de création. Par choix.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="h-px mt-16 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />
          </div>
        </section>

        {/* ── COFFRET ── */}
        <section className="py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[25vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.025)' }}>Æ</span>
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto text-center"
            >
              <Gift className="w-8 h-8 mx-auto mb-8" style={{ color: 'hsl(43,50%,54%)' }} />
              <h2 className="font-display text-3xl lg:text-5xl mb-4 italic font-light">
                Coffret <span style={{ color: 'hsl(43,60%,65%)' }}>Æ</span>TERNUM
              </h2>
              <p className="font-body text-sm text-foreground/50 mb-2">5 parfums au choix · 5 × 10ml</p>
              <p className="font-display text-4xl mt-6 mb-8" style={{ color: 'hsl(43,50%,54%)' }}>39,99€</p>
              <Link
                to="/coffret"
                className="inline-block px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300"
                style={{ border: '1px solid hsl(43,50%,54%)', color: 'hsl(43,50%,54%)' }}
              >
                Composer mon coffret
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── QUIZ CTA ── */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="flex items-center gap-4 justify-center mb-8">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4))' }} />
                <span className="font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(196,149,106,0.6)' }}>
                  Quiz Olfactif
                </span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(196,149,106,0.4))' }} />
              </div>
              <h2 className="font-display text-3xl lg:text-5xl italic font-light mb-4">
                Quelle est<br />
                <span style={{ color: 'hsl(43,50%,54%)' }}>votre signature ?</span>
              </h2>
              <p className="font-body text-sm text-foreground/45 mb-10">5 questions. Votre fragrance idéale révélée.</p>
              <Link
                to="/quiz"
                className="inline-block px-10 py-4 font-body text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
                style={{ border: '1px solid rgba(196,149,106,0.4)', color: 'hsl(43,50%,54%)' }}
              >
                Commencer le Quiz
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── JOURNAL ── */}
        {articles.length > 0 && (
          <section className="py-12 lg:py-16 border-t" style={{ borderColor: 'rgba(196,149,106,0.1)' }}>
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: 'rgba(196,149,106,0.6)' }}>La Maison</p>
                    <h2 className="font-display text-3xl lg:text-4xl italic font-light">Le Journal <span style={{ color: 'hsl(43,50%,54%)' }}>Æ</span></h2>
                  </div>
                  <Link
                    to="/journal"
                    className="hidden md:flex font-body text-[10px] uppercase tracking-[0.25em] transition-colors hover:text-primary"
                    style={{ color: 'var(--c-w30)' }}
                  >
                    Tous les articles →
                  </Link>
                </div>

                <Carousel opts={{ align: 'start', loop: articles.length > 1 }} className="w-full">
                  <CarouselContent className="-ml-4">
                    {articles.slice(0, 6).map(article => (
                      <CarouselItem key={article.id} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                        <Link
                          to={`/journal/${article.slug}`}
                          className="group relative block rounded-xl overflow-hidden border border-white/8 hover:border-white/16 transition-all duration-500"
                          style={{ aspectRatio: '4/5', background: 'var(--c-bg8)' }}
                        >
                          {article.image_url
                            ? <img src={article.image_url} alt={article.titre} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            : <div className="absolute inset-0 flex items-center justify-center"><span className="font-display text-7xl font-bold" style={{ color: 'rgba(196,149,106,0.08)' }}>Æ</span></div>
                          }
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <span className="inline-block font-body text-[9px] uppercase tracking-widest px-2.5 py-1 rounded mb-3" style={{ background: 'rgba(196,149,106,0.18)', color: '#E8C28A', border: '1px solid rgba(196,149,106,0.3)' }}>
                              {article.categorie}
                            </span>
                            <h3 className="font-display italic text-xl lg:text-2xl font-light text-white leading-snug group-hover:text-primary transition-colors">
                              {article.titre}
                            </h3>
                          </div>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
                  <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
                </Carousel>

                <div className="mt-8 text-center md:hidden">
                  <Link to="/journal" className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/35 hover:text-primary transition-colors">
                    Tous les articles →
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── ECO ── */}
        <section className="py-12 lg:py-16 border-t" style={{ borderColor: 'rgba(196,149,106,0.1)' }}>
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto text-center"
            >
              <Recycle className="w-8 h-8 mx-auto mb-8" style={{ color: 'hsl(43,50%,54%)' }} />
              <h2 className="font-display text-3xl lg:text-4xl italic font-light mb-6">Rechargez votre flacon</h2>
              <p className="font-body text-sm text-foreground/45 leading-relaxed">
                Nos recharges 50ml à 35€ vous permettent de réutiliser votre flacon signature. Le luxe et la responsabilité vont de pair.
              </p>
            </motion.div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Index;