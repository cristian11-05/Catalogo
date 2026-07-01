'use client'

import { useMemo, useState } from 'react'
import { createProduct, updateProduct } from '@/app/actions/product-actions'
import { createClient } from '@/lib/supabase/browser'
import { Category, ProductWithCategory } from '@/lib/types'
import { slugify } from '@/lib/utils'

type ProductFormState = {
  name: string
  price: string
  old_price: string
  category_id: string
  stock: string
  short_description: string
  long_description: string
  whatsapp_text: string
  image_url: string
  tags: string
  is_active: boolean
  is_offer: boolean
  is_featured: boolean
}

export default function ProductForm({ categories, product }: { categories: Category[]; product?: ProductWithCategory }) {
  const [loadingImage, setLoadingImage] = useState(false)
  const [loadingAi, setLoadingAi] = useState(false)
  const [message, setMessage] = useState('')

  const initialTags = product?.ai_tags?.map((tag) => tag.tag).join(', ') || ''

  const [form, setForm] = useState<ProductFormState>({
    name: product?.name || '',
    price: String(product?.price ?? ''),
    old_price: String(product?.old_price ?? ''),
    category_id: product?.category_id || '',
    stock: String(product?.stock ?? ''),
    short_description: product?.short_description || '',
    long_description: product?.long_description || '',
    whatsapp_text: product?.whatsapp_text || '',
    image_url: product?.image_url || '',
    tags: initialTags,
    is_active: product?.is_active ?? true,
    is_offer: product?.is_offer ?? false,
    is_featured: product?.is_featured ?? false
  })

  const selectedCategory = useMemo(() => {
    return categories.find((category) => category.id === form.category_id)
  }, [categories, form.category_id])

  const action = product?.id ? updateProduct : createProduct

  function updateField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function uploadImage(file: File) {
    setMessage('')
    setLoadingImage(true)

    try {
      const supabase = createClient()

      // Generate unique file name
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        // If bucket doesn't exist, fall back to base64 with compression
        console.warn('Storage upload failed, using compressed preview:', uploadError.message)
        
        // Compress the image to avoid the 1MB limit
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new window.Image()
        img.onload = () => {
          const maxSize = 400
          let w = img.width, h = img.height
          if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
          else { w = Math.round(w * maxSize / h); h = maxSize }
          canvas.width = w
          canvas.height = h
          ctx?.drawImage(img, 0, 0, w, h)
          const compressed = canvas.toDataURL('image/jpeg', 0.6)
          updateField('image_url', compressed)
          setMessage('Imagen comprimida para vista previa. Configura Supabase Storage para imágenes en alta calidad.')
          setLoadingImage(false)
        }
        img.onerror = () => {
          setMessage('Error al procesar la imagen.')
          setLoadingImage(false)
        }
        img.src = URL.createObjectURL(file)
        return
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      updateField('image_url', urlData.publicUrl)
      setMessage('¡Imagen subida exitosamente!')
    } catch (err) {
      setMessage('Error al subir la imagen.')
      console.error(err)
    } finally {
      setLoadingImage(false)
    }
  }

  async function generateWithAi() {
    if (!form.image_url) {
      setMessage('Primero sube una imagen del producto.')
      return
    }

    setLoadingAi(true)
    setMessage('Analizando imagen y generando descripción...')

    try {
      const response = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: form.image_url,
          productName: form.name,
          categoryName: selectedCategory?.name
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al generar descripción')
      }

      setForm((current) => ({
        ...current,
        name: current.name || data.suggestedName || '',
        short_description: data.shortDescription || current.short_description,
        long_description: data.longDescription || current.long_description,
        whatsapp_text: data.whatsappText || current.whatsapp_text,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : current.tags
      }))
      setMessage('Descripción generada. Revísala y edítala antes de guardar.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo generar la descripción.')
    } finally {
      setLoadingAi(false)
    }
  }

  return (
    <form action={action} className="admin-form product-form">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="image_url" value={form.image_url} />

      <div className="form-grid two">
        <div className="input-group">
          <label>Nombre del producto</label>
          <input name="name" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Ej: Perfume Sweet Rose" required />
        </div>
        <div className="input-group">
          <label>Categoría</label>
          <select name="category_id" value={form.category_id} onChange={(e) => updateField('category_id', e.target.value)} required>
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid three">
        <div className="input-group">
          <label>Precio actual</label>
          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="35.00" required />
        </div>
        <div className="input-group">
          <label>Precio anterior</label>
          <input name="old_price" type="number" min="0" step="0.01" value={form.old_price} onChange={(e) => updateField('old_price', e.target.value)} placeholder="45.00" />
        </div>
        <div className="input-group">
          <label>Stock</label>
          <input name="stock" type="number" min="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} placeholder="10" />
        </div>
      </div>

      <div className="image-uploader">
        <div className="input-group">
          <label>Imagen del producto</label>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
          <small>Formatos recomendados: JPG, PNG o WEBP. Máximo 5 MB.</small>
        </div>
        <div className="image-preview">
          {form.image_url ? <img src={form.image_url} alt="Vista previa" /> : <span>Vista previa</span>}
        </div>
      </div>

      <div className="ai-box">
        <div>
          <h3>Generador con IA</h3>
          <p>Sube una imagen, presiona el botón y el sistema propondrá una descripción. Siempre revísala antes de guardar.</p>
        </div>
        <button type="button" className="btn btn-dark" onClick={generateWithAi} disabled={loadingAi || loadingImage}>
          {loadingAi ? 'Generando...' : 'Generar descripción con IA'}
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}

      <div className="input-group">
        <label>Descripción corta</label>
        <textarea name="short_description" value={form.short_description} onChange={(e) => updateField('short_description', e.target.value)} placeholder="Aroma delicado, juvenil y fresco, ideal para uso diario." />
      </div>
      <div className="input-group">
        <label>Descripción completa</label>
        <textarea name="long_description" rows={6} value={form.long_description} onChange={(e) => updateField('long_description', e.target.value)} placeholder="Describe beneficios, estilo, uso recomendado y ocasión ideal." />
      </div>
      <div className="input-group">
        <label>Mensaje para WhatsApp</label>
        <textarea name="whatsapp_text" value={form.whatsapp_text} onChange={(e) => updateField('whatsapp_text', e.target.value)} placeholder="Hola, estoy interesada en este producto. ¿Sigue disponible?" />
      </div>
      <div className="input-group">
        <label>Etiquetas IA</label>
        <input name="tags" value={form.tags} onChange={(e) => updateField('tags', e.target.value)} placeholder="perfume, fragancia, femenino, regalo" />
      </div>

      <div className="check-grid">
        <label className="check-row align-left">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} />
          Publicar producto
        </label>
        <label className="check-row align-left">
          <input type="checkbox" name="is_offer" checked={form.is_offer} onChange={(e) => updateField('is_offer', e.target.checked)} />
          Marcar como oferta
        </label>
        <label className="check-row align-left">
          <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={(e) => updateField('is_featured', e.target.checked)} />
          Destacado
        </label>
      </div>

      <button type="submit" className="btn btn-primary big">Guardar producto</button>
    </form>
  )
}
