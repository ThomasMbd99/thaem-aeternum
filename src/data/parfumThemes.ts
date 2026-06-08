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
};

export function getParfumTheme(id: string): ParfumTheme | null {
  return parfumThemes[id] ?? null;
}
