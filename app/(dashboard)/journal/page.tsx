import NewEntryCard from '@/components/NewEntryCard';
import EntryCard from '@/components/EntryCard';
import { db } from '@/db';
import { getUserByClerkId } from '@/db/auth';
import { journalEntry } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import Question from '@/components/Question';

const getEntries = async () => {
  const user = await getUserByClerkId();

  const entries = await db.query.journalEntry.findMany({
    where: eq(journalEntry.userId, user),
    columns: {
      id: true,
      content: true,
      createdAt: true,
      status: true,
    },
    with: {
      analysis: true,
    },
    orderBy: [desc(journalEntry.createdAt)],
  });

  return entries;
};

const JournalPage = async () => {
  const entries = await getEntries();
  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="my-8">
        <Question />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
