import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useParfums } from '@/hooks/useParfums';
import { getCollection, type Collection } from '@/data/products';
import { getBottleImage } from '@/data/bottleImages';

// ── Types ──
interface Question {
  id: number;
  question: string;
  subtitle?: string;
  options: { label: string; sub: string; families: Collection[] }[];
}

// ── Questions ──
const questions: Question[] = [
  {
    id: 1,
    question: "Quand vous fermez les yeux et pensez à un parfum idéal, c'est...",
    subtitle: "Laissez votre instinct répondre.",
    options: [
      { label: "Quelque chose de chaud, de dense, qui enveloppe", sub: "Gourmand, sucré, réconfortant", families: ['sacrae'] },
      { label: "Quelque chose de vif, de fruité, qui éclate", sub: "Lumineux, énergique, solaire", families: ['vitae'] },
      { label: "Quelque chose de profond, de sombre, qui reste", sub: "Boisé, ambré, intense", families: ['umbrae'] },
      { label: "Quelque chose de floral, de délicat, qui touche", sub: "Élégant, romantique, précieux", families: ['nerolae'] },
      { label: "Quelque chose de pur, d'aérien, qui libère", sub: "Propre, minimaliste, aérien", families: ['aera'] },
    ],
  },
  {
    id: 2,
    question: "Ce qui vous attire dans un parfum...",
    subtitle: "Pas ce que vous pensez devoir aimer. Ce que vous aimez vraiment.",
    options: [
      { label: "La gourmandise, le sucre, la chaleur", sub: "Vanille, tonka, caramel", families: ['sacrae'] },
      { label: "Le fruit, l'éclat, la légèreté", sub: "Mangue, framboise, agrumes", families: ['vitae'] },
      { label: "Le bois, l'ambre, la profondeur", sub: "Oud, encens, santal", families: ['umbrae'] },
      { label: "La fleur, la douceur, l'élégance", sub: "Rose, jasmin, néroli", families: ['nerolae'] },
      { label: "La pureté, la fraîcheur, le vide", sub: "Musc blanc, coton, air", families: ['aera'] },
    ],
  },
  {
    id: 3,
    question: "Vous portez un parfum plutôt...",
    subtitle: "Le moment dit tout sur ce qu'on cherche.",
    options: [
      { label: "Le soir, quand tout ralentit", sub: "Les heures douces et enveloppantes", families: ['sacrae', 'umbrae'] },
      { label: "Le jour, quand tout s'embrase", sub: "L'énergie et la spontanéité", families: ['vitae'] },
      { label: "La nuit, quand tout devient autre chose", sub: "L'intensité et le mystère", families: ['umbrae', 'nerolae'] },
      { label: "En toute occasion, comme une seconde peau", sub: "Un parfum qui vous appartient", families: ['sacrae', 'nerolae'] },
      { label: "Le matin, avant que le monde commence", sub: "La clarté et la légèreté", families: ['aera', 'vitae'] },
    ],
  },
  {
    id: 4,
    question: "Votre parfum doit...",
    subtitle: "Ce que vous attendez vraiment de lui.",
    options: [
      { label: "Marquer. Longtemps. Sans hésiter.", sub: "Une présence affirmée et durable", families: ['sacrae', 'umbrae'] },
      { label: "Exister sans s'imposer", sub: "Subtil mais reconnaissable", families: ['aera', 'nerolae'] },
      { label: "Surprendre avant d'être compris", sub: "Complexe, inattendu, rare", families: ['umbrae', 'vitae'] },
      { label: "Être discret mais reconnaissable", sub: "Une signature personnelle", families: ['nerolae', 'aera'] },
      { label: "Vous précéder partout où vous allez", sub: "Un sillage qui annonce votre arrivée", families: ['sacrae', 'vitae'] },
    ],
  },
  {
    id: 5,
    question: "Dans votre quotidien, vous êtes plutôt...",
    subtitle: "Votre caractère se porte aussi.",
    options: [
      { label: "Intense et chaleureux", sub: "Présence forte, âme généreuse", families: ['sacrae'] },
      { label: "Solaire et spontané", sub: "Énergie vive, joie naturelle", families: ['vitae'] },
      { label: "Mystérieux et posé", sub: "Profondeur calme, regard qui retient", families: ['umbrae'] },
      { label: "Romantique et raffiné", sub: "Sensibilité, élégance intérieure", families: ['nerolae'] },
      { label: "Épuré et silencieux", sub: "Précision, légèreté choisie", families: ['aera'] },
    ],
  },
  {
    id: 6,
    question: "Ce que vous voulez laisser derrière vous...",
    subtitle: "La trace dit plus que le parfum lui-même.",
    options: [
      { label: "Une chaleur dont on se souvient", sub: "Quelque chose de doux et persistant", families: ['sacrae'] },
      { label: "Une énergie qui donne envie", sub: "Un souffle de vie et de lumière", families: ['vitae'] },
      { label: "Une présence qu'on ne peut pas oublier", sub: "Quelque chose de profond, d'ancré", families: ['umbrae'] },
      { label: "Un souvenir floral et tendre", sub: "Une empreinte délicate et précieuse", families: ['nerolae'] },
      { label: "Un souffle propre et rare", sub: "Une légèreté qui marque sans peser", families: ['aera'] },
    ],
  },
];

// ── Textes personnalisés par gamme ──
const gammeTexts: Record<Collection, { titre: string; texte: string }> = {
  sacrae: {
    titre: "THÆM a choisi SACRÆ pour vous.",
    texte: "Vous portez la chaleur comme une évidence. Ce n'est pas une tendance — c'est une nature. SACRÆ existe pour ceux qui n'ont pas peur de la douceur quand elle est profonde. Vanille, tonka, caramel brûlant. Une gamme qui reste. Longtemps après que vous soyez parti.",
  },
  vitae: {
    titre: "THÆM a choisi VITÆ pour vous.",
    texte: "Vous êtes mouvement avant d'être silence. Votre parfum doit suivre ce rythme — vif, lumineux, immédiat. VITÆ a été pensée pour les peaux qui captent la lumière. Des fruits qui éclatent, une énergie qui ne demande pas la permission.",
  },
  umbrae: {
    titre: "THÆM a choisi UMBRÆ pour vous.",
    texte: "Il y a en vous quelque chose qui n'a pas besoin d'être expliqué. UMBRÆ existe pour ça. Une profondeur que peu comprennent du premier coup. Bois sombres, ambre, oud. Une gamme pour ceux qui savent que les choses les plus rares ne se révèlent pas tout de suite.",
  },
  nerolae: {
    titre: "THÆM a choisi NEROLÆ pour vous.",
    texte: "Vous portez l'élégance sans effort — c'est la forme la plus rare de la beauté. NEROLÆ a été pensée pour les peaux qui transforment la fleur en quelque chose d'inattendu. Rose, jasmin, néroli. Une gamme qui murmure mais ne s'efface pas.",
  },
  aera: {
    titre: "THÆM a choisi ÆRA pour vous.",
    texte: "Vous avez compris que la pureté est un luxe. Pas le vide — la précision. ÆRA existe pour ceux qui n'ont besoin de rien de plus que ce qui est essentiel. Musc blanc, air, légèreté absolue. Une gamme qui dit tout sans bruit.",
  },
};

// ── Composant principal ──
const Quiz = () => {
  const { parfums } = useParfums();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Collection, number>>({
    sacrae: 0, vitae: 0, umbrae: 0, nerolae: 0, aera: 0,
  });
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [result, setResult] = useState(false);

  const current = questions[step];
  const progress = ((step) / questions.length) * 100;

  const handleSelect = (optionIndex: number, families: Collection[]) => {
    const newScores = { ...scores };
    families.forEach(f => { newScores[f] += 1; });
    setScores(newScores);
    setSelectedOptions([...selectedOptions, optionIndex]);

    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        setResult(true);
      }
    }, 400);
  };

  // Top 3 gammes
  const sorted = (Object.entries(scores) as [Collection, number][])
    .sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3).map(([col]) => col);

  // Pour chaque gamme du top 3 — trouver le meilleur parfum
  const getTopParfum = (col: Collection) => {
    const list = parfums.filter(p => p.collection === col);
    return list[0] ?? null;
  };

  if (result) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background">
        <div className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(196,149,106,0.06) 0%, transparent 70%)' }} />

        <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2 text-center">Votre résultat</p>
            <h1 className="font-display text-3xl lg:text-4xl italic font-light text-foreground mb-4 text-center">
              {gammeTexts[top3[0]].titre}
            </h1>
            <p className="font-display italic text-foreground/60 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
              {gammeTexts[top3[0]].texte}
            </p>

            <h2 className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-8 text-center">Vos trois parfums</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {top3.map((col, rank) => {
                const parfum = getTopParfum(col);
                const collection = getCollection(col);
                if (!parfum || !collection) return null;
                const bottleImg = getBottleImage(col);
                const acc = collection.colors.accent;

                return (
                  <motion.div
                    key={col}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rank * 0.15, duration: 0.6 }}
                    className="relative border rounded-lg overflow-hidden"
                    style={{ borderColor: rank === 0 ? `${acc}40` : 'rgba(255,255,255,0.08)' }}
                  >
                    {rank === 0 && (
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded font-body text-[9px] uppercase tracking-widest"
                        style={{ background: `${acc}20`, color: acc, border: `1px solid ${acc}40` }}>
                        Votre accord parfait
                      </div>
                    )}
                    {rank === 1 && (
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded font-body text-[9px] uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        Accord secondaire
                      </div>
                    )}
                    {rank === 2 && (
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded font-body text-[9px] uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        À explorer
                      </div>
                    )}

                    {/* Bottle */}
                    <div className="h-52 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${acc}08 0%, transparent 100%)` }}>
                      <img src={bottleImg} alt={parfum.nom} className="h-40 w-auto object-contain" />
                    </div>

                    <div className="p-5">
                      <p className="font-body text-[10px] uppercase tracking-widest mb-1" style={{ color: acc }}>
                        {collection.name}
                      </p>
                      <h3 className="font-display italic text-xl text-foreground mb-2">{parfum.nom}</h3>
                      <p className="font-body text-xs text-foreground/50 leading-relaxed mb-4 line-clamp-3">
                        {gammeTexts[col].texte}
                      </p>
                      <Link
                        to={`/product/${parfum.id}`}
                        className="block text-center py-2.5 font-body text-[10px] uppercase tracking-widest rounded transition-all duration-300"
                        style={rank === 0
                          ? { background: `${acc}20`, border: `1px solid ${acc}40`, color: acc }
                          : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                        }
                      >
                        Découvrir {parfum.nom}
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => { setStep(0); setScores({ sacrae: 0, vitae: 0, umbrae: 0, nerolae: 0, aera: 0 }); setResult(false); setSelectedOptions([]); }}
                className="font-body text-xs uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors"
              >
                Recommencer le quiz
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background flex items-center">
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(196,149,106,0.05) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 lg:px-8 max-w-2xl relative z-10 w-full">

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between font-body text-[10px] uppercase tracking-widest text-foreground/30 mb-3">
            <span>Quiz olfactif</span>
            <span>{step + 1} / {questions.length}</span>
          </div>
          <div className="h-px bg-white/10 w-full rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'rgba(196,149,106,0.6)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-display italic text-2xl lg:text-3xl font-light text-foreground mb-2 leading-snug">
              {current.question}
            </h2>
            {current.subtitle && (
              <p className="font-body text-xs text-foreground/40 mb-10 tracking-wide italic">
                {current.subtitle}
              </p>
            )}

            <div className="space-y-3">
              {current.options.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i, opt.families)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="w-full text-left px-5 py-4 rounded border transition-all duration-300 group"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,149,106,0.3)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(196,149,106,0.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <p className="font-display italic text-base text-foreground group-hover:text-foreground transition-colors">
                    {opt.label}
                  </p>
                  <p className="font-body text-xs text-foreground/40 mt-0.5">{opt.sub}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
