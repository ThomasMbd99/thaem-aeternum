import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('thaem-splash-seen');
    }
    return false;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!show) return;
    const t1 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('thaem-splash-seen', '1');
    }, 3200);
    return () => clearTimeout(t1);
  }, [show]);

  // Canvas — rayons très subtils
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let t = 0;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.006;

      const cx = W / 2;
      const cy = H / 2;

      // Halo central très discret
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.4);
      halo.addColorStop(0, `rgba(196, 149, 106, ${0.06 + Math.sin(t) * 0.02})`);
      halo.addColorStop(1, 'rgba(196, 149, 106, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      // 6 rayons fins et très transparents
      for (let r = 0; r < 6; r++) {
        const angle = (r / 6) * Math.PI * 2 + t * 0.05;
        const len = (W > H ? W : H);
        const alpha = 0.025 + Math.sin(t * 0.5 + r) * 0.01;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        const grad = ctx.createLinearGradient(0, 0, len, 0);
        grad.addColorStop(0, `rgba(196, 149, 106, ${alpha})`);
        grad.addColorStop(0.5, `rgba(196, 149, 106, ${alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(196, 149, 106, 0)');

        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(len, -2);
        ctx.lineTo(len, 2);
        ctx.lineTo(0, 8);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [show]);

  const letters = ['T','H','Æ','M','SPACE','Æ','T','E','R','N','U','M'];

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: '#050505' }}
            exit={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
          >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8">

              {/* Nom */}
              <div className="flex items-baseline justify-center">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.4 + i * 0.09,
                      duration: 1.2,
                      ease: 'easeOut',
                    }}
                    className="font-display"
                    style={{
                      fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                      letterSpacing: '0.1em',
                      color: (i === 2 || i === 5)
                        ? 'hsl(43, 55%, 62%)'
                        : 'hsl(43, 30%, 78%)',
                      width: letter === 'SPACE' ? '1.8rem' : 'auto',
                    }}
                  >
                    {letter === 'SPACE' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </div>

              {/* Ligne */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
                style={{
                  width: '60px',
                  height: '1px',
                  background: 'hsl(43,50%,54%)',
                  opacity: 0.5,
                }}
              />

              {/* Slogan */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="font-body uppercase"
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.45em',
                  color: 'rgba(196,149,106,0.4)',
                }}
              >
                Le souffle de l&apos;âme
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default SplashScreen;