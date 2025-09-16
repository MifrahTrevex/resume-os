
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 40;
const PLAYER_SPEED = 15;
const LASER_SPEED = 7;
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 30;
const ENEMY_ROWS = 3;
const ENEMY_COLS = 6;

type GameObject = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const CSSInvaders = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2 });
  const [lasers, setLasers] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});

  // Initialize enemies
  useEffect(() => {
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
    setEnemies(initialEnemies);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
    if (e.key === ' ') {
       e.preventDefault();
       // Add a new laser
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
  }, [playerPosition.x]);

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
  useEffect(() => {
    const gameInterval = setInterval(() => {
      // Move player
      setPlayerPosition((prev) => {
        let newX = prev.x;
        if (keysPressed['ArrowLeft']) {
          newX = Math.max(0, prev.x - PLAYER_SPEED);
        }
        if (keysPressed['ArrowRight']) {
          newX = Math.min(GAME_WIDTH - PLAYER_WIDTH, prev.x + PLAYER_SPEED);
        }
        return { x: newX };
      });

      // Move lasers and check for collisions
      setLasers((prevLasers) => {
          const updatedLasers = prevLasers.map((laser) => ({ ...laser, y: laser.y - LASER_SPEED })).filter(l => l.y > 0);
          
          setEnemies(currentEnemies => {
              let enemiesHitThisFrame: number[] = [];
              for (const laser of updatedLasers) {
                  for (const enemy of currentEnemies) {
                      if (
                          laser.x < enemy.x + enemy.width &&
                          laser.x + laser.width > enemy.x &&
                          laser.y < enemy.y + enemy.height &&
                          laser.y + laser.height > enemy.y
                      ) {
                         enemiesHitThisFrame.push(enemy.id);
                      }
                  }
              }
              if (enemiesHitThisFrame.length > 0) {
                 return currentEnemies.filter(enemy => !enemiesHitThisFrame.includes(enemy.id));
              }
              return currentEnemies;
          });

          // Filter out lasers that hit an enemy
          return updatedLasers.filter(laser => {
             return !enemies.some(enemy => 
                  laser.x < enemy.x + enemy.width &&
                  laser.x + laser.width > enemy.x &&
                  laser.y < enemy.y + enemy.height &&
                  laser.y + laser.height > enemy.y
             );
          });
      });

    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameInterval);
  }, [keysPressed, enemies]);

  return (
    <div 
      className="shooter-container" 
      style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, margin: 'auto' }}
      // tabIndex={0} is needed to receive key events on a div
      tabIndex={0} 
    >
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
              animation: 'none', // Override CSS animation
              opacity: 1,
              position: 'absolute',
              height: '20px',
              width: '4px',
              backgroundColor: '#f00',
              boxShadow: '0 0 10px #f00',
            }}
        ></div>
      ))}
      
      <div className="enemies" style={{ animation: 'none', position: 'relative' }}>
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="enemy"
            style={{
              left: `${enemy.x}px`,
              top: `${enemy.y}px`,
              animation: 'enemy-bob 2s ease-in-out infinite alternate'
            }}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSSInvaders;
