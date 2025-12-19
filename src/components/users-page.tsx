'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { UserPlus, PenSquare, Loader2, Trash2, ChevronDown, X } from 'lucide-react'

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
  onDeleteUser,
  onDeletePost,
}: {
  user: User
  onDeleteUser: (userId: number) => Promise<void>
  onDeletePost: (postId: number, title: string) => Promise<void>
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Deletar ${user.name}?`)) return
    setIsDeleting(true)
    await onDeleteUser(user.id)
    setIsDeleting(false)
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium'>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className='font-medium'>{user.name}</h3>
              <p className='text-sm text-muted-foreground'>{user.email}</p>
            </div>
          </div>
          <Button variant='ghost' size='icon' onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        <Badge variant='secondary' className='mb-3'>
          {calculateAge(user.birthDate)} anos
        </Badge>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' className='w-full justify-between px-0'>
              <span className='text-sm'>{user.posts.length} posts</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className='space-y-2 pt-2'>
            {user.posts.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-2'>Nenhum post</p>
            ) : (
              user.posts.map((post) => (
                <div key={post.id} className='p-3 rounded-lg bg-muted/50'>
                  <div className='flex items-start justify-between gap-2'>
                    <h4 className='font-medium text-sm'>{post.title}</h4>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6'
                      onClick={() => onDeletePost(post.id, post.title)}
                    >
                      <X className='w-3 h-3' />
                    </Button>
                  </div>
                  <p className='text-sm text-muted-foreground mt-1'>{post.content}</p>
                </div>
              ))
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
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <UserPlus className='w-4 h-4' />
          Novo Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id='create-user-form' action={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome</Label>
            <Input id='name' name='name' placeholder='João Silva' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' placeholder='joao@email.com' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='birthDate'>Data de Nascimento</Label>
            <Input id='birthDate' name='birthDate' type='date' required />
          </div>
          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? <><Loader2 className='w-4 h-4 animate-spin mr-2' /> Criando...</> : 'Criar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CreatePostForm({ users, onSubmit }: { users: User[]; onSubmit: (formData: FormData) => Promise<void> }) {
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
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <PenSquare className='w-4 h-4' />
          Novo Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id='create-post-form' action={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='userId'>Autor</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
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
          <div className='space-y-2'>
            <Label htmlFor='title'>Título</Label>
            <Input id='title' name='title' placeholder='Título' required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='content'>Conteúdo</Label>
            <Textarea id='content' name='content' placeholder='Conteúdo...' required rows={3} />
          </div>
          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? <><Loader2 className='w-4 h-4 animate-spin mr-2' /> Publicando...</> : 'Publicar'}
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
}: {
  users: User[]
  actions: Actions
  ormName: string
}) {
  const [users, setUsers] = useState(initialUsers)

  const handleCreateUser = async (formData: FormData) => {
    const result = await actions.createUser(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Usuário criado!')
      window.location.reload()
    }
  }

  const handleCreatePost = async (formData: FormData) => {
    const result = await actions.createPost(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post criado!')
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
    if (!confirm(`Deletar "${title}"?`)) return
    const result = await actions.deletePost(postId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post deletado')
      setUsers(users.map((u) => ({ ...u, posts: u.posts.filter((p) => p.id !== postId) })))
    }
  }

  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <header className='mb-12'>
          <div className='flex items-center gap-3 mb-4'>
            <Badge>{ormName}</Badge>
            <a href='/' className='text-sm text-muted-foreground hover:underline'>
              ← Voltar
            </a>
          </div>
          <h1 className='text-4xl font-bold mb-2'>Usuários & Posts</h1>
          <p className='text-muted-foreground'>
            Gerenciando dados com <strong>{ormName}</strong>
          </p>
        </header>

        <div className='grid lg:grid-cols-[1fr_350px] gap-8'>
          <section>
            <h2 className='text-xl font-semibold mb-6'>
              {users.length > 0 ? `${users.length} usuário${users.length > 1 ? 's' : ''}` : 'Nenhum usuário'}
            </h2>

            {users.length === 0 ? (
              <Card className='border-dashed'>
                <CardContent className='py-8 text-center text-muted-foreground'>
                  Crie seu primeiro usuário
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-4'>
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onDeleteUser={handleDeleteUser}
                    onDeletePost={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className='space-y-6 lg:sticky lg:top-6 lg:self-start'>
            <CreateUserForm onSubmit={handleCreateUser} />
            {users.length > 0 && <CreatePostForm users={users} onSubmit={handleCreatePost} />}
          </aside>
        </div>
      </div>
    </main>
  )
}
