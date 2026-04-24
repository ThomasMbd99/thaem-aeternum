import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, getCollection } from '@/data/products';
import { getBottleImage } from '@/data/bottleImages';
import { useState, useCallback, useRef } from 'react';

interface Props {
  product: Product;
  index?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  type: 'grain' | 'petal' | 'smoke' | 'spark';
}

// ── SACRÆ : pluie de grains de sucre dorés sur toute la carte
const spawnSacrae = (W: number, H: number): Particle[] =>
  Array.from({ length: 22 }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * W,
    y: Math.random() * H * 0.4,
    tx: (Math.random() - 0.5) * 30,
    ty: 50 + Math.random() * 80,
    color: ['#C4956A', '#E8C99A', '#F5F0E1', '#D4A574', '#FFE0A0'][Math.floor(Math.random() * 5)],
    size: 2 + Math.random() * 3.5,
    duration: 0.9 + Math.random() * 0.6,
    delay: Math.random() * 0.4,
    rotate: Math.random() * 360,
    type: 'grain',
  }));

// ── VITÆ : éclats solaires qui explosent depuis le centre de la carte
const spawnVitaea = (W: number, H: number): Particle[] =>
  Array.from({ length: 20 }, (_, i) => {
    const angle = (360 / 20) * i + Math.random() * 10;
    const rad = (angle * Math.PI) / 180;
    const dist = 60 + Math.random() * 60;
    return {
      id: Date.now() + i,
      x: W / 2, y: H / 2,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      color: ['#FF6B2B', '#FF4500', '#FFB347', '#FFE566', '#FF8C00'][Math.floor(Math.random() * 5)],
      size: 3 + Math.random() * 5,
      duration: 0.6 + Math.random() * 0.4,
      delay: Math.random() * 0.1,
      rotate: 0,
      type: 'spark',
    };
  });

// ── UMBRÆ : volutes de fumée sombre qui montent depuis le bas de la carte
const spawnUmbrae = (W: number, H: number): Particle[] =>
  Array.from({ length: 12 }, (_, i) => ({
    id: Date.now() + i,
    x: (W / 12) * i + Math.random() * (W / 12),
    y: H * 0.75 + Math.random() * (H * 0.25),
    tx: (Math.random() - 0.5) * 40,
    ty: -(70 + Math.random() * 80),
    color: ['#8B6914', '#5C3A1E', '#3D2020', '#6B4226', '#2A1A1A'][Math.floor(Math.random() * 5)],
    size: 20 + Math.random() * 25,
    duration: 1.2 + Math.random() * 0.6,
    delay: Math.random() * 0.4,
    rotate: (Math.random() - 0.5) * 80,
    type: 'smoke',
  }));

// ── FLORÆ : pétales qui tombent depuis le haut sur toute la largeur
const spawnFlorae = (W: number, H: number): Particle[] =>
  Array.from({ length: 18 }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * W,
    y: -10 + Math.random() * (H * 0.2),
    tx: (Math.random() - 0.5) * 50,
    ty: 60 + Math.random() * 80,
    color: ['#F0A0B8', '#FFB7C5', '#FADADD', '#FFD6E0', '#FFC0CB'][Math.floor(Math.random() * 5)],
    size: 8 + Math.random() * 7,
    duration: 1.1 + Math.random() * 0.7,
    delay: Math.random() * 0.4,
    rotate: 180 + Math.random() * 360,
    type: 'petal',
  }));

const spawnAera = (W: number, H: number): Particle[] =>
  Array.from({ length: 20 }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * W,
    y: H * 0.6 + Math.random() * (H * 0.4),
    tx: (Math.random() - 0.5) * 40,
    ty: -(60 + Math.random() * 80),
    color: ['#A8D4F0', '#D6EEFF', '#FFFFFF', '#C0E4FF', '#E8F4FF'][Math.floor(Math.random() * 5)],
    size: 4 + Math.random() * 8,
    duration: 1.2 + Math.random() * 0.8,
    delay: Math.random() * 0.5,
    rotate: Math.random() * 360,
    type: 'grain' as const,
  }));

const spawners = { sacrae: spawnSacrae, vitae: spawnVitaea, umbrae: spawnUmbrae, nerolae: spawnFlorae };

const ProductCard = ({ product, index = 0 }: Props) => {
  const collection = getCollection(product.collection);
  const bottleImg = getBottleImage(product.collection);
  const [particles, setParticles] = useState<Particle[]>([]);
  const fired = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (fired.current) return;
    fired.current = true;

    const el = cardRef.current;
    if (!el) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;

    const spawner = spawners[product.collection];
    setParticles(spawner(W, H));

    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setParticles([]);
      fired.current = false;
    }, 1800);
  }, [product.collection]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/produit/${product.id}`} className="group block">
        <div
          ref={cardRef}
          className="aspect-[3/4] rounded overflow-hidden relative mb-4 flex items-center justify-center transition-all duration-500 group-hover:scale-[1.03]"
          style={{ background: `linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 12%))` }}
          onMouseEnter={handleMouseEnter}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded"
            style={{ boxShadow: `0 0 40px ${collection?.colors.accent}44, 0 0 80px ${collection?.colors.accent}18` }}
          />

          {/* Bottle */}
          <img
            src={bottleImg}
            alt={product.name}
            className="relative z-10 h-[70%] w-auto object-contain drop-shadow-lg transition-transform duration-700 group-hover:-translate-y-3 group-hover:scale-105"
          />

          {/* Badge */}
          <div
            className="absolute bottom-3 left-3 px-2 py-1 rounded text-[10px] font-body uppercase tracking-wider z-10"
            style={{ backgroundColor: collection?.colors.accent + '22', color: collection?.colors.accent }}
          >
            {collection?.name}
          </div>

          {/* ── PARTICLES ── */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute pointer-events-none z-20"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.type === 'petal' ? p.size * 0.45 : p.size,
                  borderRadius: p.type === 'petal' ? '50% 0 50% 0' : '50%',
                  background: p.type === 'smoke'
                    ? `radial-gradient(circle, ${p.color}66 0%, transparent 70%)`
                    : p.color,
                  translateX: '-50%',
                  translateY: '-50%',
                  filter: p.type === 'spark'
                    ? 'blur(0.4px) brightness(1.5)'
                    : p.type === 'smoke'
                    ? 'blur(6px)'
                    : 'none',
                }}
                initial={{ opacity: p.type === 'smoke' ? 0.7 : 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                animate={{
                  opacity: 0,
                  x: p.tx,
                  y: p.ty,
                  scale: p.type === 'smoke' ? 3 : p.type === 'spark' ? 0.1 : 0.2,
                  rotate: p.rotate,
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: p.type === 'smoke' ? 'easeOut' : [0.2, 0.8, 0.4, 1],
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        <h3 className="font-display text-lg tracking-wide group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-1">{product.tagline}</p>
        <p className="font-body text-sm text-primary mt-2">À partir de 10€</p>
      </Link>
    </motion.div>
  );
};

export default ProductCard;