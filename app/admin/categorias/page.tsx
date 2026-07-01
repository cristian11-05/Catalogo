import Link from 'next/link'
import { deleteCategory } from '@/app/actions/category-actions'
import { createClient } from '@/lib/supabase/server'
import { Category } from '@/lib/types'

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const { q } = await searchParams

  let query = supabase.from('categories').select('*').order('created_at', { ascending: false })
  
  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data } = await query
  const categories = (data || []) as Category[]

  return (
    <div>
      <div className="admin-heading row">
        <div>
          <span>Categorías</span>
          <h1>Lista de categorías</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <form method="get" style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" name="q" placeholder="Buscar por nombre..." defaultValue={q || ''} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" className="btn btn-soft">Buscar</button>
            {q && <Link href="/admin/categorias" className="btn btn-soft">Limpiar</Link>}
          </form>
          <Link href="/admin/categorias/nueva" className="btn btn-primary">Nueva categoría</Link>
        </div>
      </div>
      <div className="category-admin-grid">
        {categories.map((category) => (
          <article className="admin-category-card" key={category.id}>
            <div className="admin-category-cover" style={category.background_url ? { backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.35), rgba(214,107,156,.35)), url(${category.background_url})` } : undefined} />
            <h3>{category.name}</h3>
            <p>{category.description || 'Sin descripción.'}</p>
            <span>{category.is_active ? 'Activa' : 'Oculta'}</span>
            <div className="table-actions">
              <Link href={`/admin/categorias/${category.id}/editar`} className="btn btn-soft">Editar</Link>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button type="submit" className="btn btn-danger">Eliminar</button>
              </form>
            </div>
          </article>
        ))}
      </div>
      {!categories.length && <p className="empty-state">No hay categorías registradas.</p>}
    </div>
  )
}
