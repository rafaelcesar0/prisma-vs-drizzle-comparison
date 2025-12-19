import { UsersPageClient } from '@/components/users-page'
import {
  getUsersDrizzle,
  createUserDrizzle,
  createPostDrizzle,
  deleteUserDrizzle,
  deletePostDrizzle,
} from './actions'

export const dynamic = 'force-dynamic'

export default async function DrizzlePage() {
  const users = await getUsersDrizzle()

  return (
    <UsersPageClient
      users={users}
      actions={{
        createUser: createUserDrizzle,
        createPost: createPostDrizzle,
        deleteUser: deleteUserDrizzle,
        deletePost: deletePostDrizzle,
      }}
      ormName="Drizzle ORM"
      ormColor="#c5f74f"
    />
  )
}
