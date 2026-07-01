import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import PWARegister from '@/components/PWARegister'

export const metadata: Metadata = {
  title: 'XM Venta de Maquillaje',
  description: 'Catálogo online de maquillaje. Belleza que te inspira.',
  applicationName: 'XM Maquillaje',
  appleWebApp: {
    capable: true,
    title: 'XM Maquillaje',
    statusBarStyle: 'default'
  }
}

export const viewport: Viewport = {
  themeColor: '#d66b9c',
  width: 'device-width',
  initialScale: 1
}

import BottomNav from '@/components/BottomNav'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <PWARegister />
        <Header />
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
