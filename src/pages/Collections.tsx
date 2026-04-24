import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { collections, type Collection } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';
import PageTransition from '@/components/PageTransition';

const Collections = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const handleCollectionClick = useCallback((colId: Collection) => {
    setTheme(colId);
    setTimeout(() => navigate(`/collection/${colId}`), 1600);
  }, []);

  const themeBgs: Record<string, string> = {
    sacrae: 'linear-gradient(150deg, #F5EFE0 0%, #EFE5CC 40%, #E8D8B8 70%, #F0E8D5 100%)',
    vitae: 'linear-gradient(160deg, #7a1500 0%, #c03000 25%, #e05500 55%, #cc7700 80%, #a08800 100%)',
    umbrae: 'radial-gradient(ellipse at 30% 60%, #3D1A00 0%, #1A0A00 45%, #0D0500 100%)',
    nerolae: 'linear-gradient(135deg, #FFF0F5 0%, #FFD6E7 40%, #FFCCE0 70%, #FFF0F5 100%)',
    aera:    'linear-gradient(135deg, #F5FAFF 0%, #D6EEFF 40%, #C0E4FF 70%, #F0F8FF 100%)',
  };

  const lightThemes = ['sacrae', 'nerolae', 'aera'];

  const formats = [
    { size: '10ml', label: 'Flacon Voyage', price: '10€', desc: "La découverte. Un format nomade pour apprivoiser une fragrance avant de l'adopter.", featured: false },
    { size: '50ml', label: 'Flacon Signature', price: '45€', desc: "L'objet. Verre lourd, finitions dorées, conçu pour durer et s'exposer.", featured: true },
    { size: '10×5ml', label: 'Coffret Découverte', price: '50€', desc: "L'exploration. Dix flacons voyage pour traverser nos univers sans choisir.", featured: false },
    { size: '50ml', label: 'Recharge Éco', price: '35€', desc: "La conscience. Rechargez votre flacon signature, réduisez l'empreinte.", featured: false },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 lg:pt-28 pb-28">

        {/* ── HEADER ── */}
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl mb-20">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2 }}
            className="h-px mb-14 origin-left"
            style={{ background: 'linear-gradient(to right, hsl(43,50%,54%), transparent)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <p className="font-body text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(196,149,106,0.6)' }}>
              Nos Univers
            </p>
            <h1 className="font-display text-4xl lg:text-6xl italic font-light">
              Nos <span style={{ color: 'hsl(43,50%,54%)' }}>Gammes</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="font-display italic text-base lg:text-lg leading-relaxed text-center"
            style={{ color: 'hsl(var(--foreground) / 0.6)' }}
          >
            Nos gammes THÆM ÆTERNUM ne composent pas des parfums au hasard. La maison a été pensée autour de cinq gammes, cinq univers olfactifs aux intensités et aux signatures bien distinctes. Le fruit, la fleur, la gourmandise, l&apos;ombre et la pureté y prennent chacun une forme singulière, avec leur propre profondeur, leur propre sillage, leur propre pouvoir.{' '}
            <span style={{ color: 'hsl(43,50%,54%)' }}>Choisir une gamme, c&apos;est déjà choisir une présence.</span>
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="h-px mt-14 origin-right"
            style={{ background: 'linear-gradient(to left, hsl(43,50%,54%), transparent)' }}
          />
        </div>

        {/* ── GRILLE GAMMES ── */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {collections.map((col, i) => {
              const isLight = lightThemes.includes(col.id);
              const textColor = isLight ? col.colors.text : 'hsl(var(--foreground))';

              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.7 }}
                  className="group"
                >
                  <button onClick={() => handleCollectionClick(col.id)} className="w-full block text-left">
                    <div
                      className="relative p-8 min-h-[340px] flex flex-col items-center justify-center text-center overflow-hidden rounded transition-all duration-700"
                      style={{ background: 'hsl(0 0% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded"
                        style={{ background: themeBgs[col.id] }}
                      />
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <h2
                          className="font-display text-4xl lg:text-5xl italic font-light transition-colors duration-500"
                          dangerouslySetInnerHTML={{ __html: col.displayName }}
                          style={{ color: textColor }}
                        />
                        <div className="font-body text-[10px] tracking-[0.25em] uppercase" style={{ color: col.colors.accent }}>
                          {col.mood.split(', ').map((m, i) => <p key={i}>{m}</p>)}
                        </div>
                        <div className="h-px w-10 my-1" style={{ backgroundColor: col.colors.accent, opacity: 0.3 }} />
                        <p className="font-body text-xs leading-relaxed opacity-50 group-hover:opacity-80 transition-opacity duration-500" style={{ color: textColor }}>
                          {col.description}
                        </p>
                        <span
                          className="mt-6 font-body text-[10px] uppercase tracking-[0.3em] transition-all duration-500 group-hover:tracking-[0.5em]"
                          style={{ color: col.colors.accent }}
                        >
                          Explorer →
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── FORMATS ── */}
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl mt-28">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="h-px mb-14 origin-left"
            style={{ background: 'linear-gradient(to right, hsl(43,50%,54%), transparent)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="font-body text-[10px] uppercase tracking-[0.4em] mb-4 text-center" style={{ color: 'rgba(196,149,106,0.6)' }}>
              Nos Formats
            </p>
            <h2 className="font-display text-4xl lg:text-5xl italic font-light mb-8 text-center">
              L&apos;objet <span style={{ color: 'hsl(43,50%,54%)' }}>avant</span> le parfum.
            </h2>
            <p className="font-display italic text-base lg:text-lg leading-relaxed text-center" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
              Chez THÆM ÆTERNUM, le flacon n&apos;est pas un contenant. C&apos;est une déclaration. Chaque format a été pensé pour s&apos;adapter à un rapport différent au parfum : la découverte, la fidélité, la conscience.{' '}
              <span style={{ color: 'hsl(43,50%,54%)' }}>Porter une fragrance, c&apos;est aussi choisir comment elle vit avec vous.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="h-px mt-14 mb-14 origin-right"
            style={{ background: 'linear-gradient(to left, hsl(43,50%,54%), transparent)' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {formats.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 flex flex-col items-center text-center rounded overflow-hidden group transition-all duration-500"
                style={{
                  border: f.featured ? '1px solid hsl(43,50%,54%)' : '1px solid rgba(255,255,255,0.06)',
                  background: f.featured ? 'rgba(196,149,106,0.06)' : 'hsl(0 0% 7%)',
                  minHeight: '260px',
                }}
              >
                {f.featured && (
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'hsl(43,50%,54%)' }} />
                )}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(196,149,106,0.08) 0%, transparent 70%)' }}
                />
                <div className="relative z-10 flex flex-col items-center justify-between h-full gap-4">
                  <div>
                    <p className="font-display text-4xl mb-2" style={{ color: 'hsl(43,50%,54%)' }}>{f.size}</p>
                    <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-1">{f.label}</p>
                    <p className="font-display text-2xl" style={{ color: 'hsl(43,50%,54%)' }}>{f.price}</p>
                  </div>
                  <p className="font-body text-xs text-foreground/40 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Collections;