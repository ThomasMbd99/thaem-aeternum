import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">

      {/* Æ géant en fond */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display font-bold leading-none" style={{ fontSize: '50vw', color: 'rgba(196,149,106,0.03)' }}>Æ</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: 'rgba(196,149,106,0.5)' }}>
          Erreur
        </p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display font-light leading-none mb-6"
          style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', color: 'hsl(43,50%,54%)', opacity: 0.25 }}
        >
          404
        </motion.h1>

        <div className="h-px max-w-[60px] mx-auto mb-8" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-display italic text-xl lg:text-2xl mb-3"
          style={{ color: 'hsl(var(--foreground) / 0.7)' }}
        >
          Cette page s'est évaporée.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body text-sm mb-10"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Comme un sillage, elle a disparu dans l'air.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            to="/"
            className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300"
            style={{ border: '1px solid hsl(43,50%,54%)', color: 'hsl(43,50%,54%)' }}
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/parfums"
            className="px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300 text-foreground/40 hover:text-foreground"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Voir les parfums
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
