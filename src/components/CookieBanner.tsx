import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('thaem-cookies');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('thaem-cookies', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('thaem-cookies', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-md z-50 rounded-lg p-5 border"
          style={{
            background: 'hsl(var(--background))',
            borderColor: 'rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <p className="font-display italic text-base text-foreground mb-2">Cookies</p>
          <p className="font-body text-xs text-foreground/60 leading-relaxed mb-4">
            Ce site utilise des cookies techniques essentiels à son fonctionnement. Aucun cookie publicitaire.{' '}
            <Link to="/confidentialite" className="underline hover:text-foreground transition-colors">
              En savoir plus
            </Link>
          </p>
          <div className="flex gap-3">
            <button
              onClick={accept}
              className="flex-1 py-2 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
              style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.3)', color: '#C4956A' }}
            >
              Accepter
            </button>
            <button
              onClick={decline}
              className="flex-1 py-2 font-body text-xs uppercase tracking-widest rounded border border-white/10 text-foreground/40 hover:text-foreground transition-colors"
            >
              Refuser
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
