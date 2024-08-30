import { getUserByClerkId } from '@/db/auth';
import { db } from '@/db';
import { entryAnalysis, journalEntry } from '@/db/schema';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { analyze } from '@/utils/ai';

export const POST = async () => {
  const userId = await getUserByClerkId();
  const [entry] = await db
    .insert(journalEntry)
    .values({
      userId: userId,
      content: 'Write about your day!',
    })
    .returning();

  const analysis = await analyze(entry.content);
  const normalizedSentimentScore = analysis.sentimentScore / 10;

  await db.insert(entryAnalysis).values({
    userId: userId,
    entryId: entry.id,
    sentimentScore: normalizedSentimentScore,
    ...analysis,
  });

  revalidatePath('/journal');

  return NextResponse.json({ data: entry });
};
