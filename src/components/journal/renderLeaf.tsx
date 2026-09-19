import type { ReactNode } from 'react';
import type { LeafBlock } from '@/data/journalTypes';
import JournalGallery from './JournalGallery';
import JournalImage from './JournalImage';
import JournalInteractive from './JournalInteractive';
import JournalTable from './JournalTable';
import JournalVideo from './JournalVideo';
import { BulletList, Callout, Heading, Paragraph, PullQuote } from './TextBlocks';

// Compile-time exhaustiveness: adding a block type to journalTypes.ts makes
// this call fail to type-check until the switch below handles it. At runtime
// an unknown block renders nothing (and says so) rather than taking the
// article down.
function unreachable(block: never): null {
  console.warn('[journal] unhandled block', block);
  return null;
}

/** Render one block that may sit anywhere, including inside a `choice` or `details`. */
export function renderLeaf(block: LeafBlock, key: number | string, headingId?: string): ReactNode {
  switch (block.type) {
    case 'p':
      return <Paragraph key={key} block={block} />;
    case 'h3':
      return <Heading key={key} block={block} id={headingId} />;
    case 'pull':
      return <PullQuote key={key} block={block} />;
    case 'list':
      return <BulletList key={key} block={block} />;
    case 'callout':
      return <Callout key={key} block={block} />;
    case 'image':
      return <JournalImage key={key} block={block} />;
    case 'gallery':
      return <JournalGallery key={key} block={block} />;
    case 'video':
      return <JournalVideo key={key} block={block} />;
    case 'table':
      return <JournalTable key={key} block={block} />;
    case 'interactive':
      return <JournalInteractive key={key} block={block} />;
    default:
      return unreachable(block);
  }
}
