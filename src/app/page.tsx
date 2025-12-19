import { UsersPageClient } from '@/components/users-page'
import {
  createUserDrizzle,
  createPostDrizzle,
  getUsersDrizzle,
  deleteUserDrizzle,
  deletePostDrizzle,
} from '@/app/drizzle/actions'
import {
  createUserPrisma,
  createPostPrisma,
  getUsersPrisma,
  deleteUserPrisma,
  deletePostPrisma,
} from '@/app/prisma/actions'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const users = await getUsersDrizzle()

  const drizzleActions = {
    createUser: createUserDrizzle,
    createPost: createPostDrizzle,
    deleteUser: deleteUserDrizzle,
    deletePost: deletePostDrizzle,
    getUsers: getUsersDrizzle,
  }

  const prismaActions = {
    createUser: createUserPrisma,
    createPost: createPostPrisma,
    deleteUser: deleteUserPrisma,
    deletePost: deletePostPrisma,
    getUsers: getUsersPrisma,
  }

  return (
    <UsersPageClient
      initialUsers={users}
      drizzleActions={drizzleActions}
      prismaActions={prismaActions}
    />
  )
}
