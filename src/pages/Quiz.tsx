import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collections, getCollection, type Collection } from '@/data/products';
import { useParfums } from '@/hooks/useParfums';
import { useCart } from '@/context/CartContext';

interface QuizOption {
  label: string;
  sub: string;
  families: Collection[];
}

const questions: { question: string; hint: string; options: QuizOption[] }[] = [
  {
    question: 'Quelle ambiance vous correspond ?',
    hint: 'Choisissez instinctivement.',
    options: [
      { label: 'Chaleureuse & Enveloppante', sub: 'Cocon, douceur, sécurité', families: ['sacrae'] },
      { label: 'Fraîche & Pétillante', sub: 'Énergie, légèreté, joie', families: ['vitae'] },
      { label: 'Mystérieuse & Profonde', sub: 'Intensité, caractère, force', families: ['umbrae'] },
      { label: 'Lumineuse & Romantique', sub: 'Élégance, grâce, poésie', families: ['nerolae'] },
      { label: 'Pure & Aérienne', sub: 'Légèreté, clarté, liberté', families: ['aera'] },
    ],
  },
  {
    question: 'Quelle saison vous inspire ?',
    hint: 'Celle qui vous ressemble.',
    options: [
      { label: 'Automne', sub: 'Épices, bois, chaleur', families: ['sacrae', 'umbrae'] },
      { label: 'Été', sub: 'Soleil, fruits, liberté', families: ['vitae'] },
      { label: 'Hiver', sub: 'Nuit froide, feu, profondeur', families: ['umbrae'] },
      { label: 'Printemps', sub: 'Fleurs, renouveau, clarté', families: ['nerolae'] },
      { label: 'Été blanc', sub: 'Pureté, soleil, espace', families: ['aera'] },
    ],
  },
  {
    question: 'Quelle matière vous attire ?',
    hint: 'Celle que vous porteriez toujours.',
    options: [
      { label: 'Cachemire & Velours', sub: 'Douceur, confort, chaleur', families: ['sacrae'] },
      { label: 'Lin & Coton', sub: 'Légèreté, fraîcheur', families: ['vitae'] },
      { label: 'Cuir & Bois brut', sub: 'Force, authenticité', families: ['umbrae'] },
      { label: 'Soie & Organza', sub: 'Raffinement, délicatesse', families: ['nerolae'] },
      { label: 'Lin & Coton blanc', sub: 'Minimalisme, pureté', families: ['aera'] },
    ],
  },
  {
    question: 'Quel est votre moment de la journée ?',
    hint: 'Celui où vous êtes vous-même.',
    options: [
      { label: 'Soirée cocon', sub: 'Chaleur, intimité', families: ['sacrae'] },
      { label: 'Matin ensoleillé', sub: 'Énergie, départ', families: ['vitae'] },
      { label: 'Nuit urbaine', sub: 'Mystère, profondeur', families: ['umbrae'] },
      { label: 'Après-midi fleuri', sub: 'Nature, douceur', families: ['nerolae'] },
      { label: 'Matin épuré', sub: 'Clarté, fraîcheur, espace', families: ['aera'] },
    ],
  },
  {
    question: 'Comment portez-vous votre parfum ?',
    hint: 'Votre rapport au parfum, en vérité.',
    options: [
      { label: 'Un rituel réconfortant', sub: 'Famille, mémoire', families: ['sacrae'] },
      { label: 'Une énergie du matin', sub: 'Vitalité, clarté', families: ['vitae'] },
      { label: 'Une affirmation de soi', sub: 'Signature forte', families: ['umbrae'] },
      { label: 'Une touche poétique', sub: 'Romantisme, subtilité', families: ['nerolae'] },
      { label: 'Un souffle léger', sub: 'Pureté, discrétion, élégance', families: ['aera'] },
    ],
  },
];

const Quiz = () => {
  const { parfums } = useParfums();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const { addItem } = useCart();

  const handleAnswer = (optIndex: number) => {
    const newAnswers = [...answers, optIndex];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 400);
    }
  };

  const result = useMemo(() => {
    if (!showResult) return null;

    // Tally family scores
    const scores: Record<Collection, number> = { sacrae: 0, vitae: 0, umbrae: 0, nerolae: 0, aera: 0 };
    answers.forEach((optIdx, qIdx) => {
      const option = questions[qIdx].options[optIdx];
      option.families.forEach(f => { scores[f] += 1; });
    });

    const ranked = (Object.entries(scores) as [Collection, number][]).sort((a, b) => b[1] - a[1]);
    const topFamily = ranked[0][0];
    const familyProducts = parfums.filter(p => p.collection === topFamily);
    const recommended = familyProducts[Math.floor(Math.random() * familyProducts.length)];
    const collection = getCollection(topFamily);

    return { recommended, collection, scores, topFamily };
  }, [showResult, answers]);

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-20 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-0.5 mb-3">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mr-3">
              Quiz Olfactif
            </span>
            {questions.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[2px] transition-all duration-500"
                style={{
                  background: i < (showResult ? questions.length : step)
                    ? 'hsl(43, 50%, 54%)'
                    : i === step && !showResult
                    ? 'linear-gradient(to right, hsl(43, 50%, 54%), hsl(0, 0%, 16%))'
                    : 'hsl(0, 0%, 16%)',
                }}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Question {step + 1} / {questions.length}
              </p>
              <h2 className="font-display text-3xl lg:text-5xl font-light italic leading-tight mb-2">
                {questions[step].question}
              </h2>
              <p className="font-body text-xs text-muted-foreground/50 mb-10">
                {questions[step].hint}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {questions[step].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="group text-left p-5 border border-border bg-card/50 hover:border-primary relative overflow-hidden transition-all duration-300 active:scale-[0.97]"
                  >
                    <div className="absolute inset-0 bg-primary transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                    <div className="relative z-10">
                      <span className="font-display text-xl italic font-light group-hover:text-primary-foreground transition-colors duration-300">
                        {opt.label}
                      </span>
                      <span className="block font-body text-xs text-muted-foreground group-hover:text-primary-foreground/70 mt-1 transition-colors duration-300">
                        {opt.sub}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="text-center"
            >
              <p className="font-body text-[11px] tracking-[0.4em] uppercase text-primary mb-6">
                Votre signature olfactive
              </p>

              {/* Flacon visual */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-28 h-44 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${result.collection?.colors.accent}20, ${result.collection?.colors.accent}08)`,
                    boxShadow: `0 0 60px ${result.collection?.colors.accent}15`,
                  }}
                >
                  <span className="font-display text-xl text-primary tracking-wider">
                    {result.recommended.name}
                  </span>
                </div>
              </div>

              <h2 className="font-display text-5xl lg:text-7xl font-light italic leading-none mb-3">
                {result.recommended.name}
              </h2>
              <p className="font-body text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-2"
                style={{ color: result.collection?.colors.accent }}
              >
                {result.collection?.name}
              </p>
              <p className="font-body text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                {result.recommended.tagline}
              </p>

              <div className="flex gap-3 justify-center flex-wrap mb-6">
                <button
                  onClick={() => {
                    addItem({
                      productId: result.recommended.id,
                      format: '10ml',
                      price: 10,
                      name: result.recommended.name,
                    });
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-300 active:scale-[0.97]"
                >
                  Ajouter au Panier
                </button>
                <Link
                  to={`/produit/${result.recommended.id}`}
                  className="px-6 py-3 border border-border font-body text-xs uppercase tracking-[0.2em] hover:border-primary transition-all duration-300"
                >
                  Voir la Fiche
                </Link>
              </div>

              <button
                onClick={reset}
                className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                ← Refaire le quiz
              </button>

              {/* Compatibility bars */}
              <div className="mt-10 text-left max-w-sm mx-auto">
                <p className="font-body text-[11px] tracking-[0.2em] uppercase text-muted-foreground/50 mb-4">
                  Compatibilité par famille
                </p>
                {collections.map(col => {
                  const score = result.scores[col.id];
                  const pct = Math.round((score / questions.length) * 100);
                  return (
                    <div key={col.id} className="flex items-center gap-3 mb-2.5">
                      <span className="font-body text-[10px] tracking-[0.15em] uppercase w-16 flex-shrink-0">
                        {col.name}
                      </span>
                      <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: col.colors.accent }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        />
                      </div>
                      <span className="font-body text-xs text-muted-foreground w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
