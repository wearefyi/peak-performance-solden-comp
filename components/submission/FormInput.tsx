'use client';

import { useState } from 'react';

interface FormInputProps {
  type: 'text' | 'email' | 'url' | 'date';
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}

export default function FormInput({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'date' && !isFocused && !value ? 'text' : type;

  return (
    <div className='mb-0 -mx-8 md:-mx-16'>
      <input
        type={inputType}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className='w-full py-6 px-8 md:px-16 border-0 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-black transition-all uppercase placeholder:uppercase placeholder:text-[#868686] bg-transparent text-[16px] leading-[16px] tracking-[-0.02em]'
        placeholder={placeholder}
        style={{
          fontFamily: 'Helvetica Now Var, sans-serif',
          fontWeight: 400,
          color: type === 'date' && !value ? '#868686' : '#000000',
        }}
      />
      {error && (
        <p
          className='mt-1 text-sm text-red-600 px-8 md:px-16'
          style={{ fontFamily: 'var(--font-text)' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
