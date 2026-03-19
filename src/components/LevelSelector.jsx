import React from 'react';
import { LEVELS } from '../utils/gameUtils';
import styles from './LevelSelector.module.css';

const LEVEL_DETAILS = {
  easy:   { desc: '4×4 grid · 8 pairs',  color: '#10b981', tip: 'Perfect for beginners' },
  medium: { desc: '6×6 grid · 18 pairs', color: '#f59e0b', tip: 'A real challenge' },
  hard:   { desc: '8×8 grid · 32 pairs', color: '#ef4444', tip: 'For memory masters' },
};

export default function LevelSelector({ onSelect }) {
  return (
    <div className={styles.page}>
      {/* Background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.iconRow}>🃏</div>
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
                <span className={styles.cardEmoji}>{lvl.emoji}</span>
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
