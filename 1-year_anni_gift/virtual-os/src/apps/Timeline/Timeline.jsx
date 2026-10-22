import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.css';
import { formatTimelineDate, getTimelineChapters } from './timelineData';

const chapters = getTimelineChapters();

const Timeline = () => {
  const [viewer, setViewer] = useState(null);
  const scrollRef = useRef(null);
  const openerRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (!scrollArea) return undefined;

    const updateProgress = () => {
      const distance = scrollArea.scrollHeight - scrollArea.clientHeight;
      const progress = distance > 0 ? scrollArea.scrollTop / distance : 0;
      scrollArea.style.setProperty('--story-progress', `${Math.min(100, Math.max(0, progress * 100))}%`);
    };

    updateProgress();
    scrollArea.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    let observer;
    if ('IntersectionObserver' in window) {
      const entries = scrollArea.querySelectorAll('[data-story-month]');
      observer = new IntersectionObserver((observations) => {
        observations.forEach((item) => {
          if (!item.isIntersecting) return;
          item.target.classList.add(styles.revealed);
          observer.unobserve(item.target);
        });
      }, { root: scrollArea, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      entries.forEach((entry) => observer.observe(entry));
      scrollArea.classList.add(styles.motionEnabled);
    }

    return () => {
      observer?.disconnect();
      scrollArea.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

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

  const openPhoto = (month, index, clickEvent) => {
    openerRef.current = clickEvent.currentTarget;
    setViewer({ photos: month.albumPhotos, index, title: month.title });
  };

  const filledMonths = chapters.filter((month) => month.photoCount > 0).length;
  const activePhoto = viewer?.photos[viewer.index];

  return (
    <div className={styles.app}>
      <div className={styles.scrollArea} ref={scrollRef}>
        <header className={styles.hero}>
          <span className={styles.heroHearts} aria-hidden="true">♡ · ♡ · ♡</span>
          <span className={styles.eyebrow}>OUR LITTLE STORY / VOL. 01</span>
          <h2 className={styles.heroTitle}>12 tháng của chúng mình</h2>
          <p className={styles.heroDescription}>
            Một năm đầu tiên, được kể lại bằng những bức ảnh nhỏ.
          </p>
          <div className={styles.heroDates}>
            <span>24.10.2025</span>
            <span className={styles.dateConnector} aria-hidden="true">♡</span>
            <span>24.10.2026</span>
          </div>
          <span className={styles.scrollHint}>Cuộn xuống để xem từng chương ↓</span>
        </header>

        <div className={styles.story} aria-label="12 mốc kỷ niệm theo tháng">
          <div className={styles.timelineRail} aria-hidden="true">
            <div className={styles.timelineProgress} />
          </div>

          {chapters.map((month, index) => (
            <section
              key={month.number}
              data-story-month={month.number}
              className={`${styles.storyEntry} ${index % 2 ? styles.onRight : styles.onLeft} ${index === 0 ? styles.revealed : ''}`}
              aria-labelledby={`story-month-${month.number}`}
            >
              <div className={styles.monthMarker} aria-hidden="true">
                <span>{String(month.number).padStart(2, '0')}</span>
              </div>

              <article className={styles.chapterCard}>
                <div className={styles.chapterTop}>
                  <span className={styles.chapterNumber}>CHAPTER {String(month.number).padStart(2, '0')}</span>
                  <span className={styles.chapterHeart} aria-hidden="true">♡</span>
                </div>
                <h3 className={styles.chapterTitle} id={`story-month-${month.number}`}>
                  {month.title}
                </h3>
                <p className={styles.chapterDates}>
                  {formatTimelineDate(month.startDate)} — {formatTimelineDate(month.endDate)}
                </p>
                <p className={styles.chapterNote}>{month.note}</p>

                {month.albumPhotos.length > 0 ? (
                  <div className={styles.collage}>
                    {month.albumPhotos.map((photo, photoIndex) => (
                      <button
                        type="button"
                        key={photo.src}
                        className={styles.photoCard}
                        style={{ '--photo-order': Math.min(photoIndex, 7) }}
                        onClick={(event) => openPhoto(month, photoIndex, event)}
                        aria-label={`Xem ảnh ${photoIndex + 1} của ${month.title}`}
                      >
                        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyAlbum}>
                    <span aria-hidden="true">♡</span>
                    <p>Chương này đang chờ những tấm ảnh của tụi mình.</p>
                  </div>
                )}

                <div className={styles.chapterFooter}>
                  <span>{month.photoCount > 0 ? `${month.photoCount} tấm ảnh` : 'Một trang còn trống'}</span>
                  <span aria-hidden="true">✿</span>
                </div>
              </article>
            </section>
          ))}
        </div>

        <footer className={styles.ending}>
          <span aria-hidden="true">♡</span>
          <p>12 tháng — một cuốn album nhỏ.</p>
          <strong>To be continued...</strong>
          <span className={styles.endingDate}>24.10.2026</span>
        </footer>
        <span className={styles.srOnly}>{filledMonths} trong 12 tháng đã có ảnh.</span>
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
