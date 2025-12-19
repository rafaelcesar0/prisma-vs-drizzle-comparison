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
    revalidatePath('/')
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
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao criar post' }
  }
}

export async function updateUserPrisma(formData: FormData) {
  const id = formData.get('id')
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const birthDate = formData.get('birthDate') as string

  const userId = Number(id)

  if (!id || Number.isNaN(userId)) {
    return { error: 'ID do usuário é obrigatório' }
  }

  const data: {
    name?: string
    email?: string
    birthDate?: string
  } = {}

  if (name) data.name = name
  if (email) data.email = email
  if (birthDate) data.birthDate = birthDate

  if (Object.keys(data).length === 0) {
    return { error: 'Nenhum campo para atualizar' }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique')) {
      return { error: 'Este email já está cadastrado' }
    }
    return { error: 'Erro ao atualizar usuário' }
  }
}

export async function updatePostPrisma(formData: FormData) {
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

  const data: {
    title?: string
    content?: string
    userId?: number
  } = {}

  if (title) data.title = title
  if (content) data.content = content
  if (parsedUserId !== undefined) data.userId = parsedUserId

  if (Object.keys(data).length === 0) {
    return { error: 'Nenhum campo para atualizar' }
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data,
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao atualizar post' }
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
    revalidatePath('/')
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
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Erro ao deletar post' }
  }
}
