'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface StatsData {
  total: number;
  byCountry: { country: string; count: number }[];
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');

  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!key) {
      setError('No access key provided.');
      setLoading(false);
      return;
    }

    fetch(`/api/submissions?key=${key}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setError(json.message || 'Unauthorised.');
        } else {
          setData(json);
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, [key]);

  return (
    <div
      className='min-h-screen bg-black text-white flex items-start justify-center p-8'
      style={{ fontFamily: 'Helvetica Now Var, sans-serif' }}
    >
      <div className='w-full max-w-lg pt-12'>
        <h1
          className='text-3xl uppercase tracking-[-0.05em] mb-8'
          style={{ fontFamily: 'Helvetica Now Display, sans-serif' }}
        >
          Mountain House Sölden
          <br />
          Sign-up Stats
        </h1>

        {loading && (
          <p className='text-gray-400 text-sm uppercase tracking-[-0.02em]'>Loading…</p>
        )}

        {error && (
          <p className='text-red-400 text-sm uppercase tracking-[-0.02em]'>{error}</p>
        )}

        {data && (
          <>
            <div className='border border-white/20 px-6 py-5 mb-6'>
              <p className='text-xs uppercase tracking-[-0.02em] text-gray-400 mb-1'>
                Total entries
              </p>
              <p className='text-5xl font-light tracking-[-0.05em]'>{data.total}</p>
            </div>

            <div className='border border-white/20'>
              <div className='px-6 py-4 border-b border-white/20'>
                <p className='text-xs uppercase tracking-[-0.02em] text-gray-400'>
                  Entries by country
                </p>
              </div>
              {data.byCountry.map(({ country, count }) => (
                <div
                  key={country}
                  className='flex items-center justify-between px-6 py-4 border-b border-white/10 last:border-0'
                >
                  <span className='text-sm uppercase tracking-[-0.02em]'>{country}</span>
                  <span className='text-sm tabular-nums'>{count}</span>
                </div>
              ))}
              {data.byCountry.length === 0 && (
                <p className='px-6 py-4 text-sm text-gray-400'>No entries yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
