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
    }, 2400);
    return () => clearTimeout(t1);
  }, [show]);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: '#050505' }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          >
            <div className="relative z-10 flex flex-col items-center gap-6">

              {/* Sillage — trait doré qui se trace */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                style={{
                  width: '180px',
                  height: '1px',
                  transformOrigin: 'left',
                  background: 'linear-gradient(to right, transparent, hsl(43,55%,62%) 60%, hsl(43,55%,62%))',
                }}
              />

              {/* Nom — apparaît au moment où le sillage se termine */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default SplashScreen;
