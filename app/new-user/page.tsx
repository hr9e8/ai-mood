import { db } from '@/db';
import { users } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

const createNewUser = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error('No user found');
  }

  const [match] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, user.id));

  if (!match) {
    await db.insert(users).values({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    });
  }
  redirect('/journal');
};

const NewUser = async () => {
  await createNewUser();
  return <div>...loading</div>;
};

export default NewUser;
