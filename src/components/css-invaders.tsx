const CSSInvaders = () => {
  // Generate multiple enemies and lasers for a richer animation
  const enemies = Array.from({ length: 18 });
  const lasers = Array.from({ length: 5 });

  return (
    <div className="shooter-container">
      <div className="player-ship"></div>
      {lasers.map((_, i) => (
        <div key={`laser-${i}`} className="laser" style={{ animationDelay: `${i * 0.8}s` }}></div>
      ))}
      <div className="enemies">
        {enemies.map((_, i) => (
          <div
            key={`enemy-${i}`}
            className="enemy"
            style={{
              left: `${(i % 6) * 15 + 5}%`,
              top: `${Math.floor(i / 6) * 15 + 5}%`,
            }}
          >
            <div className="explosion" style={{ animationDelay: `${2 + i * 0.2}s` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSSInvaders;
