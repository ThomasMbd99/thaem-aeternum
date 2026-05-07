import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; life: number;
  decay: number; color: string;
}

const LETTERS = ['T','H','Æ','M','_','Æ','T','E','R','N','U','M'];

const CinematicHero = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const particles   = useRef<Particle[]>([]);
  const rafRef      = useRef<number>(0);
  const prevScroll  = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Flacon : monte et disparaît
  const bottleY       = useTransform(scrollYProgress, [0, 0.55], ['0vh', '-20vh']);
  const bottleOpacity = useTransform(scrollYProgress, [0, 0.22, 0.52], [1, 1, 0]);
  const bottleScale   = useTransform(scrollYProgress, [0, 0.08, 0.52], [0.88, 1, 1.1]);

  // Halo d'explosion quand le flacon disparaît
  const glowOpacity = useTransform(scrollYProgress, [0.30, 0.50, 0.65], [0, 1, 0]);

  // États texte
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showTagline, setShowTagline]       = useState(false);
  const [showCta, setShowCta]               = useState(false);
  const [showScroll, setShowScroll]         = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setShowScroll(v < 0.05);

    // Spawn particules dorées quand le flacon s'élève
    const delta = v - prevScroll.current;
    const canvas = canvasRef.current;
    if (delta > 0 && v > 0.15 && v < 0.65 && canvas) {
      const cx  = canvas.width  / 2;
      const cy  = canvas.height / 2 - (v - 0.15) * canvas.height * 0.32;
      const nb  = Math.ceil(delta * 900) + 3;
      for (let i = 0; i < nb; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 3;
        particles.current.push({
          x: cx + (Math.random() - 0.5) * 80,
          y: cy + (Math.random() - 0.5) * 80,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: 0.6 + Math.random() * 2.8,
          life: 1,
          decay: 0.007 + Math.random() * 0.02,
          color: Math.random() > 0.65 ? '255,215,130' : '196,149,106',
        });
      }
    }
    prevScroll.current = v;

    // Révélation des lettres
    if (v < 0.50) {
      setVisibleLetters(0); setShowTagline(false); setShowCta(false);
    } else if (v <= 0.78) {
      const p = (v - 0.50) / 0.28;
      setVisibleLetters(Math.round(p * LETTERS.length));
      setShowTagline(false); setShowCta(false);
    } else if (v <= 0.88) {
      setVisibleLetters(LETTERS.length);
      setShowTagline(true); setShowCta(false);
    } else {
      setVisibleLetters(LETTERS.length);
      setShowTagline(true); setShowCta(true);
    }
  });

  // Canvas init + boucle rAF
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.life > 0);
      for (const p of particles.current) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.04;   // légère gravité
        p.vx *= 0.985;
        p.life -= p.decay;
        if (p.life <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${(p.life * 0.95).toFixed(2)})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[280vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: '#080808' }}
      >
        {/* Glow fond */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(196,149,106,0.07) 0%, transparent 70%)' }}
        />

        {/* Æ filigrane */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <span className="font-display" style={{
            fontSize: 'clamp(280px, 55vw, 700px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(196,149,106,0.05)',
            lineHeight: 1,
          }}>Æ</span>
        </div>

        {/* Canvas particules */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ mixBlendMode: 'screen' }}
          aria-hidden="true"
        />

        {/* Explosion dorée */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 pointer-events-none z-[5] flex items-center justify-center"
        >
          <div style={{
            width: '50vw', height: '50vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,149,106,0.28) 0%, rgba(196,149,106,0.08) 45%, transparent 70%)',
            filter: 'blur(24px)',
          }} />
        </motion.div>

        {/* Flacon */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div style={{ y: bottleY, opacity: bottleOpacity, scale: bottleScale }}>
            <img
              src="/flacon-hero.png.png"
              alt="Flacon THÆM ÆTERNUM"
              className="h-[52vh] lg:h-[68vh] w-auto object-contain select-none"
              style={{
                filter: 'drop-shadow(0 0 60px rgba(196,149,106,0.35)) drop-shadow(0 40px 80px rgba(0,0,0,0.7))',
              }}
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Nom + tagline + CTAs */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-5 px-4 z-30">

          {/* Lettres */}
          <div className="flex items-baseline justify-center flex-wrap" style={{ gap: 'clamp(3px, 0.8vw, 12px)' }}>
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={i < visibleLetters
                  ? { opacity: l === '_' ? 0 : 1, filter: 'blur(0px)', y: 0 }
                  : { opacity: 0, filter: 'blur(18px)', y: 28 }
                }
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-none"
                style={{
                  fontSize: l === '_' ? 'clamp(1rem, 3vw, 3rem)' : 'clamp(2.6rem, 7vw, 8rem)',
                  letterSpacing: '0.05em',
                  color: 'hsl(43, 50%, 62%)',
                  fontWeight: l === 'Æ' ? '500' : '300',
                  textShadow: l === 'Æ'
                    ? '0 0 30px hsl(43 60% 65% / 0.7), 0 0 60px hsl(43 60% 65% / 0.3)'
                    : 'none',
                  display: 'inline-block',
                  width: l === '_' ? 'clamp(0.8rem, 2vw, 2.5rem)' : 'auto',
                  visibility: l === '_' ? 'hidden' : 'visible',
                }}
              >
                {l === '_' ? ' ' : l}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={false}
            animate={showTagline
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 14, filter: 'blur(8px)' }
            }
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display italic text-center"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', color: 'rgba(196,149,106,0.5)' }}
          >
            Le souffle de l&apos;âme.
          </motion.p>

          {/* Ligne */}
          <motion.div
            initial={false}
            animate={showTagline ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-px w-20 origin-center"
            style={{ background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.55), transparent)' }}
          />

          {/* CTAs */}
          <motion.div
            initial={false}
            animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8 }}
            className="flex gap-4 flex-wrap justify-center pointer-events-auto mt-2"
          >
            <Link to="/collections"
              className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:opacity-80"
              style={{ border: '1px solid rgba(196,149,106,0.5)', color: '#C4956A', background: 'rgba(196,149,106,0.08)' }}
            >
              Découvrir les gammes
            </Link>
            <Link to="/coffret"
              className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}
            >
              Coffret Découverte
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ opacity: showScroll ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-40"
        >
          <p className="font-body text-[10px] uppercase tracking-[0.35em]" style={{ color: 'rgba(196,149,106,0.4)' }}>
            Défiler
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10"
            style={{ background: 'linear-gradient(to bottom, rgba(196,149,106,0.5), transparent)' }}
          />
        </motion.div>

        {/* Vignette bas */}
        <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-50"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,8,8,0.9))' }}
        />
      </div>
    </section>
  );
};

export default CinematicHero;
