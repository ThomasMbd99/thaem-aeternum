import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('thaem-splash-seen');
    }
    return false;
  });

  useEffect(() => {
    if (!show) return;
    const t1 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('thaem-splash-seen', '1');
    }, 2300);
    return () => clearTimeout(t1);
  }, [show]);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
            style={{ background: '#050505' }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          >
            {/* Goutte — flash bref au point d'origine */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 6,
                height: 6,
                background: 'hsl(43, 70%, 72%)',
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Diffusion — halo doré qui se répand comme un sillage */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 6,
                height: 6,
                background: 'radial-gradient(circle, hsl(43,60%,65%) 0%, hsl(43,50%,45%) 45%, transparent 72%)',
              }}
              initial={{ scale: 1, opacity: 0.9, filter: 'blur(0px)' }}
              animate={{ scale: 90, opacity: 0, filter: 'blur(18px)' }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            />

            <div className="relative z-10 flex flex-col items-center gap-4">
              {/* Nom — émerge de la diffusion, du flou au net */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-display"
                style={{
                  fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                  letterSpacing: '0.1em',
                  color: 'hsl(43, 30%, 78%)',
                }}
              >
                TH<span style={{ color: 'hsl(43, 55%, 62%)' }}>Æ</span>M{' '}
                <span style={{ color: 'hsl(43, 55%, 62%)' }}>Æ</span>TERNUM
              </motion.div>

              {/* Slogan */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
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
