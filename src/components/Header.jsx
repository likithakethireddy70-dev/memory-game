import { LEVELS, formatTime } from '../utils/gameUtils';
import styles from './Header.module.css';

/* Minimal inline SVG icons — no emoji, no external deps */
const Icons = {
  timer: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  moves: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  pairs: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  trophy: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  hint: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  ),
  restart: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
    </svg>
  ),
  menu: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6"  x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  ),
};

export default function Header({ level, moves, seconds, matched, total, onRestart, onMenu, onHint, bestScore }) {
  const lvl      = LEVELS[level];
  const progress = total > 0 ? (matched / total) * 100 : 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* ── Brand ── */}
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <rect x="2"  y="2"  width="16" height="16" rx="3" fill="#6366f1"/>
              <rect x="22" y="2"  width="16" height="16" rx="3" fill="#8b5cf6" opacity="0.7"/>
              <rect x="2"  y="22" width="16" height="16" rx="3" fill="#8b5cf6" opacity="0.7"/>
              <rect x="22" y="22" width="16" height="16" rx="3" fill="#6366f1"/>
            </svg>
          </div>
          <span className={styles.brandName}>Memory</span>
          <span className={styles.levelPill}>{lvl?.label}</span>
        </div>

        {/* ── Stats ── */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>{Icons.timer}</span>
            <span className={styles.statVal}>{formatTime(seconds)}</span>
            <span className={styles.statLabel}>Time</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statIcon}>{Icons.moves}</span>
            <span className={styles.statVal}>{moves}</span>
            <span className={styles.statLabel}>Moves</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statIcon} style={{ color: 'var(--success)' }}>{Icons.pairs}</span>
            <span className={styles.statVal}>{matched}<span className={styles.statTotal}>/{total}</span></span>
            <span className={styles.statLabel}>Pairs</span>
          </div>

          {bestScore > 0 && (
            <div className={`${styles.statCard} ${styles.bestCard}`}>
              <span className={styles.statIcon}>{Icons.trophy}</span>
              <span className={styles.statVal}>{bestScore.toLocaleString()}</span>
              <span className={styles.statLabel}>Best</span>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.hintBtn}`} onClick={onHint} title="AI Hint">
            {Icons.hint}<span>Hint</span>
          </button>
          <button className={styles.btn} onClick={onRestart} title="Restart">
            {Icons.restart}<span>Restart</span>
          </button>
          <button className={`${styles.btn} ${styles.menuBtn}`} onClick={onMenu} title="Menu">
            {Icons.menu}<span>Menu</span>
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
