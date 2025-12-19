import Link from 'next/link'
import { Database, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-navy/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-coral-light/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <header className="text-center mb-16">
          <h1
            className="text-5xl lg:text-7xl font-bold tracking-tight text-navy mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Usuários & Posts
          </h1>
          <p
            className="text-muted-foreground text-xl max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Compare duas implementações do mesmo app usando ORMs diferentes.
            Mesmo banco SQLite, mesma interface, ORMs diferentes.
          </p>
          <div className="mt-8 h-1 w-24 bg-gradient-to-r from-coral to-coral-light rounded-full mx-auto" />
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Drizzle Card */}
          <Link
            href="/drizzle"
            className="group relative overflow-hidden rounded-3xl bg-white border-2 border-transparent hover:border-[#c5f74f] shadow-xl shadow-navy/5 hover:shadow-2xl hover:shadow-navy/10 transition-all duration-500 p-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#c5f74f]" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#c5f74f]/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#8cb000]" />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold text-navy"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Drizzle ORM
                </h2>
                <p className="text-muted-foreground text-sm">TypeScript-first</p>
              </div>
            </div>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5f74f]" />
                Schema em TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5f74f]" />
                Query API relacional
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5f74f]" />
                Zero dependências runtime
              </li>
            </ul>
            <div className="flex items-center text-[#8cb000] font-medium group-hover:gap-3 gap-2 transition-all">
              Acessar
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Prisma Card */}
          <Link
            href="/prisma"
            className="group relative overflow-hidden rounded-3xl bg-white border-2 border-transparent hover:border-[#2d3748] shadow-xl shadow-navy/5 hover:shadow-2xl hover:shadow-navy/10 transition-all duration-500 p-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#2d3748]" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#2d3748]/10 flex items-center justify-center">
                <Database className="w-7 h-7 text-[#2d3748]" />
              </div>
              <div>
                <h2
                  className="text-2xl font-bold text-navy"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Prisma ORM
                </h2>
                <p className="text-muted-foreground text-sm">Developer-friendly</p>
              </div>
            </div>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2d3748]" />
                Schema declarativo (.prisma)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2d3748]" />
                Cliente gerado com tipos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2d3748]" />
                Prisma Studio incluso
              </li>
            </ul>
            <div className="flex items-center text-[#2d3748] font-medium group-hover:gap-3 gap-2 transition-all">
              Acessar
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Ambos usando <strong>SQLite</strong> com <strong>libsql</strong> • Next.js 16 + Bun
          </p>
        </footer>
      </div>
    </main>
  )
}
