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
        toast.success('Post criado com sucesso!')
        const form = document.getElementById('create-post-form') as HTMLFormElement
        form?.reset()
        setSelectedUserId('')
      }
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
            <Label htmlFor="userId" className="text-navy">
              Autor
            </Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full bg-cream/30 border-border/50 focus:border-navy focus:ring-navy/20">
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
            <Label htmlFor="title" className="text-navy">
              Título
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Título do post"
              required
              className="bg-cream/30 border-border/50 focus:border-navy focus:ring-navy/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-navy">
              Conteúdo
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Escreva seu post aqui..."
              required
              rows={4}
              className="bg-cream/30 border-border/50 focus:border-navy focus:ring-navy/20 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-navy hover:bg-navy/90 text-white font-medium shadow-md shadow-navy/20 hover:shadow-lg hover:shadow-navy/30 transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publicando...
              </>
            ) : (
              'Publicar Post'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
