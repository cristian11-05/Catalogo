import { notFound } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import { createClient } from '@/lib/supabase/server'
import { Category, ProductWithCategory } from '@/lib/types'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('products').select('*, categories(*), ai_tags(*)').eq('id', id).single()
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="admin-heading">
        <span>Editar producto</span>
        <h1>{product.name}</h1>
      </div>
      <ProductForm categories={(categories || []) as Category[]} product={product as ProductWithCategory} />
    </div>
  )
}
