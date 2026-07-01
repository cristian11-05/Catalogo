'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    // Bypassing real login for testing
    setTimeout(() => {
      router.push('/admin')
      router.refresh()
    }, 500)
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <span className="eyebrow">Acceso de prueba</span>
        <h1>Ingresar al panel (Mock)</h1>
        <p>El login real con Supabase está deshabilitado. Presiona Entrar para acceder al panel de pruebas.</p>
        <div className="input-group">
          <label>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tienda.com" required />
        </div>
        <div className="input-group">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
        </div>
        <button className="btn btn-primary big full" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</button>
      </form>
    </main>
  )
}
