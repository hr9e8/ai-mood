import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/db/auth';
import { db } from '@/db';
import { journalEntry } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const getEntry = async (id: string) => {
  const userId = await getUserByClerkId();
  const entry = await db.query.journalEntry.findFirst({
    where: and(eq(journalEntry.userId, userId), eq(journalEntry.id, id)),
    with: {
      analysis: true,
    },
  });

  return entry;
};

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const entry = await getEntry(params.id);
  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
