import type { MetadataRoute } from 'next'

const SITE = 'https://sabco.com.ng'
const API = (process.env.NEXT_PUBLIC_API_BASE_URL || `${SITE}/api`).replace(/\/$/, '')

async function fetchList(path: string) {
  try {
    const url = `${API}${path.startsWith('/') ? path : `/${path}`}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json) ? json : (json.results ?? [])
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content from your API
  const [projects, posts , services] = await Promise.all([
    fetchList('/projects/'),
    fetchList('/posts/'),
    fetchList('/services/'), // uncomment when you have /services pages live
  ])

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const dynamicUrls: MetadataRoute.Sitemap = [
    ...projects.map((p: any) => ({
      url: `${SITE}/projects/${p.slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...posts.map((b: any) => ({
      url: `${SITE}/blog/${b.slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
    ...services.map((s: any) => ({
      url: `${SITE}/services/${s.slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ]

  return [...staticUrls, ...dynamicUrls]
}