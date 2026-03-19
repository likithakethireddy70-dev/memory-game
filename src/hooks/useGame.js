import { useState, useEffect, useCallback, useRef } from 'react';
import { buildDeck, calcScore, LEVELS } from '../utils/gameUtils';

const FLIP_BACK_DELAY = 900; // ms before unmatched cards flip back
const LS_KEY = 'memoryGame_bestScores'; // localStorage key

/** Read best scores object { easy: 0, medium: 0, hard: 0 } from localStorage */
function loadBestScores() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
}

/** Persist best scores to localStorage */
function saveBestScores(scores) {
  localStorage.setItem(LS_KEY, JSON.stringify(scores));
}

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
  const [hintIndex, setHintIndex] = useState(null);       // index of hinted card
  const [bestScores, setBestScores] = useState(loadBestScores); // { easy, medium, hard }
  const [isNewBest, setIsNewBest]   = useState(false);    // did player beat their record?

  const timerRef = useRef(null);
  const hintTimerRef = useRef(null);

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
  const clearHint = useCallback(() => {
    clearTimeout(hintTimerRef.current);
    setHintIndex(null);
  }, []);

  const startGame = useCallback((lvl) => {
    stopTimer();
    clearHint();
    const { cols, rows } = LEVELS[lvl];
    setLevel(lvl);
    setCards(buildDeck(cols, rows));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setScore(0);
    setIsNewBest(false);
    setStatus('playing');
    setLocked(false);
    timerRef.current = null;
  }, [stopTimer, clearHint]);

  const goToMenu = useCallback(() => {
    stopTimer();
    clearHint();
    setStatus('idle');
    setLevel(null);
  }, [stopTimer, clearHint]);

  // ── Card click ─────────────────────────────────────────────────────────────
  const flipCard = useCallback((index) => {
    if (locked) return;
    if (cards[index].isMatched) return;
    if (selected.includes(index)) return;
    if (selected.length === 2) return;

    clearHint(); // dismiss hint on any card click

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

          // Update best score for this level if improved
          setBestScores((prev) => {
            const prevBest = prev[level] || 0;
            if (finalScore > prevBest) {
              setIsNewBest(true);
              const updated = { ...prev, [level]: finalScore };
              saveBestScores(updated);
              return updated;
            }
            setIsNewBest(false);
            return prev;
          });
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
  }, [locked, cards, selected, matched, moves, seconds, status, level, startTimer, stopTimer, clearHint]);

  // ── AI Hint ────────────────────────────────────────────────────────────────
  const getHint = useCallback(() => {
    if (locked || status !== 'playing') return;
    clearHint();

    // Case 1: one card already flipped — find its unflipped, unmatched pair
    if (selected.length === 1) {
      const flippedEmoji = cards[selected[0]].emoji;
      const match = cards.findIndex(
        (c, i) => c.emoji === flippedEmoji && !c.isMatched && !c.isFlipped && i !== selected[0]
      );
      if (match !== -1) {
        setHintIndex(match);
        hintTimerRef.current = setTimeout(() => setHintIndex(null), 2000);
        return;
      }
    }

    // Case 2: suggest a random unflipped, unmatched card
    const candidates = cards
      .map((c, i) => ({ ...c, index: i }))
      .filter((c) => !c.isMatched && !c.isFlipped);

    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setHintIndex(pick.index);
    hintTimerRef.current = setTimeout(() => setHintIndex(null), 2000);
  }, [locked, status, selected, cards, clearHint]);

  return {
    level, cards, selected, matched,
    moves, seconds, status, score, locked,
    hintIndex, bestScores, isNewBest,
    flipCard, startGame, goToMenu, getHint,
  };
}
