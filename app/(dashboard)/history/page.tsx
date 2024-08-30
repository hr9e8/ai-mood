import { getUserByClerkId } from '@/db/auth';
import { db } from '@/db';
import { entryAnalysis } from '@/db/schema';
import { eq } from 'drizzle-orm';
import HistoryChart from '@/components/HistoryCharts';

const getData = async () => {
  const userId = await getUserByClerkId();
  const analysis = await db
    .select()
    .from(entryAnalysis)
    .where(eq(entryAnalysis.userId, userId));

  const sum = analysis.reduce(
    (all, current) => all + current.sentimentScore,
    0
  );
  const avg =
    analysis.length > 0 ? Math.round((sum / analysis.length) * 100) / 100 : 0;
  return { analysis, avg };
};

const History = async () => {
  const { avg, analysis } = await getData();
  return (
    <div className="w-full h-full">
      <div>{`Avg. Sentiment ${avg}`}</div>
      <div className="w-full h-full">
        <HistoryChart data={analysis} />
      </div>
    </div>
  );
};

export default History;
