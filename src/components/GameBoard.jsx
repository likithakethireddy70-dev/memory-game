import React from 'react';
import Card from './Card';
import { LEVELS } from '../utils/gameUtils';
import styles from './GameBoard.module.css';

export default function GameBoard({ cards, onFlip, level }) {
  const { cols } = LEVELS[level];

  return (
    <main className={styles.wrapper}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          '--cols': cols,
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            emoji={card.emoji}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => onFlip(index)}
          />
        ))}
      </div>
    </main>
  );
}
