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
import { createPost } from '@/app/actions'
import { toast } from 'sonner'
import { PenSquare, Loader2 } from 'lucide-react'

type User = {
  id: number
  name: string
}

export function CreatePostForm({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition()
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const handleSubmit = (formData: FormData) => {
    if (!selectedUserId) {
      toast.error('Selecione um usuário')
      return
    }
    formData.set('userId', selectedUserId)

    startTransition(async () => {
      const result = await createPost(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Post criado!')
        const form = document.getElementById('create-post-form') as HTMLFormElement
        form?.reset()
        setSelectedUserId('')
      }
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
                <SelectValue placeholder='Selecione um usuário' />
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
            <Input id='title' name='title' placeholder='Título do post' required />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='content'>Conteúdo</Label>
            <Textarea
              id='content'
              name='content'
              placeholder='Escreva seu post...'
              required
              rows={3}
            />
          </div>

          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Publicando...
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
