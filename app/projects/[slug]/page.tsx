import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
// Adjust import path if you don’t use @ alias
import Breadcrumbs from '../../../components/Breadcrumbs'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getProject(slug: string) {
  const res = await fetch(`${API}/projects/${slug}/`, { next: { revalidate: 300 } })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProject(params.slug)
  if (!p) return {}
  const desc = (p.description || '').toString().replace(/<[^>]+>/g, '').slice(0, 160) || p.results || ''
  const img = p.cover_image || p.images?.[0]?.image
  return {
    title: p.title,
    description: desc,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { images: img ? [{ url: img, width: 1200, height: 630 }] : undefined },
    twitter: { images: img ? [img] : undefined },
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const p = await getProject(params.slug)
  if (!p) return <div className="card">Project not found.</div>

  const gallery: { id?: number; image: string; alt_text?: string }[] =
    p.images?.length ? p.images : (p.cover_image ? [{ image: p.cover_image, alt_text: p.title }] : [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: p.title,
    location: p.state ? `Nigeria, ${p.state}` : 'Nigeria',
    startDate: p.year?.toString(),
    description: (p.description || '').toString().replace(/<[^>]+>/g, ''),
    creator: { '@type': 'Organization', name: 'Sabco Multi Trade LTD' },
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Projects', href: '/projects' }, { name: p.title }]} />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{p.title}</h1>
        <Link href="/projects" className="text-sky-700 hover:underline">Back to projects</Link>
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

          {p.description && (
            <article
              className="space-y-3"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.description) }}
            />
          )}
        </div>

        <aside className="space-y-3">
          <p><strong>Sector:</strong> {p.sector}</p>
          <p><strong>Location:</strong> {p.state}</p>
          <p><strong>Year:</strong> {p.year}</p>
          <p><strong>Role:</strong> {p.role}</p>
          {p.materials && <p><strong>Materials:</strong> {p.materials}</p>}
          {p.services?.length > 0 && (
            <div>
              <h3 className="font-semibold">Services</h3>
              <ul className="list-disc pl-5 text-sm">
                {p.services.map((s: any) => <li key={s.slug}>{s.title}</li>)}
              </ul>
            </div>
          )}
          {p.results && (
            <div>
              <h3 className="font-semibold">Results</h3>
              <p className="text-sm">{p.results}</p>
            </div>
          )}
          {p.testimonial && (
            <blockquote className="border-l-4 pl-4 italic text-slate-600">
              “{p.testimonial}”
            </blockquote>
          )}
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}