import AiRenderBadge from '@/components/AiRenderBadge';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import type { MediaOrigin } from '@/data/journalTypes';

interface OriginBadgeProps {
  origin: MediaOrigin;
  className?: string;
}

// Disclosure pill for media that is not a photograph or a plan. 'ai' reuses
// the site-wide AiRenderBadge wording so the phrase never drifts; 'render'
// (3D studies) has its own. 'photo' and 'drawing' show nothing.
export default function OriginBadge({ origin, className = '' }: OriginBadgeProps) {
  const { lang } = useLanguage();
  if (origin === 'ai') return <AiRenderBadge className={className} />;
  if (origin !== 'render') return null;
  return (
    <span
      className={`pointer-events-none z-10 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 font-sans text-[11px] uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm ${className}`}
    >
      {TR.journal.blocks.renderBadge[lang]}
    </span>
  );
}
