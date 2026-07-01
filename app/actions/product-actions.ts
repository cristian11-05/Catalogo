'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createProductSlug, normalizeTags } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === 'on'
}

function numberOrNull(value: FormDataEntryValue | null) {
  const raw = String(value || '').trim()
  if (!raw) return null
  const number = Number(raw)
  return Number.isFinite(number) ? number : null
}

function textOrNull(value: FormDataEntryValue | null) {
  const raw = String(value || '').trim()
  return raw || null
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const price = numberOrNull(formData.get('price'))

  if (!name || price === null) throw new Error('El nombre y precio son obligatorios')

  const newProd = {
    name,
    slug: createProductSlug(name),
    price,
    old_price: numberOrNull(formData.get('old_price')),
    short_description: textOrNull(formData.get('short_description')),
    long_description: textOrNull(formData.get('long_description')),
    whatsapp_text: textOrNull(formData.get('whatsapp_text')) || `Hola, me interesa comprar el producto ${name} a S/.${price}. ¿Aún lo tienen disponible?`,
    image_url: textOrNull(formData.get('image_url')),
    category_id: textOrNull(formData.get('category_id')),
    stock: numberOrNull(formData.get('stock')),
    is_active: checkboxValue(formData, 'is_active'),
    is_offer: checkboxValue(formData, 'is_offer'),
    is_featured: checkboxValue(formData, 'is_featured'),
  }

  const supabase = await createClient()

  const { error } = await supabase.from('products').insert(newProd)
  if (error) {
    console.error('Error creando producto en Supabase:', error)
    if (error.code === '23505') {
      throw new Error('Ya existe un producto con ese nombre. Por favor, elige otro nombre.')
    }
    throw new Error(`No se pudo crear el producto en la base de datos: ${error.message || JSON.stringify(error)}`)
  }

  // Tags feature has been simplified (not saving to DB currently). 
  // You can create an `ai_tags` table in Supabase and insert them here if needed.

  revalidatePath('/')
  revalidatePath('/admin/productos')
  redirect('/admin/productos')
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const price = numberOrNull(formData.get('price'))

  if (!id || !name || price === null) throw new Error('Faltan datos del producto')

  const updates = {
    name,
    price,
    old_price: numberOrNull(formData.get('old_price')),
    short_description: textOrNull(formData.get('short_description')),
    long_description: textOrNull(formData.get('long_description')),
    whatsapp_text: textOrNull(formData.get('whatsapp_text')),
    image_url: textOrNull(formData.get('image_url')),
    category_id: textOrNull(formData.get('category_id')),
    stock: numberOrNull(formData.get('stock')),
    is_active: checkboxValue(formData, 'is_active'),
    is_offer: checkboxValue(formData, 'is_offer'),
    is_featured: checkboxValue(formData, 'is_featured'),
    updated_at: new Date().toISOString()
  }

  const supabase = await createClient()

  const { error } = await supabase.from('products').update(updates).eq('id', id)
  if (error) {
    console.error('Error actualizando producto en Supabase:', error)
    throw new Error('No se pudo actualizar el producto en la base de datos')
  }

  revalidatePath('/')
  revalidatePath('/admin/productos')
  redirect('/admin/productos')
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get('id') || '')
  if (!id) throw new Error('ID de producto no válido')

  const supabase = await createClient()

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    console.error('Error eliminando producto en Supabase:', error)
    throw new Error('No se pudo eliminar el producto de la base de datos')
  }

  revalidatePath('/')
  revalidatePath('/admin/productos')
}
