import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { isPrerender } from '@/lib/isPrerender';
import { localize } from '@/lib/journalBlocks';
import type { ArticleBlock } from '@/data/journalTypes';
import { SIZE_CLASS } from './blockSize';
import OriginBadge from './OriginBadge';

type VideoBlock = Extract<ArticleBlock, { type: 'video' }>;

// Self-hosted <video>. preload="none" + a required poster keeps the page light
// (nothing downloads until play). An `ambient` clip is a silent loop that plays
// only while it is on screen and never under reduced-motion — in that case it
// falls back to a normal clip with controls.
export default function JournalVideo({ block }: { block: VideoBlock }) {
  const { lang } = useLanguage();
  const reducedMotion = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const ambient = block.ambient === true;
  const autoplays = ambient && !reducedMotion && !isPrerender();

  useEffect(() => {
    const el = video.current;
    if (!el || !autoplays) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Records can queue up; the latest one is the clip's current state.
        const latest = entries[entries.length - 1];
        if (latest.isIntersecting) void el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.pause(); // e.g. reduced-motion switched on mid-play must not leave the loop running
    };
  }, [autoplays]);

  return (
    <figure data-jn-block="video" className={`mx-auto my-10 w-full ${SIZE_CLASS[block.size ?? 'wide']}`}>
      <div
        className="relative overflow-hidden rounded-xl border sec-border bg-near-black"
        style={{ aspectRatio: `${block.width} / ${block.height}` }}
      >
        <video
          ref={video}
          className="h-full w-full object-cover"
          poster={localize(block.poster, lang)}
          preload="none"
          playsInline
          controls={!ambient || reducedMotion}
          muted={ambient}
          loop={ambient}
          aria-label={block.label[lang]}
        >
          {block.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          {block.tracks?.map((track) => (
            <track key={track.src} kind="captions" src={track.src} srcLang={track.lang} label={track.label} default={track.lang === lang} />
          ))}
        </video>
        {/* Top corner: the bottom edge is where the native controls (seek bar) live. */}
        <OriginBadge origin={block.origin} className="absolute right-3 top-3" />
      </div>
      {block.caption && (
        <figcaption className="mt-3 font-sans text-[13px] leading-relaxed sec-text-60">{block.caption[lang]}</figcaption>
      )}
    </figure>
  );
}
