// Download vocabulary images from Unsplash
// Usage: UNSPLASH_KEY=your_key node scripts/download-images.js

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'client', 'public', 'images');

const ACCESS_KEY = process.env.UNSPLASH_KEY;
if (!ACCESS_KEY) {
  console.error('Missing UNSPLASH_KEY. Usage: UNSPLASH_KEY=your_key node scripts/download-images.js');
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// Spanish word → search keyword (English works better for Unsplash)
// Only concrete/visual concepts — no verbs, phrases, or abstracts
const imageMap = {
  // Lesson 1
  'hola': 'greeting wave',
  'adiós': 'goodbye wave',
  'por favor': 'hands please',
  'gracias': 'thank you hands',
  'sí': 'thumbs up yes',
  'no': 'thumbs down no',
  'buenos días': 'sunrise morning',
  'buenas noches': 'night moon stars',
  'buenas tardes': 'sunset afternoon',
  'lo siento': 'sorry apologize',
  'amigo': 'friends men',
  'amiga': 'friends women',
  'señor': 'man suit',
  'señora': 'woman elegant',
  'nombre': 'name tag',
  'persona': 'person portrait',

  // Lesson 2
  'uno': 'number one',
  'dos': 'number two fingers',
  'tres': 'number three',
  'cuatro': 'number four',
  'cinco': 'number five hand',
  'diez': 'number ten',
  'cien': 'hundred coins',
  'hora': 'clock hour',
  'minuto': 'stopwatch timer',
  'día': 'sunny day',
  'semana': 'calendar week',
  'mes': 'monthly calendar',
  'año': 'new year calendar',
  'hoy': 'today calendar',
  'mañana': 'tomorrow sunrise',
  'ayer': 'yesterday memory',
  'ahora': 'clock now',

  // Lesson 3
  'familia': 'family portrait',
  'madre': 'mother woman',
  'padre': 'father man',
  'hijo': 'son boy child',
  'hija': 'daughter girl child',
  'hermano': 'brothers',
  'hermana': 'sisters',
  'abuelo': 'grandfather old man',
  'abuela': 'grandmother old woman',
  'tío': 'uncle man',
  'tía': 'aunt woman',
  'primo': 'cousins boy',
  'prima': 'cousins girl',
  'esposo': 'husband couple',
  'esposa': 'wife couple',
  'bebé': 'baby infant',
  'niño': 'boy child',
  'niña': 'girl child',
  'sobrino': 'nephew boy',
  'sobrina': 'niece girl',

  // Lesson 4
  'agua': 'water glass',
  'comida': 'food plate meal',
  'pan': 'bread loaf',
  'leche': 'milk glass',
  'café': 'coffee cup',
  'cerveza': 'beer glass',
  'vino': 'wine glass',
  'carne': 'meat steak',
  'pollo': 'roast chicken',
  'pescado': 'fish food',
  'arroz': 'rice bowl',
  'fruta': 'fruit bowl assorted',
  'manzana': 'red apple',
  'naranja': 'orange fruit',
  'huevo': 'egg fried',
  'queso': 'cheese',
  'ensalada': 'salad bowl',
  'sopa': 'soup bowl',
  'postre': 'dessert cake',
  'azúcar': 'sugar cubes',

  // Lesson 5
  'rojo': 'red color',
  'azul': 'blue sky ocean',
  'verde': 'green grass',
  'amarillo': 'yellow sunflower',
  'negro': 'black background',
  'blanco': 'white snow',
  'grande': 'large elephant',
  'pequeño': 'small tiny mouse',
  'bonito': 'beautiful flower',
  'feo': 'ugly broken',
  'nuevo': 'new shiny product',
  'viejo': 'old antique',
  'caliente': 'hot fire flame',
  'frío': 'cold ice snow',
  'rápido': 'fast running sprint',
  'lento': 'slow turtle snail',
  'feliz': 'happy smiling woman',
  'triste': 'sad crying person',
  'fuerte': 'strong muscles',

  // Lesson 6
  'casa': 'house home',
  'puerta': 'door entrance',
  'ventana': 'window house',
  'mesa': 'table wooden',
  'silla': 'chair seat',
  'cama': 'bed bedroom',
  'cocina': 'kitchen',
  'baño': 'bathroom',
  'habitación': 'bedroom room',
  'jardín': 'garden flowers',
  'escalera': 'stairs staircase',
  'techo': 'roof house',
  'piso': 'floor tiles',
  'pared': 'wall brick',
  'llave': 'key metal',
  'luz': 'light lamp',
  'espejo': 'mirror reflection',
  'reloj': 'clock watch',
  'teléfono': 'smartphone phone',
  'libro': 'book reading',

  // Lesson 7 (verbs — use action images)
  'hablar': 'people talking conversation',
  'comer': 'eating food',
  'beber': 'drinking water',
  'trabajar': 'working office',
  'estudiar': 'studying books',
  'leer': 'reading book',
  'escribir': 'writing pen',
  'dormir': 'sleeping bed',
  'jugar': 'playing soccer',

  // Lesson 8
  'ciudad': 'city skyline',
  'calle': 'street road',
  'tienda': 'store shop',
  'restaurante': 'restaurant dining',
  'hospital': 'hospital building',
  'escuela': 'school building',
  'iglesia': 'church building',
  'playa': 'beach ocean sand',
  'montaña': 'mountain peak',
  'río': 'river landscape',
  'aeropuerto': 'airport terminal',
  'estación': 'train station',
  'hotel': 'hotel building',
  'museo': 'museum building',
  'parque': 'park green trees',
  'mercado': 'market fruit vegetables',
  'banco': 'bank building',
  'biblioteca': 'library books',
  'oficina': 'office workspace',
  'país': 'country landscape',

  // Lesson 9
  'cabeza': 'head portrait',
  'ojo': 'eye close up',
  'nariz': 'nose face',
  'boca': 'mouth lips',
  'oreja': 'ear close up',
  'mano': 'hand palm',
  'pie': 'foot barefoot',
  'brazo': 'arm muscle',
  'pierna': 'leg running',
  'corazón': 'heart red',
  'diente': 'teeth smile',
  'pelo': 'hair woman',
  'dedo': 'finger pointing',
  'médico': 'doctor hospital',
  'enfermo': 'sick person',
  'medicina': 'medicine pills',
  'salud': 'health wellness',
};

function slugify(word) {
  return word
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[¿¡?!,]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function fetchUnsplash(query) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=squarish&client_id=${ACCESS_KEY}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept-Version': 'v1' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errors) reject(new Error(json.errors[0]));
          else resolve(json.urls?.small);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const words = Object.keys(imageMap);
  console.log(`Downloading ${words.length} images to ${OUT_DIR}\n`);

  let success = 0, skip = 0, fail = 0;

  for (const word of words) {
    const slug = slugify(word);
    const dest = path.join(OUT_DIR, `${slug}.jpg`);

    if (fs.existsSync(dest)) {
      console.log(`  skip  ${word}`);
      skip++;
      continue;
    }

    try {
      const imageUrl = await fetchUnsplash(imageMap[word]);
      await download(imageUrl, dest);
      console.log(`  ✓     ${word}  (${imageMap[word]})`);
      success++;
      // Unsplash free tier: 50 req/hour — stay safe at ~40/min
      await sleep(1500);
    } catch (err) {
      console.log(`  ✗     ${word}  — ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${success} downloaded, ${skip} skipped, ${fail} failed.`);
}

main();
