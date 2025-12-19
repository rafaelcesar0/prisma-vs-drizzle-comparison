# Prisma vs Drizzle - Comparação Lado a Lado

Aplicação Next.js 16 que implementa o mesmo CRUD de usuários e posts usando dois ORMs diferentes: **Drizzle ORM** e **Prisma ORM**.

## Objetivo

Comparar a experiência de desenvolvimento (DX) e as diferenças de API entre os dois ORMs mais populares do ecossistema TypeScript/Node.js.

## Stack

- **Next.js 16** com App Router e Server Actions
- **SQLite** via libsql (mesmo banco para ambos)
- **Drizzle ORM** v0.45
- **Prisma ORM** v7.2
- **Tailwind CSS** v4
- **React 19**

## Rotas

| Rota | ORM | Descrição |
|------|-----|-----------|
| `/` | - | Página inicial com links |
| `/drizzle` | Drizzle | CRUD usando Drizzle ORM |
| `/prisma` | Prisma | CRUD usando Prisma ORM |

## Observações

### Definição de Schema

**Drizzle** - Schema em TypeScript puro:
```typescript
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
})
```

**Prisma** - Schema em linguagem própria (`.prisma`):
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

### Queries com Relações

**Drizzle** - API relacional:
```typescript
await db.query.users.findMany({
  with: { posts: true },
  orderBy: (users, { desc }) => [desc(users.createdAt)],
})
```

**Prisma** - Include pattern:
```typescript
await prisma.user.findMany({
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
})
```

### Insert

**Drizzle**:
```typescript
await db.insert(users).values({ name, email })
```

**Prisma**:
```typescript
await prisma.user.create({ data: { name, email } })
```

### Delete

**Drizzle**:
```typescript
await db.delete(users).where(eq(users.id, userId))
```

**Prisma**:
```typescript
await prisma.user.delete({ where: { id: userId } })
```

## Executando

```bash
# Instalar dependências
bun install

# Gerar cliente Prisma
bun run prisma:generate

# Aplicar schema no banco
bun run drizzle:push
bun run prisma:push

# Iniciar dev server
bun run dev
```

## Scripts

| Script | Descrição |
|--------|-----------|
| `dev` | Inicia servidor de desenvolvimento |
| `build` | Build de produção |

### Prisma

| Script | Descrição |
|--------|-----------|
| `prisma:generate` | Gera cliente Prisma |
| `prisma:migrate` | Cria e aplica migrations |
| `prisma:push` | Aplica schema no banco (sem migration) |
| `prisma:studio` | Abre Prisma Studio |

### Drizzle

| Script | Descrição |
|--------|-----------|
| `drizzle:generate` | Gera migrations |
| `drizzle:migrate` | Aplica migrations |
| `drizzle:push` | Aplica schema no banco (sem migration) |
| `drizzle:studio` | Abre Drizzle Studio |
