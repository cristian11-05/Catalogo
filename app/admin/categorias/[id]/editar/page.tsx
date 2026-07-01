import { notFound } from 'next/navigation'
import CategoryForm from '@/components/CategoryForm'
import { createClient } from '@/lib/supabase/server'
import { Category } from '@/lib/types'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('id', id).single()

  if (!data) notFound()

  return (
    <div>
      <div className="admin-heading">
        <span>Editar categoría</span>
        <h1>{data.name}</h1>
      </div>
      <CategoryForm category={data as Category} />
    </div>
  )
}
