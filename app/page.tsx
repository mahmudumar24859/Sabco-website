// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '../components/Reveal'
import { Suspense } from 'react'
import LatestProjectsSkeleton from '../components/LatestProjectsSkeleton'
import LatestProjects from '../components/LatestProjects'
import { HistoryPhilosophy, Objectives, PhilosophyModel, VisionMission } from '../components/AboutSections'

<script type="application/ld+json" dangerouslySetInnerHTML={{
  __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sabco Multi Trade LTD",
    "url": "https://www.sabco.com.ng",
    "logo": "https://www.sabco.com.ng/logo.png",
    "sameAs": ["https://www.linkedin.com/company/your-link"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG",
      "addressLocality": "Kano",
      "addressRegion": "Kano State"
    },
    "contactPoint": [{ "@type": "ContactPoint", "contactType": "Sales", "telephone": "+2347034223243" }]
  })
}} />

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

async function getLatestProjects(limit = 3) {
  const res = await fetch(`${API}/projects/`, { next: { revalidate: 300 } }) // cache for 5 min
  if (!res.ok) return []
  const json = await res.json()
  const list = Array.isArray(json) ? json : (json.results ?? [])
  return list.slice(0, limit)
}


export default async function Home() {
  const projects = await getLatestProjects(3)
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-10">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />

      <Reveal>
        <p className="mt-2 text-slate-800 dark:text-slate-200">Builders since 1998</p>
      </Reveal>
      <Reveal delay={60}>
        <h1 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
          Industrial & Commercial Construction. Nationwide Delivery from Kano.
        </h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-2 max-w-3xl text-slate-800 dark:text-slate-200">
          We deliver general contracting, project management, and precast manufacturing. We also design terrazzo tiles
          and wall cladding to international standards.
        </p>
      </Reveal>
      <Reveal delay={180}>
        <div className="mt-4 flex gap-3">
          <Link href="/contact" className="btn btn-primary transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50">
            Get a Quote
          </Link>
          <Link href="/projects" className="btn border transition-transform hover:-translate-y-0.5">
            Our Projects
          </Link>
        </div>
      </Reveal>
    </section>

      <Suspense fallback={<LatestProjectsSkeleton />}>
        <LatestProjects limit={3} />
      </Suspense>

      <Reveal><HistoryPhilosophy compact /></Reveal>
      <Reveal delay={60}><Objectives compact /></Reveal>
      <Reveal delay={120}><PhilosophyModel compact /></Reveal>
      <Reveal delay={180}><VisionMission compact /></Reveal>
    </div>
  )
}