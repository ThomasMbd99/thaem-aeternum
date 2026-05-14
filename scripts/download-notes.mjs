import fs from 'fs';
import path from 'path';
import https from 'https';

const UNSPLASH_KEY = 'SmNfcCvPbLXzmUuHKNnqLUaGyNAistWlyWIQE4SFQq4';
const OUTPUT_DIR = './public/notes';

// All unique notes from products.ts + Supabase variants
const notes = [
  // Floraux
  "rose", "rose-absolue", "rose-de-bulgarie", "rose-de-damas",
  "jasmin", "jasmin-vintage", "jasmin-absolu-egypte",
  "iris", "iris-absolu",
  "tubereuse", "fleur-oranger", "neroli",
  "ylang-ylang", "violette", "feuille-de-violette",
  "gardenia", "geranium", "lys",
  "fleur-de-tiare", "fleur-de-frangipanier",
  "heliotrope", "osmanthus", "immortelle",

  // Agrumes
  "bergamote", "bergamote-de-calabre", "bergamote-italienne",
  "citron", "citron-vert", "cedrat",
  "mandarine", "mandarine-italie",
  "pamplemousse", "orange-de-sicile",

  // Fruits
  "fraise", "fraise-des-bois", "framboise",
  "peche", "poire", "cerise", "cassis", "mure", "figue",
  "ananas", "mangue", "noix-de-coco", "fruits-exotiques",

  // Épices
  "cannelle", "cardamome",
  "poivre-rose", "poivre-noir",
  "gingembre", "safran",

  // Boisés
  "santal", "cedre", "vetiver",
  "patchouli", "amyris", "gaiac", "oud",
  "cuir", "daim",

  // Résines
  "encens", "olibanum", "benjoin",
  "ambre-gris", "ambre", "ciste",

  // Gourmands
  "vanille", "feve-de-tonka",
  "caramel", "caramel-toffee",
  "miel", "pistache",
  "amande", "amande-pralinee",
  "cacao", "rhum", "lait",

  // Muscs & neutres
  "musc", "musc-blanc",
  "the-noir", "tabac",
  "ambrette", "ambroxan",
  "notes-marines", "notes-poudrées",
];

// Keyword mapping for Unsplash search
const keywords = {
  "rose": "red rose flower macro",
  "rose-absolue": "red rose close macro",
  "rose-de-bulgarie": "bulgarian rose pink",
  "rose-de-damas": "pink rose close macro",
  "jasmin": "jasmine white flower",
  "jasmin-vintage": "jasmine white flower",
  "jasmin-absolu-egypte": "jasmine flower white close",
  "iris": "iris purple flower",
  "iris-absolu": "iris purple flower close",
  "tubereuse": "tuberose white flower",
  "fleur-oranger": "orange blossom white flower",
  "neroli": "orange blossom flower",
  "ylang-ylang": "ylang ylang yellow flower",
  "violette": "violet purple flower",
  "feuille-de-violette": "violet green leaf",
  "gardenia": "white flower close tropical",
  "geranium": "geranium pink flower",
  "lys": "white lily flower",
  "fleur-de-tiare": "white tropical flower gardenia",
  "fleur-de-frangipanier": "plumeria white flower",
  "heliotrope": "heliotrope purple flower",
  "osmanthus": "osmanthus small flower",
  "immortelle": "helichrysum yellow flower",
  "bergamote": "green citrus fruit close",
  "bergamote-de-calabre": "citrus green yellow fruit",
  "bergamote-italienne": "italian citrus fruit green",
  "citron": "lemon yellow fruit",
  "citron-vert": "lime green fruit",
  "cedrat": "citron yellow thick rind",
  "mandarine": "mandarin orange fruit",
  "mandarine-italie": "tangerine orange fruit",
  "pamplemousse": "grapefruit pink sliced",
  "orange-de-sicile": "orange fruit slice",
  "fraise": "strawberry red fresh",
  "fraise-des-bois": "small strawberry red berry",
  "framboise": "raspberry red close",
  "peche": "peach yellow fruit",
  "poire": "pear green yellow",
  "cerise": "cherry red fruit",
  "cassis": "blackcurrant dark berry",
  "mure": "blackberry dark fruit close",
  "figue": "fig fruit purple cut",
  "ananas": "pineapple yellow fruit",
  "mangue": "mango orange tropical",
  "noix-de-coco": "coconut cut open white",
  "fruits-exotiques": "tropical fruits colorful",
  "cannelle": "cinnamon sticks brown",
  "cardamome": "cardamom green pods",
  "poivre-rose": "red pepper corns spice",
  "poivre-noir": "black pepper close",
  "gingembre": "ginger root fresh",
  "safran": "saffron threads golden close",
  "santal": "sandalwood chips aromatic",
  "cedre": "cedar wood chips pale",
  "vetiver": "vetiver grass roots",
  "patchouli": "patchouli plant green leaf",
  "amyris": "white amyris wood aromatic",
  "gaiac": "guaiac dark resin wood",
  "oud": "agarwood dark chips oud",
  "cuir": "leather brown texture close",
  "daim": "suede brown soft texture",
  "encens": "frankincense resin drops white",
  "olibanum": "boswellia frankincense resin",
  "benjoin": "benzoin resin amber brown",
  "ambre-gris": "ambergris sea ocean",
  "ambre": "amber resin golden nugget",
  "ciste": "cistus rockrose pink",
  "vanille": "vanilla bean pod dark",
  "feve-de-tonka": "tonka bean brown pods",
  "caramel": "caramel sauce golden drizzle",
  "caramel-toffee": "toffee caramel candy",
  "miel": "honey golden drip",
  "pistache": "pistachio green nuts open",
  "amande": "almond nuts brown",
  "amande-pralinee": "praline caramelized almond",
  "cacao": "cacao bean pod cut",
  "rhum": "rum dark liquid glass",
  "lait": "fresh milk white glass",
  "musc": "white cotton soft fabric",
  "musc-blanc": "white cotton fabric clean",
  "the-noir": "black tea leaves dry",
  "tabac": "tobacco leaves dry brown",
  "ambrette": "hibiscus musk flower seed",
  "ambroxan": "ocean sea spray foam",
  "notes-marines": "ocean sea blue waves",
  "notes-poudrées": "cosmetic powder pink blush",
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function searchUnsplash(keyword) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=squarish&content_filter=high`;
  const data = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
  }).then(r => r.json());
  return data.results?.[0]?.urls?.small ?? null;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let ok = 0, fail = 0;

  for (const note of notes) {
    const dest = path.join(OUTPUT_DIR, `${note}.jpg`);
    if (fs.existsSync(dest)) {
      console.log(`⏭  ${note} (déjà présent)`);
      ok++;
      continue;
    }

    const keyword = keywords[note] || note.replace(/-/g, ' ');
    try {
      const imageUrl = await searchUnsplash(keyword);
      if (!imageUrl) {
        console.log(`❌ ${note} — aucun résultat pour "${keyword}"`);
        fail++;
        continue;
      }
      await downloadFile(imageUrl, dest);
      console.log(`✅ ${note}`);
      ok++;
      // Respecter le rate limit Unsplash (50 req/h)
      await new Promise(r => setTimeout(r, 1300));
    } catch (e) {
      console.log(`❌ ${note} — erreur: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nTerminé : ${ok} ✅  ${fail} ❌`);
}

main();
