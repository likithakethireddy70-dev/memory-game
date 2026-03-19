// Emoji pools per level size
const EMOJI_POOL = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼',
  '🐨','🐯','🦁','🐮','🐸','🐵','🐔','🐧',
  '🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄',
  '🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗',
];

/**
 * Build a shuffled deck of card pairs for the given grid size.
 * @param {number} cols
 * @param {number} rows
 * @returns {Array} array of card objects
 */
export function buildDeck(cols, rows) {
  const pairCount = (cols * rows) / 2;
  const emojis = EMOJI_POOL.slice(0, pairCount);

  const cards = [...emojis, ...emojis].map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));

  return shuffle(cards);
}

/** Fisher-Yates shuffle */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Calculate score: base 10000, penalise moves and time.
 */
export function calcScore(moves, seconds, pairCount) {
  const base = pairCount * 500;
  const movePenalty = Math.max(0, (moves - pairCount) * 20);
  const timePenalty = seconds * 3;
  return Math.max(0, base - movePenalty - timePenalty);
}

/** Format seconds → mm:ss */
export function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export const LEVELS = {
  easy:   { label: 'Easy',   cols: 4, rows: 4 },
  medium: { label: 'Medium', cols: 6, rows: 6 },
  hard:   { label: 'Hard',   cols: 8, rows: 8 },
};
