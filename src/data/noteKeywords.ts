// Maps French perfume note names to English Unsplash search keywords

const keywordMap: [RegExp, string][] = [
  // Floraux
  [/rose de bulgarie|rose de damas|rose absolue|rose/i, 'rose flower macro pink'],
  [/jasmin absolu|jasmin vintage|jasmin/i, 'jasmine flower white'],
  [/iris absolu|iris/i, 'iris flower purple'],
  [/tubéreuse|tubereuse/i, 'tuberose flower white'],
  [/néroli|neroli|fleur d.oranger/i, 'orange blossom flower white'],
  [/ylang-ylang|ylang/i, 'ylang ylang flower yellow'],
  [/violette/i, 'violet flower purple'],
  [/feuille de violette/i, 'violet leaf green'],
  [/gardénia|gardenia/i, 'gardenia white flower'],
  [/géranium|geranium/i, 'geranium pink flower'],
  [/lys/i, 'lily white flower'],
  [/fleur de tiaré|tiaré/i, 'tiare tahiti flower'],
  [/fleur de frangipanier|frangipanier/i, 'frangipani plumeria flower'],
  [/héliotrope|heliotrope/i, 'heliotrope purple flower'],
  [/osmanthus/i, 'osmanthus orange flower'],
  [/immortelle/i, 'helichrysum yellow flower'],
  [/fleurs blanches|accord floral blanc|notes florales/i, 'white flowers bouquet'],

  // Agrumes
  [/bergamote italienne|bergamote de calabre|bergamote/i, 'bergamot citrus fruit'],
  [/citron vert/i, 'lime green citrus'],
  [/citron/i, 'lemon yellow citrus'],
  [/mandarine d.italie|mandarine/i, 'mandarin orange fruit'],
  [/pamplemousse/i, 'grapefruit pink slice'],
  [/orange de sicile|orange/i, 'orange fruit'],
  [/aldéhydes|aldehydes/i, 'soap bubbles clean white'],

  // Fruits
  [/fraise des bois/i, 'wild strawberry small red'],
  [/fraise/i, 'strawberry red fresh'],
  [/framboise/i, 'raspberry red berry'],
  [/pêche|peche/i, 'peach fruit yellow'],
  [/poire/i, 'pear green fruit'],
  [/cerise/i, 'cherry red fruit'],
  [/cassis/i, 'blackcurrant berry dark'],
  [/mûre|mure/i, 'blackberry fruit dark'],
  [/figue/i, 'fig fruit cut'],
  [/ananas/i, 'pineapple tropical'],
  [/mangue/i, 'mango tropical fruit'],
  [/noix de coco/i, 'coconut open tropical'],
  [/fruits exotiques/i, 'tropical exotic fruits'],

  // Épices
  [/cannelle/i, 'cinnamon sticks spice'],
  [/cardamome/i, 'cardamom green pods'],
  [/poivre noir/i, 'black pepper ground'],
  [/poivre rose/i, 'pink pepper berries'],
  [/poivre/i, 'pepper spice'],
  [/gingembre/i, 'ginger root fresh'],
  [/safran/i, 'saffron threads golden'],

  // Boisés
  [/santal de mysore|santal blanc|santal crémeux|bois de santal|accord santal|santal/i, 'sandalwood chips fragrant'],
  [/cèdre de virginie/i, 'cedar wood chips'],
  [/cèdre|cedre/i, 'cedar bark wood'],
  [/vétiver bourbon|vétiver|vetiver/i, 'vetiver grass roots'],
  [/patchouli d.indonésie|patchouli/i, 'patchouli plant leaves'],
  [/bois d.amyris|amyris/i, 'white amyris wood'],
  [/bois de gaïac|gaïac|gaiac/i, 'guaiac wood bark'],
  [/bois d.akigala/i, 'exotic wood texture'],
  [/bois ambré|bois ambrés/i, 'amber resin golden warm'],
  [/oud du vietnam|oud fruité|oud/i, 'oud agarwood chips'],
  [/daim/i, 'suede leather soft texture'],
  [/cuir de russie|cuir/i, 'leather dark texture'],

  // Résines & orientaux
  [/encens/i, 'frankincense incense resin'],
  [/benjoin/i, 'benzoin resin amber brown'],
  [/ambre gris/i, 'ambergris sea ocean'],
  [/ambre floral|ambre/i, 'amber resin golden'],
  [/ciste/i, 'cistus rockrose flower pink'],
  [/ambroxan/i, 'ocean sea spray'],

  // Gourmands
  [/vanille de madagascar|vanille noire|vanille douce|absolu de fève de tonka|vanille/i, 'vanilla beans pods dark'],
  [/fève de tonka brésilienne|fève de tonka absolue|fève de tonka|tonka/i, 'tonka bean brown pods'],
  [/caramel toffee|caramel/i, 'caramel golden sauce'],
  [/cacao/i, 'cacao cocoa beans dark'],
  [/miel/i, 'honey golden jar drip'],
  [/pistache/i, 'pistachio nuts green'],
  [/amande pralinée|amande grillée|amande/i, 'almond nuts roasted'],
  [/rhum/i, 'rum dark bottle glass'],
  [/sucre vanillé|sucre/i, 'sugar vanilla white'],
  [/accord lacté|lacté|mystikal/i, 'milk cream white pour'],

  // Muscs & neutres
  [/musc blanc|muscs blancs|musc crémeux|musc sensuel|musc blanc|musc/i, 'white fabric soft light'],
  [/thé noir|thé/i, 'black tea leaves dry'],
  [/tabac absolu des balkans|tabac/i, 'tobacco leaves dry brown'],
  [/notes marines/i, 'ocean sea waves blue'],
  [/notes minérales/i, 'mineral stone grey rock'],
  [/notes poudrées/i, 'powder cosmetic soft pink'],
];

export function getNoteKeyword(noteName: string): string {
  for (const [regex, keyword] of keywordMap) {
    if (regex.test(noteName)) return keyword;
  }
  return noteName;
}
