import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getUserByClerkId = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error('Not authenticated');

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    columns: {
      id: true,
    },
  });

  if (!user) throw new Error('User not found');
  return user.id;
};
