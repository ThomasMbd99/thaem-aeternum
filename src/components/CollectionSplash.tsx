import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CollectionInfo } from '@/data/products';

interface Props {
  collection: CollectionInfo;
}

const CollectionSplash = ({ collection }: Props) => {
  const [show, setShow] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem(`thaem-collection-${collection.id}`);
    }
    return false;
  });

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem(`thaem-collection-${collection.id}`, '1');
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [show, collection.id]);

  const acc = collection.colors.accent;
  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}` : '196,149,106';
  };
  const rgb = hexToRgb(acc);
  const letters = collection.name.split('');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`splash-${collection.id}`}
          className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden"
          style={{ background: '#0A0A0A' }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
        >
          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(${rgb}, 0.35) 0%, rgba(${rgb}, 0.08) 50%, transparent 75%)`,
            }}
          />

          {/* Æ géant filigrane */}
          <motion.span
            className="absolute font-display font-bold select-none pointer-events-none"
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{
              fontSize: '40vw',
              color: `rgba(${rgb}, 0.06)`,
              lineHeight: 1,
            }}
          >
            Æ
          </motion.span>

          {/* Contenu centré */}
          <div className="relative z-10 text-center px-8">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-body text-[10px] uppercase mb-8"
              style={{ color: `rgba(${rgb}, 0.6)` }}
            >
              Collection
            </motion.p>

            {/* Nom lettre par lettre */}
            <h1 className="font-display leading-none tracking-widest flex justify-center mb-8"
              style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.3 + i * 0.08,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={letter === 'Æ' ? { color: acc } : {}}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            {/* Tagline collection */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="font-display italic text-base lg:text-lg"
              style={{ color: `rgba(${rgb}, 0.7)` }}
            >
              {collection.mood}
            </motion.p>

            {/* Ligne accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
              className="h-px max-w-[100px] mx-auto mt-8 origin-center"
              style={{ backgroundColor: acc }}
            />
          </div>

          {/* Barre de progression en bas */}
          <motion.div
            className="absolute bottom-0 left-0 h-px"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.4, ease: 'linear' }}
            style={{ background: `linear-gradient(to right, transparent, ${acc}, transparent)` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollectionSplash;