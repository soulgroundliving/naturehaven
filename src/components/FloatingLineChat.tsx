import { MessageCircle } from 'lucide-react';

// Sticky bottom-right CTA — LINE-only contact path. Always visible across
// the page so prospects can reach out without scrolling back to the contact
// section. The white ping dot subtly signals availability.
export default function FloatingLineChat() {
  return (
    <a
      href="https://lin.ee/ZoujovB6"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on LINE"
      className="fixed right-6 bottom-6 z-[60] inline-flex items-center gap-2.5 bg-[#06C755] hover:bg-[#05A848] text-pure-white px-5 py-3.5 rounded-full font-sans text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow:
          '0 12px 32px -8px rgba(6, 199, 85, 0.45), 0 4px 12px rgba(31,27,22,0.12)',
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
