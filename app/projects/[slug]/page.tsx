<script type="application/ld+json" dangerouslySetInnerHTML={{
  __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Project",
    "name": "Kano Logistics Yard",
    "location": "Kano, Nigeria",
    "startDate": "2023",
    "endDate": "2023",
    "description": "Large-scale logistics yard with heavy-duty interlocking paving.",
    "creator": { "@type": "Organization", "name": "Sabco Multi Trade LTD" }
  })
}} />

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

async function getProject(slug: string) {
  const res = await fetch(`${API}/projects/${slug}/`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function ProjectDetail({ params }) {
  const project = await getProject(params.slug)
  if (!project) return <div className="py-6">Not found</div>

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-sm text-slate-600">
          {project.sector} • {project.state} • {project.year}
        </p>
      </header>

      {project.cover_image && (
        <img
          src={project.cover_image}
          alt={project.title}
          className="w-full rounded-lg"
        />
      )}

      <section dangerouslySetInnerHTML={{ __html: project.description || project.results }} />

      {project.images?.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {project.images.map(img => (
            <img
              key={img.id}
              src={img.image}
              alt={img.alt_text || project.title}
              className="rounded shadow"
            />
          ))}
        </div>
      )}
    </article>
  )
}
