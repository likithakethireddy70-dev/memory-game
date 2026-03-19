import React from 'react';
import styles from './Card.module.css';

/**
 * Single memory card with CSS 3D flip animation.
 * Props: emoji, isFlipped, isMatched, onClick
 */
export default function Card({ emoji, isFlipped, isMatched, isHint, onClick }) {
  return (
    <div
      className={`${styles.scene} ${isMatched ? styles.matched : ''} ${isHint ? styles.hint : ''}`}
      onClick={onClick}
      role="button"
      aria-label={isFlipped || isMatched ? emoji : 'Hidden card'}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className={`${styles.card} ${isFlipped || isMatched ? styles.flipped : ''}`}>
        {/* Back face */}
        <div className={styles.back}>
          <span className={styles.backPattern}>?</span>
        </div>
        {/* Front face */}
        <div className={styles.front}>
          <span className={styles.emoji}>{emoji}</span>
        </div>
      </div>
    </div>
  );
}
