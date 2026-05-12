// Maps French perfume note names to English Unsplash search keywords
// Order matters: most specific regex first

const keywordMap: [RegExp, string][] = [
  // ── Floraux ──
  [/rose de bulgarie|rose de damas|rose absolue|rose/i, 'rose flower macro pink'],
  [/jasmin absolu d.egypte|jasmin absolu|jasmin vintage|jasmin/i, 'jasmine flower white'],
  [/iris absolu|iris/i, 'iris flower purple'],
  [/tubéreuse|tubereuse/i, 'tuberose white flower'],
  [/fleur d.oranger|néroli|neroli/i, 'orange blossom white flower'],
  [/ylang-ylang|ylang/i, 'ylang ylang yellow flower'],
  [/violette/i, 'violet flower purple'],
  [/feuille de violette/i, 'violet leaf green'],
  [/gardénia|gardenia/i, 'gardenia white flower'],
  [/géranium|geranium/i, 'geranium pink flower'],
  [/lys/i, 'white lily flower'],
  [/fleur de tiaré|tiaré/i, 'white tropical gardenia flower'],
  [/fleur de frangipanier|frangipanier/i, 'plumeria white pink'],
  [/héliotrope|heliotrope/i, 'heliotrope purple flower'],
  [/osmanthus/i, 'osmanthus orange blossom'],
  [/immortelle/i, 'helichrysum yellow flower'],
  [/accord floral blanc|fleurs blanches/i, 'white flowers bouquet'],
  [/notes florales/i, 'tropical flowers exotic'],

  // ── Agrumes ──
  [/bergamote italienne|bergamote de calabre|bergamote/i, 'bergamot orange citrus'],
  [/cédrat|cedrat/i, 'citron yellow thick rind citrus'],
  [/citron vert/i, 'lime green citrus sliced'],
  [/citron/i, 'lemon yellow citrus'],
  [/mandarine d.italie|mandarine/i, 'mandarin orange fruit'],
  [/pamplemousse/i, 'grapefruit pink sliced'],
  [/orange de sicile|orange/i, 'orange fruit'],
  [/aldéhydes|aldehydes/i, 'soap bubbles white clean'],

  // ── Fruits ──
  [/fraise des bois/i, 'wild strawberry tiny red'],
  [/fraise/i, 'strawberry red fresh'],
  [/framboise/i, 'raspberry red berry'],
  [/pêche|peche/i, 'peach fruit yellow'],
  [/poire/i, 'pear green yellow fruit'],
  [/cerise/i, 'cherry red fruit'],
  [/cassis/i, 'blackcurrant dark berry'],
  [/mûre|mure/i, 'blackberry dark fruit'],
  [/figue/i, 'fig fruit cut purple'],
  [/ananas/i, 'pineapple yellow fruit'],
  [/mangue/i, 'mango tropical orange fruit'],
  [/noix de coco/i, 'coconut split white'],
  [/fruits exotiques/i, 'tropical exotic fruits'],

  // ── Épices ──
  [/cannelle de ceylan|cannelle/i, 'cinnamon sticks spice'],
  [/cardamome/i, 'cardamom green pods spice'],
  [/poivre noir/i, 'black pepper close'],
  [/poivre rose/i, 'pink pepper berries'],
  [/poivre/i, 'pepper spice'],
  [/gingembre/i, 'ginger root fresh'],
  [/safran/i, 'saffron golden threads'],
  [/muscade/i, 'nutmeg spice'],
  [/clou de girofle|girofle/i, 'clove spice dark'],

  // ── Boisés ──
  [/santal de mysore|santal blanc|santal crémeux|bois de santal|accord santal|santal/i, 'sandalwood chips aromatic'],
  [/cèdre de virginie/i, 'cedar wood chips pale'],
  [/cèdre|cedre/i, 'cedar tree bark brown'],
  [/vétiver bourbon|vétiver|vetiver/i, 'vetiver grass roots'],
  [/patchouli d.indonésie|patchouli/i, 'patchouli plant green leaves'],
  [/bois d.amyris|amyris/i, 'white wood aromatic'],
  [/bois de gaïac|gaïac|gaiac/i, 'dark resin wood brown'],
  [/bois d.akigala/i, 'exotic dark wood texture'],
  [/bois ambré|bois ambrés/i, 'amber resin warm golden'],
  [/oud du vietnam|oud fruité|oud/i, 'agarwood oud dark chips'],
  [/daim/i, 'suede leather soft brown'],
  [/cuir de russie|cuir/i, 'leather dark texture close'],

  // ── Résines & orientaux ──
  [/olibanum/i, 'frankincense resin white drops'],
  [/encens/i, 'incense frankincense resin'],
  [/benjoin/i, 'benzoin resin amber brown'],
  [/ambre gris/i, 'ambergris ocean sea'],
  [/ambre floral|ambre/i, 'amber golden resin warm'],
  [/ciste/i, 'cistus rockrose pink flower'],
  [/ambroxan/i, 'ocean sea spray foam'],
  [/résine|résines/i, 'dark resin drops'],

  // ── Gourmands ──
  [/vanille de madagascar|vanille noire|vanille douce|vanille/i, 'vanilla bean pods dark'],
  [/absolu de fève de tonka|fève de tonka brésilienne|fève de tonka absolue|fève de tonka/i, 'tonka bean brown pods'],
  [/caramel toffee|caramel/i, 'caramel golden sauce sweet'],
  [/cacao/i, 'cacao cocoa beans dark'],
  [/miel/i, 'honey golden drip jar'],
  [/pistache/i, 'pistachio green nuts'],
  [/amande pralinée|amande grillée|amande/i, 'almond nuts roasted brown'],
  [/rhum/i, 'rum dark liquid glass'],
  [/sucre vanillé|sucre/i, 'vanilla sugar white'],
  [/accord lacté|lacté/i, 'milk cream white pour'],
  [/mystikal/i, 'white musk soft fabric'],
  [/ambrette/i, 'ambrette seed flower musk'],

  // ── Muscs & neutres ──
  [/musc blanc|muscs blancs|musc crémeux|musc sensuel|musc/i, 'white cotton fabric soft clean'],
  [/thé noir chinois|thé noir|thé/i, 'black tea leaves dry'],
  [/tabac absolu des balkans|tabac/i, 'tobacco leaves dry brown'],
  [/notes marines/i, 'ocean sea blue waves'],
  [/notes minérales/i, 'grey stone mineral rock'],
  [/notes poudrées/i, 'powder blush cosmetic soft'],
  [/accord santal/i, 'sandalwood chips warm'],
];

export function getNoteKeyword(noteName: string): string {
  for (const [regex, keyword] of keywordMap) {
    if (regex.test(noteName)) return keyword;
  }
  // Generic fallback based on first word
  return noteName.split(' ')[0];
}

// Broader fallback keyword if primary search returns 0 results
export function getNoteFallbackKeyword(noteName: string): string {
  const lower = noteName.toLowerCase();
  if (/fleur|rose|jasmin|iris|lys|gardenia|violette|orchidée/.test(lower)) return 'flower macro close';
  if (/fruit|fraise|framboise|pêche|poire|cerise|mangue|ananas/.test(lower)) return 'fresh fruit colorful';
  if (/bois|santal|cèdre|gaïac|oud|vétiver/.test(lower)) return 'aromatic wood dark';
  if (/épice|cannelle|cardamome|poivre|gingembre|safran/.test(lower)) return 'spice aromatic';
  if (/résine|encens|benjoin|ambre|olibanum/.test(lower)) return 'resin amber golden';
  if (/musc|accord|note/.test(lower)) return 'soft white cotton clean';
  if (/vanille|caramel|miel|sucre|cacao/.test(lower)) return 'sweet ingredient food';
  if (/agrume|citron|orange|bergamote|mandarine|pamplemousse/.test(lower)) return 'citrus fruit fresh';
  return 'botanical ingredient nature';
}
