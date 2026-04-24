import type { Collection } from './products';

export const collectionStories: Record<Collection, { title: string; paragraphs: string[] }> = {
  sacrae: {
    title: 'La tentation incarnée',
    paragraphs: [
      "SACRÆ est née d'un désir qu'on n'explique pas.\nUne chaleur lente, presque interdite, qui s'installe sans prévenir.",
      "Ici, le sucre n'est pas innocent.\nIl est dense, profond, presque brûlant.",
      "Vanille noire. Caramel ambré. Fève tonka.\nDes matières qui enveloppent, qui retiennent, qui marquent.",
      "SACRÆ ne cherche pas à plaire.\nElle cherche à faire rester.",
    ],
  },
  vitae: {
    title: "L'élan vital",
    paragraphs: [
      "VITÆ est mouvement.\nUne énergie brute, libre, presque incontrôlable.",
      "Les fruits éclatent avant même d'être touchés.\nFramboise, mangue, cassis, passion.",
      "Tout est vif, juteux, immédiat.\nPuis vient le calme, lent, presque sensuel.",
      "VITÆ attire sans prévenir.\nEt disparaît avant d'être comprise.",
    ],
  },
  umbrae: {
    title: 'La profondeur silencieuse',
    paragraphs: [
      "UMBRÆ ne se révèle pas.\nElle s'impose.",
      "Une matière sombre, dense, presque minérale.\nOud, encens, ambre, musc.",
      "Ce n'est pas une lumière.\nC'est une présence.",
      "UMBRÆ ne parle pas fort.\nMais elle reste longtemps.",
    ],
  },
  nerolae: {
    title: "L'élégance absolue",
    paragraphs: [
      "NEROLÆ est une fleur qui ne tombe pas.\nElle s'impose dans l'air, douce et irrésistible.",
      "Rose de Damas. Néroli. Jasmin absolu.\nDes pétales qui vibrent entre Orient et Occident.",
      "Tout est délicat, mais rien n'est fragile.\nC'est la force tranquille de l'élégance.",
      "NEROLÆ ne s'oublie pas.\nElle laisse une trace que le temps ne peut effacer.",
    ],
  },
  aera: {
    title: 'Le luxe du silence',
    paragraphs: [
      "ÆRA est née d'un vide.\nCelui qu'on choisit, qu'on cultive, qu'on protège.",
      "Ici, rien n'est de trop.\nMusc blanc, coton propre, bois de cachemire.",
      "La pureté n'est pas l'absence.\nC'est une présence silencieuse, absolue.",
      "ÆRA ne dit rien.\nMais on la sent, longtemps après que quelqu'un est parti.",
    ],
  },
};
