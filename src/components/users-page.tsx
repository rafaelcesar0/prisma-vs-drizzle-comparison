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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  UserPlus,
  PenSquare,
  Loader2,
  Trash2,
  ChevronDown,
  X,
} from 'lucide-react'
import { OrmToggle } from '@/components/orm-toggle'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'

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
  createUser: (
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean }>
  createPost: (
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean }>
  deleteUser: (userId: number) => Promise<{ error?: string; success?: boolean }>
  deletePost: (postId: number) => Promise<{ error?: string; success?: boolean }>
  getUsers: () => Promise<User[]>
}

type OrmType = 'drizzle' | 'prisma'

function calculateAge(dateString: string) {
  const today = new Date()
  const birthDate = new Date(dateString + 'T00:00:00')
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
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
  onDeletePost: (postId: number) => Promise<void>
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDeleteUser(user.id)
    setIsDeleting(false)
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium transition-colors duration-300'>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className='font-medium'>{user.name}</h3>
              <p className='text-sm text-muted-foreground'>{user.email}</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size='icon' disabled={isDeleting}>
                <Trash2 className='w-4 h-4' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deletar {user.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação removerá o usuário e seus posts permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin mr-2' /> Deletando...
                    </>
                  ) : (
                    'Deletar'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className='space-y-2 pt-2'>
            {user.posts.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-2'>
                Nenhum post
              </p>
            ) : (
              user.posts.map((post) => (
                <div key={post.id} className='p-3 rounded-lg bg-muted/50'>
                  <div className='flex items-start justify-between gap-2'>
                    <h4 className='font-medium text-sm'>{post.title}</h4>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                        >
                          <X className='w-3 h-3' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Deletar &quot;{post.title}&quot;?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeletePost(post.id)}>
                            Deletar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

function CreateUserForm({
  onSubmit,
}: {
  onSubmit: (formData: FormData) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [isDateOpen, setIsDateOpen] = useState(false)

  const handleSubmit = (formData: FormData) => {
    if (!birthDate) {
      toast.error('Selecione a data de nascimento')
      return
    }

    formData.set('birthDate', format(birthDate, 'yyyy-MM-dd'))

    startTransition(async () => {
      await onSubmit(formData)
      const form = document.getElementById(
        'create-user-form'
      ) as HTMLFormElement
      form?.reset()
      setBirthDate(undefined)
      setIsDateOpen(false)
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
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='joao@email.com'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='birthDate'>Data de Nascimento</Label>
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  id='birthDate'
                  className='w-full justify-between font-normal'
                >
                  {birthDate
                    ? format(birthDate, 'dd/MM/yyyy')
                    : 'Selecionar data'}
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
              >
                <Calendar
                  mode='single'
                  selected={birthDate}
                  captionLayout='dropdown'
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  onSelect={(date) => {
                    setBirthDate(date ?? undefined)
                    setIsDateOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <input
              type='hidden'
              name='birthDate'
              value={birthDate ? format(birthDate, 'yyyy-MM-dd') : ''}
            />
          </div>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full transition-colors duration-300'
          >
            {isPending ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' /> Criando...
              </>
            ) : (
              'Criar'
            )}
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
      const form = document.getElementById(
        'create-post-form'
      ) as HTMLFormElement
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
            <Textarea
              id='content'
              name='content'
              placeholder='Conteúdo...'
              required
              rows={3}
            />
          </div>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full transition-colors duration-300'
          >
            {isPending ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' /> Publicando...
              </>
            ) : (
              'Publicar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function UsersPageClient({
  initialUsers,
  drizzleActions,
  prismaActions,
}: {
  initialUsers: User[]
  drizzleActions: Actions
  prismaActions: Actions
}) {
  const [selectedOrm, setSelectedOrm] = useState<OrmType>('drizzle')
  const [users, setUsers] = useState(initialUsers)
  const [isLoading, setIsLoading] = useState(false)

  const actions = selectedOrm === 'drizzle' ? drizzleActions : prismaActions
  const ormName = selectedOrm === 'drizzle' ? 'Drizzle ORM' : 'Prisma ORM'

  const handleOrmChange = async (orm: OrmType) => {
    setSelectedOrm(orm)
    setIsLoading(true)
    try {
      const newActions = orm === 'drizzle' ? drizzleActions : prismaActions
      const newUsers = await newActions.getUsers()
      setUsers(newUsers)
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (formData: FormData) => {
    const result = await actions.createUser(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Usuário criado!')
      const newUsers = await actions.getUsers()
      setUsers(newUsers)
    }
  }

  const handleCreatePost = async (formData: FormData) => {
    const result = await actions.createPost(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post criado!')
      const newUsers = await actions.getUsers()
      setUsers(newUsers)
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

  const handleDeletePost = async (postId: number) => {
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
    <main
      className={cn(
        'min-h-screen bg-background theme-transition',
        `theme-${selectedOrm}`
      )}
    >
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <header className='mb-12'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
            <div>
              <p className='text-primary text-sm font-medium uppercase tracking-widest mb-2 transition-colors duration-300'>
                Comparação de ORMs
              </p>
              <h1 className='text-4xl font-bold'>Usuários & Posts</h1>
            </div>
            <OrmToggle value={selectedOrm} onChange={handleOrmChange} />
          </div>
          <p className='text-muted-foreground'>
            Gerenciando dados com{' '}
            <Badge
              variant='secondary'
              className='transition-colors duration-300'
            >
              {ormName}
            </Badge>
          </p>
        </header>

        <div
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
          )}
        >
          <h2 className='text-xl font-semibold mb-6'>
            {users.length > 0
              ? `${users.length} usuário${users.length > 1 ? 's' : ''}`
              : 'Nenhum usuário'}
          </h2>
          <div className='grid gap-6 lg:grid-cols-2 lg:grid-rows-[auto_auto]'>
            <section className='lg:row-span-2 scroll-auto lg:max-h-[88vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-colors'>
              {users.length === 0 ? (
                <Card className='border-dashed'>
                  <CardContent className='py-8 text-center text-muted-foreground '>
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

            <div className='lg:col-start-2 lg:row-start-1'>
              <CreateUserForm onSubmit={handleCreateUser} />
            </div>
            {users.length > 0 && (
              <div className='lg:col-start-2 lg:row-start-2'>
                <CreatePostForm users={users} onSubmit={handleCreatePost} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
