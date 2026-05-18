import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const sections = [
  {
    title: 'La Maison',
    text: "THÆM ÆTERNUM est née de trois frères, d'une même vision, et d'une même exigence. Celle de créer des parfums qui ne se contentent pas d'exister, mais qui laissent une trace.",
    image: '/image-1.2.png',
  },
  {
    title: "L'Intuition",
    text: "Avant d'être une maison, THÆM ÆTERNUM était une intuition. La certitude qu'un parfum pouvait devenir plus qu'une fragrance. Une présence. Un souffle. Une empreinte invisible capable de traverser le temps et de demeurer dans la mémoire.",
    image: '/image-2.png',
  },
  {
    title: 'Notre Écriture',
    text: "De cette recherche est née notre écriture. Une manière de penser le parfum comme une matière vivante, dense, sensible et habitée.",
    image: '/image-3.png',
  },
  {
    title: 'Notre Choix',
    text: "Et parce qu'une telle exigence ne pouvait accepter l'à-peu-près, nous avons fait un choix clair dès l'origine : travailler uniquement l'extrait de parfum, pour donner à chaque création la profondeur, la tenue et l'intensité qu'elle mérite.",
    image: '/image-4.png',
  },
  {
    title: 'Notre Vision',
    text: "THÆM ÆTERNUM explore ainsi un parfum plus intense, plus mystérieux, plus durable. Un parfum pensé pour demeurer.",
    image: '/image-5.png',
  },
];

const OurStory = () => (
  <PageTransition>
    <Helmet>
      <title>Notre Histoire, THÆM ÆTERNUM</title>
      <meta name="description" content="Découvrez l'histoire de THÆM ÆTERNUM, maison de parfumerie artisanale française. Le souffle de l'âme, née d'une passion pour les matières nobles." />
      <meta property="og:title" content="Notre Histoire, THÆM ÆTERNUM" />
    </Helmet>
    <div className="min-h-screen pt-24 lg:pt-28 pb-28 relative">

      {/* Glow fond */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(196,149,106,0.08) 0%, transparent 60%)' }}
      />

      {/* Titre */}
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <p className="font-body text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: 'rgba(196,149,106,0.6)' }}>
            La Maison
          </p>
          <h1 className="font-display text-4xl lg:text-6xl italic font-light">
            Notre <span className="text-primary">Histoire</span>
          </h1>
          <div className="h-px max-w-[60px] mx-auto mt-8" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />
        </motion.div>
      </div>

      {/* Sections alternées image / texte */}
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10 space-y-0">
        {sections.map((section, i) => {
          const imageRight = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${imageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-0 lg:gap-0 mb-0`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 overflow-hidden">
                <motion.div
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="relative h-[60vw] lg:h-[520px] overflow-hidden m-4 lg:m-8"
                >
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: imageRight
                        ? 'linear-gradient(to right, transparent 60%, rgba(10,10,10,0.5) 100%)'
                        : 'linear-gradient(to left, transparent 60%, rgba(10,10,10,0.5) 100%)',
                    }}
                  />
                  {/* Coins dorés */}
                  {[
                    'top-0 left-0 border-t border-l',
                    'top-0 right-0 border-t border-r',
                    'bottom-0 left-0 border-b border-l',
                    'bottom-0 right-0 border-b border-r',
                  ].map((pos, ci) => (
                    <div
                      key={ci}
                      className={`absolute w-8 h-8 ${pos} pointer-events-none`}
                      style={{ borderColor: 'rgba(196,149,106,0.7)' }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Texte */}
              <div className={`w-full lg:w-1/2 px-8 lg:px-16 py-12 lg:py-0 flex flex-col justify-center ${imageRight ? 'lg:text-left' : 'lg:text-right'}`}>
                <p className="font-body text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: 'rgba(196,149,106,0.5)' }}>
                  0{i + 1}
                </p>
                <h2 className="font-display text-3xl lg:text-4xl italic font-light mb-6" style={{ color: 'hsl(43,50%,54%)' }}>
                  {section.title}
                </h2>
                <div
                  className={`h-px w-12 mb-6 ${imageRight ? '' : 'lg:ml-auto'}`}
                  style={{ background: 'rgba(196,149,106,0.4)' }}
                />
                <p className="font-display italic text-base lg:text-lg leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.65)' }}>
                  {section.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slogan final */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mt-28 px-4"
      >
        <div className="h-px mb-10 mx-auto max-w-xs" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />
        <p className="font-display italic text-xl lg:text-3xl" style={{ color: 'hsl(43,50%,54%)' }}>
          Le souffle de l&apos;âme.
        </p>
      </motion.div>

    </div>
  </PageTransition>
);

export default OurStory;
