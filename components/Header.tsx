'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export function Header() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b z-40">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold"
        >
          <Image
            src="/logo.jpg"
            alt="Sabco logo"
            width={36}
            height={36}
            priority
            className="rounded-full"
          />
          <span className="hidden sm:inline">SABCO Multi Trade LTD</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/projects" className="px-3 py-2 text-slate-700 dark:text-slate-200">Projects</Link>
          <Link href="/about" className="px-3 py-2 text-slate-700 dark:text-slate-200">About</Link>
          <Link href="/blog" className="px-3 py-2 text-slate-700 dark:text-slate-200">Blog</Link>
          <Link href="/services" className="px-3 py-2 text-slate-700 dark:text-slate-200">Services</Link>
          <Link href="/contact" className="btn btn-primary">Get a Quote</Link>

          {/* Theme toggle (render only after mounted) */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 px-3 py-2 rounded border"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          SABCO Multi Trade
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-3 py-2 rounded border"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-2 rounded border"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden border-t bg-white/95 dark:bg-slate-900/95">
          <div className="container flex flex-col py-2">
            <Link href="/projects" className="py-2">Projects</Link>
            <Link href="/about" className="py-2">About</Link>
            <Link href="/blog" className="py-2">Blog</Link>
            <Link href="/contact" className="py-2">Contact</Link>
          </div>
        </div>
      )}
    </header>
  )
}
