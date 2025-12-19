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
    drizzleClientCode,
    prismaClientCode,
    drizzleActionsCode,
    prismaActionsCode,
  ] = await Promise.all([
    readCode('src/db/schema.ts'),
    readCode('prisma/schema.prisma'),
    readCode('drizzle.config.ts'),
    readCode('prisma.config.ts'),
    readCode('src/db/index.ts'),
    readCode('src/db/prisma.ts'),
    readCode('src/app/drizzle/actions.ts'),
    readCode('src/app/prisma/actions.ts'),
  ])

  const [
    drizzleSchemaHighlighted,
    prismaSchemaHighlighted,
    drizzleConfigHighlighted,
    prismaConfigHighlighted,
    drizzleClientHighlighted,
    prismaClientHighlighted,
    drizzleActionsHighlighted,
    prismaActionsHighlighted,
  ] = await Promise.all([
    highlightCode(drizzleSchemaCode, 'ts'),
    highlightCode(prismaSchemaCode, 'prisma'),
    highlightCode(drizzleConfigCode, 'ts'),
    highlightCode(prismaConfigCode, 'ts'),
    highlightCode(drizzleClientCode, 'ts'),
    highlightCode(prismaClientCode, 'ts'),
    highlightCode(drizzleActionsCode, 'ts'),
    highlightCode(prismaActionsCode, 'ts'),
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

          <div className='space-y-2'>
            <p className='text-primary text-sm font-medium uppercase tracking-widest'>
              Clients
            </p>
            <h3 className='text-2xl font-semibold'>Instanciação das conexões</h3>
            <p className='text-muted-foreground'>
              Como cada ORM cria o client conectado ao SQLite/libSQL e expõe helpers tipados.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-4'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Client — Drizzle</CardTitle>
                <CardDescription>
                  Conecta com <code className='font-mono'>@libsql/client</code>, injeta o schema e reexporta tabelas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={drizzleClientCode}
                  language='ts'
                  fileName='src/db/index.ts'
                  highlightedHtml={drizzleClientHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Client — Prisma</CardTitle>
                <CardDescription>
                  Usa <code className='font-mono'>PrismaLibSql</code> como adapter e instancia o client gerado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={prismaClientCode}
                  language='ts'
                  fileName='src/db/prisma.ts'
                  highlightedHtml={prismaClientHighlighted}
                />
              </CardContent>
            </Card>
          </div>

          <div className='space-y-2'>
            <p className='text-primary text-sm font-medium uppercase tracking-widest'>
              Requisições CRUD
            </p>
            <h3 className='text-2xl font-semibold'>Actions server lado a lado</h3>
            <p className='text-muted-foreground'>
              Como o fluxo de criar, ler e deletar é escrito em cada ORM.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-4'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>CRUD — Drizzle</CardTitle>
                <CardDescription>
                  Query builder em TS usando <code className='font-mono'>db.insert</code>, <code className='font-mono'>db.query</code> e helpers como <code className='font-mono'>eq</code>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={drizzleActionsCode}
                  language='ts'
                  fileName='src/app/drizzle/actions.ts'
                  highlightedHtml={drizzleActionsHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full'>
              <CardHeader>
                <CardTitle>CRUD — Prisma</CardTitle>
                <CardDescription>
                  Client gerado com métodos declarativos (<code className='font-mono'>prisma.user.create</code>, <code className='font-mono'>findMany</code>) e inclusão de relações via <code className='font-mono'>include</code>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={prismaActionsCode}
                  language='ts'
                  fileName='src/app/prisma/actions.ts'
                  highlightedHtml={prismaActionsHighlighted}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análise</CardTitle>
              <CardDescription>Observações focadas em DX, performance e operação.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-5 space-y-2 text-sm text-muted-foreground'>
                <li>
                  <span className='text-foreground font-semibold'>Migrações:</span>{' '}
                  Drizzle-kit gera SQL legível e roda sem passo de geração; Prisma Migrate mantém histórico completo (bom para times), mas adiciona o passo <code className='font-mono'>prisma migrate</code>/<code className='font-mono'>generate</code> no CI.
                </li>
                <li>
                  <span className='text-foreground font-semibold'>Tipos & validação:</span>{' '}
                  Drizzle reaproveita os tipos das tabelas direto no código (bom para reutilizar em forms/DTOs); Prisma gera tipos via client (precisa rodar generate). Em ambos os casos, vale usar um validador de runtime (ex.: Zod) para não confiar só na tipagem.
                </li>
                <li>
                  <span className='text-foreground font-semibold'>Tamanho e deploy:</span>{' '}
                  Drizzle não precisa de client gerado e tende a ser mais leve em bundling/edge; Prisma client é robusto mas maior (cuidado com lambdas frias/edge functions).
                </li>
                <li>
                  <span className='text-foreground font-semibold'>Ergonomia de query:</span>{' '}
                  Drizzle favorece quem quer controle SQL (builder explícito, fácil de ver o SQL final); Prisma brilha em CRUD rápido com <code className='font-mono'>include</code>/<code className='font-mono'>select</code> e writes aninhados (<code className='font-mono'>create</code> com <code className='font-mono'>posts: {'{'} create: [...] {'}'}</code>).
                </li>
                <li>
                  <span className='text-foreground font-semibold'>Ferramentas:</span>{' '}
                  Prisma entrega Studio, introspecção e migrations integradas; Drizzle tem CLI simples e SQL direto (ótimo para revisar diffs de banco). Nos dois fluxos, use <code className='font-mono'>revalidatePath</code> ou cache por tags para evitar re-fetch completo após mutações maiores.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
