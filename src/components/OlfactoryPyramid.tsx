import { Note } from '@/data/products';
import { motion } from 'framer-motion';
import { useNoteImage } from '@/hooks/useNoteImage';

interface NoteItemProps {
  name: string;
  accentColor: string;
  index: number;
  sectionIndex: number;
}

const NoteItem = ({ name, accentColor, index, sectionIndex }: NoteItemProps) => {
  const { data: imageUrl, isLoading } = useNoteImage(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: sectionIndex * 0.12 + index * 0.07 }}
      className="flex flex-col items-center gap-2 group"
    >
      {/* Photo circle */}
      <div
        className="relative w-14 h-14 rounded-full overflow-hidden ring-1 transition-all duration-300 group-hover:scale-110"
        style={{
          ringColor: `${accentColor}44`,
          boxShadow: `0 0 0 1px ${accentColor}33`,
        }}
      >
        {isLoading && (
          <div
            className="absolute inset-0 animate-pulse rounded-full"
            style={{ background: `${accentColor}22` }}
          />
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          !isLoading && (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `${accentColor}18` }}
            >
              <span
                className="font-display text-lg italic"
                style={{ color: `${accentColor}99` }}
              >
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )
        )}
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)` }}
        />
      </div>

      {/* Note name */}
      <span
        className="font-body text-[10px] uppercase tracking-widest text-center leading-tight max-w-[64px] transition-colors duration-300"
        style={{ color: `${accentColor}aa` }}
      >
        {name}
      </span>
    </motion.div>
  );
};

interface SectionProps {
  label: string;
  sublabel: string;
  items: string[];
  width: string;
  accentColor: string;
  sectionIndex: number;
}

const PyramidSection = ({ label, sublabel, items, width, accentColor, sectionIndex }: SectionProps) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: sectionIndex * 0.15 }}
    className="flex flex-col items-center gap-4"
    style={{ width }}
  >
    {/* Section header */}
    <div className="w-full text-center pb-3 border-b" style={{ borderColor: `${accentColor}22` }}>
      <p
        className="font-body text-[9px] uppercase tracking-[0.3em] mb-0.5"
        style={{ color: `${accentColor}99` }}
      >
        {sublabel}
      </p>
      <p className="font-display text-sm italic" style={{ color: `${accentColor}cc` }}>
        {label}
      </p>
    </div>

    {/* Notes grid */}
    <div className="flex flex-wrap justify-center gap-4 pb-2">
      {items.map((note, i) => (
        <NoteItem
          key={note}
          name={note}
          accentColor={accentColor}
          index={i}
          sectionIndex={sectionIndex}
        />
      ))}
    </div>
  </motion.div>
);

interface Props {
  notes: Note;
  accentColor?: string;
}

const OlfactoryPyramid = ({ notes, accentColor = 'hsl(var(--gold))' }: Props) => {
  const sections = [
    { label: 'Notes de Tête', sublabel: 'Ouverture', items: notes.top, width: '60%' },
    { label: 'Notes de Cœur', sublabel: 'Signature', items: notes.heart, width: '80%' },
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

      <div className="flex flex-col items-center gap-6">
        {sections.map((section, i) => (
          <PyramidSection
            key={section.label}
            label={section.label}
            sublabel={section.sublabel}
            items={section.items}
            width={section.width}
            accentColor={accentColor}
            sectionIndex={i}
          />
        ))}
      </div>
    </div>
  );
};

export default OlfactoryPyramid;
