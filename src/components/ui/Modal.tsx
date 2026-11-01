import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  onClose: () => void;
  /** Teks pembaca layar; kosongkan bila memakai labelledBy. */
  label?: string;
  labelledBy?: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

/** Overlay dialog: role dialog, Esc, klik latar, focus trap, kembalikan fokus, animasi masuk/keluar. */
export default function Modal({ onClose, label, labelledBy, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const el = ref.current!;
    const prev = document.activeElement as HTMLElement | null;
    const items = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    (el.querySelector<HTMLElement>('[autofocus]') ?? items()[0] ?? el).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return closeRef.current();
      if (e.key !== 'Tab') return;
      const list = items();
      if (!list.length) return e.preventDefault();
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs outline-none"
    >
      {children}
    </motion.div>
  );
}
