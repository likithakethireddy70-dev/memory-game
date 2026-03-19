import React from 'react';
import useGame from './hooks/useGame';
import LevelSelector from './components/LevelSelector';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import ResultModal from './components/ResultModal';

export default function App() {
  const game = useGame();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {game.status === 'idle' && (
        <LevelSelector onSelect={game.startGame} />
      )}

      {(game.status === 'playing' || game.status === 'finished') && (
        <>
          <Header
            level={game.level}
            moves={game.moves}
            seconds={game.seconds}
            matched={game.matched.length / 2}
            total={game.cards.length / 2}
            onRestart={() => game.startGame(game.level)}
            onMenu={game.goToMenu}
            onHint={game.getHint}
            bestScore={game.bestScores[game.level] || 0}
          />
          <GameBoard
            cards={game.cards}
            onFlip={game.flipCard}
            level={game.level}
            hintIndex={game.hintIndex}
          />
        </>
      )}

      {game.status === 'finished' && (
        <ResultModal
          moves={game.moves}
          seconds={game.seconds}
          score={game.score}
          level={game.level}
          onPlayAgain={() => game.startGame(game.level)}
          onChangeLevel={game.goToMenu}
          isNewBest={game.isNewBest}
          bestScore={game.bestScores[game.level] || 0}
        />
      )}
    </div>
  );
}
// force redeploy
