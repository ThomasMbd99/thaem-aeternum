import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';

const LETTERS = ['T','H','Æ','M','_','Æ','T','E','R','N','U','M'];

const CinematicHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Flacon : pivote et disparaît
  const bottleRotateY  = useTransform(scrollYProgress, [0, 0.48], [0, 90]);
  const bottleOpacity  = useTransform(scrollYProgress, [0, 0.28, 0.50], [1, 1, 0]);
  const bottleScale    = useTransform(scrollYProgress, [0, 0.48], [1, 0.82]);

  // Lettres + tagline + CTA
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showTagline, setShowTagline]       = useState(false);
  const [showCta, setShowCta]               = useState(false);
  const [showScroll, setShowScroll]         = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setShowScroll(v < 0.05);

    if (v < 0.44) {
      setVisibleLetters(0);
      setShowTagline(false);
      setShowCta(false);
    } else if (v >= 0.44 && v <= 0.74) {
      const p = (v - 0.44) / 0.30;
      setVisibleLetters(Math.round(p * LETTERS.length));
      setShowTagline(false);
      setShowCta(false);
    } else if (v > 0.74 && v <= 0.86) {
      setVisibleLetters(LETTERS.length);
      setShowTagline(true);
      setShowCta(false);
    } else {
      setVisibleLetters(LETTERS.length);
      setShowTagline(true);
      setShowCta(true);
    }
  });

  return (
    <section ref={sectionRef} className="relative h-[280vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: '#080808' }}
      >
        {/* Glow fond doré */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(196,149,106,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Grand Æ en filigrane */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-display"
            style={{
              fontSize: 'clamp(280px, 55vw, 700px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(196,149,106,0.05)',
              lineHeight: 1,
            }}
          >
            Æ
          </span>
        </div>

        {/* ── FLACON ── */}
        <div style={{ perspective: '1200px' }} className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{
              rotateY: bottleRotateY,
              opacity: bottleOpacity,
              scale: bottleScale,
            }}
          >
            <img
              src="/flacon-hero.png.png"
              alt="Flacon THÆM ÆTERNUM"
              className="h-[52vh] lg:h-[68vh] w-auto object-contain select-none"
              style={{
                filter: 'drop-shadow(0 0 60px rgba(196,149,106,0.30)) drop-shadow(0 40px 80px rgba(0,0,0,0.6))',
              }}
              draggable={false}
            />
          </motion.div>
        </div>

        {/* ── NOM + TAGLINE + CTA ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-6 px-4">

          {/* Lettres */}
          <div className="flex items-baseline justify-center flex-wrap" style={{ gap: 'clamp(4px, 1vw, 14px)' }}>
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={
                  i < visibleLetters
                    ? { opacity: l === '_' ? 0 : 1, filter: 'blur(0px)', y: 0 }
                    : { opacity: 0, filter: 'blur(16px)', y: 24 }
                }
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="font-display leading-none"
                style={{
                  fontSize: l === '_' ? 'clamp(1rem, 3vw, 3rem)' : 'clamp(2.6rem, 7vw, 8rem)',
                  letterSpacing: '0.05em',
                  color: 'hsl(43, 50%, 62%)',
                  fontWeight: l === 'Æ' ? '500' : '300',
                  textShadow:
                    l === 'Æ'
                      ? '0 0 30px hsl(43 60% 65% / 0.7), 0 0 60px hsl(43 60% 65% / 0.3)'
                      : 'none',
                  display: 'inline-block',
                  width: l === '_' ? 'clamp(0.8rem, 2vw, 2.5rem)' : 'auto',
                  visibility: l === '_' ? 'hidden' : 'visible',
                }}
              >
                {l === '_' ? ' ' : l}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={false}
            animate={showTagline ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 16, filter: 'blur(8px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display italic text-center"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              color: 'rgba(196,149,106,0.5)',
              letterSpacing: '0.02em',
            }}
          >
            Le souffle de l&apos;âme.
          </motion.p>

          {/* Ligne dorée */}
          <motion.div
            initial={false}
            animate={showTagline ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-px w-24 origin-center"
            style={{ background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.6), transparent)' }}
          />

          {/* CTAs */}
          <motion.div
            initial={false}
            animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 flex-wrap justify-center pointer-events-auto"
          >
            <Link
              to="/collections"
              className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:opacity-80"
              style={{
                border: '1px solid rgba(196,149,106,0.5)',
                color: '#C4956A',
                background: 'rgba(196,149,106,0.08)',
              }}
            >
              Découvrir les gammes
            </Link>
            <Link
              to="/coffret"
              className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:text-white"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Coffret Découverte
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ opacity: showScroll ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p
            className="font-body text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'rgba(196,149,106,0.4)' }}
          >
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
        <div
          className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,8,8,0.8))' }}
        />
      </div>
    </section>
  );
};

export default CinematicHero;
