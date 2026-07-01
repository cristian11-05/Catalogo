import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <Link href="/" className="brand">
          <Image
            src="/logo.png"
            alt="Logo XM Venta de Maquillaje"
            width={58}
            height={58}
            className="brand-logo"
            priority
          />

          <span className="brand-text">
            <strong>XM Venta de Maquillaje</strong>
            <small>Belleza que te inspira</small>
          </span>
        </Link>

        <button className="cart-btn" aria-label="Carrito">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
      </div>
    </header>
  )
}