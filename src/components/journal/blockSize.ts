import type { BlockSize } from '@/data/journalTypes';

/** Column width per block size. Text is always 'reading'; media may break out to 'wide'. */
export const SIZE_CLASS: Record<BlockSize, string> = {
  narrow: 'max-w-[480px]',
  reading: 'max-w-[720px]',
  wide: 'max-w-[1000px]',
};
