import React, { useState, useEffect, useRef } from 'react';
import styles from './MemoryMatch.module.css';
import { useSound } from '../../hooks/useSound';
import { useAchievements } from '../../context/AchievementsContext';
import us1 from '../../assets/images/us1.jpg';
import us2 from '../../assets/images/us2.jpg';
import us3 from '../../assets/images/us3.jpg';
import us4 from '../../assets/images/us4.jpg';
import her1 from '../../assets/images/her1.jpg';
import her2 from '../../assets/images/her2.jpg';
import her3 from '../../assets/images/her3.jpg';
import her4 from '../../assets/images/her4.jpg';

const PHOTOS = [
  { id: 'u1', src: us1 }, { id: 'u2', src: us2 },
  { id: 'u3', src: us3 }, { id: 'u4', src: us4 },
  { id: 'h1', src: her1 }, { id: 'h2', src: her2 },
  { id: 'h3', src: her3 }, { id: 'h4', src: her4 },
];

const MODES = {
  easy: { label: 'Dễ', pairs: 3, maxMoves: 9, columns: 3 },
  medium: { label: 'Vừa', pairs: 5, maxMoves: 16, columns: 5 },
  hard: { label: 'Khó', pairs: 8, maxMoves: 28, columns: 4 },
};

const WIN_MESSAGE = 'Trí nhớ đỉnh vậy?? Chắc là vì mỗi khoảnh khắc với tui đều đáng nhớ hết trơn á 💜';

const shuffle = (photos) => {
  const copy = [...photos];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const makeDeck = (mode) => {
  const chosen = shuffle(PHOTOS).slice(0, MODES[mode].pairs);
  return shuffle(chosen.flatMap((photo) => [
    { key: `${photo.id}-a`, photoId: photo.id, src: photo.src },
    { key: `${photo.id}-b`, photoId: photo.id, src: photo.src },
  ]));
};

const MemoryMatch = () => {
  const [mode, setMode] = useState(null);
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const pendingRef = useRef(null);
  const { playMatch, playWin } = useSound();
  const { unlock } = useAchievements();

  const clearPending = () => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
    pendingRef.current = null;
  };

  useEffect(() => () => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
  }, []);

  const startGame = (nextMode) => {
    clearPending();
    setMode(nextMode);
    setDeck(makeDeck(nextMode));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
    setOutcome(null);
  };

  const handleCardClick = (index) => {
    if (!mode || outcome || locked || flipped.includes(index) || matched.has(deck[index].key)) return;
    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);
    if (nextFlipped.length !== 2) return;

    setLocked(true);
    const [a, b] = nextFlipped;
    const correct = deck[a].photoId === deck[b].photoId;
    const newMoves = moves + 1;
    setMoves(newMoves);

    pendingRef.current = setTimeout(() => {
      pendingRef.current = null;
      if (correct) {
        const nextMatched = new Set(matched).add(deck[a].key).add(deck[b].key);
        setMatched(nextMatched);
        playMatch();
        if (nextMatched.size === deck.length) {
          setOutcome('won');
          playWin();
          if (mode === 'hard') unlock('memory_hard_master');
        } else if (newMoves >= MODES[mode].maxMoves) {
          setOutcome('lost');
        }
      } else if (newMoves >= MODES[mode].maxMoves) {
        setOutcome('lost');
      }
      setFlipped([]);
      setLocked(false);
    }, correct ? 350 : 850);
  };

  const exitGame = () => {
    clearPending();
    setMode(null);
    setOutcome(null);
    setDeck([]);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
  };

  if (!mode) {
    return (
      <div className={styles.container}>
        <div className={styles.modeScreen}>
          <h2 className={styles.modeTitle}>MEMORY MATCH ♡</h2>
          <p>Chọn chế độ để bắt đầu ghép ảnh nè!</p>
          <div className={styles.modeList}>
            {Object.entries(MODES).map(([id, config]) => (
              <button key={id} type="button" className={styles.modeBtn} onClick={() => startGame(id)}>
                <strong>{config.label}</strong>
                <span>{config.pairs} cặp ảnh · {config.maxMoves} lượt</span>
              </button>
            ))}
          </div>
          <p className={styles.achievementHint}>Hoàn thành mức Khó để nhận thành tựu Trí nhớ đỉnh cao.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        <span>{MODES[mode].label} · {moves}/{MODES[mode].maxMoves} lượt</span>
        <span>{matched.size / 2}/{MODES[mode].pairs} cặp</span>
        <button className={styles.restartBtn} type="button" onClick={() => startGame(mode)}>↻ Chơi lại</button>
        <button className={styles.restartBtn} type="button" onClick={exitGame}>Đổi chế độ</button>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.grid} style={{ '--card-columns': MODES[mode].columns }}>
          {deck.map((card, index) => {
            const faceUp = flipped.includes(index) || matched.has(card.key);
            return (
              <button
                key={card.key}
                type="button"
                className={`${styles.card} ${faceUp ? styles.faceUp : ''}`}
                onClick={() => handleCardClick(index)}
                disabled={faceUp || locked || Boolean(outcome)}
                aria-label={`Lá bài ${index + 1}${faceUp ? ', đang mở' : ', đang úp'}`}
              >
                <span className={styles.cardInner}>
                  <span className={styles.cardBack} aria-hidden="true">💜</span>
                  <span className={styles.cardFront}><img src={card.src} alt="" className={styles.cardImg} /></span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {outcome && (
        <div className={styles.popupBackdrop}>
          <div className={styles.popup} role="dialog" aria-modal="true" aria-labelledby="memory-result">
            <h2 id="memory-result" className={styles.winTitle}>{outcome === 'won' ? 'Hoàn thành!' : 'Hết lượt rồi!'}</h2>
            <p className={styles.winMessage}>{outcome === 'won' ? WIN_MESSAGE : 'Nhinhi ngố kìaaaa <3'}</p>
            <p className={styles.winStats}>{matched.size / 2}/{MODES[mode].pairs} cặp · {moves} lượt</p>
            <div className={styles.popupActions}>
              <button className={styles.restartBtn} type="button" onClick={() => startGame(mode)}>Chơi lại</button>
              <button className={styles.restartBtn} type="button" onClick={exitGame}>Đổi chế độ</button>
              <button className={styles.restartBtn} type="button" onClick={exitGame}>Thoát</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
