import ProductForm from '@/components/ProductForm'
import { createClient } from '@/lib/supabase/server'
import { Category } from '@/lib/types'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('name')

  return (
    <div>
      <div className="admin-heading">
        <span>Nuevo producto</span>
        <h1>Agregar producto con IA</h1>
        <p>Sube la imagen, genera una descripción automática y revisa todo antes de guardar.</p>
      </div>
      <ProductForm categories={(data || []) as Category[]} />
    </div>
  )
}
