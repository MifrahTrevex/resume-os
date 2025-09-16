
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 40;
const PLAYER_SPEED = 5;
const LASER_SPEED = 7;
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 30;
const ENEMY_ROWS = 3;
const ENEMY_COLS = 6;
const ENEMY_SPEED = 0.5;

type GameObject = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

function GameOverScreen({ score, onRestart }: { score: number; onRestart: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center z-10">
      <h2 className="text-4xl font-bold text-destructive mb-2">GAME OVER</h2>
      <p className="text-xl text-foreground mb-4">Your Score: {score}</p>
      <button
        onClick={onRestart}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Restart
      </button>
    </div>
  );
}

const CSSInvaders = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2 });
  const [lasers, setLasers] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number>();

  const createEnemies = () => {
    const initialEnemies: GameObject[] = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        initialEnemies.push({
          id: row * ENEMY_COLS + col,
          x: col * (ENEMY_WIDTH + 20) + 40,
          y: row * (ENEMY_HEIGHT + 20) + 30,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
        });
      }
    }
    return initialEnemies;
  };
  
  const resetGame = useCallback(() => {
      setPlayerPosition({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2 });
      setLasers([]);
      setEnemies(createEnemies());
      setScore(0);
      setGameOver(false);
  }, []);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
    if (e.key === ' ' && !gameOver) {
       e.preventDefault();
       setLasers((prevLasers) => [
         ...prevLasers,
         {
           id: Date.now(),
           x: playerPosition.x + PLAYER_WIDTH / 2 - 2,
           y: GAME_HEIGHT - 60,
           width: 4,
           height: 20,
         },
       ]);
    }
  }, [playerPosition.x, gameOver]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
  }, []);


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Game Loop
  const gameLoop = useCallback(() => {
    if (gameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    // Move player
    setPlayerPosition((prev) => {
      let newX = prev.x;
      if (keysPressed['ArrowLeft'] || keysPressed['a']) {
        newX = Math.max(0, prev.x - PLAYER_SPEED);
      }
      if (keysPressed['ArrowRight'] || keysPressed['d']) {
        newX = Math.min(GAME_WIDTH - PLAYER_WIDTH, prev.x + PLAYER_SPEED);
      }
      return { x: newX };
    });

    // Move lasers, enemies and check for collisions
    setEnemies(currentEnemies => {
        if (currentEnemies.length === 0) {
            return createEnemies();
        }
        
        const updatedEnemies = currentEnemies.map(enemy => ({
            ...enemy,
            y: enemy.y + ENEMY_SPEED,
        }));
        
        // Check if any enemy reached the bottom
        if (updatedEnemies.some(enemy => enemy.y + enemy.height >= GAME_HEIGHT - PLAYER_WIDTH)) {
            setGameOver(true);
        }

        return updatedEnemies;
    });

    setLasers((prevLasers) => {
        const updatedLasers = prevLasers.map((laser) => ({ ...laser, y: laser.y - LASER_SPEED })).filter(l => l.y > 0);
        
        const enemiesHitThisFrame = new Set<number>();
        const lasersThatHit = new Set<number>();

        for (const laser of updatedLasers) {
            for (const enemy of enemies) {
                if (
                    laser.x < enemy.x + enemy.width &&
                    laser.x + laser.width > enemy.x &&
                    laser.y < enemy.y + enemy.height &&
                    laser.y + laser.height > enemy.y
                ) {
                   enemiesHitThisFrame.add(enemy.id);
                   lasersThatHit.add(laser.id);
                }
            }
        }

        if (enemiesHitThisFrame.size > 0) {
           setScore(s => s + enemiesHitThisFrame.size * 10);
           setEnemies(currentEnemies => currentEnemies.filter(enemy => !enemiesHitThisFrame.has(enemy.id)));
        }

        return updatedLasers.filter(laser => !lasersThatHit.has(laser.id));
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [keysPressed, enemies, gameOver]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
  }, [gameLoop]);

  return (
    <div 
      className="shooter-container" 
      style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, margin: 'auto' }}
      tabIndex={0} 
    >
      {gameOver && <GameOverScreen score={score} onRestart={resetGame} />}
      <div className="absolute top-2 left-2 text-primary font-bold text-lg">SCORE: {score}</div>
      <div
        className="player-ship"
        style={{ left: `${playerPosition.x}px`, width: `${PLAYER_WIDTH}px` }}
      ></div>
      
      {lasers.map((laser) => (
        <div
          key={laser.id}
          className="laser"
          style={{ 
              left: `${laser.x}px`, 
              top: `${laser.y}px`,
              width: `${laser.width}px`,
              height: `${laser.height}px`,
            }}
        ></div>
      ))}
      
      <div className="enemies" style={{ position: 'relative' }}>
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="enemy"
            style={{
              left: `${enemy.x}px`,
              top: `${enemy.y}px`,
            }}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSSInvaders;
