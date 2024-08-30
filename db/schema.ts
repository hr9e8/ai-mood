import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  pgEnum,
  boolean,
  unique,
  index,
  real,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const journalEntryStatus = pgEnum('journal_entry_status', [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const journalEntry = pgTable(
  'journal_entry',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    content: text('content').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    status: journalEntryStatus('status').notNull().default('DRAFT'),
  },
  (table) => ({
    userIdIdUnique: unique().on(table.userId, table.id),
  })
);

export const entryAnalysis = pgTable(
  'entry_analysis',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    entryId: uuid('entry_id')
      .unique()
      .notNull()
      .references(() => journalEntry.id, { onDelete: 'cascade' })
      .unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    mood: text('mood').notNull(),
    subject: text('subject').notNull(),
    negative: boolean('negative').notNull(),
    summary: text('summary').notNull(),
    color: varchar('color', { length: 7 }).notNull().default('#0101FE'),
    sentimentScore: real('sentiment_score').notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_entry_analysis_user_id').on(table.userId),
  })
);

export const account = pgTable('account', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id)
    .unique(),
});

export const journalEntryRelations = relations(journalEntry, ({ one }) => ({
  analysis: one(entryAnalysis, {
    fields: [journalEntry.id],
    references: [entryAnalysis.entryId],
  }),
}));

export const entryAnalysisRelations = relations(entryAnalysis, ({ one }) => ({
  entry: one(journalEntry, {
    fields: [entryAnalysis.entryId],
    references: [journalEntry.id],
  }),
}));
