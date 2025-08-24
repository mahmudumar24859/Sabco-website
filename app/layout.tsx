
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'Sabco Multi Trade LTD — Builders Since 1998',
  description: 'General contracting, project management, precast solutions and terrazzo tiles.'
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
      </body>
    </html>
  )
}
