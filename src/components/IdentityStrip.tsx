import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';

// The hero stays editorial and uncluttered. This strip is the decision layer directly
// below the cover: one source of public facts, one next action, and no hidden dates.
export default function IdentityStrip() {
  const { lang } = useLanguage();
  const s = TR.hero.status;

  return (
    <section
      aria-labelledby="nature-haven-status-title"
      className="border-y sec-border card-surface"
    >
      <div className="container-main py-8 md:py-10">
        <div className="grid gap-7 md:grid-cols-[1.35fr_repeat(4,minmax(0,1fr))] md:items-center">
          <div>
            <p className="section-label">{s.eyebrow[lang]}</p>
            <h2
              id="nature-haven-status-title"
              className="mt-3 max-w-[360px] font-serif text-2xl leading-tight sec-text md:text-3xl"
            >
              {s.headline[lang]}
            </h2>
          </div>

          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] sec-text-60">
              {s.statusLabel[lang]}
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed sec-text md:text-base">
              {s.statusValue[lang]}
            </p>
          </div>

          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] sec-text-60">
              {s.moveInLabel[lang]}
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed sec-text md:text-base">
              {s.moveInValue[lang]}
            </p>
          </div>

          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] sec-text-60">
              {s.priceLabel[lang]}
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed sec-text md:text-base">
              {s.priceValue[lang]}
            </p>
          </div>

          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] sec-text-60">
              {s.petLabel[lang]}
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed sec-text md:text-base">
              {s.petValue[lang]}
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t sec-border pt-5 md:flex-row md:items-center md:justify-between">
          <p className="font-sans text-sm sec-text-70">{s.availability[lang]}</p>
          <a
            href={PROPERTY.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-sage-green px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.1em] text-pure-white transition-opacity duration-200 hover:opacity-85 md:w-auto"
          >
            {s.cta[lang]}
          </a>
        </div>
      </div>
    </section>
  );
}
