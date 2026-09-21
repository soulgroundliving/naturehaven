import type { PieceId } from '@/lib/roomFit';

// Fills are brand tokens, so the pieces read the same by day and by night. The OUTLINE, like the
// selection ring, follows the theme's text colour: fixed dark, a piece's edge measured only
// 1.4-1.9:1 against the night floor (3:1 is the floor for a shape you must be able to make out).
export const STYLE: Record<PieceId, { fill: string; text: string }> = {
  bed: { fill: 'fill-sage-green', text: 'fill-pure-white' },
  closet: { fill: 'fill-warm-brown', text: 'fill-pure-white' },
  kitchen: { fill: 'fill-dark-grey', text: 'fill-pure-white' },
  fridge: { fill: 'fill-pure-white', text: 'fill-dark-charcoal' },
  table: { fill: 'fill-light-warm-grey', text: 'fill-dark-charcoal' },
  shelf: { fill: 'fill-warm-rose', text: 'fill-dark-charcoal' },
};
