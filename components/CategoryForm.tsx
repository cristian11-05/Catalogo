import { createCategory, updateCategory } from '@/app/actions/category-actions'
import { Category } from '@/lib/types'

export default function CategoryForm({ category }: { category?: Category }) {
  const action = category?.id ? updateCategory : createCategory

  return (
    <form action={action} className="admin-form">
      {category?.id && <input type="hidden" name="id" value={category.id} />}
      <div className="input-group">
        <label>Nombre de categoría</label>
        <input name="name" defaultValue={category?.name || ''} placeholder="Ej: Perfumes" required />
      </div>
      <div className="input-group">
        <label>Descripción</label>
        <textarea name="description" defaultValue={category?.description || ''} placeholder="Productos de aroma elegante, fresco y moderno." />
      </div>
      <div className="input-group">
        <label>Imagen o fondo de categoría</label>
        <input name="background_url" defaultValue={category?.background_url || ''} placeholder="URL de imagen de fondo opcional" />
      </div>
      <label className="check-row align-left">
        <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} />
        Categoría activa
      </label>
      <button type="submit" className="btn btn-primary">Guardar categoría</button>
    </form>
  )
}
