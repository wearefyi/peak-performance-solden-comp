import Image from 'next/image';
import { ReactNode } from 'react';

interface SubmissionHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function SubmissionHeader({ title, children }: SubmissionHeaderProps) {
  return (
    <>
      <div className='mb-6 pb-6 border-b border-gray-300 pt-0 -mx-8 md:-mx-16 px-8 md:px-16'>
        <Image
          src='/peakperformancelogo.svg'
          alt='Peak Performance'
          width={300}
          height={31}
          className='w-[300px] h-[31px]'
          priority
        />
      </div>

      <div className='mb-0 pb-6 border-b border-gray-300 -mx-8 md:-mx-16 px-8 md:px-16'>
        <h1
          className='text-black uppercase mb-4 text-[20px] leading-[100%] tracking-[-0.02em]'
          style={{ fontFamily: 'Helvetica Now Var, sans-serif', fontWeight: 400 }}
        >
          {title}
        </h1>
        <div
          className='text-black'
          style={{
            fontFamily: 'Mercury Display, serif',
            fontWeight: 400,
            fontSize: '16px',
            letterSpacing: '-0.05em',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
