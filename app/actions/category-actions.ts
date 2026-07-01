'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === 'on'
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get('name') || '').trim()

  if (!name) throw new Error('El nombre de la categoría es obligatorio')

  const newCat = {
    name,
    slug: slugify(name),
    description: String(formData.get('description') || '').trim() || null,
    background_url: String(formData.get('background_url') || '').trim() || null,
    is_active: checkboxValue(formData, 'is_active'),
  }

  const supabase = await createClient()

  const { error } = await supabase.from('categories').insert(newCat)
  if (error) {
    console.error('Error creando categoría en Supabase:', error)
    if (error.code === '23505') {
      throw new Error('Ya existe una categoría con ese nombre. Por favor, elige otro nombre.')
    }
    throw new Error(`No se pudo crear la categoría en la base de datos: ${error.message || JSON.stringify(error)}`)
  }

  revalidatePath('/')
  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()

  if (!id || !name) throw new Error('Faltan datos de la categoría')

  const updates = {
    name,
    slug: slugify(name),
    description: String(formData.get('description') || '').trim() || null,
    background_url: String(formData.get('background_url') || '').trim() || null,
    is_active: checkboxValue(formData, 'is_active')
  }

  const supabase = await createClient()

  const { error } = await supabase.from('categories').update(updates).eq('id', id)
  if (error) {
    console.error('Error actualizando categoría en Supabase:', error)
    throw new Error('No se pudo actualizar la categoría en la base de datos')
  }

  revalidatePath('/')
  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get('id') || '')
  if (!id) throw new Error('ID de categoría no válido')

  const supabase = await createClient()

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) {
    console.error('Error eliminando categoría en Supabase:', error)
    throw new Error('No se pudo eliminar la categoría de la base de datos')
  }

  revalidatePath('/')
  revalidatePath('/admin/categorias')
}
