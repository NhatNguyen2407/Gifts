import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  formatTimelineDate,
  getTimelineChapters,
  TIMELINE_START_DATE,
  TIMELINE_TOTAL_MONTHS,
} from '../../apps/Timeline/timelineData';
import styles from './AboutDialog.module.css';

const PHOTO_COUNT = getTimelineChapters().reduce(
  (total, month) => total + month.albumPhotos.length,
  0,
);
const SINCE_DATE = formatTimelineDate(TIMELINE_START_DATE).replaceAll('/', '.');

const AboutDialog = ({ onClose }) => {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const buttons = dialogRef.current?.querySelectorAll('button:not(:disabled)');
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  // Render ngoài Start Menu để hộp thoại không bị clip-path/overflow cắt mất.
  return createPortal(
    <div
      className={styles.backdrop}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-os-title"
        aria-describedby="about-os-note"
      >
        <div className={styles.header}>
          <span>About BiBi-OS</span>
          <button
            ref={closeButtonRef}
            className={styles.closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Đóng About"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.identity}>
            <div className={styles.logo} aria-hidden="true">♡</div>
            <div className={styles.identityText}>
              <h2 className={styles.osName} id="about-os-title">BiBi-OS</h2>
              <p className={styles.version}>Version 1.0 · Nhi Edition</p>
              <span className={styles.edition}>ONE YEAR ANNIVERSARY</span>
            </div>
          </div>

          <div className={styles.sectionHeading}>SYSTEM INFORMATION</div>
          <dl className={styles.specsBox}>
            <div className={styles.specRow}>
              <dt>Created by</dt>
              <dd>Bibi</dd>
            </div>
            <div className={styles.specRow}>
              <dt>Made for</dt>
              <dd>Nhi</dd>
            </div>
            <div className={styles.specRow}>
              <dt>Since</dt>
              <dd>{SINCE_DATE}</dd>
            </div>
            <div className={styles.specRow}>
              <dt>Memories</dt>
              <dd>{TIMELINE_TOTAL_MONTHS} chapters · {PHOTO_COUNT} photos</dd>
            </div>
            <div className={styles.specRow}>
              <dt>Status</dt>
              <dd className={styles.status}><span aria-hidden="true">♡</span> Still making memories</dd>
            </div>
          </dl>

          <div className={styles.note} id="about-os-note">
            <p className={styles.noteTitle}>A little note ♡</p>
            <p>
              Anh làm cái máy tính nhỏ này để giữ lại một vài điều của tụi mình.
              Có ảnh, có nhạc, có mấy trò linh tinh, và cả những thứ anh chưa biết nói thế nào.
            </p>
            <p>Chúc mừng một năm của tụi mình nhé. ♡</p>
            <p className={styles.signature}>- Bibi</p>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.okBtn} type="button" onClick={onClose}>OK</button>
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default AboutDialog;
