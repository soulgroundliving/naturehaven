import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ArticleView from '@/components/journal/ArticleView';
import sandbox from '@/content/journal-sandbox/kitchen-sink';
import type { Article } from '@/data/journalTypes';

// DEV-ONLY route (/journal-sandbox), registered in src/main.tsx behind
// import.meta.env.DEV so it never reaches a production build.
//
// `?crash` appends an interactive piece that always throws, so the test can
// check that a crashing game degrades to its description. It is opt-in because
// React reports the throw as a console error, which the normal run must not see.
export default function JournalSandbox() {
  const { search } = useLocation();
  const article = useMemo<Article>(() => {
    if (!new URLSearchParams(search).has('crash')) return sandbox;
    return {
      ...sandbox,
      blocks: [
        ...sandbox.blocks,
        {
          type: 'interactive',
          id: 'sandbox-crash',
          title: { en: 'A piece that crashes', th: 'ชิ้นที่ทำงานพัง' },
          description: {
            en: 'This piece throws while rendering; the article must survive.',
            th: 'ชิ้นนี้ error ตอนเรนเดอร์ บทความต้องยังใช้งานได้',
          },
        },
      ],
    };
  }, [search]);
  return <ArticleView article={article} noindex />;
}
