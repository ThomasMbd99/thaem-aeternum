// Maps note names to local image files in /public/notes/
// Fallback: uses the closest matching note image

const NOTE_MAP: Record<string, string> = {
  // Floraux
  'rose': 'rose', 'rose absolue': 'rose-absolue',
  'rose de bulgarie': 'rose-de-bulgarie', 'rose de damas': 'rose-de-damas',
  'jasmin': 'jasmin', 'jasmin vintage': 'jasmin-vintage',
  "jasmin absolu d'egypte": 'jasmin-absolu-egypte', 'jasmin absolu': 'jasmin-absolu-egypte',
  'iris': 'iris', 'iris absolu': 'iris-absolu',
  'tubéreuse': 'tubereuse', 'tubereuse': 'tubereuse',
  "fleur d'oranger": 'fleur-oranger', 'néroli': 'neroli', 'neroli': 'neroli',
  'ylang-ylang': 'ylang-ylang',
  'violette': 'violette', 'feuille de violette': 'feuille-de-violette',
  'gardénia': 'gardenia', 'gardenia': 'gardenia',
  'géranium': 'geranium', 'geranium': 'geranium',
  'lys': 'lys',
  'fleur de tiaré': 'fleur-de-tiare', 'tiaré': 'fleur-de-tiare',
  'fleur de frangipanier': 'fleur-de-frangipanier', 'frangipanier': 'fleur-de-frangipanier',
  'héliotrope': 'heliotrope',
  'osmanthus': 'osmanthus',
  'immortelle': 'immortelle',

  // Agrumes
  'bergamote': 'bergamote', 'bergamote italienne': 'bergamote',
  'bergamote de calabre': 'bergamote-de-calabre',
  'citron': 'citron', 'citron vert': 'citron-vert',
  'cédrat': 'cedrat',
  'mandarine': 'mandarine', "mandarine d'italie": 'mandarine-italie',
  'pamplemousse': 'pamplemousse',
  'orange': 'orange-de-sicile', 'orange de sicile': 'orange-de-sicile',

  // Fruits
  'fraise': 'fraise', 'fraise des bois': 'fraise-des-bois',
  'framboise': 'framboise',
  'pêche': 'peche', 'peche': 'peche',
  'poire': 'poire',
  'cerise': 'cerise',
  'cassis': 'cassis',
  'mûre': 'mure', 'mure': 'mure',
  'figue': 'figue',
  'ananas': 'ananas',
  'mangue': 'mangue',
  'noix de coco': 'noix-de-coco',
  'fruits exotiques': 'fruits-exotiques',

  // Épices
  'cannelle': 'cannelle', 'cannelle de ceylan': 'cannelle',
  'cardamome': 'cardamome',
  'poivre rose': 'poivre-rose', 'poivre noir': 'poivre-noir', 'poivre': 'poivre-noir',
  'gingembre': 'gingembre',
  'safran': 'safran',

  // Boisés
  'santal': 'santal', 'santal blanc': 'santal', 'santal de mysore': 'santal',
  'santal crémeux': 'santal', 'bois de santal': 'santal',
  'cèdre': 'cedre', 'cedre': 'cedre', 'cèdre de virginie': 'cedre',
  'vétiver': 'vetiver', 'vetiver': 'vetiver', 'vétiver bourbon': 'vetiver',
  'patchouli': 'patchouli', "patchouli d'indonésie": 'patchouli',
  'amyris': 'amyris', "bois d'amyris": 'amyris',
  'gaïac': 'gaiac', 'bois de gaïac': 'gaiac',
  'oud': 'oud', 'oud du vietnam': 'oud', 'oud fruité': 'oud',
  'cuir': 'cuir', 'cuir de russie': 'cuir',
  'daim': 'daim',
  'bois ambré': 'ambre', 'bois ambrés': 'ambre',
  "bois d'akigala": 'bois',
  'bois': 'bois', 'bois crémeux': 'bois-cremeux',
  'sapin baumier': 'sapin-baumier',
  'chouchou': 'chouchou',
  'mahonial': 'mahonial',
  'oud du vietnam': 'oud-du-vietnam',

  // Résines
  'encens': 'encens',
  'olibanum': 'olibanum',
  'benjoin': 'benjoin',
  'ambre gris': 'ambre-gris',
  'ambre': 'ambre', 'ambre floral': 'ambre',
  'ciste': 'ciste',
  'ambroxan': 'ambroxan',

  // Gourmands
  'vanille': 'vanille', 'vanille de madagascar': 'vanille',
  'vanille douce': 'vanille', 'vanille noire': 'vanille',
  'fève de tonka': 'feve-de-tonka', 'fève de tonka absolue': 'feve-de-tonka',
  'fève de tonka brésilienne': 'feve-de-tonka',
  'absolu de fève de tonka': 'feve-de-tonka',
  'caramel': 'caramel', 'caramel toffee': 'caramel-toffee',
  'miel': 'miel',
  'pistache': 'pistache',
  'amande': 'amande', 'amande grillée': 'amande', 'amande pralinée': 'amande-pralinee',
  'cacao': 'cacao',
  'rhum': 'rhum',
  'sucre vanillé': 'vanille',

  // Muscs & neutres
  'musc': 'musc', 'musc blanc': 'musc-blanc', 'muscs blancs': 'musc-blanc',
  'musc crémeux': 'musc', 'musc sensuel': 'musc',
  'accord lacté': 'lait', 'lait': 'lait', 'mystikal': 'musc',
  'ambrette': 'ambrette',
  'thé noir': 'the-noir', 'thé noir chinois': 'the-noir',
  'tabac': 'tabac', 'tabac absolu des balkans': 'tabac',
  'notes marines': 'notes-marines',
  'notes minérales': 'notes-marines',
  'notes poudrées': 'notes-poudrées',
  'accord floral blanc': 'fleur-oranger',
  'fleurs blanches': 'fleur-oranger',
  'notes florales exotiques': 'fruits-exotiques',
  'aldéhydes': 'musc-blanc',
  'accord santal': 'santal',
  'mahonial': 'ambre',

  // Nouveaux ajouts
  'épices': 'epices', 'epices': 'epices',
  'café': 'cafe', 'cafe': 'cafe',
  'coriandre': 'coriandre',
  'eau de mer': 'eau-de-mer', 'notes aquatiques': 'eau-de-mer',
  'fruit du dragon': 'fruit-du-dragon', 'pitaya': 'fruit-du-dragon',
  'muguet': 'muguet',
  'notes de fleurs exotiques': 'notes-de-fleurs-exotiques',
  'fleurs exotiques': 'notes-de-fleurs-exotiques',
  'pois de senteur': 'pois-de-senteur',
  'pomme granny smith': 'pomme-granny-smith', 'pomme verte': 'pomme-granny-smith', 'granny smith': 'pomme-granny-smith',
  'œillet': 'oeillet', 'oeillet': 'oeillet',
  'fruit de la passion': 'fruit-de-la-passion', 'fruits de la passion': 'fruit-de-la-passion', 'passion': 'fruit-de-la-passion',
};

export function getNoteImagePath(noteName: string): string {
  const key = noteName.toLowerCase().trim()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents for matching
    .replace(/[̀-ͯ]/g, '');

  // Try with accents first (original)
  const original = noteName.toLowerCase().trim();
  if (NOTE_MAP[original]) return `/notes/${NOTE_MAP[original]}.jpg`;

  // Try without accents
  for (const [mapKey, file] of Object.entries(NOTE_MAP)) {
    const normalizedKey = mapKey.normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (normalizedKey === key || key.includes(normalizedKey) || normalizedKey.includes(key)) {
      return `/notes/${file}.jpg`;
    }
  }

  // Last resort: first word match
  const firstWord = key.split(' ')[0];
  for (const [mapKey, file] of Object.entries(NOTE_MAP)) {
    if (mapKey.includes(firstWord)) return `/notes/${file}.jpg`;
  }

  return '';
}
