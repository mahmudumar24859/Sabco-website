import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '../../../components/Breadcrumbs'
import DOMPurify from 'isomorphic-dompurify'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getEquipment(slug: string) {
  const res = await fetch(`${API}/equipment/${slug}/`, { next: { revalidate: 300 } })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const e = await getEquipment(params.slug)
  if (!e) return {}
  const desc = (e.capability || '').toString().slice(0, 160)
  return {
    title: e.name,
    description: desc,
    alternates: { canonical: `/equipment/${e.slug}` },
    openGraph: { images: e.image ? [{ url: e.image, width: 1200, height: 630 }] : undefined },
    twitter: { images: e.image ? [e.image] : undefined },
  }
}

export default async function EquipmentDetailPage({ params }: { params: { slug: string } }) {
  const e = await getEquipment(params.slug)
  if (!e) return <div className="card">Equipment not found.</div>

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Equipment', href: '/equipment' }, { name: e.name }]} />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{e.name}</h1>
        <Link href="/equipment" className="text-sky-700 hover:underline">Back to equipment</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-slate-100">
            {e.image && <Image src={e.image} alt={e.name} fill className="object-cover" />}
          </div>
          {e.specs && (
            <article className="space-y-3" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(e.specs) }} />
          )}
        </div>

        <aside className="space-y-2">
          {e.category && <p><strong>Category:</strong> {e.category}</p>}
          {e.make && <p><strong>Make:</strong> {e.make}</p>}
          {e.model && <p><strong>Model:</strong> {e.model}</p>}
          {e.year && <p><strong>Year:</strong> {e.year}</p>}
          {e.capacity && <p><strong>Capacity:</strong> {e.capacity}</p>}
          {e.capability && <p><strong>Capability:</strong> {e.capability}</p>}
        </aside>
      </div>
    </div>
  )
}