import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Close } from '@/components/icons';
import useDialog from '@/hooks/useDialog';

interface FilmDialogProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  src: string;
  poster: string;
  title: string;
  closeLabel: string;
}

// A tall, full-screen player for a portrait clip: the page behind it is inert
// and frozen, Escape closes it, and focus goes back to the button that opened
// it. Mounted only while open, so the file is not fetched before someone asks
// for it and playback stops the moment it closes.
const FilmPanel: React.FC<Omit<FilmDialogProps, 'open'>> = ({ onClose, triggerRef, src, poster, title, closeLabel }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, onClose);

  useEffect(() => {
    const trigger = triggerRef.current;
    return () => trigger?.focus();
  }, [triggerRef]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      className="fixed inset-0 z-[200] flex flex-col items-center bg-dark-charcoal"
    >
      <div className="flex w-full flex-none justify-end px-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="flex h-11 w-11 items-center justify-center text-pure-white/85 transition-colors duration-200 hover:text-pure-white"
        >
          <Close size={24} />
        </button>
      </div>
      <div className="flex min-h-0 w-full flex-1 items-center justify-center px-3 pb-4">
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="aspect-[9/16] max-h-full max-w-full bg-pure-white object-contain"
        />
      </div>
    </div>,
    document.body,
  );
};

const FilmDialog: React.FC<FilmDialogProps> = ({ open, ...rest }) => (open ? <FilmPanel {...rest} /> : null);

export default FilmDialog;
