'use client';

import {
  FormInput,
  LanguageModal,
  SubmissionHeader,
  SubmissionSuccess,
  SubmitButton,
} from '@/components/submission';
import Image from 'next/image';
import { useState } from 'react';

const STORY_MAX_CHARS = 2000;

const selectStyle = {
  fontFamily: 'Helvetica Now Var, sans-serif',
  fontWeight: 400,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23868686' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 2rem center',
};

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    country: '',
    socialHandle: '',
    heardAboutUs: '',
    storyAnswer: '',
    ageConfirmed: false,
    agreedToTerms: false,
    privacyAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyNoticeModalOpen, setIsPrivacyNoticeModalOpen] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.heardAboutUs) {
      newErrors.heardAboutUs = 'Please tell us where you heard about us';
    }

    if (!formData.storyAnswer.trim()) {
      newErrors.storyAnswer = 'Please tell us your story';
    } else if (formData.storyAnswer.length > STORY_MAX_CHARS) {
      newErrors.storyAnswer = `Answer must be ${STORY_MAX_CHARS} characters or fewer`;
    }

    if (!formData.ageConfirmed) {
      newErrors.ageConfirmed = 'You must confirm you are 18 or older';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms and Conditions';
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must agree to the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          country: formData.country,
          socialHandle: formData.socialHandle,
          heardAboutUs: formData.heardAboutUs,
          storyAnswer: formData.storyAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsSubmitting(false);
        setSubmitError(data.message || 'Failed to submit. Please try again.');
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit. Please try again.'
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    const type = e.target instanceof HTMLInputElement ? e.target.type : 'text';
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const storyCharsRemaining = STORY_MAX_CHARS - formData.storyAnswer.length;

  return (
    <div className='min-h-screen relative flex items-center justify-center p-4 overflow-hidden'>
      {/* Background image */}
      <Image
        src='/background.jpeg'
        alt=''
        fill
        className='object-cover'
        priority
      />
      <div className='absolute inset-0 bg-black/30' />

      {/* Form card */}
      <div className='relative z-10 w-full max-w-2xl'>
        <div className='bg-white/95 backdrop-blur-sm shadow-2xl px-8 md:px-16 py-8 md:py-12 flex flex-col'>
          {!isSubmitted ? (
            <>
              <SubmissionHeader title='WIN A SPOT AT THE SÖLDEN MOUNTAIN HOUSE'>
                <p className='mb-4'>
                  Copy tbc — explaining the competition, judging criteria, required experience for participating, timeline, etc.
                </p>
              </SubmissionHeader>

              <form onSubmit={handleSubmit} className='space-y-0'>
                {/* Full Name */}
                <FormInput
                  type='text'
                  id='fullName'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='FULL NAME'
                  error={errors.fullName}
                />

                {/* Email */}
                <FormInput
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='EMAIL'
                  error={errors.email}
                />

                {/* Date of Birth */}
                <FormInput
                  type='date'
                  id='dateOfBirth'
                  name='dateOfBirth'
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  placeholder='DATE OF BIRTH'
                  error={errors.dateOfBirth}
                />

                {/* Country */}
                <div className='mb-0 -mx-8 md:-mx-16'>
                  <label htmlFor='country' className='sr-only'>Country of residence</label>
                  <select
                    id='country'
                    name='country'
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full py-6 px-8 md:px-16 border-0 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-black transition-all uppercase bg-transparent text-[16px] leading-[16px] tracking-[-0.02em] appearance-none cursor-pointer ${
                      formData.country ? 'text-black' : 'text-[#868686]'
                    }`}
                    style={selectStyle}
                  >
                    <option value='' disabled>COUNTRY OF RESIDENCE</option>
                    <option value='Austria'>AUSTRIA</option>
                    <option value='Belgium'>BELGIUM</option>
                    <option value='Denmark'>DENMARK</option>
                    <option value='Finland'>FINLAND</option>
                    <option value='Germany'>GERMANY</option>
                    <option value='Norway'>NORWAY</option>
                    <option value='Sweden'>SWEDEN</option>
                    <option value='Switzerland'>SWITZERLAND</option>
                    <option value='United Kingdom'>UNITED KINGDOM</option>
                  </select>
                  {errors.country && (
                    <p className='mt-1 text-sm text-red-600 px-8 md:px-16' style={{ fontFamily: 'var(--font-text)' }}>
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* Social Handle (optional) */}
                <FormInput
                  type='text'
                  id='socialHandle'
                  name='socialHandle'
                  value={formData.socialHandle}
                  onChange={handleChange}
                  placeholder='INSTAGRAM / TIKTOK HANDLE (OPTIONAL)'
                  error={errors.socialHandle}
                />

                {/* Where did you hear about us */}
                <div className='mb-0 -mx-8 md:-mx-16'>
                  <label htmlFor='heardAboutUs' className='sr-only'>Where did you hear about us?</label>
                  <select
                    id='heardAboutUs'
                    name='heardAboutUs'
                    value={formData.heardAboutUs}
                    onChange={handleChange}
                    className={`w-full py-6 px-8 md:px-16 border-0 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-black transition-all uppercase bg-transparent text-[16px] leading-[16px] tracking-[-0.02em] appearance-none cursor-pointer ${
                      formData.heardAboutUs ? 'text-black' : 'text-[#868686]'
                    }`}
                    style={selectStyle}
                  >
                    <option value='' disabled>WHERE DID YOU HEAR ABOUT US?</option>
                    <option value='Peak Performance'>PEAK PERFORMANCE</option>
                    <option value='Anton Sport'>ANTON SPORT</option>
                  </select>
                  {errors.heardAboutUs && (
                    <p className='mt-1 text-sm text-red-600 px-8 md:px-16' style={{ fontFamily: 'var(--font-text)' }}>
                      {errors.heardAboutUs}
                    </p>
                  )}
                </div>

                {/* Story answer */}
                <div className='mb-0 -mx-8 md:-mx-16'>
                  <label
                    htmlFor='storyAnswer'
                    className='block px-8 md:px-16 pt-6 pb-3 text-black text-[16px] leading-snug tracking-[-0.05em]'
                    style={{ fontFamily: 'Mercury Display, serif', fontWeight: 400 }}
                  >
                    Tell us the story of an adventure or mountain experience where you pushed to find your own path. How did you handle risk and planning, and what decisions did you make when things got tough? What made the experience stand out, and what memories and lessons did you take away from it?
                  </label>
                  <textarea
                    id='storyAnswer'
                    name='storyAnswer'
                    value={formData.storyAnswer}
                    onChange={handleChange}
                    rows={6}
                    maxLength={STORY_MAX_CHARS}
                    placeholder='YOUR ANSWER'
                    className='w-full py-4 px-8 md:px-16 border-0 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-black transition-all placeholder:uppercase placeholder:text-[#868686] bg-transparent text-[16px] leading-[1.5] tracking-[-0.02em] text-black resize-none normal-case'
                    style={{ fontFamily: 'Helvetica Now Var, sans-serif', fontWeight: 400 }}
                  />
                  <div className='flex justify-between items-center px-8 md:px-16 pt-1 pb-2'>
                    {errors.storyAnswer ? (
                      <p className='text-sm text-red-600' style={{ fontFamily: 'var(--font-text)' }}>
                        {errors.storyAnswer}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p
                      className={`text-sm ml-auto ${storyCharsRemaining < 0 ? 'text-red-600' : 'text-gray-400'}`}
                      style={{ fontFamily: 'var(--font-text)' }}
                    >
                      {formData.storyAnswer.length} / {STORY_MAX_CHARS}
                    </p>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className='space-y-3 my-6'>
                  <div>
                    <div className='flex items-center gap-3'>
                      <input
                        type='checkbox'
                        id='ageConfirmed'
                        name='ageConfirmed'
                        checked={formData.ageConfirmed}
                        onChange={handleChange}
                        className='w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-black accent-black cursor-pointer shrink-0 mt-0.5'
                      />
                      <label htmlFor='ageConfirmed' className='text-xs text-black cursor-pointer leading-tight' style={{ fontFamily: 'var(--font-text)' }}>
                        I confirm that I am 18 or older
                      </label>
                    </div>
                    {errors.ageConfirmed && (
                      <p className='mt-1 text-sm text-red-600 ml-8' style={{ fontFamily: 'var(--font-text)' }}>
                        {errors.ageConfirmed}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className='flex items-start gap-3'>
                      <input
                        type='checkbox'
                        id='agreedToTerms'
                        name='agreedToTerms'
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        className='w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-black accent-black cursor-pointer shrink-0 mt-0.5'
                      />
                      <div className='text-xs text-black leading-tight' style={{ fontFamily: 'var(--font-text)' }}>
                        <label htmlFor='agreedToTerms' className='cursor-pointer'>
                          I agree to the Peak Performance Sölden Mountain House 2026 Promotion{' '}
                        </label>
                        <button type='button' onClick={() => setIsTermsModalOpen(true)} className='text-black underline hover:no-underline'>
                          Terms and Conditions
                        </button>
                      </div>
                    </div>
                    {errors.agreedToTerms && (
                      <p className='mt-1 text-sm text-red-600 ml-8' style={{ fontFamily: 'var(--font-text)' }}>
                        {errors.agreedToTerms}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className='flex items-start gap-3'>
                      <input
                        type='checkbox'
                        id='privacyAccepted'
                        name='privacyAccepted'
                        checked={formData.privacyAccepted}
                        onChange={handleChange}
                        className='w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-black accent-black cursor-pointer shrink-0 mt-0.5'
                      />
                      <div className='text-xs text-black leading-tight' style={{ fontFamily: 'var(--font-text)' }}>
                        <label htmlFor='privacyAccepted' className='cursor-pointer'>
                          I agree the processing of my personal information according to the{' '}
                        </label>
                        <a href='https://www.peakperformance.com/se/en/privacy-policy' target='_blank' rel='noopener noreferrer' className='text-black underline hover:no-underline'>
                          Privacy Policy
                        </a>
                        {' '}and{' '}
                        <button type='button' onClick={() => setIsPrivacyNoticeModalOpen(true)} className='text-black underline hover:no-underline'>
                          Privacy Notice
                        </button>
                      </div>
                    </div>
                    {errors.privacyAccepted && (
                      <p className='mt-1 text-sm text-red-600 ml-8' style={{ fontFamily: 'var(--font-text)' }}>
                        {errors.privacyAccepted}
                      </p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-sm text-red-900' style={{ fontFamily: 'var(--font-text)' }}>
                      {submitError}
                    </p>
                  </div>
                )}

                <SubmitButton isSubmitting={isSubmitting} />
              </form>
            </>
          ) : (
            <SubmissionSuccess />
          )}
        </div>
      </div>

      <LanguageModal
        type='terms'
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <LanguageModal
        type='privacy'
        isOpen={isPrivacyNoticeModalOpen}
        onClose={() => setIsPrivacyNoticeModalOpen(false)}
      />
    </div>
  );
}
