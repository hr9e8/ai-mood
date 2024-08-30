import { getUserByClerkId } from '@/db/auth';
import { db } from '@/db';
import { entryAnalysis, journalEntry } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { analyze } from '@/utils/ai';
import { revalidatePath } from 'next/cache';

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { content } = await request.json();
  const userId = await getUserByClerkId();
  const [updatedEntry] = await db
    .update(journalEntry)
    .set({
      content: content,
      updatedAt: new Date(),
    })
    .where(and(eq(journalEntry.id, params.id), eq(journalEntry.userId, userId)))
    .returning();

  if (!updatedEntry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  const analysis = await analyze(updatedEntry.content);
  const [updatedAnalysis] = await db
    .update(entryAnalysis)
    .set({ ...analysis, updatedAt: new Date() })
    .where(eq(entryAnalysis.entryId, updatedEntry.id))
    .returning();

  const fullUpdatedEntry = {
    ...updatedEntry,
    analysis: updatedAnalysis,
  };

  return NextResponse.json({ data: fullUpdatedEntry });
};
