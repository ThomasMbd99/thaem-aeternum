import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const curtainColors: Record<string, string> = {
  sacrae: '#F5EFE0',
  vitae: '#FF6B2B',
  umbrae: '#1A0A00',
  nerolae: '#FFF0F5',
  aera: '#D6EEFF',
  default: '#0a0a0a',
};

const ThemeTransition = () => {
  const { isTransitioning, pendingTheme } = useTheme();
  const color = pendingTheme ? curtainColors[pendingTheme] : curtainColors.default;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={pendingTheme ?? 'default'}
          initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0.7 }}
          animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3.0, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: color,
            pointerEvents: 'none',
            backdropFilter: 'blur(20px)',
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default ThemeTransition;