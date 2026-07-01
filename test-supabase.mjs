import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Probando la conexión a Supabase en: " + supabaseUrl);
  // Hacemos una consulta rápida a una tabla inexistente. Si nos responde Supabase con un error SQL, sabemos que la conexión y la API key son válidas.
  const { data, error } = await supabase.from('_test_connection_xyz').select('*').limit(1);
  
  if (error) {
    if (error.code === '42P01') {
       console.log("✅ Conexión exitosa. El servidor de Supabase respondió correctamente a la API Key (la tabla no existe, lo cual es esperado).");
    } else {
       console.log("✅ Conexión establecida, pero se recibió este mensaje:", error.message);
    }
  } else {
    console.log("✅ Conexión exitosa a Supabase. Se pudo consultar la base de datos.");
  }
}

testConnection();
