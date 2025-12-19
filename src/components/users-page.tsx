'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { toast } from 'sonner'
import {
  UserPlus,
  PenSquare,
  Loader2,
  Trash2,
  ChevronDown,
  Calendar,
  X,
} from 'lucide-react'

type Post = {
  id: number
  title: string
  content: string
  userId: number
  createdAt: Date | null
}

type User = {
  id: number
  name: string
  email: string
  birthDate: string
  createdAt: Date | null
  posts: Post[]
}

type Actions = {
  createUser: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
  createPost: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
  deleteUser: (userId: number) => Promise<{ error?: string; success?: boolean }>
  deletePost: (postId: number) => Promise<{ error?: string; success?: boolean }>
}

function formatBirthDate(dateString: string) {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function calculateAge(dateString: string) {
  const today = new Date()
  const birthDate = new Date(dateString + 'T00:00:00')
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function UserCard({
  user,
  index,
  onDeleteUser,
  onDeletePost,
}: {
  user: User
  index: number
  onDeleteUser: (userId: number) => Promise<void>
  onDeletePost: (postId: number, title: string) => Promise<void>
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteUser = async () => {
    if (!confirm(`Tem certeza que deseja deletar ${user.name}?`)) return
    setIsDeleting(true)
    await onDeleteUser(user.id)
    setIsDeleting(false)
  }

  return (
    <Card
      className="group overflow-hidden border-0 shadow-lg shadow-navy/5 hover:shadow-xl hover:shadow-navy/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
      style={{
        fontFamily: 'var(--font-body)',
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards',
      }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral to-coral-light flex items-center justify-center text-white text-xl font-semibold shadow-md"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3
                className="text-xl font-semibold text-navy"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {user.name}
              </h3>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDeleteUser}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-coral" />
            <span>{formatBirthDate(user.birthDate)}</span>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-coral-light/50 text-coral text-xs font-medium">
            {calculateAge(user.birthDate)} anos
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between py-3 px-4 -mx-4 border-t border-border/50 hover:bg-cream/50 transition-colors">
              <span className="text-sm font-medium text-navy">
                {user.posts.length} post{user.posts.length !== 1 ? 's' : ''}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            {user.posts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center italic">
                Nenhum post ainda
              </p>
            ) : (
              <div className="pt-4 space-y-3">
                {user.posts.map((post) => (
                  <div
                    key={post.id}
                    className="group/post p-4 rounded-xl bg-cream/50 border border-border/30 hover:border-coral/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4
                        className="font-semibold text-navy"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {post.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDeletePost(post.id, post.title)}
                        className="opacity-0 group-hover/post:opacity-100 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.content}
                    </p>
                    {post.createdAt && (
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

function CreateUserForm({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await onSubmit(formData)
      const form = document.getElementById('create-user-form') as HTMLFormElement
      form?.reset()
    })
  }

  return (
    <Card
      className="border-0 shadow-lg shadow-navy/5 overflow-hidden"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="h-1 bg-gradient-to-r from-coral to-coral-light" />
      <CardHeader>
        <CardTitle
          className="text-xl text-navy flex items-center gap-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <div className="w-8 h-8 rounded-lg bg-coral-light/50 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-coral" />
          </div>
          Novo Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="create-user-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-navy">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="João Silva"
              required
              className="bg-cream/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-navy">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="joao@email.com"
              required
              className="bg-cream/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-navy">Data de Nascimento</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              className="bg-cream/30 border-border/50"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-coral hover:bg-coral/90 text-white font-medium"
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Criando...</> : 'Criar Usuário'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CreatePostForm({
  users,
  onSubmit,
}: {
  users: User[]
  onSubmit: (formData: FormData) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const handleSubmit = (formData: FormData) => {
    if (!selectedUserId) {
      toast.error('Selecione um usuário')
      return
    }
    formData.set('userId', selectedUserId)
    startTransition(async () => {
      await onSubmit(formData)
      const form = document.getElementById('create-post-form') as HTMLFormElement
      form?.reset()
      setSelectedUserId('')
    })
  }

  return (
    <Card
      className="border-0 shadow-lg shadow-navy/5 overflow-hidden"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="h-1 bg-gradient-to-r from-navy to-navy/70" />
      <CardHeader>
        <CardTitle
          className="text-xl text-navy flex items-center gap-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center">
            <PenSquare className="w-4 h-4 text-navy" />
          </div>
          Novo Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="create-post-form" action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-navy">Autor</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full bg-cream/30 border-border/50">
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-navy">Título</Label>
            <Input
              id="title"
              name="title"
              placeholder="Título do post"
              required
              className="bg-cream/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-navy">Conteúdo</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Escreva seu post aqui..."
              required
              rows={4}
              className="bg-cream/30 border-border/50 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-navy hover:bg-navy/90 text-white font-medium"
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</> : 'Publicar Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function UsersPageClient({
  users: initialUsers,
  actions,
  ormName,
  ormColor,
}: {
  users: User[]
  actions: Actions
  ormName: string
  ormColor: string
}) {
  const [users, setUsers] = useState(initialUsers)

  const handleCreateUser = async (formData: FormData) => {
    const result = await actions.createUser(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Usuário criado com sucesso!')
      // Recarregar página para atualizar lista
      window.location.reload()
    }
  }

  const handleCreatePost = async (formData: FormData) => {
    const result = await actions.createPost(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post criado com sucesso!')
      window.location.reload()
    }
  }

  const handleDeleteUser = async (userId: number) => {
    const result = await actions.deleteUser(userId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Usuário deletado')
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  const handleDeletePost = async (postId: number, title: string) => {
    if (!confirm(`Deletar o post "${title}"?`)) return
    const result = await actions.deletePost(postId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post deletado')
      setUsers(
        users.map((u) => ({
          ...u,
          posts: u.posts.filter((p) => p.id !== postId),
        }))
      )
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-navy/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <header className="mb-16 lg:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: ormColor }}
            >
              {ormName}
            </span>
            <a href="/" className="text-muted-foreground hover:text-navy text-sm">
              ← Voltar
            </a>
          </div>
          <div className="flex items-end gap-4 mb-4">
            <h1
              className="text-5xl lg:text-7xl font-bold tracking-tight text-navy"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Usuários
            </h1>
            <span
              className="text-coral text-2xl lg:text-3xl italic mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              & Posts
            </span>
          </div>
          <p className="text-muted-foreground text-lg max-w-xl" style={{ fontFamily: 'var(--font-body)' }}>
            Usando <strong>{ormName}</strong> para gerenciar os dados.
          </p>
          <div className="mt-6 h-1 w-24 rounded-full" style={{ backgroundColor: ormColor }} />
        </header>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          <section>
            <h2
              className="text-2xl font-semibold text-navy mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {users.length > 0
                ? `${users.length} usuário${users.length > 1 ? 's' : ''}`
                : 'Nenhum usuário ainda'}
            </h2>

            {users.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">Crie seu primeiro usuário.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {users.map((user, index) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    index={index}
                    onDeleteUser={handleDeleteUser}
                    onDeletePost={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            <CreateUserForm onSubmit={handleCreateUser} />
            {users.length > 0 && <CreatePostForm users={users} onSubmit={handleCreatePost} />}
          </aside>
        </div>
      </div>
    </main>
  )
}
