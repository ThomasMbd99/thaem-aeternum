import { Note, NoteEntry, getNoteName, getNoteWeight } from '@/data/products';
import { motion } from 'framer-motion';
import { getNoteImagePath } from '@/data/noteImages';

interface NoteItemProps {
  note: NoteEntry;
  accentColor: string;
  index: number;
  sectionIndex: number;
}

// Taille de base 48px, mise à l'échelle par le poids de la note (clampé pour rester lisible).
const BASE_SIZE = 48;
const MIN_SIZE = 36;
const MAX_SIZE = 88;

const NoteItem = ({ note, accentColor, index, sectionIndex }: NoteItemProps) => {
  const name = getNoteName(note);
  const weight = getNoteWeight(note);
  const size = Math.round(Math.min(Math.max(BASE_SIZE * weight, MIN_SIZE), MAX_SIZE));
  const imagePath = getNoteImagePath(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: sectionIndex * 0.1 + index * 0.06 }}
      className="flex flex-col items-center gap-1.5 group"
      style={{ width: '72px', flexShrink: 0 }}
    >
      {/* Photo circle */}
      <div
        className="rounded-full overflow-hidden transition-all duration-300 group-hover:scale-110"
        style={{ width: `${size}px`, height: `${size}px`, boxShadow: `0 0 0 1.5px ${accentColor}44` }}
      >
        {imagePath ? (
          <img
            src={imagePath}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center rounded-full"
            style={{ background: `${accentColor}1a` }}
          >
            <span className="font-display text-base italic" style={{ color: `${accentColor}99` }}>
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Note name */}
      <span
        className="font-body text-center leading-tight"
        style={{
          color: 'var(--foreground)',
          opacity: 0.85,
          fontSize: '8px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          width: '72px',
          display: 'block',
          wordBreak: 'break-word',
        }}
      >
        {name}
      </span>
    </motion.div>
  );
};

interface Props {
  notes: Note;
  accentColor?: string;
}

const OlfactoryPyramid = ({ notes, accentColor = 'hsl(var(--gold))' }: Props) => {
  const sections = [
    { label: 'Notes de Tête', sublabel: 'Ouverture', items: notes.top, width: '55%' },
    { label: 'Notes de Cœur', sublabel: 'Signature', items: notes.heart, width: '75%' },
    { label: 'Notes de Fond', sublabel: 'Sillage', items: notes.base, width: '100%' },
  ];

  if (notes.olfactive && notes.olfactive.length > 0) {
    sections.push({ label: 'Notes Olfactives', sublabel: 'Caractère', items: notes.olfactive, width: '100%' });
  }

  return (
    <div className="space-y-1">
      <motion.h4
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display text-sm uppercase tracking-widest text-primary mb-6"
      >
        Pyramide Olfactive
      </motion.h4>

      <div className="flex flex-col items-center gap-3">
        {sections.map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center gap-4 rounded-sm py-4 px-3"
            style={{
              width: section.width,
              background: `linear-gradient(135deg, ${accentColor}28, ${accentColor}12)`,
              borderLeft: `2px solid ${accentColor}cc`,
              borderTop: `1px solid ${accentColor}55`,
              borderBottom: `1px solid ${accentColor}33`,
              boxShadow: `0 2px 20px ${accentColor}18`,
              backdropFilter: 'blur(4px)',
            }}
          >
            <div className="text-center">
              <p className="font-body uppercase" style={{ fontSize: '9px', letterSpacing: '0.3em', color: accentColor, opacity: 0.7 }}>
                {section.sublabel}
              </p>
              <p className="font-display text-sm italic" style={{ color: accentColor }}>
                {section.label}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {section.items.map((note, j) => (
                <NoteItem key={getNoteName(note)} note={note} accentColor={accentColor} index={j} sectionIndex={i} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OlfactoryPyramid;
