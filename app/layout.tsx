
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  metadataBase: new URL('https://sabco.com.ng'),
  title: { default: 'Sabco Multi Trade LTD', template: '%s | Sabco Multi Trade LTD' },
  description: 'Industrial and commercial construction, precast solutions, terrazzo tiles, and project management across Nigeria.',
  alternates: { canonical: '/' },
  openGraph: {
  type: 'website',
  url: 'https://sabco.com.ng',
  title: 'Sabco Multi Trade LTD',
  description: 'Builders since 1998. Precast, interlocking, project management.',
  siteName: 'Sabco Multi Trade LTD',
  images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.jpg'] },
  }


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="container py-8">{children}</main>
          <Footer />
        </ThemeProvider>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Sabco Multi Trade LTD',
              url: 'https://sabco.com.ng',
              logo: 'https://sabco.com.ng/logo.png',
              contactPoint: [
                { '@type': 'ContactPoint', contactType: 'Sales', telephone: '+2340000000000' },
              ],
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NG',
                addressLocality: 'Kano',
                addressRegion: 'Kano State',
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
