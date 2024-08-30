import { getUserByClerkId } from '@/db/auth';
import { journalEntry } from '@/db/schema';
import { db } from '@/db';
import { qa } from '@/utils/ai';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export const POST = async (request) => {
  const { question } = await request.json();
  const userId = await getUserByClerkId();

  const entries = await db
    .select({
      id: journalEntry.id,
      content: journalEntry.content,
      createdAt: journalEntry.createdAt,
    })
    .from(journalEntry)
    .where(eq(journalEntry.userId, userId));

  const answer = await qa(question, entries);

  return NextResponse.json({ data: answer });
};
