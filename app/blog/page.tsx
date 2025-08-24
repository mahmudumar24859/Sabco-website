import Link from 'next/link'
import Image from 'next/image'

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

export default async function BlogPage() {
  const res = await fetch(`${API}/posts/`, { cache: 'no-store' })
  const data = res.ok ? await res.json() : { results: [] }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Insights & Updates</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {data.results.map(p => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="card hover:shadow-lg transition"
          >
            {p.image && (
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-sm text-slate-600">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
