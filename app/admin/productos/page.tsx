import Link from 'next/link'
import { deleteProduct } from '@/app/actions/product-actions'
import { createClient } from '@/lib/supabase/server'
import { ProductWithCategory } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const { q } = await searchParams

  let query = supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false })
  
  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data } = await query
  const products = (data || []) as ProductWithCategory[]

  return (
    <div>
      <div className="admin-heading row">
        <div>
          <span>Productos</span>
          <h1>Lista de productos</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <form method="get" style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" name="q" placeholder="Buscar por nombre..." defaultValue={q || ''} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" className="btn btn-soft">Buscar</button>
            {q && <Link href="/admin/productos" className="btn btn-soft">Limpiar</Link>}
          </form>
          <Link href="/admin/productos/nuevo" className="btn btn-primary">Nuevo producto</Link>
        </div>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="table-product">
                    {product.image_url ? <img src={product.image_url} alt={product.name} /> : <span />}
                    <strong>{product.name}</strong>
                  </div>
                </td>
                <td>{product.categories?.name || 'Sin categoría'}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.is_active ? 'Publicado' : 'Oculto'} {product.is_offer ? ' · Oferta' : ''}</td>
                <td>
                  <div className="table-actions">
                    <Link href={`/admin/productos/${product.id}/editar`} className="btn btn-soft">Editar</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button className="btn btn-danger" type="submit">Eliminar</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length && <p className="empty-state">No hay productos registrados.</p>}
      </div>
    </div>
  )
}
