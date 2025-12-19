'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { deleteUser, deletePost } from '@/app/actions'
import { toast } from 'sonner'
import { Trash2, ChevronDown, X } from 'lucide-react'

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

export function UserCard({ user }: { user: User }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteUser = async () => {
    if (!confirm(`Deletar ${user.name}?`)) return
    setIsDeleting(true)
    const result = await deleteUser(user.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Usuário deletado')
    }
    setIsDeleting(false)
  }

  const handleDeletePost = async (postId: number, postTitle: string) => {
    if (!confirm(`Deletar "${postTitle}"?`)) return
    const result = await deletePost(postId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post deletado')
    }
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
          <Button
            variant='ghost'
            size='icon'
            onClick={handleDeleteUser}
            disabled={isDeleting}
          >
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
              <p className='text-sm text-muted-foreground text-center py-2'>
                Nenhum post
              </p>
            ) : (
              user.posts.map((post) => (
                <div key={post.id} className='p-3 rounded-lg bg-muted/50'>
                  <div className='flex items-start justify-between gap-2'>
                    <h4 className='font-medium text-sm'>{post.title}</h4>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6'
                      onClick={() => handleDeletePost(post.id, post.title)}
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
