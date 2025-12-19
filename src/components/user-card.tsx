'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { deleteUser, deletePost } from '@/app/actions'
import { toast } from 'sonner'
import { Trash2, ChevronDown, Calendar, X } from 'lucide-react'

type User = {
  id: number
  name: string
  email: string
  birthDate: string
  createdAt: Date | null
  posts: {
    id: number
    title: string
    content: string
    userId: number
    createdAt: Date | null
  }[]
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

export function UserCard({ user, index }: { user: User; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteUser = async () => {
    if (!confirm(`Tem certeza que deseja deletar ${user.name}?`)) return
    setIsDeleting(true)
    const result = await deleteUser(user.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Usuário deletado com sucesso')
    }
    setIsDeleting(false)
  }

  const handleDeletePost = async (postId: number, postTitle: string) => {
    if (!confirm(`Deletar o post "${postTitle}"?`)) return
    const result = await deletePost(postId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post deletado')
    }
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
              className="w-14 h-14 rounded-2xl bg-linear-to-br from-coral to-coral-light flex items-center justify-center text-white text-xl font-semibold shadow-md"
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
                        onClick={() => handleDeletePost(post.id, post.title)}
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
