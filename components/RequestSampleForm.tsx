'use client'
import { useEffect, useState } from 'react'

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export default function RequestSampleForm({ productId, productTitle }: { productId: number; productTitle: string }) {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [tokenReady, setTokenReady] = useState(false)

  useEffect(() => {
    // Global callbacks for Turnstile HTML widget
    ;(window as any).onTurnstileSuccess = () => setTokenReady(true)
    ;(window as any).onTurnstileExpire = () => setTokenReady(false)
    ;(window as any).onTurnstileError = () => setTokenReady(false)
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setErr(null)
    const fd = new FormData(e.currentTarget)
    fd.set('product', String(productId))
    try {
      const res = await fetch(`${API}/sample-requests/`, { method: 'POST', body: fd })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Failed to submit request')
      }
      setOk(true)
      setTokenReady(false)
      e.currentTarget.reset()
      // optional: reset widget (if script exposes turnstile global)
      ;(window as any).turnstile?.reset?.()
    } catch (error: any) {
      setErr(error.message || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  if (ok) return <div className="card">Thanks! We’ll contact you shortly about “{productTitle}”.</div>

  return (
    <form onSubmit={onSubmit} className="card space-y-3">
      <h3 className="font-semibold text-lg">Request a Sample</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <input name="name" required placeholder="Your name" className="border rounded px-3 py-2" />
        <input name="email" type="email" required placeholder="Email" className="border rounded px-3 py-2" />
        <input name="phone" placeholder="Phone" className="border rounded px-3 py-2" />
        <input name="address" placeholder="Address" className="border rounded px-3 py-2" />
        <input name="finish_preference" placeholder="Finish preference (optional)" className="md:col-span-2 border rounded px-3 py-2" />
      </div>
      <textarea name="message" placeholder="Message" className="w-full border rounded px-3 py-2" rows={3} />

      {/* Turnstile HTML widget */}
      <div
        className="cf-turnstile"
        data-sitekey={SITE_KEY}
        data-callback="onTurnstileSuccess"
        data-expired-callback="onTurnstileExpire"
        data-error-callback="onTurnstileError"
        data-theme="auto"
        data-action="sample_request"
      />

      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={loading || !tokenReady} className="btn btn-primary">
        {loading ? 'Sending…' : (tokenReady ? 'Send request' : 'Verify to send')}
      </button>
    </form>
  )
}