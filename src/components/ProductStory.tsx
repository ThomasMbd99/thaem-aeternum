import { motion } from 'framer-motion';
import { productStories } from '@/data/stories';

interface Props {
  productId: string;
  accentColor: string;
}

const ProductStory = ({ productId, accentColor }: Props) => {
  const story = productStories[productId];
  if (!story) return null;

  const paragraphs = story.split('\n\n');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-12"
    >
      <h3 className="font-display text-xl tracking-wider mb-6 text-foreground">L'Histoire</h3>
      <div
        className="border-l-2 pl-6 lg:pl-8 py-4 rounded-r-sm space-y-4"
        style={{
          borderColor: accentColor,
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="font-display text-sm lg:text-base italic leading-relaxed text-foreground/80"
          >
            {p}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductStory;
