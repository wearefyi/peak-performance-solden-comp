import { getDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
  }

  try {
    const db = await getDatabase();
    const submissionsCollection = db.collection('submissions');

    const total = await submissionsCollection.countDocuments();
    const byCountry = await submissionsCollection
      .aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
      .toArray();

    return NextResponse.json({
      success: true,
      total,
      byCountry: byCountry.map((c) => ({ country: c._id, count: c.count })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
