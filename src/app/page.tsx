import { UsersPageClient } from '@/components/users-page'
import {
  createUserDrizzle,
  createPostDrizzle,
  getUsersDrizzle,
  deleteUserDrizzle,
  deletePostDrizzle,
} from '@/app/drizzle/actions'
import {
  createUserPrisma,
  createPostPrisma,
  getUsersPrisma,
  deleteUserPrisma,
  deletePostPrisma,
} from '@/app/prisma/actions'
import { promises as fs } from 'fs'
import path from 'path'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CodeBlock } from '@/components/code-block'
import { highlightCode } from '@/lib/highlight'

export const dynamic = 'force-dynamic'

async function readCode(relativePath: string) {
  const fullPath = path.join(process.cwd(), relativePath)
  return fs.readFile(fullPath, 'utf8')
}

export default async function Home() {
  const users = await getUsersDrizzle()

  const drizzleActions = {
    createUser: createUserDrizzle,
    createPost: createPostDrizzle,
    deleteUser: deleteUserDrizzle,
    deletePost: deletePostDrizzle,
    getUsers: getUsersDrizzle,
  }

  const prismaActions = {
    createUser: createUserPrisma,
    createPost: createPostPrisma,
    deleteUser: deleteUserPrisma,
    deletePost: deletePostPrisma,
    getUsers: getUsersPrisma,
  }

  const [
    drizzleSchemaCode,
    prismaSchemaCode,
    drizzleConfigCode,
    prismaConfigCode,
  ] = await Promise.all([
    readCode('src/db/schema.ts'),
    readCode('prisma/schema.prisma'),
    readCode('drizzle.config.ts'),
    readCode('prisma.config.ts'),
  ])

  const [
    drizzleSchemaHighlighted,
    prismaSchemaHighlighted,
    drizzleConfigHighlighted,
    prismaConfigHighlighted,
  ] = await Promise.all([
    highlightCode(drizzleSchemaCode, 'ts'),
    highlightCode(prismaSchemaCode, 'prisma'),
    highlightCode(drizzleConfigCode, 'ts'),
    highlightCode(prismaConfigCode, 'ts'),
  ])

  return (
    <>
      <UsersPageClient
        initialUsers={users}
        drizzleActions={drizzleActions}
        prismaActions={prismaActions}
      />

      <section className='border-t bg-background'>
        <div className='max-w-6xl mx-auto px-6 py-12 space-y-6'>
          <div className='space-y-2'>
            <p className='text-primary text-sm font-medium uppercase tracking-widest'>
              Comparativo de código
            </p>
            <h2 className='text-3xl font-bold'>Drizzle x Prisma</h2>
            <p className='text-muted-foreground'>
              Schema e configuração lado a lado, com pontos rápidos sobre o que muda em cada ORM.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-4'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Schema — Drizzle</CardTitle>
                <CardDescription>
                  Tipagem direto em TypeScript, relations declaradas com helpers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={drizzleSchemaCode}
                  language='ts'
                  fileName='src/db/schema.ts'
                  highlightedHtml={drizzleSchemaHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Schema — Prisma</CardTitle>
                <CardDescription>
                  DSL própria com mapeamento para snake_case via @map.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={prismaSchemaCode}
                  language='prisma'
                  fileName='prisma/schema.prisma'
                  highlightedHtml={prismaSchemaHighlighted}
                />
              </CardContent>
            </Card>
          </div>

          <div className='grid lg:grid-cols-2 gap-4'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Config — Drizzle</CardTitle>
                <CardDescription>
                  Usa drizzle-kit apontando para o schema em TS e pasta de migrações local.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={drizzleConfigCode}
                  language='ts'
                  fileName='drizzle.config.ts'
                  highlightedHtml={drizzleConfigHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Config — Prisma</CardTitle>
                <CardDescription>
                  Define schema, migrations em prisma/migrations e lê DATABASE_URL.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={prismaConfigCode}
                  language='ts'
                  fileName='prisma.config.ts'
                  highlightedHtml={prismaConfigHighlighted}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análise rápida</CardTitle>
              <CardDescription>Diferenciais práticos neste setup.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2 text-sm text-muted-foreground'>
                <li>
                  <span className='text-foreground font-semibold'>Schema:</span>{' '}
                  Drizzle usa API fluente em TS e reaproveita tipos; Prisma traz DSL declarativa e gera client tipado.
                </li>
                <li>
                  <span className='text-foreground font-semibold'>Configurações:</span>{' '}
                  Drizzle aponta direto para o schema TS e salva migrações em <code className='font-mono'>/drizzle</code>;
                  Prisma centraliza em <code className='font-mono'>prisma/schema.prisma</code> e migrações em <code className='font-mono'>prisma/migrations</code> usando <code className='font-mono'>DATABASE_URL</code>.
                </li>
                <li>
                  <span className='text-foreground font-semibold'>DX:</span>{' '}
                  Drizzle elimina passo de geração e mantém o TS como fonte única; Prisma adiciona geração do client, mas entrega tooling maduro (migrate, studio).
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
