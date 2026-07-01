import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
  const { count: offersCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_offer', true)
  const { count: noImageCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).is('image_url', null)

  return (
    <div>
      <div className="admin-heading">
        <span>Resumen</span>
        <h1>Panel de administración</h1>
        <p>Gestiona productos, categorías, imágenes, ofertas y descripciones con IA.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><span>Total productos</span><strong>{productsCount || 0}</strong></div>
        <div className="stat-card"><span>Categorías</span><strong>{categoriesCount || 0}</strong></div>
        <div className="stat-card"><span>Ofertas</span><strong>{offersCount || 0}</strong></div>
        <div className="stat-card"><span>Sin imagen</span><strong>{noImageCount || 0}</strong></div>
      </div>
      <div className="quick-actions">
        <Link href="/admin/productos/nuevo" className="btn btn-primary big">Agregar producto</Link>
        <Link href="/admin/categorias/nueva" className="btn btn-soft big">Agregar categoría</Link>
      </div>
    </div>
  )
}
