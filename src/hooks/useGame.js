import { useState, useEffect, useCallback, useRef } from 'react';
import { buildDeck, calcScore, LEVELS } from '../utils/gameUtils';

const FLIP_BACK_DELAY = 900; // ms before unmatched cards flip back

export default function useGame() {
  const [level, setLevel]         = useState(null);       // 'easy' | 'medium' | 'hard'
  const [cards, setCards]         = useState([]);
  const [selected, setSelected]   = useState([]);         // indices of flipped cards (max 2)
  const [matched, setMatched]     = useState([]);         // ids of matched cards
  const [moves, setMoves]         = useState(0);
  const [seconds, setSeconds]     = useState(0);
  const [status, setStatus]       = useState('idle');     // idle | playing | finished
  const [score, setScore]         = useState(0);
  const [locked, setLocked]       = useState(false);      // prevent clicks during check

  const timerRef = useRef(null);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // ── Start / Restart ────────────────────────────────────────────────────────
  const startGame = useCallback((lvl) => {
    stopTimer();
    const { cols, rows } = LEVELS[lvl];
    setLevel(lvl);
    setCards(buildDeck(cols, rows));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setScore(0);
    setStatus('playing');
    setLocked(false);
    timerRef.current = null;
  }, [stopTimer]);

  const goToMenu = useCallback(() => {
    stopTimer();
    setStatus('idle');
    setLevel(null);
  }, [stopTimer]);

  // ── Card click ─────────────────────────────────────────────────────────────
  const flipCard = useCallback((index) => {
    if (locked) return;
    if (cards[index].isMatched) return;
    if (selected.includes(index)) return;
    if (selected.length === 2) return;

    // Start timer on first flip
    if (status === 'playing' && seconds === 0 && selected.length === 0) {
      startTimer();
    }

    const newSelected = [...selected, index];

    // Flip the card visually
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c))
    );
    setSelected(newSelected);

    // Check for match when 2 cards are selected
    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;

      if (cards[a].emoji === cards[b].emoji) {
        // ✅ Match
        const newMatched = [...matched, cards[a].id, cards[b].id];
        setMatched(newMatched);
        setCards((prev) =>
          prev.map((c) =>
            c.id === cards[a].id || c.id === cards[b].id
              ? { ...c, isMatched: true }
              : c
          )
        );
        setSelected([]);

        // Check win condition
        const { cols, rows } = LEVELS[level];
        if (newMatched.length === cols * rows) {
          stopTimer();
          const finalScore = calcScore(moves + 1, seconds, (cols * rows) / 2);
          setScore(finalScore);
          setStatus('finished');
        }
      } else {
        // ❌ No match — flip back after delay
        setLocked(true);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              newSelected.includes(i) && !c.isMatched ? { ...c, isFlipped: false } : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, FLIP_BACK_DELAY);
      }
    }
  }, [locked, cards, selected, matched, moves, seconds, status, level, startTimer, stopTimer]);

  return {
    level, cards, selected, matched,
    moves, seconds, status, score, locked,
    flipCard, startGame, goToMenu,
  };
}
