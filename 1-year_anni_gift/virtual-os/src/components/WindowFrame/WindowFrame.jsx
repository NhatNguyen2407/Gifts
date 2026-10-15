import React, { useEffect, useRef, useState } from 'react';
import styles from './WindowFrame.module.css';

const TASKBAR_HEIGHT = 60;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;

const RESIZE_HANDLES = [
  { dir: 'n', className: styles.handleN },
  { dir: 's', className: styles.handleS },
  { dir: 'e', className: styles.handleE },
  { dir: 'w', className: styles.handleW },
  { dir: 'ne', className: styles.handleNE },
  { dir: 'nw', className: styles.handleNW },
  { dir: 'se', className: styles.handleSE },
  { dir: 'sw', className: styles.handleSW },
];

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const viewport = () => ({
  width: Math.max(1, window.innerWidth),
  height: Math.max(1, window.innerHeight - TASKBAR_HEIGHT),
});

const fitFrame = (frame) => {
  const { width: vw, height: vh } = viewport();
  const width = clamp(frame.width, Math.min(MIN_WIDTH, vw), vw);
  const height = clamp(frame.height, Math.min(MIN_HEIGHT, vh), vh);
  return {
    x: clamp(frame.x, 0, vw - width),
    y: clamp(frame.y, 0, vh - height),
    width,
    height,
  };
};

const initialFrame = () => {
  const { width: vw, height: vh } = viewport();
  const width = Math.min(750, Math.max(Math.min(MIN_WIDTH, vw), vw - 24));
  const height = Math.min(450, Math.max(Math.min(MIN_HEIGHT, vh), vh - 24));
  return {
    x: Math.max(0, Math.round((vw - width) / 2)),
    y: Math.max(0, Math.round((vh - height) / 2)),
    width,
    height,
  };
};

const WindowFrame = ({ title, children, onClose, onMinimize, zIndex, onFocus, isMinimized, isClosing }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [frame, setFrame] = useState(initialFrame);
  const interactionRef = useRef(null);

  const startInteraction = (e, dir) => {
    if (e.button !== 0 || isMaximized || (dir === 'move' && e.target.closest('button'))) return;
    interactionRef.current = {
      pointerId: e.pointerId,
      dir,
      startX: e.clientX,
      startY: e.clientY,
      frame,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    document.body.classList.add(styles.noSelect);
  };

  useEffect(() => {
    const onMove = (e) => {
      const active = interactionRef.current;
      if (!active || active.pointerId !== e.pointerId) return;

      const { width: vw, height: vh } = viewport();
      const { dir, frame: start } = active;
      const dx = e.clientX - active.startX;
      const dy = e.clientY - active.startY;
      const next = { ...start };
      const minWidth = Math.min(MIN_WIDTH, vw);
      const minHeight = Math.min(MIN_HEIGHT, vh);

      if (dir === 'move') {
        next.x = clamp(start.x + dx, 0, vw - start.width);
        next.y = clamp(start.y + dy, 0, vh - start.height);
      } else {
        if (dir.includes('e')) next.width = clamp(start.width + dx, minWidth, vw - start.x);
        if (dir.includes('s')) next.height = clamp(start.height + dy, minHeight, vh - start.y);
        if (dir.includes('w')) {
          next.x = clamp(start.x + dx, 0, start.x + start.width - minWidth);
          next.width = start.x + start.width - next.x;
        }
        if (dir.includes('n')) {
          next.y = clamp(start.y + dy, 0, start.y + start.height - minHeight);
          next.height = start.y + start.height - next.y;
        }
      }
      setFrame(fitFrame(next));
    };

    const onEnd = (e) => {
      if (interactionRef.current?.pointerId !== e.pointerId) return;
      interactionRef.current = null;
      document.body.classList.remove(styles.noSelect);
    };

    const onResize = () => setFrame((previous) => fitFrame(previous));

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove(styles.noSelect);
    };
  }, []);

  const frameStyle = {
    position: 'absolute',
    top: isMaximized ? 0 : frame.y,
    left: isMaximized ? 0 : frame.x,
    width: isMaximized ? '100%' : frame.width,
    height: isMaximized ? `calc(100% - ${TASKBAR_HEIGHT}px)` : frame.height,
    zIndex,
    display: isMinimized ? 'none' : 'flex',
  };

  return (
    <div
      className={`${styles.window} ${isMaximized ? styles.maximized : ''} ${isClosing ? styles.closing : ''}`}
      style={frameStyle}
      onPointerDown={onFocus}
    >
      <div
        className={styles.header}
        onPointerDown={(e) => startInteraction(e, 'move')}
        onDoubleClick={(e) => {
          if (!e.target.closest('button')) setIsMaximized((value) => !value);
        }}
      >
        <div className={styles.title}>{title}</div>
        <div className={styles.controls}>
          <button type="button" aria-label="Minimize" className={styles.btn} onClick={(e) => { e.stopPropagation(); onMinimize(); }}>_</button>
          <button type="button" aria-label={isMaximized ? 'Restore window' : 'Maximize'} className={styles.btn} onClick={(e) => { e.stopPropagation(); setIsMaximized((value) => !value); }}>
            {isMaximized ? '❐' : '□'}
          </button>
          <button type="button" aria-label="Close" className={`${styles.btn} ${styles.closeBtn}`} onClick={(e) => { e.stopPropagation(); onClose(); }}>X</button>
        </div>
      </div>

      <div className={styles.content}>{children}</div>

      {!isMaximized && RESIZE_HANDLES.map(({ dir, className }) => (
        <div
          key={dir}
          className={`${styles.resizeHandle} ${className}`}
          onPointerDown={(e) => startInteraction(e, dir)}
        />
      ))}

      {!isMaximized && <div className={styles.resizerVisual} />}
    </div>
  );
};

export default WindowFrame;
