import { useState } from 'react';
import { LineIcon, FacebookIcon, XIcon, LinkIcon } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

interface ShareRowProps {
  url: string;
  title: string;
}

// LINE is first and largest — it's the actual channel Thai readers share
// into (family groups, friend chats), not an afterthought next to FB/X.
export default function ShareRow({ url, title }: ShareRowProps) {
  const { lang } = useLanguage();
  const s = TR.journal.share;
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      key: 'line',
      label: 'LINE',
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: LineIcon,
      className: 'bg-[#06C755] text-white hover:opacity-90',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
      className: 'bg-[#1877F2] text-white hover:opacity-90',
    },
    {
      key: 'x',
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: XIcon,
      className: 'bg-[#111] text-white hover:opacity-90',
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older mobile browsers) — select-and-copy
      // is the graceful floor; not worth a fallback UI for this low a stake.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.14em] sec-text-55 mr-1">
        {s.label[lang]}
      </span>
      {targets.map(({ key, label, href, Icon, className }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.label[lang]} ${label}`}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-opacity duration-200 ${className}`}
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label={s.copyLink[lang]}
        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border sec-border font-sans text-[12px] sec-text-70 transition-colors duration-200 hover:bg-pure-white/50"
      >
        <LinkIcon size={14} />
        {copied ? s.copied[lang] : s.copyLink[lang]}
      </button>
    </div>
  );
}
