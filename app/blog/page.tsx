import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 300
const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getPosts() {
  const res = await fetch(`${API}/posts/`, { next: { revalidate: 300 } })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json) ? json : (json.results ?? [])
}

export const metadata = {
  title: 'Blog & Insights',
  description: 'Updates from Sabco: projects, products, and company news.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog & Insights</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((b: any) => (
          <Link key={b.slug} href={`/blog/${b.slug}`} className="card hover:shadow-lg transition">
            {b.image && (
              <div className="relative w-full h-40 mb-3 rounded overflow-hidden bg-slate-100">
                <Image src={b.image} alt={b.title} fill className="object-cover" />
              </div>
            )}
            <h3 className="font-semibold">{b.title}</h3>
            {b.excerpt && <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{b.excerpt}</p>}
          </Link>
        ))}
        {!posts.length && <p className="text-slate-700 dark:text-slate-300">No posts yet.</p>}
      </div>
    </div>
  )
}