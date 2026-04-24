export type Collection = 'sacrae' | 'vitae' | 'umbrae' | 'nerolae' | 'aera';

export interface Note {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  collection: Collection;
  tagline: string;
  inspiration?: string;
  notes: Note;
}

export interface CollectionInfo {
  id: Collection;
  name: string;
  displayName: string;
  category: string;
  description: string;
  mood: string;
  colors: {
    accent: string;
    bg: string;
    text: string;
  };
}

export const collections: CollectionInfo[] = [
  {
    id: 'sacrae',
    name: 'SACRÆ',
    displayName: 'SACR<span class="ae-highlight">Æ</span>',
    category: 'Gourmande & Sucrée',
    description: 'La gourmandise y prend une forme plus profonde, plus dense, presque envoûtante.',
    mood: 'Douce, chaleureuse, enveloppante',
    colors: { accent: '#C4956A', bg: '#F5F0E1', text: '#3D2B1F' },
  },
  {
    id: 'vitae',
    name: 'VITÆ',
    displayName: 'VIT<span class="ae-highlight">Æ</span>',
    category: 'Fruitée & Fraîche',
    description: "Le fruit y pulse comme une lumière vive, libre et insaisissable.",
    mood: 'Vivante, énergique, solaire',
    colors: { accent: '#FF6B2B', bg: '#FFF5EE', text: '#3A1500' },
  },
  {
    id: 'umbrae',
    name: 'UMBRÆ',
    displayName: 'UMBR<span class="ae-highlight">Æ</span>',
    category: 'Boisée & Intense',
    description: "L'ombre y rencontre la chaleur dans une profondeur calme et souveraine.",
    mood: 'Mystérieuse, envoûtante, profonde',
    colors: { accent: '#8B6914', bg: '#1A1210', text: '#D4B896' },
  },
  {
    id: 'nerolae',
    name: 'NEROLÆ',
    displayName: 'NEROL<span class="ae-highlight">Æ</span>',
    category: 'Florale & Orientale',
    description: "La fleur s'impose dans l'air, douce et irrésistible, entre Orient et Occident.",
    mood: 'Élégante, romantique, envoûtante',
    colors: { accent: '#F0A0B8', bg: '#FFF5F8', text: '#4A2030' },
  },
  {
    id: 'aera',
    name: 'ÆRA',
    displayName: '<span class="ae-highlight">Æ</span>RA',
    category: 'Propre & Minimaliste',
    description: 'La pureté devient un luxe silencieux, aérien et souverain.',
    mood: 'Pure, aérienne, lumineuse',
    colors: { accent: '#A8D4F0', bg: '#F5FAFF', text: '#1A2A3A' },
  },
];

export const products: Product[] = [

  // ── SACRÆ — Gourmande & Sucrée ──

  {
    id: 'zaemyr',
    name: 'ZÆMYR',
    collection: 'sacrae',
    tagline: 'Miel de pistache, fleur d\'oranger, vanille royale',
    inspiration: 'Baklava Royal – Navitus',
    notes: {
      top: ['Fleur d\'oranger', 'Bergamote italienne'],
      heart: ['Pistache', 'Amande grillée', 'Miel'],
      base: ['Vanille de Madagascar', 'Bois ambré', 'Fève de tonka brésilienne'],
    },
  },
  {
    id: 'lamae',
    name: 'LAMÆ',
    collection: 'sacrae',
    tagline: 'Caramel toffee, fève tonka absolue, santal crémeux',
    inspiration: 'Kryptonite Absolue – Khalil T.',
    notes: {
      top: ['Caramel toffee', 'Absolu de fève de tonka'],
      heart: ['Iris absolu', 'Santal blanc'],
      base: ['Amande pralinée', 'Musc crémeux'],
    },
  },
  {
    id: 'almae',
    name: 'ALMÆ',
    collection: 'sacrae',
    tagline: 'Lait lacté, tubéreuse indolente, vanille et cacao',
    inspiration: 'Blanche Bête – Les Liquides Imaginaires',
    notes: {
      top: ['Accord lacté', 'Ambrette', 'Mystikal'],
      heart: ['Tubéreuse', 'Jasmin vintage', 'Encens'],
      base: ['Vanille', 'Cacao', 'Musc'],
    },
  },
  {
    id: 'velae',
    name: 'VELÆ',
    collection: 'sacrae',
    tagline: 'Tonka veloutée, rose absolue, tabac des Balkans',
    inspiration: 'Velvet Tonka – BDK',
    notes: {
      top: ['Fleur d\'oranger', 'Amande'],
      heart: ['Rose absolue', 'Tabac absolu des Balkans'],
      base: ['Fève de tonka absolue', 'Vanille de Madagascar', 'Bois d\'Amyris', 'Bois ambrés'],
    },
  },
  {
    id: 'varkaem',
    name: 'VARKÆM',
    collection: 'sacrae',
    tagline: 'Vanille spiritueuse, rhum exotique, rose de Bulgarie',
    inspiration: 'Spirituelle Double Vanille – Guerlain',
    notes: {
      top: ['Encens', 'Poivre rose', 'Bergamote'],
      heart: ['Cèdre', 'Ylang-ylang', 'Rose de Bulgarie', 'Jasmin'],
      base: ['Vanille de Madagascar', 'Benjoin', 'Rhum'],
    },
  },

  // ── VITÆ — Fruitée & Fraîche ──

  {
    id: 'espae',
    name: 'ESPÆ',
    collection: 'vitae',
    tagline: 'Baies rouges éclatantes, framboise vive, musc de patchouli',
    inspiration: 'Rouge Trafalgar – Dior',
    notes: {
      top: ['Fraise', 'Framboise', 'Mandarine', 'Cerise'],
      heart: ['Cassis', 'Pamplemousse'],
      base: ['Musc', 'Patchouli'],
    },
  },
  {
    id: 'koyaen',
    name: 'KOYÆN',
    collection: 'vitae',
    tagline: 'Ananas tropical, noix de coco crémeuse, musc solaire',
    inspiration: 'Pina Colada – Gulf Orchid',
    notes: {
      top: ['Ananas', 'Citron vert'],
      heart: ['Noix de coco', 'Fleur de tiaré'],
      base: ['Musc blanc', 'Vanille douce'],
    },
  },
  {
    id: 'ayaem',
    name: 'AYÆM',
    collection: 'vitae',
    tagline: 'Mangue juteuse, oud fruité, notes exotiques ensoleillées',
    inspiration: 'Mango Aoud – Gritti',
    notes: {
      top: ['Mangue', 'Fruits exotiques'],
      heart: ['Oud fruité', 'Fleur de frangipanier'],
      base: ['Musc blanc', 'Santal crémeux'],
    },
  },
  {
    id: 'naera',
    name: 'NÆRA',
    collection: 'vitae',
    tagline: 'Framboise épicée, rose flamboyante, poivre vibrant',
    inspiration: 'Flamenco – Ramon Monegal',
    notes: {
      top: ['Framboise', 'Poivre rose', 'Bergamote'],
      heart: ['Rose absolue', 'Géranium', 'Jasmin'],
      base: ['Patchouli', 'Musc', 'Santal'],
    },
  },

  // ── UMBRÆ — Boisée & Intense ──

  {
    id: 'aeonis',
    name: 'ÆONIS',
    collection: 'umbrae',
    tagline: 'Fraise vénéneuse, cuir sombre, caramel et cannelle',
    inspiration: 'Venom Incarnat – Stéphane Humbert Lucas 777',
    notes: {
      top: ['Fraise des bois', 'Fraise', 'Caramel', 'Mûre'],
      heart: ['Framboise', 'Cèdre de Virginie', 'Cannelle'],
      base: ['Cuir de Russie', 'Vanille noire', 'Patchouli', 'Fève de tonka'],
    },
  },
  {
    id: 'aelia',
    name: 'ÆLIA',
    collection: 'umbrae',
    tagline: 'Santal poudré, ambrette soyeuse, élégance parisienne',
    inspiration: 'Santal de Paris – Place de la Rêverie',
    notes: {
      top: ['Lys', 'Amyris'],
      heart: ['Notes poudrées', 'Ambrette', 'Santal de Mysore'],
      base: ['Santal', 'Vanille', 'Ambre', 'Ambroxan', 'Benjoin'],
    },
  },
  {
    id: 'valaena',
    name: 'VALÆNA',
    collection: 'umbrae',
    tagline: 'Cardamome épicée, iris poudré, santal et vétiver bourbon',
    inspiration: 'Gris Charnel – BDK',
    notes: {
      top: ['Cardamome', 'Figue', 'Thé noir'],
      heart: ['Iris absolu', 'Vétiver bourbon', 'Ciste'],
      base: ['Bois de santal', 'Vanille de Madagascar', 'Fève de tonka', 'Patchouli d\'Indonésie'],
    },
  },
  {
    id: 'azrae',
    name: 'AZRÆ',
    collection: 'umbrae',
    tagline: 'Rose de Damas, ambre nocturne, oud et poivre rose',
    inspiration: 'Ambre Nuit – Dior',
    notes: {
      top: ['Bergamote', 'Pamplemousse'],
      heart: ['Rose de Damas', 'Poivre rose'],
      base: ['Ambre gris', 'Gaïac', 'Cèdre', 'Patchouli'],
    },
  },

  // ── NEROLÆ — Florale & Orientale ──

  {
    id: 'alnae',
    name: 'ALNÆ',
    collection: 'nerolae',
    tagline: 'Violette marine, sucre vanillé, fleurs blanches célestes',
    inspiration: 'Celeste – Giardini Di Toscana',
    notes: {
      top: ['Notes marines', 'Citron vert'],
      heart: ['Violette', 'Framboise', 'Notes florales exotiques'],
      base: ['Sucre vanillé', 'Ambroxan'],
    },
  },
  {
    id: 'osae',
    name: 'OSÆ',
    collection: 'nerolae',
    tagline: 'Floral ambre sensuel, rose orientale, muscs soyeux',
    inspiration: 'Nº 5 Floral – Rosendo Mateu Olfactive',
    notes: {
      top: ['Rose', 'Fleurs blanches', 'Bergamote'],
      heart: ['Jasmin', 'Iris', 'Ambre floral'],
      base: ['Musc sensuel', 'Santal', 'Fève de tonka'],
    },
  },
  {
    id: 'laeya',
    name: 'LÆYA',
    collection: 'nerolae',
    tagline: 'Tubéreuse pêchée, jasmin enveloppant, vanille et vétiver',
    inspiration: 'Hundred Silent Ways – Nishane',
    notes: {
      top: ['Tubéreuse', 'Pêche', 'Mandarine'],
      heart: ['Gardénia', 'Jasmin', 'Iris'],
      base: ['Vanille', 'Santal', 'Vétiver'],
    },
  },
  {
    id: 'saen',
    name: 'SÆN',
    collection: 'nerolae',
    tagline: 'Rose des sables, oud précieux, safran doré et ambre gris',
    inspiration: 'Les Sables Roses – Louis Vuitton',
    notes: {
      top: ['Rose de Bulgarie'],
      heart: ['Poivre noir', 'Safran'],
      base: ['Oud', 'Ambre gris'],
    },
  },

  // ── ÆRA — Propre & Minimaliste ──

  {
    id: 'lysae',
    name: 'LYSÆ',
    collection: 'aera',
    tagline: 'Poire fraîche, jasmin délicat, oud du Vietnam et muscs',
    inspiration: 'Passion Riviera – Place de la Rêverie',
    notes: {
      top: ['Poire', 'Fleur d\'oranger', 'Héliotrope'],
      heart: ['Jasmin', 'Vanille', 'Rose de Damas'],
      base: ['Oud du Vietnam', 'Fève de tonka', 'Muscs blancs'],
    },
  },
  {
    id: 'vaem',
    name: 'VÆM',
    collection: 'aera',
    tagline: 'Fleurs aériennes, jasmin d\'Egypte, muscs blancs cristallins',
    inspiration: '724 – Maison Francis Kurkdjian',
    notes: {
      top: ['Aldéhydes', 'Bergamote de Calabre'],
      heart: ['Jasmin absolu d\'Egypte', 'Accord floral blanc'],
      base: ['Accord santal', 'Muscs blancs'],
    },
  },
  {
    id: 'thaely',
    name: 'THÆLY',
    collection: 'aera',
    tagline: 'Citron lumineux, néroli tunisien, thé noir et ambroxan',
    inspiration: 'Imagination – Louis Vuitton',
    notes: {
      top: ['Citron', 'Bergamote de Calabre', 'Orange de Sicile'],
      heart: ['Néroli', 'Gingembre', 'Cannelle'],
      base: ['Thé noir', 'Ambroxan', 'Bois de gaïac'],
    },
  },
  {
    id: 'taelya',
    name: 'TÆLYA',
    collection: 'aera',
    tagline: 'Mandarine safranée, daim minéral, immortelle cuivrée',
    inspiration: 'Ganymede – Marc-Antoine Barrois',
    notes: {
      top: ['Mandarine d\'Italie', 'Safran'],
      heart: ['Osmanthus de Chine', 'Immortelle', 'Feuille de violette'],
      base: ['Bois d\'Akigala', 'Daim', 'Notes minérales', 'Musc'],
    },
  },

];

export const formats = [
  { id: '10ml', label: '10ml', price: 10, description: 'Flacon voyage' },
  { id: '50ml', label: '50ml', price: 45, description: 'Flacon signature' },
  { id: 'recharge', label: 'Recharge 50ml', price: 35, description: 'Rechargez votre flacon', eco: true },
] as const;

export type FormatId = typeof formats[number]['id'];

export const getCollectionProducts = (collectionId: Collection) =>
  products.filter(p => p.collection === collectionId);

export const getCollection = (id: Collection) =>
  collections.find(c => c.id === id);

export const getProduct = (id: string) =>
  products.find(p => p.id === id);
