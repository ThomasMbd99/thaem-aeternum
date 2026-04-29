import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collections, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Recycle, Gift, Sparkles } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import almaePromo from '@/assets/bottles/almae-promo.png';
import { useRef, useEffect, useCallback } from 'react';

const bestSellers = [products[0], products[3], products[6], products[9], products[12]];

// ── CANVAS : vague dorée lente + particules flottantes
const GoldWaveCanvas = () => {
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

    // Particles
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.1 + Math.random() * 0.3),
      opacity: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.008;

      // ── Vagues dorées lentes
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const amp = 55 + w * 20;
        const freq = 0.0018 + w * 0.0006;
        const speed = t * (0.4 + w * 0.15);
        const yBase = H * (0.35 + w * 0.12);
        const alpha = 0.035 - w * 0.008;

        ctx.moveTo(0, yBase);
        for (let x = 0; x <= W; x += 4) {
          const y = yBase
            + Math.sin(x * freq + speed) * amp
            + Math.sin(x * freq * 1.7 + speed * 0.8) * (amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp);
        grad.addColorStop(0, `rgba(196,149,106,0)`);
        grad.addColorStop(0.5, `rgba(196,149,106,${alpha})`);
        grad.addColorStop(1, `rgba(196,149,106,0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // ── Lueur centrale pulsante
      const pulse = 0.06 + Math.sin(t * 1.2) * 0.025;
      const radial = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.55);
      radial.addColorStop(0, `rgba(196,149,106,${pulse})`);
      radial.addColorStop(0.5, `rgba(196,149,106,0.015)`);
      radial.addColorStop(1, 'rgba(196,149,106,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, H);

      // ── Particules dorées flottantes
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.phase) * 0.15;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const flicker = p.opacity * (0.7 + Math.sin(t * 2 + p.phase) * 0.3);

        // Glow autour de la particule
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        glow.addColorStop(0, `rgba(220,180,120,${flicker * 0.4})`);
        glow.addColorStop(1, 'rgba(220,180,120,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Point central
        ctx.fillStyle = `rgba(245,230,190,${flicker})`;
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
      style={{ opacity: 1 }}
    />
  );
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <PageTransition>
      <div className="min-h-screen">

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">

          {/* Canvas animation */}
          <GoldWaveCanvas />

          {/* Overlay sombre en haut et bas */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, transparent 30%, transparent 70%, rgba(10,10,10,0.7) 100%)' }}
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
              style={{ color: 'rgba(196,149,106,0.35)' }}
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
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
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
            <span className="font-body text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(196,149,106,0.4)' }}>
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
        <section className="relative py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[30vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.03)' }}>Æ</span>
          </div>
          <div className="container mx-auto px-6 lg:px-16 relative z-10 max-w-2xl text-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="h-px mb-16 origin-center"
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
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(196,149,106,0.6)' }}>
                Nos Univers
              </p>
              <h2 className="font-display text-3xl lg:text-5xl italic font-light">
                Cinq gammes.<br />
                <span className="text-foreground/40">Une maison.</span>
              </h2>
            </motion.div>

            {(() => {
              const themeBgs: Record<string, string> = {
                sacrae: 'linear-gradient(150deg, #F5EFE0 0%, #EFE5CC 40%, #E8D8B8 70%, #F0E8D5 100%)',
                vitae: 'linear-gradient(160deg, #7a1500 0%, #c03000 25%, #e05500 55%, #cc7700 80%, #a08800 100%)',
                umbrae: 'radial-gradient(ellipse at 30% 60%, #3D1A00 0%, #1A0A00 45%, #0D0500 100%)',
                nerolae: 'linear-gradient(135deg, #FFF0F5 0%, #FFD6E7 40%, #FFCCE0 70%, #FFF0F5 100%)',
                aera:    'linear-gradient(135deg, #F5FAFF 0%, #D6EEFF 40%, #C0E4FF 70%, #F0F8FF 100%)',
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
                          className="relative p-8 min-h-[320px] flex flex-col items-center justify-center text-center overflow-hidden rounded transition-all duration-700"
                          style={{ background: 'hsl(0 0% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          {/* Fond thème complet au hover */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded"
                            style={{ background: themeBgs[col.id] }}
                          />
                          {(() => {
                            const lightThemes = ['sacrae', 'nerolae', 'aera'];
                            const isLight = lightThemes.includes(col.id);
                            const textColor = isLight ? col.colors.text : 'hsl(var(--foreground))';
                            const subColor = isLight ? col.colors.text + '99' : 'rgba(255,255,255,0.5)';
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
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
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
        <section className="relative py-28 lg:py-36 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[25vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.03)' }}>Æ</span>
          </div>

          <div className="container mx-auto px-6 lg:px-16 max-w-2xl relative z-10 text-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="h-px mb-16 origin-center"
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
        <section className="py-20 lg:py-28 relative overflow-hidden">
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
              <p className="font-display text-4xl mt-6 mb-8" style={{ color: 'hsl(43,50%,54%)' }}>50€</p>
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
        <section className="py-20 lg:py-28">
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

        {/* ── ECO ── */}
        <section className="py-20 lg:py-28 border-t" style={{ borderColor: 'rgba(196,149,106,0.1)' }}>
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