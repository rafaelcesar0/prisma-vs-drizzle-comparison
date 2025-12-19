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
    revalidatePath('/drizzle')
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
    revalidatePath('/drizzle')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao criar post' }
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
    revalidatePath('/drizzle')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao deletar usuário' }
  }
}

export async function deletePostDrizzle(postId: number) {
  try {
    await db.delete(posts).where(eq(posts.id, postId))
    revalidatePath('/drizzle')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao deletar post' }
  }
}
