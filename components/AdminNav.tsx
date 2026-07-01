'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminNav() {
  const router = useRouter()

  function logout() {
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-logo">Panel Admin</Link>
      <Link href="/admin/productos">Productos</Link>
      <Link href="/admin/categorias">Categorías</Link>
      <Link href="/">Ver catálogo</Link>
      <button type="button" onClick={logout} className="ghost-danger">Cerrar sesión</button>
    </aside>
  )
}
