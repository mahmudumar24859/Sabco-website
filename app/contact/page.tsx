
'use client'
import { useState } from 'react'

export default function Contact(){
  const [status,setStatus]=useState('')
  async function onSubmit(e){
    e.preventDefault()
    setStatus('Sending...')
    const form = e.target
    const data = new FormData(form)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/`, { method:'POST', body: data })
    if(res.ok){ setStatus('Thank you! We will be in touch.'); form.reset(); window.location.href='/contact/success' }
    else{ setStatus('Something went wrong') }
  }
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Contact</h1>
      <form onSubmit={onSubmit} className="card grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">Full Name<input name="name" required className="border rounded px-3 py-2"/></label>
        <label className="flex flex-col gap-1">Email<input type="email" name="email" required className="border rounded px-3 py-2"/></label>
        <label className="flex flex-col gap-1">Phone<input name="phone" className="border rounded px-3 py-2"/></label>
        <label className="flex flex-col gap-1">Project Type<select name="project_type" className="border rounded px-3 py-2"><option value="">Select</option><option>General Contracting</option><option>Precast</option><option>Terrazzo</option></select></label>
        <label className="md:col-span-2 flex flex-col gap-1">Message<textarea name="message" rows={5} className="border rounded px-3 py-2"/></label>
        <div className="md:col-span-2"><button className="btn btn-primary" type="submit">Send Request</button><p className="mt-2 text-sm">{status}</p></div>
      </form>
    </div>
  )
}
