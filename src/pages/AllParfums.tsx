import { useState } from 'react';
import { motion } from 'framer-motion';
import { products, collections } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import PageTransition from '@/components/PageTransition';

const AllParfums = () => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? products : products.filter(p => p.collection === filter);

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(196,149,106,0.6)' }}>
              La collection complète
            </p>
            <h1 className="font-display text-4xl lg:text-6xl italic font-light mb-4">
              Tous les <span style={{ color: 'hsl(43,50%,54%)' }}>parfums</span>
            </h1>
            <div className="h-px max-w-[80px] mx-auto mt-8" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />
          </motion.div>

          {/* Filtres */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            <button
              onClick={() => setFilter('all')}
              className="px-5 py-2 font-body text-[10px] uppercase tracking-[0.3em] rounded transition-all duration-300"
              style={{
                border: '1px solid',
                borderColor: filter === 'all' ? 'hsl(43,50%,54%)' : 'rgba(255,255,255,0.12)',
                color: filter === 'all' ? 'hsl(43,50%,54%)' : 'rgba(255,255,255,0.4)',
                background: filter === 'all' ? 'rgba(196,149,106,0.08)' : 'transparent',
              }}
            >
              Tous ({products.length})
            </button>
            {collections.map(col => {
              const count = products.filter(p => p.collection === col.id).length;
              const active = filter === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setFilter(col.id)}
                  className="px-5 py-2 font-body text-[10px] uppercase tracking-[0.3em] rounded transition-all duration-300"
                  style={{
                    border: '1px solid',
                    borderColor: active ? col.colors.accent : 'rgba(255,255,255,0.12)',
                    color: active ? col.colors.accent : 'rgba(255,255,255,0.4)',
                    background: active ? col.colors.accent + '14' : 'transparent',
                  }}
                >
                  {col.name} ({count})
                </button>
              );
            })}
          </motion.div>

          {/* Grille */}
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>

          {/* Compteur */}
          <p className="text-center font-body text-xs mt-12" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {filtered.length} parfum{filtered.length > 1 ? 's' : ''}
          </p>

        </div>
      </div>
    </PageTransition>
  );
};

export default AllParfums;
