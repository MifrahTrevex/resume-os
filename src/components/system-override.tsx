
'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const SEQUENCE_DELAY = 400; // ms between sequence flashes
const TILE_FLASH_DURATION = 300; // ms for a tile to be lit

type GameStatus = 'idle' | 'showing' | 'playing' | 'gameover';

const symbols = ['⏃', '⎔', '⍾', '⎓', '⏁', '⏄', '⍼', '⍹', '⎕'];

const SystemOverride = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [tiles] = useState(() => Array.from({ length: TILE_COUNT }, (_, i) => symbols[i % symbols.length]));

  const nextRound = useCallback(() => {
    setGameStatus('showing');
    setPlayerSequence([]);
    const nextTile = Math.floor(Math.random() * TILE_COUNT);
    const newSequence = [...sequence, nextTile];
    setSequence(newSequence);

    newSequence.forEach((tileIndex, i) => {
      setTimeout(() => {
        setActiveTile(tileIndex);
        setTimeout(() => {
          setActiveTile(null);
          if (i === newSequence.length - 1) {
            setGameStatus('playing');
          }
        }, TILE_FLASH_DURATION);
      }, (i + 1) * (SEQUENCE_DELAY + TILE_FLASH_DURATION));
    });
  }, [sequence]);

  const handlePlayerInput = (tileIndex: number) => {
    if (gameStatus !== 'playing') return;

    const newPlayerSequence = [...playerSequence, tileIndex];
    setPlayerSequence(newPlayerSequence);

    // Check if the current move is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameStatus('gameover');
      return;
    }

    // Check if the sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        nextRound();
      }, 1000);
    }
  };

  const startGame = () => {
    setScore(0);
    setSequence([]);
    setGameStatus('idle');
    // We call nextRound inside a timeout to allow the state to reset before starting.
    setTimeout(() => {
        nextRound();
    }, 100);
  };
  
  useEffect(() => {
    if (gameStatus === 'idle') {
      const newTiles = [...symbols].sort(() => 0.5 - Math.random());
    }
  }, [gameStatus]);


  return (
    <div className="bg-[#111] text-[#f00] font-mono h-full flex flex-col items-center justify-center p-4">
        <div className="absolute top-2 left-2 text-sm glitch-text" data-text="> SYS_SEC_OVERRIDE">
            &gt; SYS_SEC_OVERRIDE
        </div>
        <div className="absolute top-2 right-2 text-sm glitch-text" data-text={`> SCORE: ${score}`}>
            &gt; SCORE: {score}
        </div>
      
      {gameStatus === 'idle' && (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 glitch-text" data-text="[ SYSTEM OVERRIDE ]">[ SYSTEM OVERRIDE ]</h1>
            <p className="mb-6 text-sm text-center max-w-sm">Watch the pattern. Repeat the sequence. Do not fail.</p>
            <Button onClick={startGame} className="bg-[#f00] text-[#111] hover:bg-white">
                &gt; INITIATE HACK
            </Button>
        </div>
      )}

      {(gameStatus === 'showing' || gameStatus === 'playing') && (
        <div className={`grid grid-cols-${GRID_SIZE} gap-2`}>
          {tiles.map((symbol, index) => (
            <button
              key={index}
              onClick={() => handlePlayerInput(index)}
              disabled={gameStatus !== 'playing'}
              className={cn(
                'w-20 h-20 flex items-center justify-center text-4xl border-2 transition-all duration-100',
                'border-[#f00]/50 text-[#f00]/60',
                'hover:bg-[#f00]/20 hover:text-[#f00]',
                {
                  'bg-[#f00] !text-black animate-pulse': activeTile === index,
                  'cursor-not-allowed': gameStatus === 'showing',
                }
              )}
            >
              {symbol}
            </button>
          ))}
        </div>
      )}

      {gameStatus === 'gameover' && (
        <div className="text-center">
            <h2 className="text-4xl font-bold text-destructive mb-2 glitch-text" data-text="[ ACCESS DENIED ]">[ ACCESS DENIED ]</h2>
            <p className="text-xl text-foreground mb-4">Final Score: {score}</p>
            <Button onClick={startGame} className="bg-[#f00] text-[#111] hover:bg-white">
                &gt; RETRY
            </Button>
        </div>
      )}
      
       <style jsx>{`
            .glitch-text {
                position: relative;
            }
            .glitch-text::before,
            .glitch-text::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #111;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
            }
            .glitch-text::before {
                left: 2px;
                text-shadow: -1px 0 red;
                animation: glitch-anim-1 2s infinite linear alternate-reverse;
            }
            .glitch-text::after {
                left: -2px;
                text-shadow: -1px 0 blue;
                animation: glitch-anim-2 2s infinite linear alternate-reverse;
            }
            
            @keyframes glitch-anim-1 {
                0% { clip: rect(42px, 9999px, 44px, 0); }
                5% { clip: rect(12px, 9999px, 60px, 0); }
                10% { clip: rect(40px, 9999px, 45px, 0); }
                /* ... add more steps */
                100% { clip: rect(50px, 9999px, 10px, 0); }
            }

            @keyframes glitch-anim-2 {
                 0% { clip: rect(42px, 9999px, 44px, 0); }
                5% { clip: rect(12px, 9999px, 60px, 0); }
                10% { clip: rect(40px, 9999px, 45px, 0); }
                /* ... add more steps */
                100% { clip: rect(50px, 9999px, 10px, 0); }
            }
       `}</style>
    </div>
  );
};

export default SystemOverride;

