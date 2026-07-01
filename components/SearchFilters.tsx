import { Category } from '@/lib/types'

export default function SearchFilters({ current }: { current: Record<string, string | undefined> }) {
  return (
    <form action="/" className="search-bar-wrap">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input name="q" defaultValue={current.q || ''} placeholder="Buscar productos, marcas y más..." className="search-input" />
      <button type="submit" className="filter-btn" aria-label="Filtros">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
      </button>
    </form>
  )
}
