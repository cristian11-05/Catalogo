import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { ProductWithCategory } from '@/lib/types'
import { formatCurrency, whatsappLink } from '@/lib/utils'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, categories(*), ai_tags(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!data) notFound()

  const product = data as ProductWithCategory

  const { data: related } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_active', true)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)

  return (
    <main className="container page-space">
      <Link href="/" className="back-link">← Volver al catálogo</Link>
      <section className="detail-grid">
        <div className="detail-image-card">
          {product.image_url ? <img src={product.image_url} alt={product.name} /> : <div className="product-placeholder tall">Sin imagen</div>}
        </div>
        <div className="detail-copy">
          <span className="category-chip big-chip">{product.categories?.name || 'Sin categoría'}</span>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.long_description || product.short_description || 'Producto disponible en catálogo.'}</p>
          <div className="detail-price">
            <strong>{formatCurrency(product.price)}</strong>
            {product.old_price ? <span>{formatCurrency(product.old_price)}</span> : null}
          </div>
          <div className="tag-row">
            {product.ai_tags?.map((tag) => <span key={tag.id}>#{tag.tag}</span>)}
          </div>
          <a href={whatsappLink(product.name, product.price, product.whatsapp_text)} target="_blank" className="btn btn-primary big full">Consultar por WhatsApp</a>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>Relacionados</span>
          <h2>También te puede interesar</h2>
        </div>
        <div className="product-grid">
          {((related || []) as ProductWithCategory[]).map((item) => <ProductCard product={item} key={item.id} />)}
        </div>
      </section>
    </main>
  )
}
