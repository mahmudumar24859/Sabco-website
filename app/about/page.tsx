// app/about/page.tsx
import Image from 'next/image'
import { HistoryPhilosophy, Objectives, PhilosophyModel, VisionMission } from '../../components/AboutSections'

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function getData() {
  const [certsRes, teamRes] = await Promise.all([
    fetch(`${API}/certifications/`, { cache: 'no-store' }),
    fetch(`${API}/team/`, { cache: 'no-store' }),
  ])
  const certs = certsRes.ok ? await certsRes.json() : { results: [] }
  const team = teamRes.ok ? await teamRes.json() : { results: [] }
  return { certs: certs.results || [], team: team.results || [] }
}

export default async function AboutPage() {
  const { certs, team } = await getData()

  return (
    <div className="space-y-12">
      {/* Core company sections */}
      <HistoryPhilosophy id="history-philosophy" />
      <Objectives id="objectives" />
      <PhilosophyModel id="philosophy" />
      <VisionMission id="vision-mission" />

      {/* Certifications */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">HSE & Certifications</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {certs.map((c:any) => (
            <article key={c.id} className="card">
              {c.image && (
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-contain rounded"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((t:any) => (
            <article key={t.id} className="card text-center">
              {t.photo && (
                <div className="relative w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" />
                </div>
              )}
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-slate-600">{t.role}</p>
              <p className="text-sm mt-2">{t.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}