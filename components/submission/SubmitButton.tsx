interface SubmitButtonProps {
  isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <button
      type='submit'
      disabled={isSubmitting}
      className='w-full py-4 mt-12 bg-black text-white rounded-full uppercase hover:bg-white hover:text-black hover:border hover:border-black transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
      style={{
        fontFamily: 'Helvetica Now Var, sans-serif',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '21px',
        letterSpacing: '-0.05em',
      }}
    >
      {isSubmitting ? 'Submitting...' : 'SUBMIT'}
    </button>
  );
}
