import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.css';
import { formatTimelineDate, getTimelineChapters } from './timelineData';

const chapters = getTimelineChapters();

const Timeline = () => {
  const [openMonth, setOpenMonth] = useState(1);
  const [viewer, setViewer] = useState(null);
  const openerRef = useRef(null);
  const closeRef = useRef(null);

  const closeViewer = useCallback(() => {
    setViewer(null);
    openerRef.current?.focus();
  }, []);

  const changePhoto = useCallback((step) => {
    setViewer((previous) => {
      if (!previous || previous.photos.length < 2) return previous;
      return {
        ...previous,
        index: (previous.index + step + previous.photos.length) % previous.photos.length,
      };
    });
  }, []);

  const viewerOpen = viewer !== null;
  useEffect(() => {
    if (!viewerOpen) return undefined;

    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowLeft') changePhoto(-1);
      if (event.key === 'ArrowRight') changePhoto(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerOpen, closeViewer, changePhoto]);

  const openPhoto = (eventData, index, clickEvent) => {
    openerRef.current = clickEvent.currentTarget;
    setViewer({ photos: eventData.photos, index, title: eventData.title });
  };

  const filledMonths = chapters.filter((month) => month.events.length > 0).length;
  const activePhoto = viewer?.photos[viewer.index];

  return (
    <div className={styles.app}>
      <div className={styles.scrollArea}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>♡ OUR LITTLE ARCHIVE · VOL. 01 ♡</span>
          <h2 className={styles.heading}>12 tháng của chúng mình</h2>
          <p className={styles.subtitle}>Một năm đầu tiên, lưu lại theo từng tháng yêu nhau.</p>
          <div className={styles.introBottom}>
            <span>24.10.2025 — 23.10.2026</span>
            <span>{filledMonths}/12 tháng có kỷ niệm</span>
          </div>
        </header>

        <div className={styles.months}>
          {chapters.map((month) => {
            const expanded = openMonth === month.number;
            const hasEvents = month.events.length > 0;
            return (
              <section className={styles.monthEntry} key={month.number}>
                <span className={`${styles.timelineDot} ${hasEvents ? styles.activeDot : ''}`} aria-hidden="true" />
                <div className={`${styles.monthCard} ${expanded ? styles.expanded : ''}`}>
                  <button
                    type="button"
                    className={styles.monthToggle}
                    aria-expanded={expanded}
                    aria-controls={`timeline-month-${month.number}`}
                    onClick={() => setOpenMonth((previous) => previous === month.number ? null : month.number)}
                  >
                    <span className={styles.monthIndex}>{String(month.number).padStart(2, '0')}</span>
                    <span className={styles.monthInfo}>
                      <span className={styles.monthName}>{month.title}</span>
                      <span className={styles.monthDates}>
                        {formatTimelineDate(month.startDate)} — {formatTimelineDate(month.endDate)}
                      </span>
                      <span className={styles.monthMeta}>
                        {hasEvents
                          ? `${month.events.length} kỷ niệm · ${month.photoCount} ảnh`
                          : 'Chưa có kỷ niệm được thêm'}
                      </span>
                    </span>
                    <span className={styles.chevron} aria-hidden="true">{expanded ? '−' : '+'}</span>
                  </button>

                  {expanded && (
                    <div className={styles.monthContent} id={`timeline-month-${month.number}`}>
                      {hasEvents ? (
                        <div className={styles.events}>
                          {month.events.map((eventData) => (
                            <article key={eventData.id} className={styles.eventCard}>
                              <div className={styles.eventHeader}>
                                <time className={styles.eventDate} dateTime={eventData.date}>
                                  {formatTimelineDate(eventData.date)}
                                </time>
                                {eventData.location && (
                                  <span className={styles.location}>⌖ {eventData.location}</span>
                                )}
                              </div>
                              <h3 className={styles.eventTitle}>{eventData.title}</h3>
                              {eventData.description && (
                                <p className={styles.description}>{eventData.description}</p>
                              )}

                              {eventData.photos?.length > 0 ? (
                                <div className={styles.photoGrid}>
                                  {eventData.photos.map((photo, index) => (
                                    <button
                                      type="button"
                                      key={`${eventData.id}-photo-${index}`}
                                      className={styles.photoTile}
                                      onClick={(event) => openPhoto(eventData, index, event)}
                                      aria-label={`Xem ảnh ${index + 1}: ${photo.caption || eventData.title}`}
                                    >
                                      <img
                                        src={photo.src}
                                        alt={photo.alt || photo.caption || eventData.title}
                                        loading="lazy"
                                      />
                                      {photo.caption && (
                                        <span className={styles.photoCaption}>{photo.caption}</span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <p className={styles.awaitingPhotos}>Ảnh của kỷ niệm này sẽ được thêm sau ♡</p>
                              )}
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <span className={styles.emptyHeart} aria-hidden="true">♡</span>
                          <p>Chương này vẫn đang chờ ảnh và kỷ niệm của tụi mình.</p>
                          <span>Rồi sẽ có những câu chuyện được viết vào đây.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
        <p className={styles.footer}>To be continued... ♡</p>
      </div>

      {viewer && activePhoto && (
        <div
          className={styles.lightboxBackdrop}
          onClick={(event) => { if (event.target === event.currentTarget) closeViewer(); }}
        >
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`Album ảnh: ${viewer.title}`}
          >
            <div className={styles.viewerHeader}>
              <span>{viewer.title} · {viewer.index + 1}/{viewer.photos.length}</span>
              <button
                type="button"
                ref={closeRef}
                className={styles.viewerClose}
                onClick={closeViewer}
                aria-label="Đóng ảnh"
              >×</button>
            </div>
            <div className={styles.viewerBody}>
              {viewer.photos.length > 1 && (
                <button
                  type="button"
                  className={styles.viewerArrow}
                  onClick={() => changePhoto(-1)}
                  aria-label="Ảnh trước"
                >‹</button>
              )}
              <img
                className={styles.viewerImage}
                src={activePhoto.src}
                alt={activePhoto.alt || activePhoto.caption || viewer.title}
              />
              {viewer.photos.length > 1 && (
                <button
                  type="button"
                  className={styles.viewerArrow}
                  onClick={() => changePhoto(1)}
                  aria-label="Ảnh tiếp theo"
                >›</button>
              )}
            </div>
            {activePhoto.caption && <p className={styles.viewerCaption}>{activePhoto.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
