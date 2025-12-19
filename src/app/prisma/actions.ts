'use server'

import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'

export async function createUserPrisma(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const birthDate = formData.get('birthDate') as string

  if (!name || !email || !birthDate) {
    return { error: 'Todos os campos são obrigatórios' }
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        birthDate,
      },
    })
    revalidatePath('/prisma')
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique')) {
      return { error: 'Este email já está cadastrado' }
    }
    return { error: 'Erro ao criar usuário' }
  }
}

export async function createPostPrisma(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const userId = formData.get('userId') as string

  if (!title || !content || !userId) {
    return { error: 'Todos os campos são obrigatórios' }
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        userId: parseInt(userId),
      },
    })
    revalidatePath('/prisma')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao criar post' }
  }
}

export async function getUsersPrisma() {
  return await prisma.user.findMany({
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteUserPrisma(userId: number) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    })
    revalidatePath('/prisma')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao deletar usuário' }
  }
}

export async function deletePostPrisma(postId: number) {
  try {
    await prisma.post.delete({
      where: { id: postId },
    })
    revalidatePath('/prisma')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao deletar post' }
  }
}
