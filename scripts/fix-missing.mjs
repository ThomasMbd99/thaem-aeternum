import fs from 'fs';
import https from 'https';

const UNSPLASH_KEY = 'SmNfcCvPbLXzmUuHKNnqLUaGyNAistWlyWIQE4SFQq4';
const DIR = './public/notes';

// Notes à télécharger avec un meilleur keyword
const toDownload = {
  'pistache': 'pistachio nuts cracked',
  'gaiac': 'dark wood resin aromatic',
  'oud': 'dark aromatic wood texture',
  'encens': 'incense smoke resin',
  'olibanum': 'white resin drops frankincense',
  'ambre-gris': 'ocean sea grey stone',
  'ambre': 'amber yellow warm resin',
};

// Alias : copier une image existante
const aliases = {
  'bergamote-italienne': 'bergamote.jpg',
  'olibanum': 'benjoin.jpg',       // fallback si download échoue
  'gaiac': 'benjoin.jpg',          // fallback si download échoue
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
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function searchUnsplash(keyword) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=squarish&content_filter=high`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0]?.urls?.small ?? null;
}

async function main() {
  // 1. Télécharger les manquantes
  for (const [name, keyword] of Object.entries(toDownload)) {
    const dest = `${DIR}/${name}.jpg`;
    if (fs.existsSync(dest)) { console.log(`⏭  ${name}`); continue; }

    try {
      const url = await searchUnsplash(keyword);
      if (!url) {
        // Utiliser alias si dispo
        if (aliases[name] && fs.existsSync(`${DIR}/${aliases[name]}`)) {
          fs.copyFileSync(`${DIR}/${aliases[name]}`, dest);
          console.log(`📋 ${name} → alias ${aliases[name]}`);
        } else {
          console.log(`❌ ${name} — aucun résultat`);
        }
      } else {
        await downloadFile(url, dest);
        console.log(`✅ ${name}`);
      }
      await new Promise(r => setTimeout(r, 1300));
    } catch (e) {
      console.log(`❌ ${name} — ${e.message}`);
    }
  }

  // 2. Créer les alias directs
  for (const [name, source] of Object.entries(aliases)) {
    const dest = `${DIR}/${name}.jpg`;
    if (fs.existsSync(dest)) continue;
    const src = `${DIR}/${source}`;
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`📋 ${name} → alias ${source}`);
    }
  }

  console.log('\nTerminé !');
}

main();
