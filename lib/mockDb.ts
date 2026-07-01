import fs from 'fs'
import path from 'path'
import { Category, ProductWithCategory } from './types'

const DB_FILE = path.join(process.cwd(), 'lib', 'db.json')

type DbState = {
  categories: Category[]
  products: ProductWithCategory[]
}

const defaultState: DbState = {
  categories: [
    {
      id: 'cat-1',
      name: 'Perfumes',
      slug: 'perfumes',
      description: 'Los mejores perfumes del mercado.',
      background_url: null,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Perfume Sweet Rose',
      slug: 'perfume-sweet-rose-123',
      price: 120.50,
      old_price: 150.00,
      short_description: 'Aroma delicado y fresco.',
      long_description: 'Perfecto para ocasiones especiales y uso diario.',
      whatsapp_text: 'Hola, me interesa el Perfume Sweet Rose',
      image_url: null,
      category_id: 'cat-1',
      stock: 50,
      is_active: true,
      is_offer: true,
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      categories: {
        id: 'cat-1',
        name: 'Perfumes',
        slug: 'perfumes',
        description: 'Los mejores perfumes del mercado.',
        background_url: null,
        is_active: true,
        created_at: new Date().toISOString()
      }
    }
  ]
}

function readDb(): DbState {
  if (!fs.existsSync(DB_FILE)) {
    writeDb(defaultState)
    return defaultState
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    return defaultState
  }
}

function writeDb(state: DbState) {
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8')
}

export const mockDb = {
  getCategories: () => readDb().categories,
  getProducts: () => readDb().products,
  addCategory: (cat: Category) => {
    const db = readDb()
    db.categories.push(cat)
    writeDb(db)
  },
  updateCategory: (id: string, updates: Partial<Category>) => {
    const db = readDb()
    db.categories = db.categories.map(c => c.id === id ? { ...c, ...updates } : c)
    // Update populated category in products too
    db.products = db.products.map(p => p.category_id === id ? { ...p, categories: { ...p.categories!, ...updates } } : p)
    writeDb(db)
  },
  deleteCategory: (id: string) => {
    const db = readDb()
    db.categories = db.categories.filter(c => c.id !== id)
    // Optional: remove category_id from products
    writeDb(db)
  },
  addProduct: (prod: ProductWithCategory) => {
    const db = readDb()
    // Find category to populate
    const cat = db.categories.find(c => c.id === prod.category_id) || null
    prod.categories = cat
    db.products.push(prod)
    writeDb(db)
  },
  updateProduct: (id: string, updates: Partial<ProductWithCategory>) => {
    const db = readDb()
    db.products = db.products.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updates, updated_at: new Date().toISOString() }
        if (updates.category_id !== undefined) {
          merged.categories = db.categories.find(c => c.id === merged.category_id) || null
        }
        return merged
      }
      return p
    })
    writeDb(db)
  },
  deleteProduct: (id: string) => {
    const db = readDb()
    db.products = db.products.filter(p => p.id !== id)
    writeDb(db)
  }
}
