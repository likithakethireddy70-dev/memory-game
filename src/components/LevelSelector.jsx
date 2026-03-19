import { LEVELS } from '../utils/gameUtils';
import styles from './LevelSelector.module.css';

// Clean SVG icons per level — no emojis
const LEVEL_ICONS = {
  easy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  medium: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  hard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
};

const LEVEL_DETAILS = {
  easy:   { desc: '4×4 grid · 8 pairs',  color: '#10b981', tip: 'Perfect for beginners' },
  medium: { desc: '6×6 grid · 18 pairs', color: '#f59e0b', tip: 'A real challenge' },
  hard:   { desc: '8×8 grid · 32 pairs', color: '#ef4444', tip: 'For memory masters' },
};

export default function LevelSelector({ onSelect }) {
  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.content}>
        <div className={styles.hero}>
          {/* Clean geometric logo mark */}
          <div className={styles.logoMark}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2"  y="2"  width="16" height="16" rx="3" fill="#6366f1" opacity="0.9"/>
              <rect x="22" y="2"  width="16" height="16" rx="3" fill="#8b5cf6" opacity="0.7"/>
              <rect x="2"  y="22" width="16" height="16" rx="3" fill="#8b5cf6" opacity="0.7"/>
              <rect x="22" y="22" width="16" height="16" rx="3" fill="#6366f1" opacity="0.9"/>
            </svg>
          </div>
          <h1 className={styles.title}>Memory Game</h1>
          <p className={styles.subtitle}>Flip cards, find pairs, beat your score.</p>
        </div>

        <div className={styles.cards}>
          {Object.entries(LEVELS).map(([key, lvl]) => {
            const detail = LEVEL_DETAILS[key];
            return (
              <button
                key={key}
                className={styles.card}
                style={{ '--accent-color': detail.color }}
                onClick={() => onSelect(key)}
              >
                <span className={styles.cardIcon} style={{ color: detail.color }}>
                  {LEVEL_ICONS[key]}
                </span>
                <span className={styles.cardLabel}>{lvl.label}</span>
                <span className={styles.cardDesc}>{detail.desc}</span>
                <span className={styles.cardTip}>{detail.tip}</span>
                <span className={styles.cardArrow}>→</span>
              </button>
            );
          })}
        </div>

        <p className={styles.hint}>Choose a difficulty to start playing</p>
      </div>
    </div>
  );
}
