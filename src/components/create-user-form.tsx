'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUser } from '@/app/actions'
import { toast } from 'sonner'
import { UserPlus, Loader2 } from 'lucide-react'

export function CreateUserForm() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createUser(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Usuário criado com sucesso!')
        const form = document.getElementById('create-user-form') as HTMLFormElement
        form?.reset()
      }
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
            <Label htmlFor="name" className="text-navy">
              Nome
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="João Silva"
              required
              className="bg-cream/30 border-border/50 focus:border-coral focus:ring-coral/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-navy">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="joao@email.com"
              required
              className="bg-cream/30 border-border/50 focus:border-coral focus:ring-coral/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-navy">
              Data de Nascimento
            </Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              className="bg-cream/30 border-border/50 focus:border-coral focus:ring-coral/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-coral to-coral hover:from-coral/90 hover:to-coral/90 text-white font-medium shadow-md shadow-coral/20 hover:shadow-lg hover:shadow-coral/30 transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Usuário'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
