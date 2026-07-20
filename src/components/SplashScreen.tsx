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
    }, 2200);
    return () => clearTimeout(t1);
  }, [show]);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(196,149,106,0.07), #050505 65%)',
            }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          >
            <div className="relative z-10 flex flex-col items-center gap-5">

              {/* Sillage — trait doré qui se trace depuis le centre, avec halo lumineux */}
              <div className="relative flex items-center justify-center" style={{ width: '220px', height: '24px' }}>
                <motion.div
                  className="absolute"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                  style={{
                    width: '220px',
                    height: '10px',
                    background: 'radial-gradient(ellipse, hsl(43,60%,65%) 0%, transparent 72%)',
                    filter: 'blur(6px)',
                    opacity: 0.6,
                  }}
                />
                <motion.div
                  className="absolute"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                  style={{
                    width: '220px',
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, hsl(43,62%,68%) 20%, hsl(43,70%,78%) 50%, hsl(43,62%,68%) 80%, transparent)',
                  }}
                />
              </div>

              {/* Nom — se précise du flou au net à mesure que le sillage se referme */}
              <motion.div
                initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                transition={{ delay: 1.5, duration: 0.6 }}
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
