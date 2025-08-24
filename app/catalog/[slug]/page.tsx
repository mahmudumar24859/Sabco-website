import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '../../../components/Breadcrumbs'
import RequestSampleForm from '../../../components/RequestSampleForm'
import DOMPurify from 'isomorphic-dompurify'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getProduct(slug: string) {
  const res = await fetch(`${API}/products/${slug}/`, { next: { revalidate: 300 } })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug)
  if (!p) return {}
  const plain = (p.summary || p.body || '').toString().replace(/<[^>]+>/g, '').trim()
  const desc = plain.slice(0, 160)
  const img = p.cover_image || p.images?.[0]?.image
  return {
    title: p.title,
    description: desc,
    alternates: { canonical: `/catalog/${p.slug}` },
    openGraph: { images: img ? [{ url: img, width: 1200, height: 630 }] : undefined },
    twitter: { images: img ? [img] : undefined },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug)
  if (!p) return <div className="card">Product not found.</div>

  const gallery: { id?: number; image: string; alt_text?: string }[] =
    p.images?.length ? p.images : (p.cover_image ? [{ image: p.cover_image, alt_text: p.title }] : [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: (p.summary || '').toString().replace(/<[^>]+>/g, ''),
    image: gallery.map(g => g.image),
    brand: { '@type': 'Organization', name: 'Sabco Multi Trade LTD' },
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Catalog', href: '/catalog' }, { name: p.title }]} />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{p.title}</h1>
        <Link href="/catalog" className="text-sky-700 hover:underline">Back to catalog</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((img, i) => (
              <div key={img.id || i} className="relative w-full aspect-[4/3] rounded overflow-hidden bg-slate-100">
                <Image src={img.image} alt={img.alt_text || p.title} fill className="object-cover" />
              </div>
            ))}
          </div>

          {p.body && (
            <article
              className="space-y-3"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.body) }}
            />
          )}
        </div>

        <aside className="space-y-4">
          {p.category && <p><strong>Category:</strong> {p.category}</p>}
          {p.pattern && <p><strong>Pattern:</strong> {p.pattern.name}</p>}
          {p.finishes?.length > 0 && (
            <p><strong>Finishes:</strong> {p.finishes.map((f: any) => f.name).join(', ')}</p>
          )}
          {p.variants?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Variants</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {p.variants.map((v: any) => (
                  <li key={v.id}>
                    {v.size}{v.thickness ? ` • ${v.thickness}` : ''}{v.finish ? ` • ${v.finish.name}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {p.spec_sheet && (
            <a href={p.spec_sheet} target="_blank" rel="noreferrer" className="btn border">Download spec sheet</a>
          )}

          <RequestSampleForm productId={p.id} productTitle={p.title} />
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}