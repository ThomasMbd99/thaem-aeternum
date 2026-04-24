import { Note } from '@/data/products';
import { motion } from 'framer-motion';

interface Props {
  notes: Note;
  accentColor?: string;
}

const OlfactoryPyramid = ({ notes, accentColor = 'hsl(var(--gold))' }: Props) => {
  const sections = [
    { label: 'Notes de Tête', items: notes.top, width: '50%' },
    { label: 'Notes de Cœur', items: notes.heart, width: '70%' },
    { label: 'Notes de Fond', items: notes.base, width: '90%' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Pyramide Olfactive</h4>
      {sections.map((section, i) => (
        <motion.div
          key={section.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="flex flex-col items-center"
        >
          <div
            className="py-3 px-4 rounded text-center"
            style={{
              width: section.width,
              background: `linear-gradient(135deg, ${accentColor}28, ${accentColor}14)`,
              borderLeft: `2px solid ${accentColor}99`,
              borderTop: `1px solid ${accentColor}33`,
              borderBottom: `1px solid ${accentColor}22`,
              boxShadow: `0 2px 16px ${accentColor}18`,
            }}
          >
            <p className="font-body text-[10px] uppercase tracking-widest mb-1" style={{ color: `${accentColor}cc` }}>{section.label}</p>
            <p className="font-body text-sm text-foreground/90">{section.items.join(' · ')}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OlfactoryPyramid;