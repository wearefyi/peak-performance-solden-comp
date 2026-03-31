'use client';

import { useEffect } from 'react';

type ModalType = 'terms' | 'privacy';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
}

const modalConfig: Record<
  ModalType,
  { title: string; languages: { label: string; path: string }[] }
> = {
  terms: {
    title: 'Terms and Conditions',
    languages: [
      { label: 'English', path: '/policies/terms_and_conditions/en/terms_and_conditions.pdf' },
      { label: 'Deutsch', path: '/policies/terms_and_conditions/de/terms_and_conditions.pdf' },
      { label: 'Norsk', path: '/policies/terms_and_conditions/no/terms_and_conditions.pdf' },
    ],
  },
  privacy: {
    title: 'Privacy Notice',
    languages: [
      { label: 'English', path: '/policies/privacy_notice/en/privacy_notice.pdf' },
      { label: 'Deutsch', path: '/policies/privacy_notice/de/privacy_notice.pdf' },
    ],
  },
};

export default function LanguageModal({ isOpen, onClose, type }: LanguageModalProps) {
  const config = modalConfig[type];

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        className='bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-8 py-6 border-b border-gray-200'>
          <h2
            className='text-2xl font-bold text-black uppercase'
            style={{ fontFamily: 'Helvetica Now Display, sans-serif', letterSpacing: '-0.05em' }}
          >
            {config.title}
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-400 hover:text-black transition-colors'
            aria-label='Close modal'
          >
            <svg className='w-6 h-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
              <path d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        <div className='px-8 py-6'>
          <div className='flex flex-col gap-3'>
            {config.languages.map((lang) => (
              <a
                key={lang.label}
                href={lang.path}
                target='_blank'
                rel='noopener noreferrer'
                className='w-full py-3 px-6 bg-black text-white text-center rounded-full uppercase hover:bg-white hover:text-black border border-black transition-all duration-500'
                style={{
                  fontFamily: 'Helvetica Now Var, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  letterSpacing: '-0.05em',
                }}
              >
                {lang.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
