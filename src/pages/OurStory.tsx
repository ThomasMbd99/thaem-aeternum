import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const sections = [
  {
    title: 'La Maison',
    text: "THÆM ÆTERNUM est née de trois frères, d'une même vision, et d'une même exigence. Celle de créer des parfums qui ne se contentent pas d'exister, mais qui laissent une trace.",
  },
  {
    title: 'L\'Intuition',
    text: "Avant d'être une maison, THÆM ÆTERNUM était une intuition. La certitude qu'un parfum pouvait devenir plus qu'une fragrance. Une présence. Un souffle. Une empreinte invisible capable de traverser le temps et de demeurer dans la mémoire.",
  },
  {
    title: 'Notre Écriture',
    text: "De cette recherche est née notre écriture. Une manière de penser le parfum comme une matière vivante, dense, sensible et habitée.",
  },
  {
    title: 'Notre Choix',
    text: "Et parce qu'une telle exigence ne pouvait accepter l'à-peu-près, nous avons fait un choix clair dès l'origine : travailler uniquement l'extrait de parfum, pour donner à chaque création la profondeur, la tenue et l'intensité qu'elle mérite.",
  },
  {
    title: 'Notre Vision',
    text: "THÆM ÆTERNUM explore ainsi un parfum plus intense, plus mystérieux, plus durable. Un parfum pensé pour demeurer.",
  },
];

const OurStory = () => (
  <PageTransition>
    <div className="min-h-screen pt-24 lg:pt-28 pb-28 relative">

      {/* Glow fond */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(196,149,106,0.08) 0%, transparent 60%)' }}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative z-10">

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="font-body text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: 'rgba(196,149,106,0.6)' }}>
            La Maison
          </p>
          <h1 className="font-display text-4xl lg:text-6xl italic font-light">
            Notre <span className="text-primary">Histoire</span>
          </h1>
        </motion.div>

        {/* Sections */}
        <div className="space-y-24">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="font-display text-2xl lg:text-3xl italic mb-6" style={{ color: 'hsl(43,50%,54%)' }}>
                {section.title}
              </h2>
              <p className="font-display italic text-base lg:text-lg leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.65)' }}>
                {section.text}
              </p>
              {i < sections.length - 1 && (
                <div className="mt-16 mx-auto w-12 h-px" style={{ background: 'rgba(196,149,106,0.3)' }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Slogan final */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mt-24"
        >
          <div className="h-px mb-10 mx-auto max-w-xs" style={{ background: 'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)' }} />
          <p className="font-display italic text-xl lg:text-2xl" style={{ color: 'hsl(43,50%,54%)' }}>
            Le souffle de l&apos;âme.
          </p>
        </motion.div>

      </div>
    </div>
  </PageTransition>
);

export default OurStory;