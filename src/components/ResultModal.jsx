import React, { useEffect, useState } from 'react';
import { LEVELS, formatTime } from '../utils/gameUtils';
import styles from './ResultModal.module.css';

function getRank(score, pairCount) {
  const max = pairCount * 500;
  const pct = score / max;
  if (pct >= 0.85) return { label: 'S', color: '#f59e0b', title: 'Legendary!' };
  if (pct >= 0.70) return { label: 'A', color: '#10b981', title: 'Excellent!' };
  if (pct >= 0.50) return { label: 'B', color: '#6366f1', title: 'Good Job!' };
  if (pct >= 0.30) return { label: 'C', color: '#8b5cf6', title: 'Not Bad' };
  return { label: 'D', color: '#ef4444', title: 'Keep Practicing' };
}

export default function ResultModal({ moves, seconds, score, level, onPlayAgain, onChangeLevel }) {
  const lvl = LEVELS[level];
  const pairCount = (lvl.cols * lvl.rows) / 2;
  const rank = getRank(score, pairCount);

  // Animate score counting up
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(score / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayScore(score); clearInterval(timer); }
      else setDisplayScore(start);
    }, 30);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Confetti dots */}
        {[...Array(12)].map((_, i) => (
          <span key={i} className={styles.confetti} style={{ '--i': i }} />
        ))}

        <div className={styles.rankBadge} style={{ '--rank-color': rank.color }}>
          {rank.label}
        </div>

        <h2 className={styles.title}>{rank.title}</h2>
        <p className={styles.subtitle}>You completed the <strong>{lvl.label}</strong> level</p>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⏱</span>
            <span className={styles.statVal}>{formatTime(seconds)}</span>
            <span className={styles.statLabel}>Time</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>🔄</span>
            <span className={styles.statVal}>{moves}</span>
            <span className={styles.statLabel}>Moves</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>✅</span>
            <span className={styles.statVal}>{pairCount}</span>
            <span className={styles.statLabel}>Pairs</span>
          </div>
        </div>

        {/* Score */}
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>Final Score</span>
          <span className={styles.scoreVal}>{displayScore.toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onPlayAgain}>
            ↺ Play Again
          </button>
          <button className={styles.secondaryBtn} onClick={onChangeLevel}>
            ☰ Change Level
          </button>
        </div>
      </div>
    </div>
  );
}
