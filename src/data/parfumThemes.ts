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
};

export function getParfumTheme(id: string): ParfumTheme | null {
  return parfumThemes[id] ?? null;
}
