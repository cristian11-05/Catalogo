import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las credenciales de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Extraemos los productos más destacados del PDF (Cyzone, Esika, Lbel, Natura, Avon, Yanbal)
const productsData = [
  // CYZONE - DANCING
  { name: 'Dancing Night', price: 25, short_description: 'ORIENTAL DULCE - Adictivas notas de ciruela y vainilla.' },
  { name: 'Dancing', price: 25, short_description: 'FLORAL - Notas cítricas y pétalos de rosa.' },
  { name: 'Dancing Sunset', price: 29.9, short_description: 'ORIENTAL DULCE - Radiante flor de sambac y sugar ámbar.' },
  { name: 'Dancing Soul', price: 25, short_description: 'FLORAL FRUTAL - Notas de jazmín, manzana verde y ámbar.' },
  // CYZONE - SWEET
  { name: 'Sweet Black', price: 25, short_description: 'ORIENTAL DULCE - Toques de pink pomelo y sandalo.' },
  { name: 'Sweet Intense', price: 25, short_description: 'ORIENTAL DULCE - Almendra tostada y vainilla.' },
  { name: 'Sweet Exclusive', price: 25, short_description: 'ORIENTAL DULCE - Notas de caramelo y rosa cristalizada.' },
  { name: 'Sweet Seduction', price: 25, short_description: 'ORIENTAL DULCE - Toques de frambuesa, rosa y vainilla.' },
  { name: 'Sweet Pink Addict', price: 27.9, short_description: 'ORIENTAL DULCE - Adictivas moras, flores de violeta imperial.' },
  { name: 'Sweet Iconic', price: 25, short_description: 'ORIENTAL DULCE FRUTAL - Vainilla, notas de manzana y caramelo.' },
  // CYZONE - GIRLINK
  { name: 'Girlink', price: 26.9, short_description: 'FLORAL - Toques de uva y bouquet de flores blancas.' },
  { name: 'Girlink Connection', price: 25, short_description: 'FLORAL - Frutos rojos toques de jazmin egipcio y vainilla.' },
  { name: 'Girlink Inspire', price: 25, short_description: 'FLORAL - Notas de pera, flores blancas y toques de almendra.' },
  // ESIKA - VIBRANZA
  { name: 'Vibranza', price: 35.9, short_description: 'ORIENTAL DULCE - Notas de orquidea de vainilla y flor de café.' },
  { name: 'Vibranza Blanc', price: 34.9, short_description: 'FLORAL - Notas de tuberosa y aceite natural de ylang ylang.' },
  { name: 'Vibranza Luminous', price: 38.9, short_description: 'ORIENTAL DULCE - Notas de bergamota y esencias de jazmín y ambar.' },
  { name: 'Vibranza Musique', price: 38.9, short_description: 'ORIENTAL DULCE - Notas de cranberry, flor de peonía y cedro.' },
  // ESIKA - MIA
  { name: 'Mía', price: 35.9, short_description: 'FLORAL - Notas de gardenia dorada de África, vainilla y pimienta rosa.' },
  { name: 'Mía Night', price: 39.9, short_description: 'ORIENTAL DULCE - Toques de cachemira y caramelo.' },
  { name: 'Mía Solar', price: 36.9, short_description: 'FLORAL - Flor de magnolia, durazno blanco y calidez solar.' },
  // LBEL - MITHYKA
  { name: 'Mithyka', price: 34.9, short_description: 'FLORAL - Jazmín de Sambac y bouquet de flores blancas.' },
  { name: 'Mithyka Elixir', price: 44.9, short_description: 'FLORAL - Miel de oro y elixir de flores blancas.' },
  { name: 'Mithyka Lumiere', price: 44.9, short_description: 'FLORAL - Jazmín de la India y frutadas notas de orquídeas.' },
  { name: 'Mithyka Liberté', price: 35.9, short_description: 'FLORAL - Flor Ylang Ylang y durazno blanco.' },
  // NATURA - EKOS FRESCOR
  { name: 'Ekos Frescor Maracuyá', price: 42.9, short_description: 'CÍTRICO FLORAL - Maracuyá, bergamota y jazmín.' },
  { name: 'Ekos Frescor Castaña', price: 37.9, short_description: 'DULCE ORIENTAL - Castaña, bergamota, mandarina.' },
  { name: 'Ekos Frescor Pitanga', price: 37.9, short_description: 'FRUTAL - Hojas de pitanga, mandarina y naranja.' },
  { name: 'Ekos Frescor Acaí', price: 41.9, short_description: 'FRUTAL - Acaí, hojas de violetas y peonía.' },
  // NATURA - TODO DIA BODY SPLASH
  { name: 'Tododia Frambuesa y Pimienta Rosa', price: 24.9, short_description: 'FRUTAL - Frambuesa, pimienta rosa, vainila.' },
  { name: 'Tododia Frutas Rojas', price: 24.9, short_description: 'FRUTAL - Fresa, casis, manzana y muguet.' },
  // AVON - FAR AWAY
  { name: 'Far Away', price: 24.9, short_description: 'FLORAL ORIENTAL - Notas de las vainas de vainilla de Madagascar.' },
  { name: 'Far Away Beyond', price: 24.9, short_description: 'ORIENTAL DULCE - Vainilla de madagascar, pera y jazmín.' },
  // YANBAL - CCORI
  { name: 'Ccori', price: 59.9, short_description: 'AMBARADO FLORAL - Rosa blanca, canela dulce y fondo fino de chocolate.' },
  { name: 'Ccori Rosé', price: 60.9, short_description: 'FLORAL AMBARADO - Notas jugosas de ciruela, rosa damascena y vainilla.' },
  // YANBAL - OHM
  { name: 'Ohm Black', price: 64.9, short_description: 'HERBAL CÍTRICO - Naranja dulce, té negro e impactante pimienta negra.' },
  { name: 'Ohm', price: 64.9, short_description: 'HERLBAL CÍTRICO - Notas de toronja rosada, salvia y cuero.' }
];

function createSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function seedCatalog() {
  console.log(`Iniciando la carga masiva de ${productsData.length} productos...`);
  
  // Obtenemos la categoría "Perfumes" para asignarla por defecto
  const { data: catData } = await supabase.from('categories').select('id').eq('slug', 'perfumes').single();
  const defaultCategoryId = catData ? catData.id : null;

  for (const item of productsData) {
    const slug = createSlug(item.name);
    
    // Auto-generamos el texto de WhatsApp
    const whatsappText = `Hola, me interesa comprar el producto ${item.name} (S/.${item.price}). ¿Aún lo tienen disponible?`;

    const productRecord = {
      name: item.name,
      slug: slug,
      price: item.price,
      short_description: item.short_description,
      whatsapp_text: whatsappText,
      category_id: defaultCategoryId,
      is_active: true,
      is_offer: false,
      is_featured: true // Los marcamos como destacados para que se vean bien
    };

    const { error } = await supabase.from('products').upsert(productRecord, { onConflict: 'slug' });
    
    if (error) {
      console.error(`❌ Error insertando "${item.name}":`, error.message);
    } else {
      console.log(`✅ Producto insertado: ${item.name}`);
    }
  }

  console.log("¡Carga masiva completada con éxito!");
}

seedCatalog();
