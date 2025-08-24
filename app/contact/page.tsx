'use client'
import { useEffect, useState } from 'react'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [tokenReady, setTokenReady] = useState(false)

  useEffect(() => {
    ;(window as any).onTurnstileSuccess = () => setTokenReady(true)
    ;(window as any).onTurnstileExpire = () => setTokenReady(false)
    ;(window as any).onTurnstileError = () => setTokenReady(false)
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setErr(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch(`${API}/contact/`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Failed to send message')
      setOk(true)
      setTokenReady(false)
      e.currentTarget.reset()
      ;(window as any).turnstile?.reset?.()
    } catch (error: any) {
      setErr(error.message || 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  if (ok) return <div className="card">Thanks! We’ll be in touch shortly.</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <form onSubmit={onSubmit} className="card space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="name" required placeholder="Your name" className="border rounded px-3 py-2" />
          <input name="email" type="email" required placeholder="Email" className="border rounded px-3 py-2" />
          <input name="phone" placeholder="Phone" className="border rounded px-3 py-2" />
          <input name="project_type" placeholder="Project type" className="border rounded px-3 py-2" />
        </div>
        <textarea name="message" placeholder="Message" className="w-full border rounded px-3 py-2" rows={4} />
        <input name="file" type="file" accept="application/pdf,image/*" className="block" />

        <div
          className="cf-turnstile"
          data-sitekey={SITE_KEY}
          data-callback="onTurnstileSuccess"
          data-expired-callback="onTurnstileExpire"
          data-error-callback="onTurnstileError"
          data-theme="auto"
          data-action="contact"
        />

        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading || !tokenReady} className="btn btn-primary">
          {loading ? 'Sending…' : (tokenReady ? 'Send message' : 'Verify to send')}
        </button>
      </form>
    </div>
  )
}