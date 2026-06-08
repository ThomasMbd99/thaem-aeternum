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
};

export function getParfumTheme(id: string): ParfumTheme | null {
  return parfumThemes[id] ?? null;
}
