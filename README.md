# Catálogo Online Inteligente

Proyecto base en Next.js + TypeScript + Supabase + PWA + IA para descripciones automáticas por imagen.

## Qué incluye

- Página de inicio moderna.
- Catálogo público con buscador, filtros y categorías.
- Detalle de producto.
- Botón de compra por WhatsApp.
- Login privado para la administradora.
- Panel admin con estadísticas.
- CRUD de productos.
- CRUD de categorías.
- Subida de imágenes a Supabase Storage.
- Generación automática de descripción con IA usando imagen.
- PWA instalable con `manifest.ts` y `sw.js`.
- SQL listo para Supabase.

## 1. Instalar

```bash
npm install
```

## 2. Configurar variables

Copia `.env.example` como `.env.local`:

```bash
cp .env.example .env.local
```

Completa:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_O_PUBLISHABLE_KEY
# Alternativa nueva de Supabase: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
NEXT_PUBLIC_WHATSAPP_NUMBER=51999999999
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4.1-mini
```

Si no colocas `OPENAI_API_KEY`, el sistema igual funcionará, pero usará descripciones de respaldo sin analizar realmente la imagen.

## 3. Crear tablas en Supabase

En Supabase entra a:

`SQL Editor > New query`

Pega todo el contenido de:

```txt
supabase/schema.sql
```

Ejecuta `Run`.

## 4. Crear usuario admin

En Supabase entra a:

`Authentication > Users > Add user`

Crea el correo y contraseña de la administradora.

Recomendado: desactivar registro público si solo habrá una administradora.

## 5. Ejecutar local

```bash
npm run dev
```

Abre:

```txt
http://localhost:3000
```

Panel admin:

```txt
http://localhost:3000/login
```

## 6. Deploy en Render

Crea un repositorio en GitHub y súbelo.

En Render:

- New > Web Service
- Conecta el repositorio.
- Language: Node
- Build Command:

```bash
npm install && npm run build
```

- Start Command:

```bash
npm run start
```

Agrega las variables de entorno de `.env.local` en Render > Environment.

## 7. Uso normal

1. La administradora entra al panel.
2. Crea categorías.
3. Agrega un producto.
4. Sube imagen.
5. Presiona “Generar descripción con IA”.
6. Revisa y edita la descripción.
7. Guarda.
8. El producto aparece en el catálogo público.
9. El cliente consulta por WhatsApp.

## Notas importantes

- El bucket de imágenes se llama `product-images`.
- Las imágenes son públicas para que la IA pueda analizarlas por URL.
- El SQL permite que cualquier usuario autenticado administre productos. Para producción real, conviene agregar roles avanzados.
- El service worker es básico. Sirve para instalación PWA y cache inicial, no para una app offline completa.
