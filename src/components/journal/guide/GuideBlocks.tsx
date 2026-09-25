import type { ArticleBlock } from '@/data/journalTypes';
import { renderBlock } from '../renderBlock';

// A guide page's words are a slice of the article's own blocks (journalGuide.ts): everything between a section's
// h2 and the next, minus the h2 that gave the page its title. Each is drawn by the same renderer as on the long
// page - so a block type added there (a table, a choice, a details) is shown here with no second list to keep - and
// given no anchor id, since the long page behind the reader already owns them.
export default function GuideBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>;
}
