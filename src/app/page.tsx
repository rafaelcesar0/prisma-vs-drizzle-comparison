import Link from 'next/link'
import { Database, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto px-6 py-20'>
        <header className='text-center mb-16'>
          <p className='text-primary text-sm font-medium uppercase tracking-widest mb-4'>
            Benchmark de ORMs
          </p>
          <h1 className='text-5xl lg:text-6xl font-bold tracking-tight mb-4'>
            Drizzle vs Prisma
          </h1>
          <p className='text-muted-foreground text-lg max-w-xl mx-auto'>
            Mesmo app. Mesmo banco. ORMs diferentes.
          </p>
        </header>

        <div className='grid md:grid-cols-2 gap-6'>
          <Link href='/drizzle'>
            <Card className='h-full hover:border-primary transition-colors'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-primary/10'>
                    <Zap className='w-5 h-5 text-primary' />
                  </div>
                  <div>
                    <CardTitle>Drizzle ORM</CardTitle>
                    <CardDescription>Leve e veloz</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm text-muted-foreground'>
                  <li>Schema 100% TypeScript</li>
                  <li>Queries type-safe nativas</li>
                  <li>Zero overhead em runtime</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href='/prisma'>
            <Card className='h-full hover:border-primary transition-colors'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-muted'>
                    <Database className='w-5 h-5 text-muted-foreground' />
                  </div>
                  <div>
                    <CardTitle>Prisma ORM</CardTitle>
                    <CardDescription>Robusto e maduro</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm text-muted-foreground'>
                  <li>Schema declarativo próprio</li>
                  <li>Cliente gerado automaticamente</li>
                  <li>Prisma Studio integrado</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        <footer className='mt-12 text-center'>
          <p className='text-muted-foreground text-sm'>
            Next.js 15 + Bun + SQLite via libsql
          </p>
        </footer>
      </div>
    </main>
  )
}
