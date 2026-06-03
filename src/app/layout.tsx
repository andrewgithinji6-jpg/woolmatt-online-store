import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Woolmatt Supermarket - Online Store | Nakuru, Kenya',
  description: 'Shop fresh groceries, dairy, meat, furniture and more at Woolmatt Supermarket. Fast delivery in Nakuru, Kenya.',
  keywords: 'supermarket, groceries, online shopping, Nakuru, Kenya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Header />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}