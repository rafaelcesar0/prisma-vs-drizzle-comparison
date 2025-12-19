import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ultrablue - Drizzle vs Prisma',
  description: 'Comparativo técnico detalhado entre Drizzle ORM e Prisma: migrações, tipagem, performance, bundle size e ecossistema.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐳</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: 'Ultrablue - Drizzle vs Prisma',
    description: 'Comparativo técnico detalhado entre Drizzle ORM e Prisma',
    type: 'website',
    images: [
      {
        url: '/ultrablue-drizzle-prisma.png',
        width: 1048,
        height: 767,
        alt: 'Ultrablue - interface do comparativo Drizzle vs Prisma',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultrablue - Drizzle vs Prisma',
    description: 'Comparativo técnico detalhado entre Drizzle ORM e Prisma',
    images: ['/ultrablue-drizzle-prisma.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning data-lt-installed>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
