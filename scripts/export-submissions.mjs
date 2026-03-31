import { MongoClient } from 'mongodb';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  console.error('Run with: MONGODB_URI="your-uri" node scripts/export-submissions.mjs');
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db('peak_performance_solden');
  const submissions = await db.collection('submissions').find({}).sort({ timestamp: 1 }).toArray();

  if (submissions.length === 0) {
    console.log('No submissions found.');
    process.exit(0);
  }

  const headers = [
    'ID',
    'Full Name',
    'Email',
    'Date of Birth',
    'Country',
    'Instagram / TikTok Handle',
    'Heard About Us',
    'Story Answer',
    'Submitted At',
  ];

  const escape = (val) => {
    if (val == null) return '';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = submissions.map((s) => [
    escape(s.id),
    escape(s.fullName),
    escape(s.email),
    escape(s.dateOfBirth),
    escape(s.country),
    escape(s.socialHandle ?? ''),
    escape(s.heardAboutUs),
    escape(s.storyAnswer),
    escape(s.timestamp),
  ]);

  const csv = [headers.map(escape), ...rows].map((r) => r.join(',')).join('\n');

  const date = new Date().toISOString().slice(0, 10);
  const outputPath = resolve(`submissions-${date}.csv`);
  writeFileSync(outputPath, csv, 'utf8');

  console.log(`Exported ${submissions.length} submission(s) to ${outputPath}`);
} finally {
  await client.close();
}
