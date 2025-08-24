// components/AboutSections.tsx
"use client"

import Link from "next/link"

type SectionProps = { compact?: boolean; id?: string }

export function HistoryPhilosophy({ compact = false, id }: SectionProps) {
  const p1 =
    "Sabco Multi Trade Limited is a general works contractor; builders since 1998. Over the years, the company undertook many challenging projects and accumulated skills, know-how, and experiences in design, building, and manufacturing precast solutions; project management and heavy-duty interlocking procurement within Kano, and other states of the Federation."
  const p2 =
    "Today, Sabco Multi Trade LTD takes on the role of both main and subcontractor for small, medium, and large size projects, and performs project management services to coordinate special trades for industrial and commercial projects. We also provide new designs of precast tiles terrazzo with high international standard as value-added services to our clients, to suit flooring and wall cladding finishing environments."

  return (
    <section id={id} className="space-y-3">
      <h2 className="text-2xl md:text-3xl font-bold">History & Philosophy</h2>
      <p className="text-slate-800 dark:text-slate-200">{p1}</p>
      {!compact && <p className="text-slate-800 dark:text-slate-200">{p2}</p>}
      {compact && (
        <div className="pt-2">
          <Link href="/about#history-philosophy" className="text-sky-700 hover:underline">
            Read more →
          </Link>
        </div>
      )}
    </section>
  )
}

export function Objectives({ compact = false, id }: SectionProps) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-2xl md:text-3xl font-bold">Our Objectives</h2>
      <p className="text-slate-800 dark:text-slate-200">
        Our objective is to provide our clients with an “I am assured” experience when we are chosen to execute
        their project. Our emphasis on clear communication and follow-through procedures ensures that clients’
        objectives are top priority in the planning and execution of all our processes.
      </p>
      {!compact && (
        <blockquote className="border-l-4 pl-4 italic text-slate-600">
          “We take pride in our delivery, thus our clients can always be assured that only the most experienced and
          qualified people/engineers are serving them all the time”.
        </blockquote>
      )}
      {compact && (
        <div className="pt-2">
          <Link href="/about#objectives" className="text-sky-700 hover:underline">
            Read more →
          </Link>
        </div>
      )}
    </section>
  )
}

export function PhilosophyModel({ compact = false, id }: SectionProps) {
  const steps = [
    "Create detailed schedule and resources plan to meet the client’s project objectives.",
    "Communicate clearly with all project stakeholders.",
    "Track project progress and fine-tune deviations.",
    "Supervise closely on the quality of work done.",
    "Complete and commission the project on time.",
  ]
  const visible = compact ? steps.slice(0, 3) : steps
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-2xl md:text-3xl font-bold">Our Project Management Philosophy</h2>
      <ol className="list-decimal pl-6 space-y-2 text-slate-800 dark:text-slate-200">
        {visible.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      {compact && (
        <div className="pt-2">
          <Link href="/about#philosophy" className="text-sky-700 hover:underline">
            Read more →
          </Link>
        </div>
      )}
    </section>
  )
}

export function VisionMission({ compact = false, id }: SectionProps) {
  const vision =
    "To be a respectable precast manufacturer and building contractor, delivering beyond expectations."
  const mission =
    "To procure projects at competitive prices, ensure safe working conditions, and deliver quality within a reasonable time frame."
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-2xl md:text-3xl font-bold">Vision & Mission</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold">Our Vision</h3>
          <p className="mt-2 text-slate-800 dark:text-slate-200">“{vision}”</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Our Mission</h3>
          <p className="mt-2 text-slate-800 dark:text-slate-200">“{mission}”</p>
        </div>
      </div>
      {compact && (
        <div className="pt-2">
          <Link href="/about#vision-mission" className="text-sky-700 hover:underline">
            Read more →
          </Link>
        </div>
      )}
    </section>
  )
}