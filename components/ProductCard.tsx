import Link from 'next/link'
import { ProductWithCategory } from '@/lib/types'
import { formatCurrency, whatsappLink } from '@/lib/utils'

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <article className="product-card">
      <Link href={`/producto/${product.slug}`} className="product-image-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-image" />
        ) : (
          <div className="product-placeholder">Sin imagen</div>
        )}
        {product.is_featured && <span className="badge badge-featured">Destacado</span>}
      </Link>
      <div className="product-body">
        <span className="category-chip-small">{product.categories?.name || 'Sin categoría'}</span>
        <h3>{product.name}</h3>
        <p>{product.short_description || 'Disponible en catálogo'}</p>
        <div className="price-row">
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <div className="card-actions">
          <Link href={`/producto/${product.slug}`} className="btn btn-outline">Ver detalle</Link>
          <a href={whatsappLink(product.name, product.price, product.whatsapp_text)} target="_blank" className="btn btn-primary-solid">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
