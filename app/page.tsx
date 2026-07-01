import ProductCard from '@/components/ProductCard'
import SearchFilters from '@/components/SearchFilters'
import { createClient } from '@/lib/supabase/server'
import { ProductWithCategory } from '@/lib/types'
import Link from 'next/link'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = readParam(params, 'q')
  const category = readParam(params, 'category')
  const min = readParam(params, 'min')
  const max = readParam(params, 'max')
  const offer = readParam(params, 'offer')

  const supabase = await createClient()

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const categoryList = categoriesData || []

  // Fetch products with their category
  const { data: productsData } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)

  let productList = (productsData || []) as unknown as ProductWithCategory[]

  if (q) {
    const safeQ = q.replaceAll(',', ' ').toLowerCase()
    productList = productList.filter(p => 
      p.name.toLowerCase().includes(safeQ) ||
      (p.short_description || '').toLowerCase().includes(safeQ) ||
      (p.long_description || '').toLowerCase().includes(safeQ)
    )
  }

  if (category) {
    productList = productList.filter(p => p.categories?.slug === category)
  }

  if (offer === 'true') {
    productList = productList.filter(p => p.is_offer)
  }
  if (min) {
    productList = productList.filter(p => p.price >= Number(min))
  }
  if (max) {
    productList = productList.filter(p => p.price <= Number(max))
  }

  const recommendedProducts = productList.filter(p => p.is_featured).slice(0, 4)

  const categoriesWithProducts = categoryList.map(cat => ({
    ...cat,
    products: productList.filter(p => p.categories?.id === cat.id)
  })).filter(cat => cat.products.length > 0)

  return (
    <main className="portal-main" style={{ paddingTop: '100px' }}>
      <div id="catalogo" className="section" style={{ paddingTop: 0 }}>
        <SearchFilters current={{ q, category, min, max, offer }} />
        {q || category || min || max || offer ? (
          <div className="result-count">{productList.length} producto(s) encontrados con este filtro</div>
        ) : null}
      </div>

      {/* Destacados */}
      {recommendedProducts.length > 0 && !category && !q && (
        <div className="section" style={{ paddingTop: '10px' }}>
          <div className="section-heading row">
            <h2>Destacados</h2>
            <Link href="/?offer=true" className="link-primary">Ver todos</Link>
          </div>
          <div className="mobile-scroll">
            {recommendedProducts.map(product => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      )}

      {/* Secciones por Categoría (Carruseles) */}
      {categoriesWithProducts.map(cat => (
        <div className="section" key={cat.id} style={{ paddingTop: '20px', paddingBottom: '10px' }}>
          <div className="section-heading row">
            <div>
              <span className="eyebrow">Categoría</span>
              <h2>{cat.name}</h2>
            </div>
            {cat.products.length > 4 && (
              <Link href={`/?category=${cat.slug}#catalogo`} className="btn btn-soft">Ver todos</Link>
            )}
          </div>
          <div className="mobile-scroll">
            {cat.products.map(product => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      ))}

      {categoriesWithProducts.length === 0 && (
        <p className="empty-state">No se encontraron productos.</p>
      )}
    </main>
  )
}
