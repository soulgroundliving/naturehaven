import { useLanguage } from '@/contexts/LanguageContext';

interface AiRenderBadgeProps {
  className?: string;
}

// The property is still under construction — every interior/exterior image on
// the site is an AI-generated visualization, not a photograph. Disclosed on
// every occurrence (Lookbook chapter heroes, homepage Collections cards,
// Residences gallery, About section) rather than the source file, since a
// single image can appear in several contexts.
export default function AiRenderBadge({ className = '' }: AiRenderBadgeProps) {
  const { lang } = useLanguage();
  return (
    <span
      className={`pointer-events-none z-10 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 font-sans text-[11px] uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm ${className}`}
    >
      {lang === 'th' ? 'ภาพจำลองด้วย AI' : 'AI-generated visualization'}
    </span>
  );
}
