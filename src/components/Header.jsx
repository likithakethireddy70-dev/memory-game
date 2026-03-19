import React from 'react';
import { LEVELS, formatTime } from '../utils/gameUtils';
import styles from './Header.module.css';

export default function Header({ level, moves, seconds, matched, total, onRestart, onMenu, onHint, bestScore }) {
  const lvl = LEVELS[level];
  const progress = total > 0 ? (matched / total) * 100 : 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Left: brand + level */}
        <div className={styles.left}>
          <span className={styles.brand}>🃏 Memory</span>
          <span className={styles.levelBadge}>{lvl?.label}</span>
        </div>

        {/* Center: stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>⏱</span>
            <span className={styles.statVal}>{formatTime(seconds)}</span>
            <span className={styles.statLabel}>Time</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statIcon}>🔄</span>
            <span className={styles.statVal}>{moves}</span>
            <span className={styles.statLabel}>Moves</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statIcon}>✅</span>
            <span className={styles.statVal}>{matched}/{total}</span>
            <span className={styles.statLabel}>Pairs</span>
          </div>
          {bestScore > 0 && (
            <>
              <div className={styles.divider} />
              <div className={`${styles.stat} ${styles.bestStat}`}>
                <span className={styles.statIcon}>🏆</span>
                <span className={styles.statVal}>{bestScore.toLocaleString()}</span>
                <span className={styles.statLabel}>Best</span>
              </div>
            </>
          )}
        </div>

        {/* Right: buttons */}
        <div className={styles.right}>
          <button className={`${styles.btn} ${styles.hintBtn}`} onClick={onHint} title="AI Hint">
            💡 Hint
          </button>
          <button className={styles.btn} onClick={onRestart} title="Restart">↺ Restart</button>
          <button className={`${styles.btn} ${styles.menuBtn}`} onClick={onMenu} title="Menu">☰ Menu</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
