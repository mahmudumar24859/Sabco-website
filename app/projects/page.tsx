'use client'
import useSWR from 'swr'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProjectsPage() {
  const { data, error } = useSWR(`${API}/projects/`, fetcher)
  const projects = data?.results || []

  const [sector, setSector] = useState('')
  const [state, setState] = useState('')
  const [year, setYear] = useState('')

  const years = useMemo(
    () => Array.from(new Set(projects.map(p => p.year))).sort((a, b) => b - a),
    [projects]
  )
  const states = useMemo(
    () => Array.from(new Set(projects.map(p => p.state))).sort(),
    [projects]
  )

  const filtered = projects.filter(
    p =>
      (!sector || p.sector === sector) &&
      (!state || p.state === state) &&
      (!year || String(p.year) === year)
  )

  if (error) return <p className="text-red-500">Failed to load projects</p>
  if (!data) return <p>Loading projects...</p>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Projects</h1>

      {/* Filters */}
      <div className="card flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm">Sector</label>
          <select value={sector} onChange={e => setSector(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All</option>
            <option value="industrial">Industrial</option>
            <option value="commercial">Commercial</option>
            <option value="public">Public Works</option>
            <option value="residential">Residential</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">State</label>
          <select value={state} onChange={e => setState(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Year</label>
          <select value={year} onChange={e => setYear(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All</option>
            {years.map(y => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>

        {(sector || state || year) && (
          <button
            onClick={() => { setSector(''); setState(''); setYear('') }}
            className="btn btn-primary"
          >
            Reset
          </button>
        )}
      </div>

      {/* Project cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map(p => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="card hover:shadow-lg transition">
            <div className="relative w-full h-48 mb-3">
              <Image
                src={p.cover_image}
                alt={p.title}
                fill
                className="object-cover rounded"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-sm text-slate-600">
              {p.sector} • {p.state} • {p.year}
            </p>
          </Link>
        ))}
        {!filtered.length && <p className="text-slate-500">No projects found.</p>}
      </div>
    </div>
  )
}
