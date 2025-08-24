import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import Breadcrumbs from '../../../components/Breadcrumbs'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getPost(slug: string) {
  const res = await fetch(`${API}/posts/${slug}/`, { next: { revalidate: 300 } })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const b = await getPost(params.slug)
  if (!b) return {}
  const desc = (b.excerpt || b.body || '').toString().replace(/<[^>]+>/g, '').slice(0, 160)
  return {
    title: b.title,
    description: desc,
    alternates: { canonical: `/blog/${b.slug}` },
    openGraph: { images: b.image ? [{ url: b.image, width: 1200, height: 630 }] : undefined },
    twitter: { images: b.image ? [b.image] : undefined },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const b = await getPost(params.slug)
  if (!b) return <div className="card">Post not found.</div>

  const date = b.published ? new Date(b.published).toLocaleDateString() : ''

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }, { name: b.title }]} />
      <h1 className="text-3xl font-bold">{b.title}</h1>
      {date && <p className="text-slate-600 dark:text-slate-400">{date}</p>}
      {b.image && (
        <div className="relative w-full aspect-[16/9] rounded overflow-hidden bg-slate-100">
          <Image src={b.image} alt={b.title} fill className="object-cover" />
        </div>
      )}
      {b.body && (
        <article
          className="space-y-3"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(b.body) }}
        />
      )}
    </div>
  )
}