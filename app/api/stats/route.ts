import { getDatabase } from '@/lib/mongodb';
import { logError } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory token store: token → expiry timestamp
const tokens = new Map<string, number>();
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function issueToken(): string {
  const token = crypto.randomUUID();
  tokens.set(token, Date.now() + TOKEN_TTL_MS);
  return token;
}

function validateToken(token: string): boolean {
  const expiry = tokens.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    tokens.delete(token);
    return false;
  }
  return true;
}

const json = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });

async function getStats() {
  const db = await getDatabase();
  const submissionsCollection = db.collection('submissions');
  const total = await submissionsCollection.countDocuments();
  const byCountry = await submissionsCollection
    .aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
    .toArray();
  return {
    total,
    byCountry: byCountry.map((c) => ({ country: c._id, count: c.count })),
  };
}

export async function POST(request: NextRequest) {
  let body: { password?: unknown; token?: unknown };

  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: 'Invalid request body' }, 400);
  }

  if (body.token !== undefined && typeof body.token !== 'string') {
    return json({ success: false, message: 'Invalid token' }, 400);
  }

  if (body.password !== undefined && typeof body.password !== 'string') {
    return json({ success: false, message: 'Invalid password' }, 400);
  }

  // Token-based refresh
  if (body.token) {
    if (!validateToken(body.token)) {
      return json({ success: false, message: 'Session expired' }, 401);
    }
    try {
      const stats = await getStats();
      return json({ success: true, ...stats });
    } catch (error) {
      await logError('[Stats] Failed to fetch stats (token auth)', { error: error instanceof Error ? error.message : String(error) });
      return json({ success: false, message: 'Internal server error' }, 500);
    }
  }

  // Password login
  if (!process.env.ADMIN_PASSWORD || !body.password || body.password !== process.env.ADMIN_PASSWORD) {
    return json({ success: false, message: 'Incorrect password' }, 401);
  }

  try {
    const stats = await getStats();
    const token = issueToken();
    return json({ success: true, token, ...stats });
  } catch (error) {
    await logError('[Stats] Failed to fetch stats (password auth)', { error: error instanceof Error ? error.message : String(error) });
    return json({ success: false, message: 'Internal server error' }, 500);
  }
}
