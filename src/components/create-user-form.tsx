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
        toast.success('Usuário criado!')
        const form = document.getElementById('create-user-form') as HTMLFormElement
        form?.reset()
      }
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
            {isPending ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Criando...
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
