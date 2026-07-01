import { NextResponse } from 'next/server'
import { AiDescriptionResponse } from '@/lib/types'

export const runtime = 'nodejs'

type RequestBody = {
  imageUrl?: string
  productName?: string
  categoryName?: string
}

function fallbackDescription(productName?: string, categoryName?: string): AiDescriptionResponse {
  const name = productName?.trim() || 'Producto destacado'
  const category = categoryName?.trim() || 'catálogo'

  return {
    suggestedName: name,
    categoryGuess: category,
    shortDescription: `${name} con presentación atractiva, ideal para quienes buscan una opción práctica y bonita.`,
    longDescription: `${name} pertenece a la categoría ${category}. Es una opción pensada para uso diario, regalo o para complementar una compra especial. Su presentación ayuda a mostrar un estilo cuidado, moderno y agradable para el cliente.`,
    whatsappText: `Hola, estoy interesada en ${name}. ¿Sigue disponible?`,
    tags: [category.toLowerCase(), 'producto', 'catálogo', 'oferta']
  }
}

function extractTextFromResponse(data: any) {
  if (typeof data?.output_text === 'string') return data.output_text

  const chunks = data?.output
    ?.flatMap((item: any) => item?.content || [])
    ?.map((content: any) => content?.text || '')
    ?.filter(Boolean)

  return chunks?.join('\n') || ''
}

function parseJson(text: string) {
  const clean = text.replace(/```json|```/g, '').trim()
  const first = clean.indexOf('{')
  const last = clean.lastIndexOf('}')
  const json = first >= 0 && last >= 0 ? clean.slice(first, last + 1) : clean
  return JSON.parse(json)
}

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody

  if (!body.imageUrl) {
    return NextResponse.json({ error: 'Debes enviar una URL pública de la imagen.' }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(fallbackDescription(body.productName, body.categoryName))
  }

  const prompt = `
Eres una asistente experta en crear descripciones comerciales para un catálogo online femenino y profesional.
Analiza la imagen del producto y, si se ve texto o marca, úsalo con cuidado sin inventar datos.
No afirmes aromas exactos, beneficios médicos ni características que no se puedan deducir.
Devuelve SOLO JSON válido, sin markdown, con esta estructura:
{
  "suggestedName": "nombre sugerido corto",
  "categoryGuess": "categoría probable",
  "shortDescription": "máximo 22 palabras",
  "longDescription": "descripción comercial de 55 a 80 palabras, natural y humana",
  "whatsappText": "mensaje corto para consultar disponibilidad por WhatsApp",
  "tags": ["etiqueta1", "etiqueta2", "etiqueta3", "etiqueta4"]
}
Contexto opcional:
Nombre escrito por la administradora: ${body.productName || 'No indicado'}
Categoría seleccionada: ${body.categoryName || 'No indicada'}
`

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: prompt },
              { type: 'input_image', image_url: body.imageUrl, detail: 'low' }
            ]
          }
        ],
        max_output_tokens: 500
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.message || 'No se pudo analizar la imagen.' }, { status: 500 })
    }

    const text = extractTextFromResponse(data)
    const parsed = parseJson(text)

    return NextResponse.json({
      suggestedName: parsed.suggestedName || body.productName || 'Producto destacado',
      categoryGuess: parsed.categoryGuess || body.categoryName || 'Catálogo',
      shortDescription: parsed.shortDescription || fallbackDescription(body.productName, body.categoryName).shortDescription,
      longDescription: parsed.longDescription || fallbackDescription(body.productName, body.categoryName).longDescription,
      whatsappText: parsed.whatsappText || fallbackDescription(body.productName, body.categoryName).whatsappText,
      tags: Array.isArray(parsed.tags) ? parsed.tags : fallbackDescription(body.productName, body.categoryName).tags
    })
  } catch {
    return NextResponse.json(fallbackDescription(body.productName, body.categoryName))
  }
}
