import { Suspense, lazy, type ReactNode } from 'react';
import type { ArticleBlock } from '@/data/journalTypes';
import BlockBoundary from './BlockBoundary';
import JournalChoiceStatic from './JournalChoiceStatic';
import JournalDetails from './JournalDetails';
import { renderLeaf } from './renderLeaf';
import { Heading } from './TextBlocks';

// The tab set pulls in Radix Tabs; load it only for articles that use a
// `choice` block. Until it arrives (or if it never does — a deploy can leave a
// stale page pointing at a chunk that no longer exists) the options render as
// plain stacked sections, so no condition is ever hidden by a failed import.
const JournalChoice = lazy(() => import('./JournalChoice'));

/**
 * One block, whatever its type. JournalBlocks draws an article body with it, and the page-by-page reader
 * (guide/GuideBlocks.tsx) draws a section with it, so a block type added here is shown in both.
 */
export function renderBlock(block: ArticleBlock, key: number, headingId?: string): ReactNode {
  switch (block.type) {
    case 'h2':
      return <Heading key={key} block={block} id={headingId} />;
    case 'choice': {
      const stacked = <JournalChoiceStatic block={block} />;
      return (
        <BlockBoundary key={key} label="choice block" fallback={stacked}>
          <Suspense fallback={stacked}>
            <JournalChoice block={block} />
          </Suspense>
        </BlockBoundary>
      );
    }
    case 'details':
      return <JournalDetails key={key} block={block} />;
    default:
      return renderLeaf(block, key, headingId);
  }
}
