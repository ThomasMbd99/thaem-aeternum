import { Note } from '@/data/products';
import { motion } from 'framer-motion';
import { getNoteImagePath } from '@/data/noteImages';

interface NoteItemProps {
  name: string;
  accentColor: string;
  index: number;
  sectionIndex: number;
}

const NoteItem = ({ name, accentColor, index, sectionIndex }: NoteItemProps) => {
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
        className="w-12 h-12 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-110"
        style={{ boxShadow: `0 0 0 1.5px ${accentColor}44` }}
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
          color: `${accentColor}bb`,
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
              background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}0e)`,
              borderLeft: `2px solid ${accentColor}88`,
              borderTop: `1px solid ${accentColor}33`,
              borderBottom: `1px solid ${accentColor}1a`,
              boxShadow: `0 2px 20px ${accentColor}10`,
            }}
          >
            <div className="text-center">
              <p className="font-body uppercase" style={{ fontSize: '9px', letterSpacing: '0.3em', color: `${accentColor}88` }}>
                {section.sublabel}
              </p>
              <p className="font-display text-sm italic" style={{ color: `${accentColor}cc` }}>
                {section.label}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {section.items.map((note, j) => (
                <NoteItem key={note} name={note} accentColor={accentColor} index={j} sectionIndex={i} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OlfactoryPyramid;
