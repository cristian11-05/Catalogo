import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Catálogo Online Inteligente',
    short_name: 'Catálogo IA',
    description: 'Catálogo instalable con productos, categorías, buscador y descripciones con IA.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fff7fb',
    theme_color: '#d66b9c',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}
