import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { getCollection, formats, getCollectionProducts, type FormatId } from '@/data/products';
import { useParfums } from '@/hooks/useParfums';
import { getBottleImage } from '@/data/bottleImages';
import OlfactoryPyramid from '@/components/OlfactoryPyramid';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Recycle, Check, Minus, Plus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import NotFound from './NotFound';



const UpsellCarousel = ({ products, acc, rgb }: { products: any[], acc: string, rgb: string }) => {
  const [active, setActive] = useState(0);
  const total = products.length;

  return (
    <div className="relative py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(${rgb}, 0.06) 0%, transparent 70%)` }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center gap-4 justify-center mb-4">
            <div className="h-px w-16" style={{ background: `rgba(${rgb}, 0.4)` }} />
            <span className="font-body text-[10px] uppercase tracking-[0.4em]" style={{ color: `rgba(${rgb}, 0.6)` }}>
              De la même collection
            </span>
            <div className="h-px w-16" style={{ background: `rgba(${rgb}, 0.4)` }} />
          </div>
          <h2 className="font-display text-2xl lg:text-3xl italic">Vous aimerez aussi</h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-sm mx-auto lg:max-w-2xl">

          {/* Cards */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${active * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              {products.map((p, i) => {
                const col = p.collection;
                return (
                  <div key={p.id} className="w-full flex-shrink-0 px-4">
                    <Link to={`/produit/${p.id}`} className="group block">
                      <div
                        className="aspect-[3/4] rounded-lg flex items-center justify-center relative overflow-hidden mb-5 transition-all duration-500"
                        style={{
                          background: `linear-gradient(145deg, hsl(0 0% 7%), hsl(0 0% 11%))`,
                          boxShadow: `0 0 40px rgba(${rgb}, 0.10)`,
                        }}
                      >
                        {/* Glow hover */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ boxShadow: `0 0 50px rgba(${rgb}, 0.2) inset` }}
                        />
                        <img
                          src={getBottleImage(col)}
                          alt={p.name}
                          className="h-[65%] w-auto object-contain drop-shadow-xl transition-transform duration-700 group-hover:-translate-y-3 group-hover:scale-105 relative z-10"
                        />
                        {/* Ligne accent bas */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: `linear-gradient(to right, transparent, ${acc}, transparent)` }}
                        />
                      </div>
                      <h3 className="font-display text-2xl tracking-wider mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                      <p className="font-body text-xs text-foreground/45 line-clamp-1 italic">{p.tagline}</p>
                      <p className="font-body text-sm mt-2" style={{ color: acc }}>À partir de 10€</p>
                    </Link>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Navigation */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-6 mt-10">
              <button
                onClick={() => setActive(Math.max(0, active - 1))}
                disabled={active === 0}
                className="w-10 h-10 rounded flex items-center justify-center transition-all duration-300 disabled:opacity-20"
                style={{ border: `1px solid rgba(${rgb}, 0.3)`, color: acc }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="transition-all duration-300"
                    style={{
                      width: active === i ? '24px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: active === i ? acc : `rgba(${rgb}, 0.25)`,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setActive(Math.min(total - 1, active + 1))}
                disabled={active === total - 1}
                className="w-10 h-10 rounded flex items-center justify-center transition-all duration-300 disabled:opacity-20"
                style={{ border: `1px solid rgba(${rgb}, 0.3)`, color: acc }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getById, getByCollection, loading } = useParfums();
  const product = id ? getById(id) : undefined;
  const collection = product ? getCollection(product.collection) : undefined;
  const [selectedFormat, setSelectedFormat] = useState<FormatId>('50ml');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display italic text-foreground/40 text-xl">Chargement...</p>
    </div>
  );

  if (!product || !collection) return <NotFound />;

  const currentFormat = formats.find(f => f.id === selectedFormat)!;
  const relatedProducts = getByCollection(product.collection).filter(p => p.id !== product.id).slice(0, 3);

  const acc = collection.colors.accent;
  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}` : '196,149,106';
  };
  const rgb = hexToRgb(acc);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ productId: product.id, format: selectedFormat, price: currentFormat.price, name: product.name });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative">

      {/* Dégradé global page */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse 120% 55% at 50% 0%, rgba(${rgb}, 0.10) 0%, rgba(${rgb}, 0.03) 50%, transparent 75%)`,
          transition: 'background 1s ease',
        }}
      />

      {/* ── HERO PRODUIT ── */}
      <div ref={heroRef} className="relative min-h-screen pt-20 flex items-center">

        {/* Glow fort hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 80% at 30% 50%, rgba(${rgb}, 0.20) 0%, transparent 65%)`,
          }}
        />

        <div className="container mx-auto px-4 lg:px-16 relative z-10">

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              to={`/collection/${collection.id}`}
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest transition-colors"
              style={{ color: `rgba(${rgb}, 0.6)` }}
            >
              <ArrowLeft className="w-3 h-3" />
              {collection.name}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* ── IMAGE ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Cadre image */}
              <div
                className="aspect-[3/4] rounded-lg relative overflow-hidden flex items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, hsl(0 0% 7%), hsl(0 0% 10%))`,
                  boxShadow: `0 0 80px rgba(${rgb}, 0.12), 0 40px 80px rgba(0,0,0,0.4)`,
                }}
              >
                {/* Glow interne */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 35%, rgba(${rgb}, 0.14) 0%, transparent 65%)`,
                  }}
                />

                {/* Grille fine */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(${rgb},1) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Flacon */}
                <motion.img
                  style={{ y: imgY }}
                  src={getBottleImage(product.collection)}
                  alt={product.name}
                  className="relative z-10 h-[65%] w-auto object-contain drop-shadow-2xl"
                />

                {/* Nom en filigrane */}
                <div className="absolute bottom-0 left-0 right-0 text-center pb-6">
                  <span
                    className="font-display text-3xl tracking-widest"
                    style={{ color: `rgba(${rgb}, 0.12)` }}
                  >
                    {product.name}
                  </span>
                </div>

                {/* Badge collection */}
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 rounded font-body text-[10px] uppercase tracking-widest z-10"
                  style={{ backgroundColor: `rgba(${rgb}, 0.12)`, color: acc, border: `1px solid rgba(${rgb}, 0.2)` }}
                >
                  {collection.name}
                </div>
              </div>
            </motion.div>

            {/* ── DÉTAILS ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {/* Nom + tagline */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="font-display text-5xl lg:text-6xl tracking-wider mb-3"
                >
                  {product.name}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="font-display italic text-lg text-foreground/55"
                >
                  {product.tagline}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-3 mt-3"
                >
                  {product.type === 'creation' ? (
                    <span
                      className="font-body text-[10px] uppercase tracking-[0.3em] px-3 py-1.5 rounded"
                      style={{
                        background: `rgba(${rgb}, 0.1)`,
                        border: `1px solid rgba(${rgb}, 0.3)`,
                        color: acc,
                      }}
                    >
                      Création THÆM
                    </span>
                  ) : (
                    <>
                      <span
                        className="font-body text-[10px] uppercase tracking-[0.3em] px-3 py-1.5 rounded"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.45)',
                        }}
                      >
                        Inspiration
                      </span>
                      {product.inspiration && (
                        <span className="font-body text-xs text-foreground/35 tracking-wider italic">
                          {product.inspiration}
                        </span>
                      )}
                    </>
                  )}
                </motion.div>

                {/* Ligne accent */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.9 }}
                  className="h-px max-w-[80px] mt-6 origin-left"
                  style={{ backgroundColor: acc }}
                />
              </div>

              {/* Format */}
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: `rgba(${rgb}, 0.6)` }}>
                  Format
                </p>
                <div className="flex flex-wrap gap-3">
                  {formats.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFormat(f.id)}
                      className="px-5 py-3 rounded font-body text-sm transition-all duration-300"
                      style={{
                        border: `1px solid ${selectedFormat === f.id ? acc : `rgba(${rgb}, 0.2)`}`,
                        background: selectedFormat === f.id ? `rgba(${rgb}, 0.1)` : 'transparent',
                        color: selectedFormat === f.id ? acc : 'hsl(var(--muted-foreground))',
                      }}
                    >
                      <span className="block">{f.label}</span>
                      <span className="block text-xs mt-0.5 opacity-70">{f.price}€</span>
                      {'eco' in f && (f as any).eco && (
                        <span className="inline-flex items-center gap-1 text-[10px] mt-1" style={{ color: acc }}>
                          <Recycle className="w-3 h-3" /> Éco
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantité */}
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: `rgba(${rgb}, 0.6)` }}>
                  Quantité
                </p>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded flex items-center justify-center transition-all duration-300"
                    style={{ border: `1px solid rgba(${rgb}, 0.25)` }}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-display text-xl w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded flex items-center justify-center transition-all duration-300"
                    style={{ border: `1px solid rgba(${rgb}, 0.25)` }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Prix + CTA */}
              <div className="flex items-center gap-6 pt-2">
                <span className="font-display text-4xl" style={{ color: acc }}>
                  {currentFormat.price * quantity}€
                </span>
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className="flex-1 py-4 font-body text-xs uppercase tracking-[0.3em] rounded transition-all duration-400"
                  style={{
                    background: added ? 'rgba(74,163,84,0.2)' : `rgba(${rgb}, 0.15)`,
                    border: `1px solid ${added ? 'rgba(74,163,84,0.5)' : acc}`,
                    color: added ? 'rgb(134,213,144)' : acc,
                  }}
                >
                  {added ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Ajouté
                    </span>
                  ) : (
                    'Ajouter au panier'
                  )}
                </button>
              </div>

              {/* Pyramide olfactive */}
              <OlfactoryPyramid notes={product.notes} accentColor={acc} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── HISTOIRE PRODUIT ── */}
      {product.texte_long && (
        <div className="container mx-auto px-4 lg:px-16 relative z-10 max-w-4xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-4"
          >
            <h3 className="font-display text-xl tracking-wider mb-6 text-foreground">L'Histoire</h3>
            <div
              className="border-l-2 pl-6 lg:pl-8 py-4 rounded-r-sm space-y-4"
              style={{ borderColor: acc, background: 'rgba(255,255,255,0.03)' }}
            >
              {product.texte_long.split('\n\n').map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="font-display text-sm lg:text-base italic leading-relaxed text-foreground/80"
                >
                  {p}
                </motion.p>
              ))}
            </div>
            {product.phrase_signature && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-display italic text-center text-foreground/40 text-sm mt-8 tracking-widest"
                style={{ color: `rgba(${rgb}, 0.5)` }}
              >
                {product.phrase_signature}
              </motion.p>
            )}
          </motion.div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <UpsellCarousel products={relatedProducts} acc={acc} rgb={rgb} />
      )}
    </div>
  );
};

export default ProductPage;