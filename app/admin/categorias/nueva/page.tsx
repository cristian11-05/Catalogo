import CategoryForm from '@/components/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div>
      <div className="admin-heading">
        <span>Nueva categoría</span>
        <h1>Crear categoría</h1>
        <p>Agrega una categoría para ordenar mejor los productos del catálogo.</p>
      </div>
      <CategoryForm />
    </div>
  )
}
