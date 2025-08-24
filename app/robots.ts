import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://sabco.com.ng'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep crawlers off API/admin endpoints
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}