import { useMemo } from 'react';
import { collectHeadings } from '@/lib/journalBlocks';
import type { ArticleBlock } from '@/data/journalTypes';
import { renderBlock } from './renderBlock';

/** Renders an article body: a list of typed blocks (see src/data/journalTypes.ts). */
export default function JournalBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  // Anchor ids are computed once from the whole list so they stay unique.
  const headingIds = useMemo(() => new Map(collectHeadings(blocks).map((h) => [h.index, h.id])), [blocks]);
  return <>{blocks.map((block, i) => renderBlock(block, i, headingIds.get(i)))}</>;
}
