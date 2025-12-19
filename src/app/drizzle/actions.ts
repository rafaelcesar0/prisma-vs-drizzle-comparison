'use server'

import { db, users, posts } from '@/db'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createUserDrizzle(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const birthDate = formData.get('birthDate') as string

  if (!name || !email || !birthDate) {
    return { error: 'Todos os campos são obrigatórios' }
  }

  try {
    await db.insert(users).values({
      name,
      email,
      birthDate,
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return { error: 'Este email já está cadastrado' }
    }
    return { error: 'Erro ao criar usuário' }
  }
}

export async function createPostDrizzle(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const userId = formData.get('userId') as string

  if (!title || !content || !userId) {
    return { error: 'Todos os campos são obrigatórios' }
  }

  try {
    await db.insert(posts).values({
      title,
      content,
      userId: parseInt(userId),
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao criar post' }
  }
}

export async function updateUserDrizzle(formData: FormData) {
  const id = formData.get('id')
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const birthDate = formData.get('birthDate') as string

  const userId = Number(id)

  if (!id || Number.isNaN(userId)) {
    return { error: 'ID do usuário é obrigatório' }
  }

  const updateData: Partial<typeof users.$inferInsert> = {}

  if (name) updateData.name = name
  if (email) updateData.email = email
  if (birthDate) updateData.birthDate = birthDate

  if (Object.keys(updateData).length === 0) {
    return { error: 'Nenhum campo para atualizar' }
  }

  try {
    await db.update(users).set(updateData).where(eq(users.id, userId))
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return { error: 'Este email já está cadastrado' }
    }
    return { error: 'Erro ao atualizar usuário' }
  }
}

export async function updatePostDrizzle(formData: FormData) {
  const id = formData.get('id')
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const userId = formData.get('userId') as string

  const postId = Number(id)
  const parsedUserId = userId ? Number(userId) : undefined

  if (!id || Number.isNaN(postId)) {
    return { error: 'ID do post é obrigatório' }
  }

  if (parsedUserId !== undefined && Number.isNaN(parsedUserId)) {
    return { error: 'Usuário do post inválido' }
  }

  const updateData: Partial<typeof posts.$inferInsert> = {}

  if (title) updateData.title = title
  if (content) updateData.content = content
  if (parsedUserId !== undefined) updateData.userId = parsedUserId

  if (Object.keys(updateData).length === 0) {
    return { error: 'Nenhum campo para atualizar' }
  }

  try {
    await db.update(posts).set(updateData).where(eq(posts.id, postId))
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao atualizar post' }
  }
}

export async function getUsersDrizzle() {
  return await db.query.users.findMany({
    with: {
      posts: {
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      },
    },
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export async function deleteUserDrizzle(userId: number) {
  try {
    await db.delete(users).where(eq(users.id, userId))
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao deletar usuário' }
  }
}

export async function deletePostDrizzle(postId: number) {
  try {
    await db.delete(posts).where(eq(posts.id, postId))
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao deletar post' }
  }
}
