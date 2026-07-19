import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, title, children, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className="modal__body">{children}</div>
      </section>
    </div>,
    document.body,
  );
}