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
      <header className="flex items-center gap-1 px-4 py-4 sm:px-6">
        <span className='text-2xl' aria-label="baleia" role="img">🐳</span>
        <span className="text-2xl font-bold text-sky-400">Ultrablue</span>
      </header>

      <UsersPageClient
        initialUsers={users}
        drizzleActions={drizzleActions}
        prismaActions={prismaActions}
      />

      <section className='border-t bg-background'>
        <div className='max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-12 space-y-4 sm:space-y-6'>
          <div className='space-y-1 sm:space-y-2'>
            <p className='text-xs sm:text-sm font-medium uppercase tracking-widest'>
              Comparativo de código
            </p>
            <h2 className='text-xl sm:text-3xl font-bold'>Drizzle x Prisma</h2>
            <p className='text-sm sm:text-base text-muted-foreground'>
              Schema e configuração lado a lado, com pontos rápidos sobre o que muda em cada ORM.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-3 sm:gap-4'>
            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>Schema — Drizzle</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Tipagem direto em TypeScript, relations declaradas com helpers.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
                <CodeBlock
                  code={drizzleSchemaCode}
                  language='ts'
                  fileName='src/db/schema.ts'
                  highlightedHtml={drizzleSchemaHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>Schema — Prisma</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  DSL própria com mapeamento para snake_case via @map.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
                <CodeBlock
                  code={prismaSchemaCode}
                  language='prisma'
                  fileName='prisma/schema.prisma'
                  highlightedHtml={prismaSchemaHighlighted}
                />
              </CardContent>
            </Card>
          </div>

          <div className='grid lg:grid-cols-2 gap-3 sm:gap-4'>
            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>Config — Drizzle</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Usa drizzle-kit apontando para o schema em TS e pasta de migrações local.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
                <CodeBlock
                  code={drizzleConfigCode}
                  language='ts'
                  fileName='drizzle.config.ts'
                  highlightedHtml={drizzleConfigHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>Config — Prisma</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Define schema, migrations em prisma/migrations e lê DATABASE_URL.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
                <CodeBlock
                  code={prismaConfigCode}
                  language='ts'
                  fileName='prisma.config.ts'
                  highlightedHtml={prismaConfigHighlighted}
                />
              </CardContent>
            </Card>
          </div>

          <div className='space-y-1 sm:space-y-2'>
            <p className='text-primary text-xs sm:text-sm font-medium uppercase tracking-widest'>
              Clients
            </p>
            <h3 className='text-lg sm:text-2xl font-semibold'>Instanciação das conexões</h3>
            <p className='text-sm sm:text-base text-muted-foreground'>
              Como cada ORM cria o client conectado ao SQLite/libSQL e expõe helpers tipados.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-3 sm:gap-4'>
            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>Client — Drizzle</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Conecta com <code className='font-mono'>@libsql/client</code>, injeta o schema e reexporta tabelas.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
                <CodeBlock
                  code={drizzleClientCode}
                  language='ts'
                  fileName='src/db/index.ts'
                  highlightedHtml={drizzleClientHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>Client — Prisma</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Usa <code className='font-mono'>PrismaLibSql</code> como adapter e instancia o client gerado.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
                <CodeBlock
                  code={prismaClientCode}
                  language='ts'
                  fileName='src/db/prisma.ts'
                  highlightedHtml={prismaClientHighlighted}
                />
              </CardContent>
            </Card>
          </div>

          <div className='space-y-1 sm:space-y-2'>
            <p className='text-primary text-xs sm:text-sm font-medium uppercase tracking-widest'>
              Requisições CRUD
            </p>
            <h3 className='text-lg sm:text-2xl font-semibold'>Actions server lado a lado</h3>
            <p className='text-sm sm:text-base text-muted-foreground'>
              Como o fluxo de criar, ler e deletar é escrito em cada ORM.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-3 sm:gap-4'>
            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>CRUD — Drizzle</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Query builder em TS usando <code className='font-mono'>db.insert</code>, <code className='font-mono'>db.query</code> e helpers como <code className='font-mono'>eq</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
                <CodeBlock
                  code={drizzleActionsCode}
                  language='ts'
                  fileName='src/app/drizzle/actions.ts'
                  highlightedHtml={drizzleActionsHighlighted}
                />
              </CardContent>
            </Card>

            <Card className='h-full min-w-0 overflow-hidden'>
              <CardHeader className='p-4 sm:p-6'>
                <CardTitle className='text-base sm:text-lg'>CRUD — Prisma</CardTitle>
                <CardDescription className='text-xs sm:text-sm'>
                  Client gerado com métodos declarativos (<code className='font-mono'>prisma.user.create</code>, <code className='font-mono'>findMany</code>) e inclusão de relações via <code className='font-mono'>include</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-hidden p-4 pt-0 sm:p-6 sm:pt-0'>
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
            <CardHeader className='p-4 sm:p-6'>
              <CardTitle className='text-base sm:text-lg'>Análise Comparativa Detalhada</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>Avaliação técnica aprofundada cobrindo DX, performance, arquitetura e operação em produção.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Migrações */}
              <div className='space-y-2'>
                <h4 className='text-foreground font-semibold flex items-center gap-2'>
                  <span className='text-primary'>01.</span> Sistema de Migrações
                </h4>
                <div className='grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground'>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Drizzle</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Gera SQL puro e legível via <code className='font-mono text-xs'>drizzle-kit generate</code></li>
                      <li>Migrações são arquivos <code className='font-mono text-xs'>.sql</code> versionados — fácil de revisar em PR</li>
                      <li>Suporta <code className='font-mono text-xs'>push</code> para sync direto (dev) ou <code className='font-mono text-xs'>migrate</code> para produção</li>
                      <li>Não requer passo de geração de client — schema é o source of truth</li>
                      <li>Rollback manual (você escreve o SQL de down)</li>
                    </ul>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Prisma</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Histórico completo com <code className='font-mono text-xs'>_prisma_migrations</code> table</li>
                      <li>Suporta <code className='font-mono text-xs'>migrate dev</code>, <code className='font-mono text-xs'>deploy</code> e <code className='font-mono text-xs'>reset</code></li>
                      <li>Requer <code className='font-mono text-xs'>prisma generate</code> após cada mudança de schema</li>
                      <li>Shadow database para detectar drift em dev</li>
                      <li>Melhor para times grandes com fluxo de aprovação de migrations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tipos e Validação */}
              <div className='space-y-2'>
                <h4 className='text-foreground font-semibold flex items-center gap-2'>
                  <span className='text-primary'>02.</span> Tipagem e Validação
                </h4>
                <div className='grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground'>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Drizzle</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Tipos inferidos diretamente do schema TS (<code className='font-mono text-xs'>$inferSelect</code>, <code className='font-mono text-xs'>$inferInsert</code>)</li>
                      <li>Integração nativa com Zod via <code className='font-mono text-xs'>drizzle-zod</code></li>
                      <li>Reutilize tipos em forms, APIs e DTOs sem duplicação</li>
                      <li>Mudanças no schema refletem imediatamente nos tipos</li>
                      <li>Sem code generation — zero latência no fluxo de dev</li>
                    </ul>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Prisma</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Tipos gerados em <code className='font-mono text-xs'>node_modules/.prisma/client</code></li>
                      <li>Tipagem muito precisa incluindo relações aninhadas</li>
                      <li>Requer <code className='font-mono text-xs'>prisma generate</code> — adiciona passo no CI/CD</li>
                      <li>Integração com Zod via libs externas (<code className='font-mono text-xs'>zod-prisma-types</code>)</li>
                      <li>Autocomplete excelente no editor após generate</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Performance e Bundle */}
              <div className='space-y-2'>
                <h4 className='text-foreground font-semibold flex items-center gap-2'>
                  <span className='text-primary'>03.</span> Performance e Bundle Size
                </h4>
                <div className='grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground'>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Drizzle</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Bundle ~50KB minificado — ideal para edge/serverless</li>
                      <li>Cold start mínimo — não há client pesado para carregar</li>
                      <li>Queries compilam para SQL direto sem overhead de runtime</li>
                      <li>Funciona nativamente em Cloudflare Workers, Vercel Edge</li>
                      <li>Prepared statements suportados para queries repetidas</li>
                    </ul>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Prisma</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Client gerado ~2-4MB — impacta lambdas frias</li>
                      <li>Query Engine em Rust (WASM para edge) adiciona peso</li>
                      <li>Prisma Accelerate resolve cold start via connection pooling global</li>
                      <li>Data Proxy para edge runtime (adiciona latência de rede)</li>
                      <li>Otimizações de query via engine podem ser vantajosas em casos complexos</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ergonomia de Queries */}
              <div className='space-y-2'>
                <h4 className='text-foreground font-semibold flex items-center gap-2'>
                  <span className='text-primary'>04.</span> Ergonomia de Queries
                </h4>
                <div className='grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground'>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Drizzle</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Query builder SQL-like: <code className='font-mono text-xs'>db.select().from().where()</code></li>
                      <li>Fácil ver o SQL gerado — debugging transparente</li>
                      <li>Relational queries via <code className='font-mono text-xs'>db.query.users.findMany({'{ with: { posts: true } }'})</code></li>
                      <li>Joins explícitos quando você precisa de controle</li>
                      <li>Raw SQL com <code className='font-mono text-xs'>sql</code> template literal tipado</li>
                    </ul>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Prisma</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>API declarativa: <code className='font-mono text-xs'>prisma.user.findMany()</code></li>
                      <li>Nested writes poderosos: <code className='font-mono text-xs'>create {'{ data: { posts: { create: [...] } } }'}</code></li>
                      <li><code className='font-mono text-xs'>include</code> e <code className='font-mono text-xs'>select</code> para carregar relações</li>
                      <li>Filtros compostos: <code className='font-mono text-xs'>where: {'{ AND, OR, NOT }'}</code></li>
                      <li>SQL gerado é abstraído — menos controle, mais conveniência</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transações */}
              <div className='space-y-2'>
                <h4 className='text-foreground font-semibold flex items-center gap-2'>
                  <span className='text-primary'>05.</span> Transações e Consistência
                </h4>
                <div className='grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground'>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Drizzle</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li><code className='font-mono text-xs'>db.transaction(async (tx) =&gt; {'{ ... }'})</code></li>
                      <li>Rollback automático em exceções</li>
                      <li>Savepoints suportados para transações aninhadas</li>
                      <li>Controle total sobre isolation levels</li>
                    </ul>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Prisma</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li><code className='font-mono text-xs'>prisma.$transaction([...])</code> para batch</li>
                      <li>Interactive transactions com callback</li>
                      <li>Timeout configurável para transações longas</li>
                      <li>Nested writes são transacionais por padrão</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ferramentas e Ecossistema */}
              <div className='space-y-2'>
                <h4 className='text-foreground font-semibold flex items-center gap-2'>
                  <span className='text-primary'>06.</span> Ferramentas e Ecossistema
                </h4>
                <div className='grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground'>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Drizzle</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li><code className='font-mono text-xs'>drizzle-kit studio</code> — UI web para explorar dados</li>
                      <li>CLI simples: <code className='font-mono text-xs'>generate</code>, <code className='font-mono text-xs'>migrate</code>, <code className='font-mono text-xs'>push</code>, <code className='font-mono text-xs'>pull</code></li>
                      <li>Introspecção de banco existente via <code className='font-mono text-xs'>pull</code></li>
                      <li>Plugins: drizzle-zod, drizzle-valibot, drizzle-typebox</li>
                      <li>Comunidade crescendo rápido, docs melhorando</li>
                    </ul>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-3 space-y-2'>
                    <p className='text-foreground font-medium text-xs uppercase tracking-wide'>Prisma</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>Prisma Studio — GUI desktop/web completa</li>
                      <li>Prisma Accelerate — connection pooling global</li>
                      <li>Prisma Pulse — real-time change data capture</li>
                      <li>Introspecção robusta de bancos legados</li>
                      <li>Ecossistema maduro, docs extensivos, comunidade enorme</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quando usar cada um */}
              <div className='space-y-2'>
                <h4 className='text-foreground font-semibold flex items-center gap-2'>
                  <span className='text-primary'>07.</span> Quando Usar Cada Um
                </h4>
                <div className='grid sm:grid-cols-2 gap-3 text-sm'>
                  <div className='bg-drizzle/10 border border-drizzle/20 rounded-lg p-3 space-y-2'>
                    <p className='text-drizzle font-medium text-xs uppercase tracking-wide'>Escolha Drizzle se:</p>
                    <ul className='list-disc pl-4 space-y-1 text-muted-foreground'>
                      <li>Precisa de bundle leve para edge/serverless</li>
                      <li>Quer controle total sobre SQL gerado</li>
                      <li>Prefere schema em TypeScript puro</li>
                      <li>Valoriza zero code generation no workflow</li>
                      <li>Trabalha com queries complexas/otimizadas</li>
                      <li>Usa Cloudflare Workers ou Vercel Edge</li>
                    </ul>
                  </div>
                  <div className='bg-prisma/10 border border-prisma/20 rounded-lg p-3 space-y-2'>
                    <p className='text-prisma font-medium text-xs uppercase tracking-wide'>Escolha Prisma se:</p>
                    <ul className='list-disc pl-4 space-y-1 text-muted-foreground'>
                      <li>Prioriza DX e produtividade em CRUD</li>
                      <li>Time grande com fluxo de migrations estruturado</li>
                      <li>Precisa de nested writes frequentes</li>
                      <li>Quer ecossistema maduro e suporte enterprise</li>
                      <li>Usa Prisma Accelerate/Pulse para features avançadas</li>
                      <li>Prefere abstração sobre controle SQL</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Nota sobre Next.js */}
              <div className='bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm'>
                <p className='text-primary font-medium mb-2'>Nota sobre Server Actions e Caching</p>
                <p className='text-muted-foreground'>
                  Em ambos os ORMs, ao usar Server Actions do Next.js, lembre-se de chamar{' '}
                  <code className='font-mono text-xs'>revalidatePath()</code> ou{' '}
                  <code className='font-mono text-xs'>revalidateTag()</code> após mutações para invalidar o cache corretamente.
                  Para queries frequentes, considere usar <code className='font-mono text-xs'>unstable_cache</code> com tags para controle granular de invalidação.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
