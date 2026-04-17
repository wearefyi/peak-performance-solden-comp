import Image from 'next/image';

// Show winners copy until this date, then revert to the standard closed message.
// Override via Netlify env var (requires redeploy): NEXT_PUBLIC_WINNER_ANNOUNCEMENT_UNTIL
const WINNER_ANNOUNCEMENT_UNTIL = new Date(
  process.env.NEXT_PUBLIC_WINNER_ANNOUNCEMENT_UNTIL ?? '2026-04-22T00:00:00Z'
);

function isWinnerAnnouncementActive(): boolean {
  return new Date() < WINNER_ANNOUNCEMENT_UNTIL;
}

export default function CompetitionClosed() {
  const showWinners = isWinnerAnnouncementActive();
  return (
    <>
      <div className='mb-6 pb-6 border-b border-gray-300 pt-0 -mx-8 md:-mx-16 px-8 md:px-16'>
        <Image
          src='/peakperformancelogo.svg'
          alt='Peak Performance'
          width={300}
          height={31}
          className='w-[300px] h-auto'
          priority
        />
      </div>

      <div className='py-8 -mx-8 md:-mx-16 border-b border-gray-300'>
        <div className='px-8 md:px-16'>
          <p
            className='text-black uppercase mb-4'
            style={{
              fontFamily: 'Helvetica Now Var, sans-serif',
              fontWeight: 400,
              fontSize: '20px',
              lineHeight: '100%',
              letterSpacing: '-0.05em',
            }}
          >
            THIS COMPETITION IS NOW CLOSED
          </p>
          <p
            className='text-black'
            style={{
              fontFamily: 'Mercury Display, serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '1.4',
              letterSpacing: '-0.05em',
            }}
          >
            {showWinners ? (
              <>
                Entries for the Peak Performance Mountain House: Sölden
                competition have now closed. Congratulations to the winners,
                Stina S and Nina K — you have been contacted directly via{' '}
                <a
                  href='mailto:collaboration@peakperformance.com'
                  className='underline hover:no-underline'
                >
                  collaboration@peakperformance.com
                </a>
                .
              </>
            ) : (
              <>
                Entries for the Peak Performance Mountain House: Sölden
                competition have now closed. If you entered, winners will be
                contacted directly via{' '}
                <a
                  href='mailto:collaboration@peakperformance.com'
                  className='underline hover:no-underline'
                >
                  collaboration@peakperformance.com
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>

      <div className='py-8 -mx-8 md:-mx-16'>
        <div className='px-8 md:px-16'>
          <p
            className='text-gray-500 uppercase mb-4'
            style={{
              fontFamily: 'Helvetica Now Var, sans-serif',
              fontWeight: 400,
              fontSize: '20px',
              lineHeight: '100%',
              letterSpacing: '-0.05em',
            }}
          >
            FOLLOW US
          </p>
          <div className='flex gap-4'>
            <a
              href='https://instagram.com/peakperformance'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Peak Performance on Instagram'
              className='text-black hover:opacity-70 transition-opacity'
            >
              <svg className='w-10 h-10' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
