import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Collection } from '@/data/products';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string; life: number;
  maxLife: number; rotation: number;
  rotSpeed: number; shape: string;
}

const collectionParticles: Record<Collection, { colors: string[]; shapes: string[]; label: string }> = {
  sacrae: {
    colors: ['#F5F0E1', '#C4956A', '#C9A870', '#E8D5B7', '#D4A574', '#FFE4C4'],
    shapes: ['circle', 'star', 'swirl'],
    label: 'Sucre · Caramel · Vanille',
  },
  vitae: {
    colors: ['#FF6B2B', '#FF4500', '#FFB347', '#FFE566', '#FF8C00', '#FF6F61'],
    shapes: ['circle', 'drop', 'burst'],
    label: 'Fruits · Énergie · Vie',
  },
  umbrae: {
    colors: ['#6B0000', '#8B6914', '#4A0E0E', '#FF4500', '#B8860B', '#2C0000'],
    shapes: ['smoke', 'ember', 'flame'],
    label: 'Oud · Ambre · Mystère',
  },
  aera: {
    colors: ['#A8D4F0', '#D6EEFF', '#FFFFFF', '#C0E4FF', '#E8F4FF', '#B8E0FF'],
    shapes: ['circle', 'drop', 'petal'],
    label: 'Pureté · Clarté · Légèreté',
  },
  nerolae: {
    colors: ['#F4C2C2', '#D4A8D4', '#B2DFDB', '#FFB6C1', '#E6E6FA', '#FFF0F5'],
    shapes: ['petal', 'circle', 'leaf'],
    label: 'Fleurs · Pétales · Lumière',
  },
};

interface Props {
  targetCollection: Collection | null;
  onComplete: () => void;
}

const CollectionTransition = ({ targetCollection, onComplete }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [active, setActive] = useState(false);

  const runExplosion = useCallback((collection: Collection) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;
    const config = collectionParticles[collection];
    const cx = W / 2;
    const cy = H / 2;

    const particles: Particle[] = [];
    const count = 180;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 12;
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 18,
        opacity: 0.7 + Math.random() * 0.3,
        color,
        life: 0,
        maxLife: 40 + Math.random() * 60,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        shape,
      });
    }

    // Shockwave
    let shockRadius = 0;
    let shockOpacity = 0.6;
    let frame = 0;
    const maxFrames = 120;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Shockwave
      if (shockRadius < Math.max(W, H)) {
        shockRadius += 25;
        shockOpacity *= 0.96;
        const grad = ctx.createRadialGradient(cx, cy, shockRadius * 0.7, cx, cy, shockRadius);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.7, `rgba(${hexToRgb(config.colors[0])},${shockOpacity * 0.15})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, shockRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particles
      let alive = 0;
      for (const p of particles) {
        p.life++;
        if (p.life > p.maxLife) continue;
        alive++;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy += 0.08; // gravity
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (progress < 0.1 ? progress * 10 : progress > 0.6 ? (1 - progress) / 0.4 : 1);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;

        if (p.shape === 'petal') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'smoke' || p.shape === 'flame') {
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          g.addColorStop(0, p.color);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          ctx.fillStyle = p.color;
          drawStar(ctx, 0, 0, 5, p.size, p.size * 0.4);
        } else if (p.shape === 'drop') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ember') {
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 0.8);
          g.addColorStop(0, '#FF4500');
          g.addColorStop(0.5, p.color);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          // Glow
          const dg = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.5);
          dg.addColorStop(0, `${p.color}88`);
          dg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = dg;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive > 0 && frame < maxFrames) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, W, H);
        onComplete();
        setActive(false);
      }
    };

    setActive(true);
    animRef.current = requestAnimationFrame(animate);
  }, [onComplete]);

  useEffect(() => {
    if (targetCollection) {
      runExplosion(targetCollection);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [targetCollection, runExplosion]);

  if (!active && !targetCollection) return null;

  const config = targetCollection ? collectionParticles[targetCollection] : null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[100] pointer-events-none"
      />
      <AnimatePresence>
        {active && config && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[101] pointer-events-none flex items-center justify-center"
          >
            <motion.p
              className="font-display text-2xl sm:text-4xl italic tracking-wider text-center"
              style={{ color: config.colors[0] }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {config.label}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, points: number, outer: number, inner: number) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / points - Math.PI / 2;
    if (i === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    else ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
  }
  ctx.closePath();
  ctx.fill();
}

export default CollectionTransition;
