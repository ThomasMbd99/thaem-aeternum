import { useState } from 'react';
import { motion } from 'framer-motion';
import { products, getCollection } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Check, Gift } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

type CollectionId = 'sacrae' | 'vitae' | 'umbrae' | 'nerolae' | 'aera';

type CollectionTheme = {
  fallbackBg: string;
  hoverBg: string;
  baseText: string;
  baseSubText: string;
  hoverText: string;
  hoverSubText: string;
};

type PerfumeTheme = {
  selectedBg: string;
  hoverBg: string;
  borderColor: string;
  textColor: string;
  subTextColor: string;
  hoverTextColor?: string;
  hoverSubTextColor?: string;
};

const collectionThemes: Record<CollectionId, CollectionTheme> = {
  sacrae: {
    fallbackBg:
      'linear-gradient(150deg, #F5EFE0 0%, #EFE5CC 40%, #E8D8B8 70%, #F0E8D5 100%)',
    hoverBg:
      'linear-gradient(150deg, #F8F1E4 0%, #F1E7D0 45%, #E7D4B0 100%)',
    baseText: '#3D2B1F',
    baseSubText: 'rgba(61,43,31,0.72)',
    hoverText: '#3D2B1F',
    hoverSubText: 'rgba(61,43,31,0.72)',
  },
  vitae: {
    fallbackBg:
      'linear-gradient(160deg, #7A1500 0%, #C03000 25%, #E05500 55%, #CC7700 80%, #A08800 100%)',
    hoverBg:
      'linear-gradient(160deg, #8F1B00 0%, #CF420A 30%, #EA6D14 65%, #C79717 100%)',
    baseText: '#2F180C',
    baseSubText: 'rgba(47,24,12,0.72)',
    hoverText: '#2F180C',
    hoverSubText: 'rgba(47,24,12,0.72)',
  },
  umbrae: {
    fallbackBg:
      'radial-gradient(ellipse at 30% 60%, #3D1A00 0%, #1A0A00 45%, #0D0500 100%)',
    hoverBg:
      'radial-gradient(ellipse at 30% 60%, #542200 0%, #241006 45%, #100707 100%)',
    baseText: '#F2E4D2',
    baseSubText: 'rgba(242,228,210,0.72)',
    hoverText: '#F2E4D2',
    hoverSubText: 'rgba(242,228,210,0.72)',
  },
  nerolae: {
    fallbackBg:
      'linear-gradient(135deg, #FFF7FA 0%, #F7EDF7 35%, #EEF2F8 70%, #FAF8FF 100%)',
    hoverBg:
      'linear-gradient(135deg, #FFF8FB 0%, #F8EEF8 40%, #EFF3FA 100%)',
    baseText: '#5B4351',
    baseSubText: 'rgba(91,67,81,0.72)',
    hoverText: '#5B4351',
    hoverSubText: 'rgba(91,67,81,0.72)',
  },
};

const perfumeThemes: Record<string, PerfumeTheme> = {
  // SACRÆ
  dulsae: {
    selectedBg:
      'linear-gradient(145deg, #FFF6FB 0%, #FADBE8 35%, #F6C7D9 70%, #FDEEF5 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF8FC 0%, #FCE4EE 50%, #F8D4E3 100%)',
    borderColor: '#E8AFC8',
    textColor: '#5A3143',
    subTextColor: 'rgba(90,49,67,0.72)',
    hoverTextColor: '#5A3143',
    hoverSubTextColor: 'rgba(90,49,67,0.72)',
  },
  nerae: {
    selectedBg:
      'linear-gradient(145deg, #FFF7EC 0%, #F4E2C4 30%, #D8B07A 70%, #FFF1DE 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF8EF 0%, #EFDDBF 55%, #D7AE78 100%)',
    borderColor: '#C89B61',
    textColor: '#4A2F1C',
    subTextColor: 'rgba(74,47,28,0.72)',
    hoverTextColor: '#4A2F1C',
    hoverSubTextColor: 'rgba(74,47,28,0.72)',
  },
  lamae: {
    selectedBg:
      'linear-gradient(145deg, #FFF3E3 0%, #E8C28D 35%, #B97A3D 75%, #F4DEC2 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF1DD 0%, #E6C28D 55%, #B87839 100%)',
    borderColor: '#B97A3D',
    textColor: '#402615',
    subTextColor: 'rgba(64,38,21,0.72)',
    hoverTextColor: '#402615',
    hoverSubTextColor: 'rgba(64,38,21,0.72)',
  },
  varkaem: {
    selectedBg:
      'linear-gradient(145deg, #F8ECDD 0%, #D6B38A 35%, #8B5A3C 75%, #EEDBC8 100%)',
    hoverBg:
      'linear-gradient(145deg, #F7E9D8 0%, #D2AF89 55%, #8A593B 100%)',
    borderColor: '#9A6746',
    textColor: '#362015',
    subTextColor: 'rgba(54,32,21,0.72)',
    hoverTextColor: '#362015',
    hoverSubTextColor: 'rgba(54,32,21,0.72)',
  },
  zaemyr: {
    selectedBg:
      'linear-gradient(145deg, #FFF5EA 0%, #EFD8BE 35%, #C89B6E 75%, #F8EBDD 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF4E8 0%, #ECD5BB 55%, #C6986A 100%)',
    borderColor: '#C6986A',
    textColor: '#4B3120',
    subTextColor: 'rgba(75,49,32,0.72)',
    hoverTextColor: '#4B3120',
    hoverSubTextColor: 'rgba(75,49,32,0.72)',
  },
  almae: {
    selectedBg:
      'linear-gradient(145deg, #FFFDF8 0%, #F3E8D6 35%, #D9C0A1 75%, #FCF4E9 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFFDF9 0%, #F1E6D6 55%, #D6BFA0 100%)',
    borderColor: '#D1B089',
    textColor: '#433024',
    subTextColor: 'rgba(67,48,36,0.72)',
    hoverTextColor: '#433024',
    hoverSubTextColor: 'rgba(67,48,36,0.72)',
  },

  // VITÆA
  syrae: {
    selectedBg:
      'linear-gradient(145deg, #FFE5B8 0%, #FFB36B 30%, #FF7A59 65%, #FFD27D 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFE8BF 0%, #FFB86E 50%, #FF7D59 100%)',
    borderColor: '#FF9A4D',
    textColor: '#4A1F0F',
    subTextColor: 'rgba(74,31,15,0.72)',
    hoverTextColor: '#4A1F0F',
    hoverSubTextColor: 'rgba(74,31,15,0.72)',
  },
  mangaera: {
    selectedBg:
      'linear-gradient(145deg, #FFF1A8 0%, #FFC247 35%, #FF8F1F 75%, #FFE28A 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF2AF 0%, #FFC64B 55%, #FF9324 100%)',
    borderColor: '#FF9E2F',
    textColor: '#472108',
    subTextColor: 'rgba(71,33,8,0.72)',
    hoverTextColor: '#472108',
    hoverSubTextColor: 'rgba(71,33,8,0.72)',
  },
  rubrae: {
    selectedBg:
      'linear-gradient(145deg, #FFD6DC 0%, #FF8AA0 35%, #D7264E 75%, #FFC0CC 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFDDE2 0%, #FF95A8 55%, #D82D53 100%)',
    borderColor: '#D7264E',
    textColor: '#4A1020',
    subTextColor: 'rgba(74,16,32,0.72)',
    hoverTextColor: '#4A1020',
    hoverSubTextColor: 'rgba(74,16,32,0.72)',
  },

  // UMBRÆ
  aeonis: {
    selectedBg:
      'linear-gradient(145deg, #1A0B0D 0%, #4A1626 35%, #7A1F2B 70%, #130709 100%)',
    hoverBg:
      'linear-gradient(145deg, #231012 0%, #561C2C 50%, #842532 100%)',
    borderColor: '#9B2C3C',
    textColor: '#F4E6E1',
    subTextColor: 'rgba(244,230,225,0.72)',
    hoverTextColor: '#F4E6E1',
    hoverSubTextColor: 'rgba(244,230,225,0.72)',
  },
  aelia: {
    selectedBg:
      'linear-gradient(145deg, #1B1714 0%, #3B312B 35%, #6E5B4E 72%, #15110F 100%)',
    hoverBg:
      'linear-gradient(145deg, #221C18 0%, #473A33 50%, #776255 100%)',
    borderColor: '#8A7462',
    textColor: '#F2E7DB',
    subTextColor: 'rgba(242,231,219,0.72)',
    hoverTextColor: '#F2E7DB',
    hoverSubTextColor: 'rgba(242,231,219,0.72)',
  },
  maraeja: {
    selectedBg:
      'linear-gradient(145deg, #130B0B 0%, #342016 30%, #5B1F28 68%, #0E0708 100%)',
    hoverBg:
      'linear-gradient(145deg, #1A1010 0%, #3F261B 45%, #68252F 100%)',
    borderColor: '#7A3A34',
    textColor: '#F3E3D5',
    subTextColor: 'rgba(243,227,213,0.72)',
    hoverTextColor: '#F3E3D5',
    hoverSubTextColor: 'rgba(243,227,213,0.72)',
  },

  // FLORÆ
  lysae: {
    selectedBg:
      'linear-gradient(145deg, #F6FFF8 0%, #E3F3E8 35%, #CFE7D7 72%, #FBFFFC 100%)',
    hoverBg:
      'linear-gradient(145deg, #F8FFFA 0%, #E8F6EC 50%, #D7ECDD 100%)',
    borderColor: '#B7D8C0',
    textColor: '#3F5A49',
    subTextColor: 'rgba(63,90,73,0.72)',
    hoverTextColor: '#3F5A49',
    hoverSubTextColor: 'rgba(63,90,73,0.72)',
  },
  
  hibiscae: {
    selectedBg:
      'linear-gradient(145deg, #FFF4F7 0%, #F2D8E3 30%, #E7B8CB 70%, #FFF9FB 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF6F8 0%, #F4DDE7 50%, #EABFD0 100%)',
    borderColor: '#D8A8BE',
    textColor: '#5B3A49',
    subTextColor: 'rgba(91,58,73,0.72)',
    hoverTextColor: '#5B3A49',
    hoverSubTextColor: 'rgba(91,58,73,0.72)',
  },
  celestae: {
    selectedBg:
      'linear-gradient(145deg, #FAF7FF 0%, #E9E1F7 35%, #D8CCEF 72%, #FCFBFF 100%)',
    hoverBg:
      'linear-gradient(145deg, #FBF9FF 0%, #EEE7F9 50%, #E0D5F2 100%)',
    borderColor: '#C7B6E6',
    textColor: '#52456A',
    subTextColor: 'rgba(82,69,106,0.72)',
    hoverTextColor: '#52456A',
    hoverSubTextColor: 'rgba(82,69,106,0.72)',
  },
};

const DiscoveryBox = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const togglePerfume = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleAdd = () => {
    addItem({
      productId: 'coffret-aeternum',
      format: '10ml',
      price: 50,
      name: 'Coffret ÆTERNUM',
      isDiscoveryBox: true,
      selectedPerfumes: selected,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelected([]);
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 lg:pt-28 pb-28 relative">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(196,149,106,0.08) 0%, transparent 60%)',
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Gift
              className="w-8 h-8 mx-auto mb-6"
              style={{ color: 'hsl(43,50%,54%)' }}
            />
            <p
              className="font-body text-[10px] uppercase tracking-[0.4em] mb-4"
              style={{ color: 'rgba(196,149,106,0.6)' }}
            >
              Coffret Découverte
            </p>
            <h1 className="font-display text-4xl lg:text-6xl italic font-light mb-4">
              Coffret <span className="ae-highlight">Æ</span>TERNUM
            </h1>
            <p
              className="font-display italic text-base"
              style={{ color: 'hsl(var(--foreground) / 0.5)' }}
            >
              Choisissez 5 parfums parmi nos 15 créations · 5 × 10ml
            </p>
            <p
              className="font-display text-4xl mt-4"
              style={{ color: 'hsl(43,50%,54%)' }}
            >
              50€
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-px max-w-[80px] mx-auto mt-8 origin-center"
              style={{
                background:
                  'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)',
              }}
            />
          </motion.div>

          <div
            className="sticky top-16 lg:top-20 z-20 py-4 mb-12"
            style={{
              background: 'hsl(var(--background) / 0.95)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(196,149,106,0.15)',
            }}
          >
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const perfume = selected[i]
                    ? products.find(p => p.id === selected[i])
                    : null;
                  const col = perfume ? getCollection(perfume.collection) : null;
                  const perfumeTheme = perfume ? perfumeThemes[perfume.id] : null;
                  const collectionTheme = perfume
                    ? collectionThemes[perfume.collection as CollectionId]
                    : null;

                  return (
                    <div
                      key={i}
                      className="w-14 h-14 rounded flex items-center justify-center text-center transition-all duration-500"
                      style={
                        perfume && col
                          ? {
                              border: `1px solid ${
                                perfumeTheme?.borderColor || col.colors.accent
                              }`,
                              background:
                                perfumeTheme?.selectedBg ||
                                collectionTheme?.fallbackBg ||
                                `${col.colors.accent}20`,
                            }
                          : {
                              border: '1px solid rgba(196,149,106,0.2)',
                            }
                      }
                    >
                      {perfume ? (
                        <span
                          className="font-display text-[9px] leading-tight px-1"
                          style={{
                            color:
                              perfumeTheme?.textColor ||
                              collectionTheme?.baseText ||
                              col?.colors.text,
                          }}
                        >
                          {perfume.name}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: 'rgba(196,149,106,0.3)',
                            fontSize: '1.2rem',
                          }}
                        >
                          +
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <span
                  className="font-body text-sm"
                  style={{ color: 'rgba(196,149,106,0.6)' }}
                >
                  {selected.length}/5
                </span>

                <button
                  onClick={handleAdd}
                  disabled={selected.length !== 5 || added}
                  className="px-6 py-3 font-body text-xs uppercase tracking-[0.2em] rounded transition-all duration-300"
                  style={{
                    border:
                      selected.length === 5 && !added
                        ? '1px solid hsl(43,50%,54%)'
                        : '1px solid rgba(196,149,106,0.2)',
                    color:
                      selected.length === 5 && !added
                        ? 'hsl(43,50%,54%)'
                        : 'rgba(196,149,106,0.3)',
                    background: added ? 'rgba(74,163,84,0.1)' : 'transparent',
                    cursor: selected.length !== 5 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {added ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-4 h-4" /> Ajouté
                    </span>
                  ) : (
                    'Ajouter au panier'
                  )}
                </button>
              </div>
            </div>
          </div>

          {(['sacrae', 'vitae', 'umbrae', 'nerolae', 'aera'] as const).map((colId, ci) => {
            const col = getCollection(colId)!;
            const colProducts = products.filter(p => p.collection === colId);
            const collectionTheme = collectionThemes[colId];

            return (
              <motion.div
                key={colId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1, duration: 0.7 }}
                className="mb-16"
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2
                    className="font-display text-2xl lg:text-3xl italic font-light"
                    dangerouslySetInnerHTML={{ __html: col.displayName }}
                  />
                  <div
                    className="h-px flex-1"
                    style={{
                      background: `linear-gradient(to right, ${col.colors.accent}40, transparent)`,
                    }}
                  />
                  <span
                    className="font-body text-[10px] uppercase tracking-widest"
                    style={{ color: col.colors.accent }}
                  >
                    {col.mood}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {colProducts.map((p, i) => {
                    const isSelected = selected.includes(p.id);
                    const isHovered = hoveredId === p.id;
                    const canSelect = selected.length < 5 || isSelected;
                    const perfumeTheme = perfumeThemes[p.id];

                    const bg = isSelected
                      ? perfumeTheme?.selectedBg || collectionTheme.fallbackBg
                      : isHovered
                      ? perfumeTheme?.hoverBg || collectionTheme.hoverBg
                      : 'hsl(0 0% 7%)';

                    const borderColor = isSelected || isHovered
                      ? perfumeTheme?.borderColor || col.colors.accent
                      : 'rgba(255,255,255,0.06)';

                    const textColor = isSelected
                      ? perfumeTheme?.textColor || collectionTheme.baseText
                      : isHovered
                      ? perfumeTheme?.hoverTextColor || collectionTheme.hoverText
                      : 'hsl(var(--foreground))';

                    const subTextColor = isSelected
                      ? perfumeTheme?.subTextColor || collectionTheme.baseSubText
                      : isHovered
                      ? perfumeTheme?.hoverSubTextColor || collectionTheme.hoverSubText
                      : 'rgba(255,255,255,0.35)';

                    return (
                      <motion.button
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => canSelect && togglePerfume(p.id)}
                        onMouseEnter={() => canSelect && setHoveredId(p.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="relative text-center overflow-hidden rounded transition-all duration-500 group"
                        style={{
                          minHeight: '120px',
                          padding: '1.25rem 1rem',
                          border: `1px solid ${borderColor}`,
                          background: bg,
                          cursor: canSelect ? 'pointer' : 'not-allowed',
                          opacity: !canSelect ? 0.35 : 1,
                          boxShadow:
                            isSelected || isHovered
                              ? `0 0 0 1px ${borderColor}20 inset`
                              : 'none',
                        }}
                      >
                        {isSelected && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: perfumeTheme?.borderColor || col.colors.accent }}
                          >
                            <Check
                              className="w-3 h-3"
                              style={{
                                color: colId === 'umbrae' ? '#140A08' : '#000',
                              }}
                            />
                          </div>
                        )}

                        <span
                          className="relative z-10 font-display text-base block mb-1 transition-colors duration-500"
                          style={{ color: textColor }}
                        >
                          {p.name}
                        </span>

                        <span
                          className="relative z-10 font-body text-[10px] leading-relaxed block transition-colors duration-500"
                          style={{ color: subTextColor }}
                        >
                          {p.tagline}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default DiscoveryBox;