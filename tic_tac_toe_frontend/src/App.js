import React, { useState } from 'react';
import './App.css';

// --- Color Palette as per requirements ---
// primary: #1976d2 (blue)
// secondary: #424242 (neutral)
// accent: #fbc02d (yellow)

/**
 * Returns the winner ('X', 'O') or null if no winner yet.
 * If draw (full board, no winner), returns 'draw'.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6]  // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every(Boolean)) {
    return 'draw';
  }
  return null;
}

// --- Square (cell) component ---
function Square({ value, onClick, isWinning, disabled }) {
  return (
    <button
      className="ttt-square"
      style={{
        color: value === 'X' ? 'var(--primary)' : (value === 'O' ? 'var(--accent)' : 'var(--text-primary)'),
        background: isWinning
          ? 'var(--accent-light)'
          : 'var(--bg-primary)',
        borderColor: isWinning ? 'var(--accent)' : 'var(--border-color)',
        cursor: value || disabled ? "default" : "pointer",
        pointerEvents: value || disabled ? "none" : "auto",
        fontWeight: isWinning ? 700 : 500
      }}
      tabIndex={value || disabled ? -1 : 0}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

/**
 * The main App component - PUBLIC_INTERFACE
 *
 * Implements a modern, minimalistic Tic Tac Toe with:
 *  - 3x3 grid, centered layout
 *  - player turn display
 *  - win/draw detection with highlight
 *  - reset/game restart button
 *  - clean, minimal light-themed visuals
 */
function App() {
  // Board state (9 cells), X starts
  const [squares, setSquares] = useState(Array(9).fill(null));
  // Tracks if X is next to play
  const [xIsNext, setXIsNext] = useState(true);
  // Track if a game result exists (winner or draw)
  const winner = calculateWinner(squares);

  // Compute winning line, if any (for highlight)
  let winningLine = null;
  if (winner && winner !== 'draw') {
    // re-run winner logic to find the line
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        winningLine = line;
        break;
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (squares[i] || winner) return; // ignore if filled or over
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE - status message
  let status;
  if (winner) {
    if (winner === 'draw') {
      status = (
        <span>
          <span className="status-draw">It's a draw! 🤝</span>
        </span>
      );
    } else {
      status = (
        <span>
          <span className="status-winner" style={{ color: winner === 'X' ? 'var(--primary)' : 'var(--accent)' }}>{winner}</span> wins! 🎉
        </span>
      );
    }
  } else {
    status = (
      <span>
        Next:&nbsp;
        <span style={{
          color: xIsNext ? 'var(--primary)' : 'var(--accent)',
          fontWeight: 700
        }}>
          {xIsNext ? 'X' : 'O'}
        </span>
      </span>
    );
  }

  return (
    <div className="ttt-app" style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" aria-live="polite">{status}</div>
        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
          {Array(3).fill().map((_, row) =>
            <div className="ttt-board-row" key={row} role="row">
              {Array(3).fill().map((_, col) => {
                const idx = row * 3 + col;
                return (
                  <Square
                    key={idx}
                    value={squares[idx]}
                    onClick={() => handleClick(idx)}
                    isWinning={winningLine ? winningLine.includes(idx) : false}
                    disabled={!!winner}
                  />
                );
              })}
            </div>
          )}
        </div>
        <button className="ttt-reset-btn" onClick={handleReset} aria-label="Reset Game">
          Reset
        </button>
        <div className="ttt-attribution" style={{ marginTop: 32, fontSize: 13, color: "var(--text-secondary)" }}>
          Modern minimalistic design &middot; <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>React</a>
        </div>
      </main>
    </div>
  );
}

export default App;
