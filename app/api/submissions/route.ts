import { getDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('[Submissions] MONGODB_URI is not configured');
      return NextResponse.json(
        { success: false, message: 'Database configuration error' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { fullName, email, dateOfBirth, country, socialHandle, heardAboutUs, storyAnswer } = body;

    if (!fullName || !email || !dateOfBirth || !country || !heardAboutUs || !storyAnswer) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (email.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Email is too long (max 100 characters)' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 },
      );
    }

    if (storyAnswer.length > 2000) {
      return NextResponse.json(
        { success: false, message: 'Story answer is too long (max 2000 characters)' },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const submissionsCollection = db.collection<Submission>('submissions');

    const alreadySubmitted = await submissionsCollection.findOne({
      email: email.toLowerCase(),
    });

    if (alreadySubmitted) {
      return NextResponse.json(
        { success: false, message: 'You have already submitted an entry with this email address' },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const newSubmission: Submission = {
      id: `sub_${timestamp}_${Math.random().toString(36).substring(2, 11)}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      dateOfBirth: dateOfBirth.trim(),
      country: country.trim(),
      ...(socialHandle?.trim() ? { socialHandle: socialHandle.trim() } : {}),
      heardAboutUs: heardAboutUs.trim(),
      storyAnswer: storyAnswer.trim(),
      timestamp: new Date().toISOString(),
    };

    await submissionsCollection.insertOne(newSubmission);

    return NextResponse.json({
      success: true,
      message: 'Submission received successfully',
      submissionId: newSubmission.id,
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
