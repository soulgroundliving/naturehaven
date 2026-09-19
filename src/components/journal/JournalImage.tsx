import { useLanguage } from '@/contexts/LanguageContext';
import { localize } from '@/lib/journalBlocks';
import type { ArticleBlock, ImageAsset } from '@/data/journalTypes';
import { SIZE_CLASS } from './blockSize';
import OriginBadge from './OriginBadge';

/** One picture with its caption and origin badge — shared by `image`, `gallery` and `interactive` posters. */
export function ImageFigure({ asset, className = '' }: { asset: ImageAsset; className?: string }) {
  const { lang } = useLanguage();
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-xl border sec-border card-surface">
        <img
          src={localize(asset.src, lang)}
          alt={asset.alt[lang]}
          width={asset.width}
          height={asset.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        <OriginBadge origin={asset.origin} className="absolute bottom-3 right-3" />
      </div>
      {asset.caption && (
        <figcaption className="mt-3 font-sans text-[13px] leading-relaxed sec-text-60">{asset.caption[lang]}</figcaption>
      )}
    </figure>
  );
}

export default function JournalImage({ block }: { block: Extract<ArticleBlock, { type: 'image' }> }) {
  return <ImageFigure asset={block} className={`mx-auto my-10 w-full ${SIZE_CLASS[block.size ?? 'reading']}`} />;
}
