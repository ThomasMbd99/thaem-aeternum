export interface ParfumTheme {
  accent: string;
  secondary: string;
  bg: string;
  rgb: string;
  marbleSeed: number;
  marbleColors: [string, string, string];
}

const parfumThemes: Record<string, ParfumTheme> = {
  // ── VITÆ ──
  naeva: {
    accent: '#7B7FD9',
    secondary: '#2A38CC',
    bg: '#10163A',
    rgb: '123, 127, 217',
    marbleSeed: 12,
    marbleColors: ['#2A38CC', '#7B7FD9', '#B8BCF0'],
  },
  koyaen: {
    accent: '#4EB5BE',
    secondary: '#6BC44B',
    bg: '#0A2018',
    rgb: '78, 181, 190',
    marbleSeed: 7,
    marbleColors: ['#1E8C3A', '#4EB5BE', '#A8DDE0'],
  },
  ayaem: {
    accent: '#E04830',
    secondary: '#D4897A',
    bg: '#2A0808',
    rgb: '224, 72, 48',
    marbleSeed: 3,
    marbleColors: ['#CC2210', '#E04830', '#F0A898'],
  },
  espae: {
    accent: '#C4185A',
    secondary: '#8C1D70',
    bg: '#200818',
    rgb: '196, 24, 90',
    marbleSeed: 18,
    marbleColors: ['#8C0050', '#C4185A', '#E07899'],
  },

  // ── SACRÆ ──
  lamae: {
    accent: '#9FB492',
    secondary: '#5e6d57',
    bg: '#2E362A',
    rgb: '159, 180, 146',
    marbleSeed: 9,
    marbleColors: ['#3E4A38', '#5e6d57', '#A8BC9C'],
  },
  almae: {
    accent: '#9C8259',
    secondary: '#d2c8b6',
    bg: '#B8A98C',
    rgb: '156, 130, 89',
    marbleSeed: 14,
    marbleColors: ['#B8A98C', '#d2c8b6', '#EAE3D6'],
  },
  varkaem: {
    accent: '#B5AEA0',
    secondary: '#757063',
    bg: '#38352E',
    rgb: '181, 174, 160',
    marbleSeed: 21,
    marbleColors: ['#38352E', '#757063', '#B5AEA0'],
  },
  velae: {
    accent: '#C9AD8C',
    secondary: '#6f5a46',
    bg: '#352B21',
    rgb: '201, 173, 140',
    marbleSeed: 5,
    marbleColors: ['#352B21', '#6f5a46', '#C9AD8C'],
  },
  zaemyr: {
    accent: '#5A92AE',
    secondary: '#c1dcea',
    bg: '#8FB8CF',
    rgb: '90, 146, 174',
    marbleSeed: 16,
    marbleColors: ['#8FB8CF', '#c1dcea', '#DCEBF3'],
  },

  // ── UMBRÆ ──
  aeonis: {
    accent: '#C4B6B7',
    secondary: '#9c8b8c',
    bg: '#2E2729',
    rgb: '196, 182, 183',
    marbleSeed: 11,
    marbleColors: ['#2E2729', '#9c8b8c', '#C4B6B7'],
  },
  valaena: {
    accent: '#8FA0AE',
    secondary: '#5c6976',
    bg: '#2C333A',
    rgb: '143, 160, 174',
    marbleSeed: 19,
    marbleColors: ['#2C333A', '#5c6976', '#8FA0AE'],
  },
  aelia: {
    accent: '#5A7FD6',
    secondary: '#83a8fb',
    bg: '#DCE6FE',
    rgb: '90, 127, 214',
    marbleSeed: 6,
    marbleColors: ['#5A7FD6', '#83a8fb', '#DCE6FE'],
  },
  azrae: {
    accent: '#6F9685',
    secondary: '#aec9c0',
    bg: '#DCEAE4',
    rgb: '111, 150, 133',
    marbleSeed: 23,
    marbleColors: ['#6F9685', '#aec9c0', '#DCEAE4'],
  },

  // ── NEROLÆ ──
  osae: {
    accent: '#E87946',
    secondary: '#fa9f73',
    bg: '#FCE6D9',
    rgb: '232, 121, 70',
    marbleSeed: 8,
    marbleColors: ['#E87946', '#fa9f73', '#FCE6D9'],
  },
  saeny: {
    accent: '#D6839A',
    secondary: '#eeb7c4',
    bg: '#FBEBEF',
    rgb: '214, 131, 154',
    marbleSeed: 17,
    marbleColors: ['#D6839A', '#eeb7c4', '#FBEBEF'],
  },
  laeya: {
    accent: '#8AD2DE',
    secondary: '#53b9cb',
    bg: '#0F2A30',
    rgb: '138, 210, 222',
    marbleSeed: 4,
    marbleColors: ['#0F2A30', '#53b9cb', '#8AD2DE'],
  },
  naely: {
    accent: '#D88AEE',
    secondary: '#a638c0',
    bg: '#2A0E33',
    rgb: '216, 138, 238',
    marbleSeed: 22,
    marbleColors: ['#2A0E33', '#a638c0', '#D88AEE'],
  },
  'noctae-rosa': {
    accent: '#9C7488',
    secondary: '#ceacbc',
    bg: '#F2E6EC',
    rgb: '156, 116, 136',
    marbleSeed: 13,
    marbleColors: ['#9C7488', '#ceacbc', '#F2E6EC'],
  },

  // ── ÆRA ──
  vaem: {
    accent: '#6F9FE0',
    secondary: '#c7dfff',
    bg: '#EAF2FF',
    rgb: '111, 159, 224',
    marbleSeed: 2,
    marbleColors: ['#6F9FE0', '#c7dfff', '#EAF2FF'],
  },
  lysae: {
    accent: '#7CC468',
    secondary: '#ddfad1',
    bg: '#EEFCE8',
    rgb: '124, 196, 104',
    marbleSeed: 20,
    marbleColors: ['#7CC468', '#ddfad1', '#EEFCE8'],
  },
  taelya: {
    accent: '#E0A350',
    secondary: '#ffd699',
    bg: '#FFF1DE',
    rgb: '224, 163, 80',
    marbleSeed: 10,
    marbleColors: ['#E0A350', '#ffd699', '#FFF1DE'],
  },
  thaely: {
    accent: '#E0C24E',
    secondary: '#ffeb99',
    bg: '#FFF8DE',
    rgb: '224, 194, 78',
    marbleSeed: 15,
    marbleColors: ['#E0C24E', '#ffeb99', '#FFF8DE'],
  },
};

export function getParfumTheme(id: string): ParfumTheme | null {
  return parfumThemes[id] ?? null;
}
