export function formatCurrency(value: number | string | null | undefined) {
  const number = Number(value ?? 0)
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(number)
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function whatsappLink(productName: string, price?: number | string | null, customMessage?: string | null) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51917308019'
  const baseMessage = customMessage || `Hola, estoy interesado en este producto: ${productName}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(baseMessage)}`
}

export function createProductSlug(name: string) {
  return `${slugify(name)}-${Date.now().toString(36)}`
}

export function normalizeTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
}
