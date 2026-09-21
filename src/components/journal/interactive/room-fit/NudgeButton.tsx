import type { ReactNode } from 'react';
import useHoldRepeat from './useHoldRepeat';

const BUTTON =
  'inline-flex items-center justify-center rounded-full border sec-border sec-text-80 transition-colors duration-300 hover:border-sage-green hover:text-sage-green disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green';

interface NudgeButtonProps {
  label: string;
  disabled: boolean;
  onPress: () => void;
  testId: string;
  /** 'compact' is the 32 px key of the phone's side rail; the default is the 44 px button. */
  size?: 'default' | 'compact';
  children: ReactNode;
}

// Moving by button is the alternative to dragging (WCAG 2.5.7): it works with a
// single tap, and holding it keeps moving.
export default function NudgeButton({ label, disabled, onPress, testId, size = 'default', children }: NudgeButtonProps) {
  const hold = useHoldRepeat(onPress);
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} data-action={testId} className={`${BUTTON} ${size === 'compact' ? 'h-8 w-8' : 'h-11 w-11'}`} {...hold}>
      {children}
    </button>
  );
}
