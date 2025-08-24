import Link from 'next/link'

export const revalidate = 300
const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getServices() {
  const res = await fetch(`${API}/services/`, { next: { revalidate: 300 } })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json) ? json : (json.results ?? [])
}

export const metadata = {
  title: 'Services',
  description: 'Precast and terrazzo manufacturing, heavy-duty interlocking procurement, and project management.',
  alternates: { canonical: '/services' },
}

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Services</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s: any) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="card hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">{s.title}</h3>
            {s.summary && <p className="text-slate-700 dark:text-slate-300 mt-1">{s.summary}</p>}
            <p className="text-sm text-slate-500 mt-2">Read more →</p>
          </Link>
        ))}
        {!services.length && <p className="text-slate-700 dark:text-slate-300">No services available yet.</p>}
      </div>
    </div>
  )
}