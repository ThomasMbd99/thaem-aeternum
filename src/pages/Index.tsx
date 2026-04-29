import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collections, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Recycle, Gift } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScrollVideoHero from '@/components/ScrollVideoHero';

const bestSellers = [products[0], products[3], products[6], products[9], products[12]];

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">

        {/* ── SCROLL VIDEO HERO ── */}
        <ScrollVideoHero />

        {/* ── MANIFESTE ── */}
        <section className="relative py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[30vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.03)' }}>Æ</span>
          </div>
          <div className="container mx-auto px-6 lg:px-16 relative z-10 max-w-2xl text-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="h-px mb-16 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-display italic text-xl lg:text-3xl leading-relaxed"
              style={{ color: 'hsl(var(--foreground) / 0.75)' }}
            >
              "Chaque parfum est une empreinte.<br />
              <span style={{ color: 'hsl(43,50%,54%)' }}>Chaque sillage, une présence.</span>"
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="h-px mt-16 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />
          </div>
        </section>

        {/* ── 4 COLLECTIONS ── */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(196,149,106,0.6)' }}>
                Nos Univers
              </p>
              <h2 className="font-display text-3xl lg:text-5xl italic font-light">
                Cinq gammes.<br />
                <span className="text-foreground/40">Une maison.</span>
              </h2>
            </motion.div>

            {(() => {
              const themeBgs: Record<string, string> = {
                sacrae: 'linear-gradient(150deg, #F5EFE0 0%, #EFE5CC 40%, #E8D8B8 70%, #F0E8D5 100%)',
                vitae: 'linear-gradient(160deg, #7a1500 0%, #c03000 25%, #e05500 55%, #cc7700 80%, #a08800 100%)',
                umbrae: 'radial-gradient(ellipse at 30% 60%, #3D1A00 0%, #1A0A00 45%, #0D0500 100%)',
                nerolae: 'linear-gradient(135deg, #FFF0F5 0%, #FFD6E7 40%, #FFCCE0 70%, #FFF0F5 100%)',
                aera:    'linear-gradient(135deg, #F5FAFF 0%, #D6EEFF 40%, #C0E4FF 70%, #F0F8FF 100%)',
              };
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {collections.map((col, i) => (
                    <motion.div
                      key={col.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <Link to={`/collection/${col.id}`} className="block h-full">
                        <div
                          className="relative p-8 min-h-[320px] flex flex-col items-center justify-center text-center overflow-hidden rounded transition-all duration-700"
                          style={{ background: 'hsl(0 0% 7%)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded"
                            style={{ background: themeBgs[col.id] }}
                          />
                          {(() => {
                            const lightThemes = ['sacrae', 'nerolae', 'aera'];
                            const isLight = lightThemes.includes(col.id);
                            const textColor = isLight ? col.colors.text : 'hsl(var(--foreground))';
                            return (
                              <div className="relative z-10 flex flex-col items-center">
                                <h3
                                  className="font-display text-3xl lg:text-4xl italic font-light mb-3 transition-colors duration-500"
                                  dangerouslySetInnerHTML={{ __html: col.displayName }}
                                  style={{ color: textColor }}
                                />
                                <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-4 transition-colors duration-500" style={{ color: col.colors.accent }}>
                                  {col.mood.split(', ').map((m: string, i: number) => <p key={i}>{m}</p>)}
                                </p>
                                <p className="font-body text-xs leading-relaxed opacity-50 group-hover:opacity-90 transition-opacity duration-500" style={{ color: textColor }}>
                                  {col.description}
                                </p>
                                <span
                                  className="mt-8 font-body text-[10px] uppercase tracking-[0.3em] transition-all duration-500 group-hover:tracking-[0.5em]"
                                  style={{ color: col.colors.accent }}
                                >
                                  Explorer →
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── BEST SELLERS ── */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center gap-4 justify-center mb-4">
                <div className="h-px w-16" style={{ background: 'rgba(196,149,106,0.3)' }} />
                <p className="font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(196,149,106,0.6)' }}>
                  Sélection
                </p>
                <div className="h-px w-16" style={{ background: 'rgba(196,149,106,0.3)' }} />
              </div>
              <h2 className="font-display text-3xl lg:text-5xl italic font-light">
                Les signatures<br />
                <span className="text-foreground/40">de la maison.</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── EXTRAIT DE PARFUM ── */}
        <section className="relative py-28 lg:py-36 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[25vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.03)' }}>Æ</span>
          </div>

          <div className="container mx-auto px-6 lg:px-16 max-w-2xl relative z-10 text-center">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="h-px mb-16 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-body text-[10px] uppercase tracking-[0.5em] mb-6"
              style={{ color: 'rgba(196,149,106,0.6)' }}
            >
              Notre engagement
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.9 }}
              className="font-display text-3xl lg:text-5xl italic font-light mb-8"
            >
              Extrait de <span style={{ color: 'hsl(43,50%,54%)' }}>Parfum</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="font-display italic text-base lg:text-lg leading-relaxed mb-6"
              style={{ color: 'hsl(var(--foreground) / 0.55)' }}
            >
              La concentration la plus haute. La signature la plus longue.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="font-body text-sm leading-relaxed mb-10"
              style={{ color: 'hsl(var(--foreground) / 0.4)' }}
            >
              Toutes nos créations sont formulées en extrait de parfum pur. Pas d&apos;eau de toilette, pas de compromis. Chaque fragrance THÆM ÆTERNUM tient sur la peau et laisse un sillage que l&apos;on remarque sans chercher à l&apos;imposer.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="font-display italic text-base"
              style={{ color: 'hsl(43,50%,54%)' }}
            >
              C&apos;est notre seul format de création. Par choix.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="h-px mt-16 origin-center"
              style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }}
            />
          </div>
        </section>

        {/* ── COFFRET ── */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[25vw] font-bold leading-none" style={{ color: 'rgba(196,149,106,0.025)' }}>Æ</span>
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto text-center"
            >
              <Gift className="w-8 h-8 mx-auto mb-8" style={{ color: 'hsl(43,50%,54%)' }} />
              <h2 className="font-display text-3xl lg:text-5xl mb-4 italic font-light">
                Coffret <span style={{ color: 'hsl(43,60%,65%)' }}>Æ</span>TERNUM
              </h2>
              <p className="font-body text-sm text-foreground/50 mb-2">5 parfums au choix · 5 × 10ml</p>
              <p className="font-display text-4xl mt-6 mb-8" style={{ color: 'hsl(43,50%,54%)' }}>50€</p>
              <Link
                to="/coffret"
                className="inline-block px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300"
                style={{ border: '1px solid hsl(43,50%,54%)', color: 'hsl(43,50%,54%)' }}
              >
                Composer mon coffret
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── QUIZ CTA ── */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="flex items-center gap-4 justify-center mb-8">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(196,149,106,0.4))' }} />
                <span className="font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(196,149,106,0.6)' }}>
                  Quiz Olfactif
                </span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(196,149,106,0.4))' }} />
              </div>
              <h2 className="font-display text-3xl lg:text-5xl italic font-light mb-4">
                Quelle est<br />
                <span style={{ color: 'hsl(43,50%,54%)' }}>votre signature ?</span>
              </h2>
              <p className="font-body text-sm text-foreground/45 mb-10">5 questions. Votre fragrance idéale révélée.</p>
              <Link
                to="/quiz"
                className="inline-block px-10 py-4 font-body text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
                style={{ border: '1px solid rgba(196,149,106,0.4)', color: 'hsl(43,50%,54%)' }}
              >
                Commencer le Quiz
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── ECO ── */}
        <section className="py-20 lg:py-28 border-t" style={{ borderColor: 'rgba(196,149,106,0.1)' }}>
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto text-center"
            >
              <Recycle className="w-8 h-8 mx-auto mb-8" style={{ color: 'hsl(43,50%,54%)' }} />
              <h2 className="font-display text-3xl lg:text-4xl italic font-light mb-6">Rechargez votre flacon</h2>
              <p className="font-body text-sm text-foreground/45 leading-relaxed">
                Nos recharges 50ml à 35€ vous permettent de réutiliser votre flacon signature. Le luxe et la responsabilité vont de pair.
              </p>
            </motion.div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Index;
