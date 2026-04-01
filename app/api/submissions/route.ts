import { getDatabase } from '@/lib/mongodb';
import { NextRequest } from 'next/server';


interface Submission {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  country: string;
  socialHandle?: string;
  heardAboutUs: string;
  storyAnswer: string;
  timestamp: string;
}

const postJson = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('[Submissions] MONGODB_URI is not configured');
      return postJson({ success: false, message: 'Database configuration error' }, 500);
    }

    const body = await request.json();

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const dateOfBirth = typeof body.dateOfBirth === 'string' ? body.dateOfBirth.trim() : '';
    const country = typeof body.country === 'string' ? body.country.trim() : '';
    const socialHandle = typeof body.socialHandle === 'string' ? body.socialHandle.trim() : '';
    const heardAboutUs = typeof body.heardAboutUs === 'string' ? body.heardAboutUs.trim() : '';
    const storyAnswer = typeof body.storyAnswer === 'string' ? body.storyAnswer.trim() : '';

    if (!fullName || !email || !dateOfBirth || !country || !heardAboutUs || !storyAnswer) {
      return postJson({ success: false, message: 'Missing required fields' }, 400);
    }

    if (email.length > 100) {
      return postJson({ success: false, message: 'Email is too long (max 100 characters)' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return postJson({ success: false, message: 'Invalid email format' }, 400);
    }

    if (storyAnswer.length > 2000) {
      return postJson({ success: false, message: 'Story answer is too long (max 2000 characters)' }, 400);
    }

    const db = await getDatabase();
    const submissionsCollection = db.collection<Submission>('submissions');

    const alreadySubmitted = await submissionsCollection.findOne({ email });

    if (alreadySubmitted) {
      return postJson({ success: false, message: 'You have already submitted an entry with this email address' }, 400);
    }

    const newSubmission: Submission = {
      id: crypto.randomUUID(),
      fullName,
      email,
      dateOfBirth,
      country,
      ...(socialHandle ? { socialHandle } : {}),
      heardAboutUs,
      storyAnswer,
      timestamp: new Date().toISOString(),
    };

    await submissionsCollection.insertOne(newSubmission);

    return postJson({ success: true, message: 'Submission received successfully', submissionId: newSubmission.id });
  } catch (error) {
    console.error('Error processing submission:', error);
    return postJson({ success: false, message: 'Internal server error' }, 500);
  }
}
