import AdminNav from '@/components/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="admin-layout">
      <AdminNav />
      <section className="admin-content">
        {children}
      </section>
    </main>
  )
}
