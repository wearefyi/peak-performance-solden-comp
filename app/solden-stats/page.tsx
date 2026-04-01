'use client';

import { useEffect, useState } from 'react';

interface StatsData {
  total: number;
  byCountry: { country: string; count: number }[];
}

const SESSION_KEY = 'solden_stats_token';

export default function SoldenStatsPage() {
  const [password, setPassword] = useState('');
  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem(SESSION_KEY);
    if (savedToken) {
      fetchWithToken(savedToken);
    }
  }, []);

  const postToApi = async (body: object) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const text = await res.text();
      return JSON.parse(text);
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  };

  const fetchWithToken = async (token: string) => {
    try {
      const json = await postToApi({ token });
      if (!json.success) {
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        setData(json);
        setAuthed(true);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const json = await postToApi({ password });
      if (!json.success) {
        setError('Incorrect password.');
      } else {
        sessionStorage.setItem(SESSION_KEY, json.token);
        setData(json);
        setAuthed(true);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to load data.');
      }
    } finally {
      setLoading(false);
    }
  };

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

        {!authed ? (
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='PASSWORD'
              className='w-full bg-transparent border-b border-white/30 py-3 text-sm uppercase tracking-[-0.02em] placeholder:text-white/30 focus:outline-none focus:border-white transition-colors'
              style={{ fontFamily: 'Helvetica Now Var, sans-serif' }}
            />
            {error && (
              <p className='text-red-400 text-xs uppercase tracking-[-0.02em]'>{error}</p>
            )}
            <button
              type='submit'
              disabled={loading || !password}
              className='w-full py-3 border border-white text-sm uppercase tracking-[-0.02em] hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              {loading ? 'Loading…' : 'View Stats'}
            </button>
          </form>
        ) : (
          <>
            <div className='border border-white/20 px-6 py-5 mb-6'>
              <p className='text-xs uppercase tracking-[-0.02em] text-gray-400 mb-1'>
                Total entries
              </p>
              <p className='text-5xl font-light tracking-[-0.05em]'>{data?.total}</p>
            </div>

            <div className='border border-white/20'>
              <div className='px-6 py-4 border-b border-white/20'>
                <p className='text-xs uppercase tracking-[-0.02em] text-gray-400'>
                  Entries by country
                </p>
              </div>
              {data?.byCountry.map(({ country, count }) => (
                <div
                  key={country}
                  className='flex items-center justify-between px-6 py-4 border-b border-white/10 last:border-0'
                >
                  <span className='text-sm uppercase tracking-[-0.02em]'>{country}</span>
                  <span className='text-sm tabular-nums'>{count}</span>
                </div>
              ))}
              {data?.byCountry.length === 0 && (
                <p className='px-6 py-4 text-sm text-gray-400'>No entries yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
