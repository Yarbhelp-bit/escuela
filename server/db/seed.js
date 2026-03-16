import Database from 'better-sqlite3';
import { initializeDatabase } from './schema.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, '..', 'escuela.db'));
db.pragma('journal_mode = WAL');

initializeDatabase(db);

// 200 vocabulary cards across 10 lessons (20 per lesson)
const vocabulary = [
  // Lesson 1: Greetings & Basics
  { spanish: 'hola', english: 'hello', gender: 'none', lesson: 1 },
  { spanish: 'adiós', english: 'goodbye', gender: 'none', lesson: 1 },
  { spanish: 'por favor', english: 'please', gender: 'none', lesson: 1 },
  { spanish: 'gracias', english: 'thank you', gender: 'none', lesson: 1 },
  { spanish: 'de nada', english: "you're welcome", gender: 'none', lesson: 1 },
  { spanish: 'sí', english: 'yes', gender: 'none', lesson: 1 },
  { spanish: 'no', english: 'no', gender: 'none', lesson: 1 },
  { spanish: 'buenos días', english: 'good morning', gender: 'none', lesson: 1 },
  { spanish: 'buenas noches', english: 'good night', gender: 'none', lesson: 1 },
  { spanish: 'buenas tardes', english: 'good afternoon', gender: 'none', lesson: 1 },
  { spanish: 'lo siento', english: "I'm sorry", gender: 'none', lesson: 1 },
  { spanish: 'perdón', english: 'excuse me', gender: 'none', lesson: 1 },
  { spanish: 'bien', english: 'well / good', gender: 'none', lesson: 1 },
  { spanish: 'mal', english: 'bad', gender: 'none', lesson: 1 },
  { spanish: 'amigo', english: 'friend', gender: 'masculine', lesson: 1 },
  { spanish: 'amiga', english: 'friend', gender: 'feminine', lesson: 1 },
  { spanish: 'señor', english: 'sir / Mr.', gender: 'masculine', lesson: 1 },
  { spanish: 'señora', english: 'ma\'am / Mrs.', gender: 'feminine', lesson: 1 },
  { spanish: 'nombre', english: 'name', gender: 'masculine', lesson: 1 },
  { spanish: 'persona', english: 'person', gender: 'feminine', lesson: 1 },

  // Lesson 2: Numbers & Time
  { spanish: 'uno', english: 'one', gender: 'none', lesson: 2 },
  { spanish: 'dos', english: 'two', gender: 'none', lesson: 2 },
  { spanish: 'tres', english: 'three', gender: 'none', lesson: 2 },
  { spanish: 'cuatro', english: 'four', gender: 'none', lesson: 2 },
  { spanish: 'cinco', english: 'five', gender: 'none', lesson: 2 },
  { spanish: 'diez', english: 'ten', gender: 'none', lesson: 2 },
  { spanish: 'veinte', english: 'twenty', gender: 'none', lesson: 2 },
  { spanish: 'cien', english: 'one hundred', gender: 'none', lesson: 2 },
  { spanish: 'mil', english: 'one thousand', gender: 'none', lesson: 2 },
  { spanish: 'hora', english: 'hour', gender: 'feminine', lesson: 2 },
  { spanish: 'minuto', english: 'minute', gender: 'masculine', lesson: 2 },
  { spanish: 'día', english: 'day', gender: 'masculine', lesson: 2 },
  { spanish: 'semana', english: 'week', gender: 'feminine', lesson: 2 },
  { spanish: 'mes', english: 'month', gender: 'masculine', lesson: 2 },
  { spanish: 'año', english: 'year', gender: 'masculine', lesson: 2 },
  { spanish: 'hoy', english: 'today', gender: 'none', lesson: 2 },
  { spanish: 'mañana', english: 'tomorrow', gender: 'feminine', lesson: 2 },
  { spanish: 'ayer', english: 'yesterday', gender: 'none', lesson: 2 },
  { spanish: 'ahora', english: 'now', gender: 'none', lesson: 2 },
  { spanish: 'siempre', english: 'always', gender: 'none', lesson: 2 },

  // Lesson 3: Family
  { spanish: 'familia', english: 'family', gender: 'feminine', lesson: 3 },
  { spanish: 'madre', english: 'mother', gender: 'feminine', lesson: 3 },
  { spanish: 'padre', english: 'father', gender: 'masculine', lesson: 3 },
  { spanish: 'hijo', english: 'son', gender: 'masculine', lesson: 3 },
  { spanish: 'hija', english: 'daughter', gender: 'feminine', lesson: 3 },
  { spanish: 'hermano', english: 'brother', gender: 'masculine', lesson: 3 },
  { spanish: 'hermana', english: 'sister', gender: 'feminine', lesson: 3 },
  { spanish: 'abuelo', english: 'grandfather', gender: 'masculine', lesson: 3 },
  { spanish: 'abuela', english: 'grandmother', gender: 'feminine', lesson: 3 },
  { spanish: 'tío', english: 'uncle', gender: 'masculine', lesson: 3 },
  { spanish: 'tía', english: 'aunt', gender: 'feminine', lesson: 3 },
  { spanish: 'primo', english: 'cousin', gender: 'masculine', lesson: 3 },
  { spanish: 'prima', english: 'cousin', gender: 'feminine', lesson: 3 },
  { spanish: 'esposo', english: 'husband', gender: 'masculine', lesson: 3 },
  { spanish: 'esposa', english: 'wife', gender: 'feminine', lesson: 3 },
  { spanish: 'bebé', english: 'baby', gender: 'both', lesson: 3 },
  { spanish: 'niño', english: 'boy / child', gender: 'masculine', lesson: 3 },
  { spanish: 'niña', english: 'girl / child', gender: 'feminine', lesson: 3 },
  { spanish: 'sobrino', english: 'nephew', gender: 'masculine', lesson: 3 },
  { spanish: 'sobrina', english: 'niece', gender: 'feminine', lesson: 3 },

  // Lesson 4: Food & Drink
  { spanish: 'agua', english: 'water', gender: 'feminine', lesson: 4 },
  { spanish: 'comida', english: 'food', gender: 'feminine', lesson: 4 },
  { spanish: 'pan', english: 'bread', gender: 'masculine', lesson: 4 },
  { spanish: 'leche', english: 'milk', gender: 'feminine', lesson: 4 },
  { spanish: 'café', english: 'coffee', gender: 'masculine', lesson: 4 },
  { spanish: 'cerveza', english: 'beer', gender: 'feminine', lesson: 4 },
  { spanish: 'vino', english: 'wine', gender: 'masculine', lesson: 4 },
  { spanish: 'carne', english: 'meat', gender: 'feminine', lesson: 4 },
  { spanish: 'pollo', english: 'chicken', gender: 'masculine', lesson: 4 },
  { spanish: 'pescado', english: 'fish', gender: 'masculine', lesson: 4 },
  { spanish: 'arroz', english: 'rice', gender: 'masculine', lesson: 4 },
  { spanish: 'fruta', english: 'fruit', gender: 'feminine', lesson: 4 },
  { spanish: 'manzana', english: 'apple', gender: 'feminine', lesson: 4 },
  { spanish: 'naranja', english: 'orange', gender: 'feminine', lesson: 4 },
  { spanish: 'huevo', english: 'egg', gender: 'masculine', lesson: 4 },
  { spanish: 'queso', english: 'cheese', gender: 'masculine', lesson: 4 },
  { spanish: 'ensalada', english: 'salad', gender: 'feminine', lesson: 4 },
  { spanish: 'sopa', english: 'soup', gender: 'feminine', lesson: 4 },
  { spanish: 'postre', english: 'dessert', gender: 'masculine', lesson: 4 },
  { spanish: 'azúcar', english: 'sugar', gender: 'masculine', lesson: 4 },

  // Lesson 5: Colors & Descriptions
  { spanish: 'rojo', english: 'red', gender: 'masculine', lesson: 5 },
  { spanish: 'azul', english: 'blue', gender: 'both', lesson: 5 },
  { spanish: 'verde', english: 'green', gender: 'both', lesson: 5 },
  { spanish: 'amarillo', english: 'yellow', gender: 'masculine', lesson: 5 },
  { spanish: 'negro', english: 'black', gender: 'masculine', lesson: 5 },
  { spanish: 'blanco', english: 'white', gender: 'masculine', lesson: 5 },
  { spanish: 'grande', english: 'big / large', gender: 'both', lesson: 5 },
  { spanish: 'pequeño', english: 'small', gender: 'masculine', lesson: 5 },
  { spanish: 'bonito', english: 'pretty', gender: 'masculine', lesson: 5 },
  { spanish: 'feo', english: 'ugly', gender: 'masculine', lesson: 5 },
  { spanish: 'nuevo', english: 'new', gender: 'masculine', lesson: 5 },
  { spanish: 'viejo', english: 'old', gender: 'masculine', lesson: 5 },
  { spanish: 'caliente', english: 'hot', gender: 'both', lesson: 5 },
  { spanish: 'frío', english: 'cold', gender: 'masculine', lesson: 5 },
  { spanish: 'rápido', english: 'fast', gender: 'masculine', lesson: 5 },
  { spanish: 'lento', english: 'slow', gender: 'masculine', lesson: 5 },
  { spanish: 'feliz', english: 'happy', gender: 'both', lesson: 5 },
  { spanish: 'triste', english: 'sad', gender: 'both', lesson: 5 },
  { spanish: 'fuerte', english: 'strong', gender: 'both', lesson: 5 },
  { spanish: 'débil', english: 'weak', gender: 'both', lesson: 5 },

  // Lesson 6: Around the House
  { spanish: 'casa', english: 'house', gender: 'feminine', lesson: 6 },
  { spanish: 'puerta', english: 'door', gender: 'feminine', lesson: 6 },
  { spanish: 'ventana', english: 'window', gender: 'feminine', lesson: 6 },
  { spanish: 'mesa', english: 'table', gender: 'feminine', lesson: 6 },
  { spanish: 'silla', english: 'chair', gender: 'feminine', lesson: 6 },
  { spanish: 'cama', english: 'bed', gender: 'feminine', lesson: 6 },
  { spanish: 'cocina', english: 'kitchen', gender: 'feminine', lesson: 6 },
  { spanish: 'baño', english: 'bathroom', gender: 'masculine', lesson: 6 },
  { spanish: 'habitación', english: 'room / bedroom', gender: 'feminine', lesson: 6 },
  { spanish: 'jardín', english: 'garden', gender: 'masculine', lesson: 6 },
  { spanish: 'escalera', english: 'stairs', gender: 'feminine', lesson: 6 },
  { spanish: 'techo', english: 'roof / ceiling', gender: 'masculine', lesson: 6 },
  { spanish: 'piso', english: 'floor', gender: 'masculine', lesson: 6 },
  { spanish: 'pared', english: 'wall', gender: 'feminine', lesson: 6 },
  { spanish: 'llave', english: 'key', gender: 'feminine', lesson: 6 },
  { spanish: 'luz', english: 'light', gender: 'feminine', lesson: 6 },
  { spanish: 'espejo', english: 'mirror', gender: 'masculine', lesson: 6 },
  { spanish: 'reloj', english: 'clock / watch', gender: 'masculine', lesson: 6 },
  { spanish: 'teléfono', english: 'telephone', gender: 'masculine', lesson: 6 },
  { spanish: 'libro', english: 'book', gender: 'masculine', lesson: 6 },

  // Lesson 7: Common Verbs
  { spanish: 'ser', english: 'to be (permanent)', gender: 'none', lesson: 7 },
  { spanish: 'estar', english: 'to be (temporary)', gender: 'none', lesson: 7 },
  { spanish: 'tener', english: 'to have', gender: 'none', lesson: 7 },
  { spanish: 'hacer', english: 'to do / to make', gender: 'none', lesson: 7 },
  { spanish: 'ir', english: 'to go', gender: 'none', lesson: 7 },
  { spanish: 'venir', english: 'to come', gender: 'none', lesson: 7 },
  { spanish: 'poder', english: 'to be able to / can', gender: 'none', lesson: 7 },
  { spanish: 'querer', english: 'to want', gender: 'none', lesson: 7 },
  { spanish: 'saber', english: 'to know (facts)', gender: 'none', lesson: 7 },
  { spanish: 'conocer', english: 'to know (people/places)', gender: 'none', lesson: 7 },
  { spanish: 'hablar', english: 'to speak', gender: 'none', lesson: 7 },
  { spanish: 'comer', english: 'to eat', gender: 'none', lesson: 7 },
  { spanish: 'beber', english: 'to drink', gender: 'none', lesson: 7 },
  { spanish: 'vivir', english: 'to live', gender: 'none', lesson: 7 },
  { spanish: 'trabajar', english: 'to work', gender: 'none', lesson: 7 },
  { spanish: 'estudiar', english: 'to study', gender: 'none', lesson: 7 },
  { spanish: 'leer', english: 'to read', gender: 'none', lesson: 7 },
  { spanish: 'escribir', english: 'to write', gender: 'none', lesson: 7 },
  { spanish: 'dormir', english: 'to sleep', gender: 'none', lesson: 7 },
  { spanish: 'jugar', english: 'to play', gender: 'none', lesson: 7 },

  // Lesson 8: Places & Travel
  { spanish: 'ciudad', english: 'city', gender: 'feminine', lesson: 8 },
  { spanish: 'calle', english: 'street', gender: 'feminine', lesson: 8 },
  { spanish: 'tienda', english: 'store / shop', gender: 'feminine', lesson: 8 },
  { spanish: 'restaurante', english: 'restaurant', gender: 'masculine', lesson: 8 },
  { spanish: 'hospital', english: 'hospital', gender: 'masculine', lesson: 8 },
  { spanish: 'escuela', english: 'school', gender: 'feminine', lesson: 8 },
  { spanish: 'iglesia', english: 'church', gender: 'feminine', lesson: 8 },
  { spanish: 'playa', english: 'beach', gender: 'feminine', lesson: 8 },
  { spanish: 'montaña', english: 'mountain', gender: 'feminine', lesson: 8 },
  { spanish: 'río', english: 'river', gender: 'masculine', lesson: 8 },
  { spanish: 'aeropuerto', english: 'airport', gender: 'masculine', lesson: 8 },
  { spanish: 'estación', english: 'station', gender: 'feminine', lesson: 8 },
  { spanish: 'hotel', english: 'hotel', gender: 'masculine', lesson: 8 },
  { spanish: 'museo', english: 'museum', gender: 'masculine', lesson: 8 },
  { spanish: 'parque', english: 'park', gender: 'masculine', lesson: 8 },
  { spanish: 'mercado', english: 'market', gender: 'masculine', lesson: 8 },
  { spanish: 'banco', english: 'bank', gender: 'masculine', lesson: 8 },
  { spanish: 'biblioteca', english: 'library', gender: 'feminine', lesson: 8 },
  { spanish: 'oficina', english: 'office', gender: 'feminine', lesson: 8 },
  { spanish: 'país', english: 'country', gender: 'masculine', lesson: 8 },

  // Lesson 9: Body & Health
  { spanish: 'cabeza', english: 'head', gender: 'feminine', lesson: 9 },
  { spanish: 'ojo', english: 'eye', gender: 'masculine', lesson: 9 },
  { spanish: 'nariz', english: 'nose', gender: 'feminine', lesson: 9 },
  { spanish: 'boca', english: 'mouth', gender: 'feminine', lesson: 9 },
  { spanish: 'oreja', english: 'ear', gender: 'feminine', lesson: 9 },
  { spanish: 'mano', english: 'hand', gender: 'feminine', lesson: 9 },
  { spanish: 'pie', english: 'foot', gender: 'masculine', lesson: 9 },
  { spanish: 'brazo', english: 'arm', gender: 'masculine', lesson: 9 },
  { spanish: 'pierna', english: 'leg', gender: 'feminine', lesson: 9 },
  { spanish: 'corazón', english: 'heart', gender: 'masculine', lesson: 9 },
  { spanish: 'estómago', english: 'stomach', gender: 'masculine', lesson: 9 },
  { spanish: 'espalda', english: 'back', gender: 'feminine', lesson: 9 },
  { spanish: 'diente', english: 'tooth', gender: 'masculine', lesson: 9 },
  { spanish: 'pelo', english: 'hair', gender: 'masculine', lesson: 9 },
  { spanish: 'dedo', english: 'finger / toe', gender: 'masculine', lesson: 9 },
  { spanish: 'dolor', english: 'pain', gender: 'masculine', lesson: 9 },
  { spanish: 'médico', english: 'doctor', gender: 'masculine', lesson: 9 },
  { spanish: 'enfermo', english: 'sick', gender: 'masculine', lesson: 9 },
  { spanish: 'medicina', english: 'medicine', gender: 'feminine', lesson: 9 },
  { spanish: 'salud', english: 'health', gender: 'feminine', lesson: 9 },

  // Lesson 10: Everyday Expressions
  { spanish: '¿cuánto cuesta?', english: 'how much does it cost?', gender: 'none', lesson: 10 },
  { spanish: '¿dónde está?', english: 'where is it?', gender: 'none', lesson: 10 },
  { spanish: '¿cómo estás?', english: 'how are you?', gender: 'none', lesson: 10 },
  { spanish: '¿qué hora es?', english: 'what time is it?', gender: 'none', lesson: 10 },
  { spanish: 'me gusta', english: 'I like', gender: 'none', lesson: 10 },
  { spanish: 'no entiendo', english: "I don't understand", gender: 'none', lesson: 10 },
  { spanish: 'necesito', english: 'I need', gender: 'none', lesson: 10 },
  { spanish: 'quiero', english: 'I want', gender: 'none', lesson: 10 },
  { spanish: 'tengo hambre', english: "I'm hungry", gender: 'none', lesson: 10 },
  { spanish: 'tengo sed', english: "I'm thirsty", gender: 'none', lesson: 10 },
  { spanish: 'estoy cansado', english: "I'm tired", gender: 'none', lesson: 10 },
  { spanish: 'tengo frío', english: "I'm cold", gender: 'none', lesson: 10 },
  { spanish: 'tengo calor', english: "I'm hot", gender: 'none', lesson: 10 },
  { spanish: 'con permiso', english: 'excuse me (to pass)', gender: 'none', lesson: 10 },
  { spanish: '¡salud!', english: 'cheers! / bless you!', gender: 'none', lesson: 10 },
  { spanish: 'claro', english: 'of course', gender: 'none', lesson: 10 },
  { spanish: 'tal vez', english: 'maybe', gender: 'none', lesson: 10 },
  { spanish: 'por supuesto', english: 'of course', gender: 'none', lesson: 10 },
  { spanish: '¡buen provecho!', english: 'enjoy your meal!', gender: 'none', lesson: 10 },
  { spanish: '¡buena suerte!', english: 'good luck!', gender: 'none', lesson: 10 },
];

// Lesson metadata
const lessons = [
  { id: 1, name: 'Greetings & Basics', description: 'Essential greetings and polite expressions' },
  { id: 2, name: 'Numbers & Time', description: 'Counting, telling time, and temporal words' },
  { id: 3, name: 'Family', description: 'Family members and relationships' },
  { id: 4, name: 'Food & Drink', description: 'Common foods, beverages, and dining' },
  { id: 5, name: 'Colors & Descriptions', description: 'Colors, adjectives, and describing things' },
  { id: 6, name: 'Around the House', description: 'Rooms, furniture, and household items' },
  { id: 7, name: 'Common Verbs', description: 'Essential verbs for everyday conversation' },
  { id: 8, name: 'Places & Travel', description: 'Locations, directions, and travel' },
  { id: 9, name: 'Body & Health', description: 'Body parts and health vocabulary' },
  { id: 10, name: 'Everyday Expressions', description: 'Useful phrases for daily life' },
];

// Grammar tips
const grammarTips = [
  { title: 'Masculine vs Feminine', content: 'Most Spanish nouns ending in -o are masculine (el libro). Most ending in -a are feminine (la mesa). But watch out for exceptions like el día and la mano!', category: 'gender' },
  { title: 'El vs La', content: 'Use "el" before masculine nouns and "la" before feminine nouns. Plural: "los" (masculine) and "las" (feminine). Example: el gato → los gatos, la casa → las casas.', category: 'articles' },
  { title: 'Ser vs Estar', content: 'Both mean "to be". Use SER for permanent traits (nationality, profession, personality). Use ESTAR for temporary states (emotions, location, conditions). "Soy americano" vs "Estoy cansado".', category: 'verbs' },
  { title: 'Making Plurals', content: 'Add -s to words ending in a vowel (gato → gatos). Add -es to words ending in a consonant (ciudad → ciudades). Words ending in -z change to -ces (lápiz → lápices).', category: 'grammar' },
  { title: 'Subject Pronouns', content: 'yo (I), tú (you), él/ella (he/she), nosotros (we), vosotros (you all - Spain), ellos/ellas (they). In Spanish, pronouns are often dropped because the verb ending tells you who is doing the action.', category: 'pronouns' },
  { title: '-AR Verb Pattern', content: 'Most -AR verbs follow the same pattern: hablar → hablo, hablas, habla, hablamos, habláis, hablan. Learn this pattern and you can conjugate hundreds of verbs!', category: 'verbs' },
  { title: '-ER/-IR Verb Pattern', content: '-ER verbs: comer → como, comes, come, comemos, coméis, comen. -IR verbs: vivir → vivo, vives, vive, vivimos, vivís, viven. The patterns are similar!', category: 'verbs' },
  { title: 'Adjective Agreement', content: 'Adjectives must match the noun in gender and number. "El gato negro" but "La gata negra". Adjectives ending in -e or consonants don\'t change for gender: "el/la estudiante inteligente".', category: 'grammar' },
  { title: 'Question Words', content: '¿Qué? (What?), ¿Quién? (Who?), ¿Dónde? (Where?), ¿Cuándo? (When?), ¿Por qué? (Why?), ¿Cómo? (How?), ¿Cuánto? (How much?). Always use ¿ at the start and ? at the end.', category: 'grammar' },
  { title: 'Gustar = "To Please"', content: '"Me gusta" literally means "it pleases me". Use "gusta" with singular nouns (Me gusta el café) and "gustan" with plural nouns (Me gustan los gatos). It works differently from English "I like"!', category: 'verbs' },
  { title: 'Tener Expressions', content: 'Spanish uses "tener" (to have) where English uses "to be": tengo hambre (I\'m hungry), tengo sed (I\'m thirsty), tengo frío (I\'m cold), tengo calor (I\'m hot), tengo sueño (I\'m sleepy).', category: 'expressions' },
  { title: 'Accents Matter', content: 'Accent marks change meaning! "si" (if) vs "sí" (yes), "el" (the) vs "él" (he), "como" (like/as) vs "cómo" (how). They also indicate stress: café, teléfono, rápido.', category: 'pronunciation' },
  { title: 'Possessive Adjectives', content: 'mi/mis (my), tu/tus (your), su/sus (his/her/your formal), nuestro/a/os/as (our). They match the number of the thing owned, not the owner: "mis libros" (my books).', category: 'grammar' },
  { title: 'Negation is Easy', content: 'Just put "no" before the verb: "Hablo español" → "No hablo español". Double negatives are correct in Spanish: "No tengo nada" (I don\'t have nothing = I have nothing).', category: 'grammar' },
  { title: 'The Personal "A"', content: 'When a person is the direct object of a verb, add "a" before them: "Veo a María" (I see María), but "Veo la casa" (I see the house). This doesn\'t exist in English!', category: 'grammar' },
  { title: 'Diminutives (-ito/-ita)', content: 'Add -ito (masculine) or -ita (feminine) to make things small or cute: casa → casita (little house), perro → perrito (little dog), momento → momentito (just a moment).', category: 'expressions' },
  { title: 'Days of the Week', content: 'lunes (Monday), martes (Tuesday), miércoles (Wednesday), jueves (Thursday), viernes (Friday), sábado (Saturday), domingo (Sunday). They\'re not capitalized in Spanish!', category: 'vocabulary' },
  { title: 'Hay = There is/are', content: '"Hay" is used for both "there is" and "there are": "Hay un gato" (there is a cat), "Hay tres gatos" (there are three cats). It never changes form!', category: 'grammar' },
  { title: 'Por vs Para', content: 'Both mean "for" but differ: POR = because of, through, in exchange for, duration. PARA = in order to, destination, deadline, purpose. "Trabajo por dinero" vs "Trabajo para Google".', category: 'grammar' },
  { title: 'Reflexive Verbs', content: 'Reflexive verbs indicate the subject does something to themselves: lavarse (to wash oneself), levantarse (to get up), llamarse (to call oneself = to be named). "Me llamo Juan" = My name is Juan.', category: 'verbs' },
];

// Clear existing data
db.exec('DELETE FROM tips_shown');
db.exec('DELETE FROM grammar_tips');
db.exec('DELETE FROM progress');
db.exec('DELETE FROM cards');
db.exec('DELETE FROM lessons');
db.exec('DELETE FROM sessions');
db.exec('DELETE FROM streaks');

// Insert lessons
const insertLesson = db.prepare(
  'INSERT INTO lessons (id, name, description, unlocked) VALUES (?, ?, ?, ?)'
);
for (const lesson of lessons) {
  insertLesson.run(lesson.id, lesson.name, lesson.description, 1);
}

// Insert cards and create initial progress entries
const insertCard = db.prepare(
  'INSERT INTO cards (spanish, english, gender, lesson_id) VALUES (?, ?, ?, ?)'
);
const insertProgress = db.prepare(
  'INSERT INTO progress (card_id) VALUES (?)'
);

for (const word of vocabulary) {
  const result = insertCard.run(word.spanish, word.english, word.gender, word.lesson);
  insertProgress.run(result.lastInsertRowid);
}

// Insert grammar tips
const insertTip = db.prepare(
  'INSERT INTO grammar_tips (title, content, category) VALUES (?, ?, ?)'
);
for (const tip of grammarTips) {
  insertTip.run(tip.title, tip.content, tip.category);
}

console.log(`Seeded ${vocabulary.length} vocabulary cards across ${lessons.length} lessons`);
console.log(`Seeded ${grammarTips.length} grammar tips`);
console.log('Database ready!');

db.close();
