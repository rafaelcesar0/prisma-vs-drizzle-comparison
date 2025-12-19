import { UsersPageClient } from '@/components/users-page'
import {
  getUsersPrisma,
  createUserPrisma,
  createPostPrisma,
  deleteUserPrisma,
  deletePostPrisma,
} from './actions'

export const dynamic = 'force-dynamic'

export default async function PrismaPage() {
  const users = await getUsersPrisma()

  return (
    <UsersPageClient
      users={users}
      actions={{
        createUser: createUserPrisma,
        createPost: createPostPrisma,
        deleteUser: deleteUserPrisma,
        deletePost: deletePostPrisma,
      }}
      ormName='Prisma ORM'
    />
  )
}
