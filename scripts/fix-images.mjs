import fs from 'fs';
import https from 'https';

const UNSPLASH_KEY = 'SmNfcCvPbLXzmUuHKNnqLUaGyNAistWlyWIQE4SFQq4';
const DIR = './public/notes';

// Images à re-télécharger avec keywords très précis
// (force: true = remplace même si le fichier existe)
const toFix = [
  { file: 'vanille',          keyword: 'vanilla bean pod macro close',        force: true },
  { file: 'feve-de-tonka',    keyword: 'tonka bean brown whole pod',           force: true },
  { file: 'cacao',            keyword: 'cocoa cacao bean tropical',            force: true },
  { file: 'cassis',           keyword: 'blackcurrant berry cluster',           force: true },
  { file: 'ananas',           keyword: 'pineapple fruit tropical yellow',      force: true },
  { file: 'ambre',            keyword: 'amber resin yellow warm stone',        force: true },
  { file: 'safran',           keyword: 'saffron threads spice red',            force: true },
  { file: 'poire',            keyword: 'pear fruit fresh green',               force: true },
  // Notes manquantes
  { file: 'bois-cremeux',     keyword: 'sandalwood creamy warm wood',          force: false },
  { file: 'sapin-baumier',    keyword: 'balsam fir tree green branch',         force: false },
  { file: 'bois',             keyword: 'wood plank texture warm',              force: false },
  { file: 'chouchou',         keyword: 'caramel sweet candy toffee',           force: false },
  { file: 'mahonial',         keyword: 'amber warm resin light',               force: false },
  { file: 'oud-du-vietnam',   keyword: 'agarwood dark aromatic',               force: false },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlink(dest, () => {});
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
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=3&orientation=squarish&content_filter=high`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );
  if (!res.ok) { console.log('Rate limit ou erreur API'); return null; }
  const data = await res.json();
  return data.results?.[0]?.urls?.small ?? null;
}

async function main() {
  for (const { file, keyword, force } of toFix) {
    const dest = `${DIR}/${file}.jpg`;
    if (fs.existsSync(dest) && !force) { console.log(`⏭  ${file}`); continue; }

    const url = await searchUnsplash(keyword);
    if (!url) { console.log(`❌ ${file} — aucun résultat`); }
    else {
      await downloadFile(url, dest);
      console.log(`✅ ${file}`);
    }
    await new Promise(r => setTimeout(r, 1400));
  }
  console.log('\nTerminé !');
}

main();
