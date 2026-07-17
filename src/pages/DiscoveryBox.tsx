import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getCollection } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useParfums } from '@/hooks/useParfums';
import { normalizeNom } from '@/lib/parfumUtils';
import { Check, Gift } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

type CollectionId = 'sacrae' | 'vitae' | 'umbrae' | 'nerolae' | 'aera';

type CollectionTheme = {
  fallbackBg: string;
  hoverBg: string;
  baseText: string;
  baseSubText: string;
  hoverText: string;
  hoverSubText: string;
};

type PerfumeTheme = {
  selectedBg: string;
  hoverBg: string;
  borderColor: string;
  textColor: string;
  subTextColor: string;
  hoverTextColor?: string;
  hoverSubTextColor?: string;
};

const collectionThemes: Record<CollectionId, CollectionTheme> = {
  sacrae: {
    fallbackBg:
      'linear-gradient(150deg, #F5EFE0 0%, #EFE5CC 40%, #E8D8B8 70%, #F0E8D5 100%)',
    hoverBg:
      'linear-gradient(150deg, #F8F1E4 0%, #F1E7D0 45%, #E7D4B0 100%)',
    baseText: '#3D2B1F',
    baseSubText: 'rgba(61,43,31,0.72)',
    hoverText: '#3D2B1F',
    hoverSubText: 'rgba(61,43,31,0.72)',
  },
  vitae: {
    fallbackBg:
      'linear-gradient(160deg, #7A1500 0%, #C03000 25%, #E05500 55%, #CC7700 80%, #A08800 100%)',
    hoverBg:
      'linear-gradient(160deg, #8F1B00 0%, #CF420A 30%, #EA6D14 65%, #C79717 100%)',
    baseText: '#2F180C',
    baseSubText: 'rgba(47,24,12,0.72)',
    hoverText: '#2F180C',
    hoverSubText: 'rgba(47,24,12,0.72)',
  },
  umbrae: {
    fallbackBg:
      'radial-gradient(ellipse at 30% 60%, #3D1A00 0%, #1A0A00 45%, #0D0500 100%)',
    hoverBg:
      'radial-gradient(ellipse at 30% 60%, #542200 0%, #241006 45%, #100707 100%)',
    baseText: '#F2E4D2',
    baseSubText: 'rgba(242,228,210,0.72)',
    hoverText: '#F2E4D2',
    hoverSubText: 'rgba(242,228,210,0.72)',
  },
  nerolae: {
    fallbackBg:
      'linear-gradient(135deg, #FFF7FA 0%, #F7EDF7 35%, #EEF2F8 70%, #FAF8FF 100%)',
    hoverBg:
      'linear-gradient(135deg, #FFF8FB 0%, #F8EEF8 40%, #EFF3FA 100%)',
    baseText: '#5B4351',
    baseSubText: 'rgba(91,67,81,0.72)',
    hoverText: '#5B4351',
    hoverSubText: 'rgba(91,67,81,0.72)',
  },
  aera: {
    fallbackBg:
      'linear-gradient(135deg, #F5FAFF 0%, #D6EEFF 40%, #C0E4FF 70%, #F0F8FF 100%)',
    hoverBg:
      'linear-gradient(135deg, #F8FCFF 0%, #DEEEFF 45%, #C8EAFF 100%)',
    baseText: '#1A2A3A',
    baseSubText: 'rgba(26,42,58,0.72)',
    hoverText: '#1A2A3A',
    hoverSubText: 'rgba(26,42,58,0.72)',
  },
};

const perfumeThemes: Record<string, PerfumeTheme> = {
  // SACRÆ
  dulsae: {
    selectedBg:
      'linear-gradient(145deg, #FFF6FB 0%, #FADBE8 35%, #F6C7D9 70%, #FDEEF5 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF8FC 0%, #FCE4EE 50%, #F8D4E3 100%)',
    borderColor: '#E8AFC8',
    textColor: '#5A3143',
    subTextColor: 'rgba(90,49,67,0.72)',
    hoverTextColor: '#5A3143',
    hoverSubTextColor: 'rgba(90,49,67,0.72)',
  },
  nerae: {
    selectedBg:
      'linear-gradient(145deg, #FFF7EC 0%, #F4E2C4 30%, #D8B07A 70%, #FFF1DE 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF8EF 0%, #EFDDBF 55%, #D7AE78 100%)',
    borderColor: '#C89B61',
    textColor: '#4A2F1C',
    subTextColor: 'rgba(74,47,28,0.72)',
    hoverTextColor: '#4A2F1C',
    hoverSubTextColor: 'rgba(74,47,28,0.72)',
  },
  lamae: {
    selectedBg:
      'linear-gradient(145deg, #2E362A 0%, #4A5A41 40%, #5e6d57 80%, #2E362A 100%)',
    hoverBg:
      'linear-gradient(145deg, #34402E 0%, #526152 55%, #6B7C62 100%)',
    borderColor: '#9FB492',
    textColor: '#E4EBDF',
    subTextColor: 'rgba(228,235,223,0.72)',
    hoverTextColor: '#F0F5EC',
    hoverSubTextColor: 'rgba(240,245,236,0.72)',
  },
  varkaem: {
    selectedBg:
      'linear-gradient(145deg, #38352E 0%, #5A564B 40%, #757063 80%, #38352E 100%)',
    hoverBg:
      'linear-gradient(145deg, #403D35 0%, #6A6558 55%, #847E6F 100%)',
    borderColor: '#B5AEA0',
    textColor: '#E6E2D9',
    subTextColor: 'rgba(230,226,217,0.72)',
    hoverTextColor: '#F0EDE6',
    hoverSubTextColor: 'rgba(240,237,230,0.72)',
  },
  zaemyr: {
    selectedBg:
      'linear-gradient(145deg, #DCEBF3 0%, #ABCBDD 40%, #c1dcea 80%, #DCEBF3 100%)',
    hoverBg:
      'linear-gradient(145deg, #E6F1F7 0%, #B7D5E5 55%, #CDE5F0 100%)',
    borderColor: '#5A92AE',
    textColor: '#1F3B49',
    subTextColor: 'rgba(31,59,73,0.72)',
    hoverTextColor: '#15303D',
    hoverSubTextColor: 'rgba(21,48,61,0.72)',
  },
  almae: {
    selectedBg:
      'linear-gradient(145deg, #EAE3D6 0%, #DDD0BB 40%, #d2c8b6 80%, #EAE3D6 100%)',
    hoverBg:
      'linear-gradient(145deg, #F0EBE1 0%, #E2D6C2 55%, #D8CEBC 100%)',
    borderColor: '#9C8259',
    textColor: '#3A3022',
    subTextColor: 'rgba(58,48,34,0.72)',
    hoverTextColor: '#2E2619',
    hoverSubTextColor: 'rgba(46,38,25,0.72)',
  },
  velae: {
    selectedBg:
      'linear-gradient(145deg, #352B21 0%, #523F2E 40%, #6f5a46 80%, #352B21 100%)',
    hoverBg:
      'linear-gradient(145deg, #3D3226 0%, #5E4A37 55%, #80694F 100%)',
    borderColor: '#C9AD8C',
    textColor: '#EFE3D4',
    subTextColor: 'rgba(239,227,212,0.72)',
    hoverTextColor: '#F7EEE2',
    hoverSubTextColor: 'rgba(247,238,226,0.72)',
  },

  // VITÆ
  naeva: {
    selectedBg:
      'linear-gradient(145deg, #0D0F2E 0%, #1A2060 40%, #2A38CC 80%, #0D0F2E 100%)',
    hoverBg:
      'linear-gradient(145deg, #10143A 0%, #202870 55%, #3344DD 100%)',
    borderColor: '#7B7FD9',
    textColor: '#C8CCFF',
    subTextColor: 'rgba(200,204,255,0.72)',
    hoverTextColor: '#D8DCFF',
    hoverSubTextColor: 'rgba(216,220,255,0.72)',
  },
  koyaen: {
    selectedBg:
      'linear-gradient(145deg, #0A2418 0%, #163C28 40%, #2A7A4A 80%, #0A2418 100%)',
    hoverBg:
      'linear-gradient(145deg, #0D2C1E 0%, #1C4A34 55%, #348A58 100%)',
    borderColor: '#5EC8B2',
    textColor: '#B8F0D8',
    subTextColor: 'rgba(184,240,216,0.72)',
    hoverTextColor: '#C8F8E8',
    hoverSubTextColor: 'rgba(200,248,232,0.72)',
  },
  ayaem: {
    selectedBg:
      'linear-gradient(145deg, #200505 0%, #400A0A 40%, #CC2210 80%, #200505 100%)',
    hoverBg:
      'linear-gradient(145deg, #280606 0%, #4E0C0C 55%, #DD2A14 100%)',
    borderColor: '#E04830',
    textColor: '#FFB8A8',
    subTextColor: 'rgba(255,184,168,0.72)',
    hoverTextColor: '#FFC8B8',
    hoverSubTextColor: 'rgba(255,200,184,0.72)',
  },
  espae: {
    selectedBg:
      'linear-gradient(145deg, #180310 0%, #350828 40%, #8C0050 80%, #180310 100%)',
    hoverBg:
      'linear-gradient(145deg, #200415 0%, #420A30 55%, #A0005C 100%)',
    borderColor: '#C4185A',
    textColor: '#FFAACC',
    subTextColor: 'rgba(255,170,204,0.72)',
    hoverTextColor: '#FFBBD9',
    hoverSubTextColor: 'rgba(255,187,217,0.72)',
  },
  // anciens IDs de secours
  syrae: {
    selectedBg:
      'linear-gradient(145deg, #FFE5B8 0%, #FFB36B 30%, #FF7A59 65%, #FFD27D 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFE8BF 0%, #FFB86E 50%, #FF7D59 100%)',
    borderColor: '#FF9A4D',
    textColor: '#4A1F0F',
    subTextColor: 'rgba(74,31,15,0.72)',
    hoverTextColor: '#4A1F0F',
    hoverSubTextColor: 'rgba(74,31,15,0.72)',
  },
  mangaera: {
    selectedBg:
      'linear-gradient(145deg, #FFF1A8 0%, #FFC247 35%, #FF8F1F 75%, #FFE28A 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF2AF 0%, #FFC64B 55%, #FF9324 100%)',
    borderColor: '#FF9E2F',
    textColor: '#472108',
    subTextColor: 'rgba(71,33,8,0.72)',
    hoverTextColor: '#472108',
    hoverSubTextColor: 'rgba(71,33,8,0.72)',
  },
  rubrae: {
    selectedBg:
      'linear-gradient(145deg, #FFD6DC 0%, #FF8AA0 35%, #D7264E 75%, #FFC0CC 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFDDE2 0%, #FF95A8 55%, #D82D53 100%)',
    borderColor: '#D7264E',
    textColor: '#4A1020',
    subTextColor: 'rgba(74,16,32,0.72)',
    hoverTextColor: '#4A1020',
    hoverSubTextColor: 'rgba(74,16,32,0.72)',
  },

  // UMBRÆ
  aeonis: {
    selectedBg:
      'linear-gradient(145deg, #2E2729 0%, #6E6062 40%, #9c8b8c 80%, #2E2729 100%)',
    hoverBg:
      'linear-gradient(145deg, #362E30 0%, #7E7072 55%, #AC9D9E 100%)',
    borderColor: '#C4B6B7',
    textColor: '#EDE5E6',
    subTextColor: 'rgba(237,229,230,0.72)',
    hoverTextColor: '#F6F0F0',
    hoverSubTextColor: 'rgba(246,240,240,0.72)',
  },
  valaena: {
    selectedBg:
      'linear-gradient(145deg, #2C333A 0%, #475260 40%, #5c6976 80%, #2C333A 100%)',
    hoverBg:
      'linear-gradient(145deg, #333B43 0%, #57606E 55%, #6C7986 100%)',
    borderColor: '#8FA0AE',
    textColor: '#E2E8ED',
    subTextColor: 'rgba(226,232,237,0.72)',
    hoverTextColor: '#EDF1F4',
    hoverSubTextColor: 'rgba(237,241,244,0.72)',
  },
  aelia: {
    selectedBg:
      'linear-gradient(145deg, #DCE6FE 0%, #AEC4FB 40%, #83a8fb 80%, #DCE6FE 100%)',
    hoverBg:
      'linear-gradient(145deg, #E6EDFE 0%, #BACEFC 55%, #98B8FC 100%)',
    borderColor: '#5A7FD6',
    textColor: '#1C2C52',
    subTextColor: 'rgba(28,44,82,0.72)',
    hoverTextColor: '#152040',
    hoverSubTextColor: 'rgba(21,32,64,0.72)',
  },
  azrae: {
    selectedBg:
      'linear-gradient(145deg, #DCEAE4 0%, #C0D9CD 40%, #aec9c0 80%, #DCEAE4 100%)',
    hoverBg:
      'linear-gradient(145deg, #E6F1EC 0%, #CCE1D6 55%, #BCD7CB 100%)',
    borderColor: '#6F9685',
    textColor: '#1F362C',
    subTextColor: 'rgba(31,54,44,0.72)',
    hoverTextColor: '#162820',
    hoverSubTextColor: 'rgba(22,40,32,0.72)',
  },
  maraeja: {
    selectedBg:
      'linear-gradient(145deg, #130B0B 0%, #342016 30%, #5B1F28 68%, #0E0708 100%)',
    hoverBg:
      'linear-gradient(145deg, #1A1010 0%, #3F261B 45%, #68252F 100%)',
    borderColor: '#7A3A34',
    textColor: '#F3E3D5',
    subTextColor: 'rgba(243,227,213,0.72)',
    hoverTextColor: '#F3E3D5',
    hoverSubTextColor: 'rgba(243,227,213,0.72)',
  },

  // FLORÆ
  // NEROLÆ
  osae: {
    selectedBg:
      'linear-gradient(145deg, #FCE6D9 0%, #FBC9A9 40%, #fa9f73 80%, #FCE6D9 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFEFE4 0%, #FDD6BB 55%, #FCB387 100%)',
    borderColor: '#E87946',
    textColor: '#5A2F16',
    subTextColor: 'rgba(90,47,22,0.72)',
    hoverTextColor: '#491F0D',
    hoverSubTextColor: 'rgba(73,31,13,0.72)',
  },
  saeny: {
    selectedBg:
      'linear-gradient(145deg, #FBEBEF 0%, #F4D2DA 40%, #eeb7c4 80%, #FBEBEF 100%)',
    hoverBg:
      'linear-gradient(145deg, #FEF3F6 0%, #F8DCE2 55%, #F2C3CF 100%)',
    borderColor: '#D6839A',
    textColor: '#5A2A38',
    subTextColor: 'rgba(90,42,56,0.72)',
    hoverTextColor: '#481F2C',
    hoverSubTextColor: 'rgba(72,31,44,0.72)',
  },
  laeya: {
    selectedBg:
      'linear-gradient(145deg, #0F2A30 0%, #2A5C68 40%, #53b9cb 80%, #0F2A30 100%)',
    hoverBg:
      'linear-gradient(145deg, #15333A 0%, #336E7C 55%, #67CADC 100%)',
    borderColor: '#8AD2DE',
    textColor: '#D6F2F6',
    subTextColor: 'rgba(214,242,246,0.72)',
    hoverTextColor: '#E4F8FA',
    hoverSubTextColor: 'rgba(228,248,250,0.72)',
  },
  naely: {
    selectedBg:
      'linear-gradient(145deg, #2A0E33 0%, #6A2580 40%, #a638c0 80%, #2A0E33 100%)',
    hoverBg:
      'linear-gradient(145deg, #321040 0%, #7C2C96 55%, #BA48D6 100%)',
    borderColor: '#D88AEE',
    textColor: '#F2D8FA',
    subTextColor: 'rgba(242,216,250,0.72)',
    hoverTextColor: '#F8E8FC',
    hoverSubTextColor: 'rgba(248,232,252,0.72)',
  },
  'noctae-rosa': {
    selectedBg:
      'linear-gradient(145deg, #F2E6EC 0%, #E3CCD8 40%, #ceacbc 80%, #F2E6EC 100%)',
    hoverBg:
      'linear-gradient(145deg, #F7EEF2 0%, #EAD9E1 55%, #D9BECC 100%)',
    borderColor: '#9C7488',
    textColor: '#3E2630',
    subTextColor: 'rgba(62,38,48,0.72)',
    hoverTextColor: '#321D26',
    hoverSubTextColor: 'rgba(50,29,38,0.72)',
  },

  // ÆRA
  vaem: {
    selectedBg:
      'linear-gradient(145deg, #EAF2FF 0%, #D2E2FB 40%, #c7dfff 80%, #EAF2FF 100%)',
    hoverBg:
      'linear-gradient(145deg, #F1F7FF 0%, #DCE9FC 55%, #B8D4FE 100%)',
    borderColor: '#6F9FE0',
    textColor: '#1E3358',
    subTextColor: 'rgba(30,51,88,0.72)',
    hoverTextColor: '#162848',
    hoverSubTextColor: 'rgba(22,40,72,0.72)',
  },
  lysae: {
    selectedBg:
      'linear-gradient(145deg, #EEFCE8 0%, #C9F0BE 40%, #ddfad1 80%, #EEFCE8 100%)',
    hoverBg:
      'linear-gradient(145deg, #F4FEF0 0%, #D6F5CD 55%, #B0E8A2 100%)',
    borderColor: '#7CC468',
    textColor: '#27431D',
    subTextColor: 'rgba(39,67,29,0.72)',
    hoverTextColor: '#1D3415',
    hoverSubTextColor: 'rgba(29,52,21,0.72)',
  },
  taelya: {
    selectedBg:
      'linear-gradient(145deg, #FFF1DE 0%, #FFE2BB 40%, #ffd699 80%, #FFF1DE 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF6E9 0%, #FFE8C9 55%, #FFCB80 100%)',
    borderColor: '#E0A350',
    textColor: '#553A14',
    subTextColor: 'rgba(85,58,20,0.72)',
    hoverTextColor: '#432D0E',
    hoverSubTextColor: 'rgba(67,45,14,0.72)',
  },
  thaely: {
    selectedBg:
      'linear-gradient(145deg, #FFF8DE 0%, #FFF0BB 40%, #ffeb99 80%, #FFF8DE 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFFBEA 0%, #FFF4CB 55%, #FFE680 100%)',
    borderColor: '#E0C24E',
    textColor: '#544B12',
    subTextColor: 'rgba(84,75,18,0.72)',
    hoverTextColor: '#423A0E',
    hoverSubTextColor: 'rgba(66,58,14,0.72)',
  },

  hibiscae: {
    selectedBg:
      'linear-gradient(145deg, #FFF4F7 0%, #F2D8E3 30%, #E7B8CB 70%, #FFF9FB 100%)',
    hoverBg:
      'linear-gradient(145deg, #FFF6F8 0%, #F4DDE7 50%, #EABFD0 100%)',
    borderColor: '#D8A8BE',
    textColor: '#5B3A49',
    subTextColor: 'rgba(91,58,73,0.72)',
    hoverTextColor: '#5B3A49',
    hoverSubTextColor: 'rgba(91,58,73,0.72)',
  },
  celestae: {
    selectedBg:
      'linear-gradient(145deg, #FAF7FF 0%, #E9E1F7 35%, #D8CCEF 72%, #FCFBFF 100%)',
    hoverBg:
      'linear-gradient(145deg, #FBF9FF 0%, #EEE7F9 50%, #E0D5F2 100%)',
    borderColor: '#C7B6E6',
    textColor: '#52456A',
    subTextColor: 'rgba(82,69,106,0.72)',
    hoverTextColor: '#52456A',
    hoverSubTextColor: 'rgba(82,69,106,0.72)',
  },
};

const DiscoveryBox = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const { parfums: parfumsDB } = useParfums();

  const stockMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of parfumsDB) map.set(normalizeNom(p.nom), p.stock);
    return map;
  }, [parfumsDB]);

  const statusMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of parfumsDB) map.set(normalizeNom(p.nom), p.statut);
    return map;
  }, [parfumsDB]);

  const togglePerfume = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleAdd = () => {
    addItem({
      productId: 'coffret-aeternum',
      format: '10ml',
      price: 39.99,
      name: 'Coffret ÆTERNUM',
      isDiscoveryBox: true,
      selectedPerfumes: selected,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelected([]);
    }, 2000);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Coffret ÆTERNUM, 5 × 10ml, THÆM ÆTERNUM</title>
        <meta name="description" content="Composez votre coffret découverte : choisissez 5 parfums parmi nos créations artisanales. 5 × 10ml pour 39,99€." />
        <meta property="og:title" content="Coffret ÆTERNUM , Coffret Découverte | THÆM ÆTERNUM" />
        <meta property="og:description" content="Choisissez 5 parfums parmi nos créations artisanales. 5 × 10ml pour 39,99€." />
      </Helmet>
      <div className="min-h-screen pt-24 lg:pt-28 pb-28 relative bg-background" style={{ backgroundColor: "hsl(var(--background))" }}>
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(196,149,106,0.08) 0%, transparent 60%)',
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Gift
              className="w-8 h-8 mx-auto mb-6"
              style={{ color: 'hsl(43,50%,54%)' }}
            />
            <p
              className="font-body text-[10px] uppercase tracking-[0.4em] mb-4"
              style={{ color: 'rgba(196,149,106,0.6)' }}
            >
              Coffret Découverte
            </p>
            <h1 className="font-display text-4xl lg:text-6xl italic font-light mb-4">
              Coffret <span className="ae-highlight">Æ</span>TERNUM
            </h1>
            <p
              className="font-display italic text-base"
              style={{ color: 'hsl(var(--foreground) / 0.5)' }}
            >
              Choisissez 5 parfums parmi nos créations · 5 × 10ml
            </p>
            <p
              className="font-display text-4xl mt-4"
              style={{ color: 'hsl(43,50%,54%)' }}
            >
              39,99€
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-px max-w-[80px] mx-auto mt-8 origin-center"
              style={{
                background:
                  'linear-gradient(to right, transparent, hsl(43,50%,54%), transparent)',
              }}
            />
          </motion.div>

          <div
            className="sticky top-16 lg:top-20 z-20 py-4 mb-12"
            style={{
              background: 'hsl(var(--background) / 0.95)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(196,149,106,0.15)',
            }}
          >
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const perfume = selected[i]
                    ? parfumsDB.find(p => p.id === selected[i])
                    : null;
                  const col = perfume ? getCollection(perfume.collection) : null;
                  const perfumeTheme = perfume ? perfumeThemes[perfume.id] : null;
                  const collectionTheme = perfume
                    ? collectionThemes[perfume.collection as CollectionId]
                    : null;

                  return (
                    <div
                      key={i}
                      className="w-14 h-14 rounded flex items-center justify-center text-center transition-all duration-500"
                      style={
                        perfume && col
                          ? {
                              border: `1px solid ${
                                perfumeTheme?.borderColor || col.colors.accent
                              }`,
                              background:
                                perfumeTheme?.selectedBg ||
                                collectionTheme?.fallbackBg ||
                                `${col.colors.accent}20`,
                            }
                          : {
                              border: '1px solid rgba(196,149,106,0.2)',
                            }
                      }
                    >
                      {perfume ? (
                        <span
                          className="font-display text-[9px] leading-tight px-1"
                          style={{
                            color:
                              perfumeTheme?.textColor ||
                              collectionTheme?.baseText ||
                              col?.colors.text,
                          }}
                        >
                          {perfume.name}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: 'rgba(196,149,106,0.3)',
                            fontSize: '1.2rem',
                          }}
                        >
                          +
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <span
                  className="font-body text-sm"
                  style={{ color: 'rgba(196,149,106,0.6)' }}
                >
                  {selected.length}/5
                </span>

                <button
                  onClick={handleAdd}
                  disabled={selected.length !== 5 || added}
                  className="px-6 py-3 font-body text-xs uppercase tracking-[0.2em] rounded transition-all duration-300"
                  style={{
                    border:
                      selected.length === 5 && !added
                        ? '1px solid hsl(43,50%,54%)'
                        : '1px solid rgba(196,149,106,0.2)',
                    color:
                      selected.length === 5 && !added
                        ? 'hsl(43,50%,54%)'
                        : 'rgba(196,149,106,0.3)',
                    background: added ? 'rgba(74,163,84,0.1)' : 'transparent',
                    cursor: selected.length !== 5 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {added ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-4 h-4" /> Ajouté
                    </span>
                  ) : (
                    'Ajouter au panier'
                  )}
                </button>
              </div>
            </div>
          </div>

          {(['sacrae', 'vitae', 'umbrae', 'nerolae', 'aera'] as const).map((colId, ci) => {
            const col = getCollection(colId)!;
            const colProducts = parfumsDB.filter(p => p.collection === colId && !p.en_promo);
            const collectionTheme = collectionThemes[colId];

            return (
              <motion.div
                key={colId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1, duration: 0.7 }}
                className="mb-16 rounded-xl overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${col.colors.accent}12 0%, transparent 60%)`, border: `1px solid ${col.colors.accent}20` }}
              >
                <div className="flex items-center gap-4 mb-6 px-5 pt-5 pb-4"
                  style={{ background: `linear-gradient(to right, ${col.colors.accent}18, transparent)`, borderBottom: `1px solid ${col.colors.accent}20` }}
                >
                  <h2
                    className="font-display text-2xl lg:text-3xl italic font-light"
                    style={{ color: col.colors.accent }}
                    dangerouslySetInnerHTML={{ __html: col.displayName }}
                  />
                  <div
                    className="h-px flex-1"
                    style={{ background: `linear-gradient(to right, ${col.colors.accent}40, transparent)` }}
                  />
                  <span
                    className="font-body text-[10px] uppercase tracking-widest"
                    style={{ color: col.colors.accent }}
                  >
                    {col.mood}
                  </span>
                </div>
                <div className="px-5 pb-5">

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {colProducts.map((p, i) => {
                    const isSelected = selected.includes(p.id);
                    const isHovered = hoveredId === p.id;
                    const key = normalizeNom(p.name);
                    const outOfStock = stockMap.size > 0 && (stockMap.get(key) ?? 100) === 0;
                    const isComingSoon = statusMap.size > 0 && statusMap.get(key) === 'prochainement';
                    const canSelect = !outOfStock && !isComingSoon && (selected.length < 5 || isSelected);
                    const perfumeTheme = perfumeThemes[p.id];

                    const bg = isSelected
                      ? perfumeTheme?.selectedBg || collectionTheme.fallbackBg
                      : isHovered
                      ? perfumeTheme?.hoverBg || collectionTheme.hoverBg
                      : 'var(--c-bg7)';

                    const borderColor = isSelected || isHovered
                      ? perfumeTheme?.borderColor || col.colors.accent
                      : 'var(--c-w06)';

                    const textColor = isSelected
                      ? perfumeTheme?.textColor || collectionTheme.baseText
                      : isHovered
                      ? perfumeTheme?.hoverTextColor || collectionTheme.hoverText
                      : 'hsl(var(--foreground))';

                    const subTextColor = isSelected
                      ? perfumeTheme?.subTextColor || collectionTheme.baseSubText
                      : isHovered
                      ? perfumeTheme?.hoverSubTextColor || collectionTheme.hoverSubText
                      : 'var(--c-w35)';

                    return (
                      <motion.button
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => canSelect && togglePerfume(p.id)}
                        onMouseEnter={() => canSelect && setHoveredId(p.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="relative text-center overflow-hidden rounded transition-all duration-500 group"
                        style={{
                          minHeight: '120px',
                          padding: '1.25rem 1rem',
                          border: `1px solid ${borderColor}`,
                          background: bg,
                          cursor: canSelect ? 'pointer' : 'not-allowed',
                          opacity: !canSelect ? 0.35 : 1,
                          boxShadow:
                            isSelected || isHovered
                              ? `0 0 0 1px ${borderColor}20 inset`
                              : 'none',
                        }}
                      >
                        {isSelected && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: perfumeTheme?.borderColor || col.colors.accent }}
                          >
                            <Check
                              className="w-3 h-3"
                              style={{
                                color: colId === 'umbrae' ? '#140A08' : '#000',
                              }}
                            />
                          </div>
                        )}

                        {outOfStock && (
                          <div
                            className="absolute inset-x-0 bottom-0 py-1 text-center"
                            style={{ background: 'rgba(0,0,0,0.55)' }}
                          >
                            <span className="font-body text-[9px] uppercase tracking-widest text-white/60">
                              Rupture
                            </span>
                          </div>
                        )}

                        {isComingSoon && (
                          <div
                            className="absolute inset-0 flex items-center justify-center rounded"
                            style={{ backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.5)' }}
                          >
                            <span className="font-body text-[9px] uppercase tracking-widest text-white/70">
                              Prochainement
                            </span>
                          </div>
                        )}

                        <span
                          className="relative z-10 font-display text-base block mb-1 transition-colors duration-500"
                          style={{ color: textColor }}
                        >
                          {p.name}
                        </span>

                        <span
                          className="relative z-10 font-body text-[10px] leading-relaxed block transition-colors duration-500"
                          style={{ color: subTextColor }}
                        >
                          {p.tagline}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default DiscoveryBox;