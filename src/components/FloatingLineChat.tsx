import { MessageCircle } from 'lucide-react';

// Sticky bottom-right CTA — LINE-only contact path. Desktop only: on mobile,
// StickyMobileCTA's full-width bottom bar covers the same job, and the two
// would otherwise stack/overlap in the same bottom-right corner.
export default function FloatingLineChat() {
  return (
    <a
      href="https://lin.ee/ZoujovB6"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on LINE"
      className="hidden md:inline-flex fixed right-6 bottom-6 z-[60] items-center gap-2.5 bg-[var(--cta-bg,#3D5A4C)] hover:bg-[var(--cta-bg-hover,#4a6e5d)] text-pure-white px-5 py-3.5 rounded-full font-sans text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow:
          '0 12px 32px -8px rgba(31,27,22,0.28), 0 4px 12px rgba(31,27,22,0.12)',
      }}
    >
      <MessageCircle size={18} />
      <span>Chat on LINE</span>
      <span
        aria-hidden="true"
        className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pure-white"
      >
        <span className="absolute inset-0 rounded-full bg-pure-white/60 animate-ping" />
      </span>
    </a>
  );
}
