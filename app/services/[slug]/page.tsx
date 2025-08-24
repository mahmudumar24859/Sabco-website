import DOMPurify from 'isomorphic-dompurify'
import Link from 'next/link'
import Breadcrumbs from '../../../components/Breadcrumbs'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getService(slug: string) {
  const res = await fetch(`${API}/services/${slug}/`, { next: { revalidate: 300 } })
  if (!res.ok) return null
  return res.json()
}

async function getProjectsByService(slug: string) {
  // requires backend filter: services__slug
  const res = await fetch(`${API}/projects/?services__slug=${encodeURIComponent(slug)}`, { next: { revalidate: 300 } })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json) ? json : (json.results ?? [])
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = await getService(params.slug)
  if (!s) return {}
  const desc = (s.summary || s.body || '').toString().replace(/<[^>]+>/g, '').slice(0, 160)
  return {
    title: s.title,
    description: desc,
    alternates: { canonical: `/services/${s.slug}` },
  }
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const [s, projects] = await Promise.all([getService(params.slug), getProjectsByService(params.slug)])
  if (!s) return <div className="card">Service not found.</div>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    provider: { '@type': 'Organization', name: 'Sabco Multi Trade LTD' },
    description: (s.summary || '').toString().replace(/<[^>]+>/g, ''),
    areaServed: 'NG',
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Services', href: '/services' }, { name: s.title }]} />

      <h1 className="text-3xl font-bold">{s.title}</h1>
      {s.summary && <p className="text-lg text-slate-800 dark:text-slate-200">{s.summary}</p>}

      {s.body && (
        <article className="space-y-3" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.body) }} />
      )}

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Related Projects</h2>
        {projects.length ? (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p: any) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="card hover:shadow-lg transition">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {p.sector} • {p.state} • {p.year}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-700 dark:text-slate-300">No related projects yet.</p>
        )}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}