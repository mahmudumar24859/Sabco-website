import Image from 'next/image'

export const revalidate = 300
const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function fetchJson(path: string) {
  const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } })
  if (!res.ok) return { results: [] }
  return res.json()
}

export const metadata = {
  title: 'Equipment & Fleet',
  description: 'Our production and site equipment with capacity and capabilities.',
  alternates: { canonical: '/equipment' },
}

export default async function EquipmentPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams?.category || ''
  const qs = new URLSearchParams()
  if (category) qs.set('category__slug', category)

  const [catsRes, equipRes] = await Promise.all([
    fetchJson('/equipment-categories/'),
    fetchJson(`/equipment/${qs.toString() ? `?${qs.toString()}` : ''}`),
  ])
  const categories = Array.isArray(catsRes) ? catsRes : (catsRes.results || [])
  const equipment = Array.isArray(equipRes) ? equipRes : (equipRes.results || [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Equipment & Fleet</h1>

      <form className="card flex flex-wrap gap-4 items-end" action="/equipment" method="get">
        <div>
          <label className="block text-sm">Category</label>
          <select name="category" defaultValue={category} className="border rounded px-3 py-2">
            <option value="">All</option>
            {categories.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <button className="btn btn-primary">Filter</button>
      </form>

      <div className="grid md:grid-cols-3 gap-6">
        {equipment.map((e: any) => (
          <div key={e.slug} className="card">
            <div className="relative w-full h-48 mb-3 rounded overflow-hidden bg-slate-100">
              {e.image ? (
                <Image src={e.image} alt={e.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600">No image</div>
              )}
            </div>
            <h3 className="font-semibold text-lg">{e.name}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {e.category || ''}{e.category ? ' • ' : ''}{e.capacity || e.capability}
            </p>
          </div>
        ))}
        {!equipment.length && <p className="text-slate-700 dark:text-slate-300">No equipment found.</p>}
      </div>
    </div>
  )
}