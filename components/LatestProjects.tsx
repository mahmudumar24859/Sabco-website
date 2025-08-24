// components/LatestProjects.tsx
import Link from 'next/link'
import Image from 'next/image'
import Reveal from './Reveal'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function getLatestProjects(limit = 3) {
  try {
    const res = await fetch(`${API}/projects/`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json()
    const list = Array.isArray(json) ? json : (json.results ?? [])
    return list.slice(0, limit)
  } catch { return [] }
}

export default async function LatestProjects({ limit = 3 }: { limit?: number }) {
  const projects = await getLatestProjects(limit)

  return (
    <section className="space-y-4" aria-labelledby="latest-projects">
      <div className="flex items-baseline justify-between">
        <h2 id="latest-projects" className="text-2xl md:text-3xl font-bold">Latest Projects</h2>
        <Link href="/projects" className="link-underline text-sky-700 dark:text-sky-400">View all →</Link>
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <p className="text-slate-700 dark:text-slate-300">No projects yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p: any, i: number) => {
            const cover = p.cover_image || p.images?.[0]?.image
            return (
              <Reveal key={p.slug} delay={i * 100}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="card group transition duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative w-full h-48 mb-3 rounded overflow-hidden bg-slate-100">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-600 dark:text-slate-400">
                        No image
                      </div>
                    )}

                    {/* subtle gradient overlay on hover */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {p.sector} • {p.state} • {p.year}
                  </p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </section>
  )
}