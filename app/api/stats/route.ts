import { getDatabase } from '@/lib/mongodb';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', Connection: 'close' },
  });

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return json({ success: false, message: 'Incorrect password' }, 401);
  }

  try {
    const db = await getDatabase();
    const submissionsCollection = db.collection('submissions');

    const total = await submissionsCollection.countDocuments();
    const byCountry = await submissionsCollection
      .aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
      .toArray();

    return json({
      success: true,
      total,
      byCountry: byCountry.map((c) => ({ country: c._id, count: c.count })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return json({ success: false, message: 'Internal server error' }, 500);
  }
}
