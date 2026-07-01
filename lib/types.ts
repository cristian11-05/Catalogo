export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  background_url: string | null
  is_active: boolean
  created_at: string
}

export type AiTag = {
  id: string
  product_id: string
  tag: string
  confidence: number | null
  created_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  price: number
  old_price: number | null
  short_description: string | null
  long_description: string | null
  whatsapp_text: string | null
  image_url: string | null
  category_id: string | null
  stock: number | null
  is_active: boolean
  is_offer: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type ProductWithCategory = Product & {
  categories: Category | null
  ai_tags?: AiTag[]
}

export type AiDescriptionResponse = {
  suggestedName?: string
  categoryGuess?: string
  shortDescription: string
  longDescription: string
  whatsappText: string
  tags: string[]
}
