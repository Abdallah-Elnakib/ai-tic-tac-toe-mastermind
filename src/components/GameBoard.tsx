
import React from 'react';
import GameCell from './GameCell';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  gameStatus: 'playing' | 'won' | 'lost' | 'tie';
  winner: Player;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, gameStatus, winner }) => {
  const getWinningLine = (): number[] => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
      }
    }
    return [];
  };

  const winningLine = gameStatus !== 'playing' && winner ? getWinningLine() : [];

  return (
    <div className="relative">
      {/* Game Board */}
      <div 
        className={`
          grid grid-cols-3 gap-3 p-6 
          bg-black/20 backdrop-blur-lg rounded-2xl 
          border border-white/10 shadow-2xl
          transition-all duration-500
          ${gameStatus === 'won' ? 'animate-pulse shadow-cyan-500/50' : ''}
          ${gameStatus === 'lost' ? 'animate-pulse shadow-red-500/50' : ''}
          ${gameStatus === 'tie' ? 'animate-pulse shadow-yellow-500/50' : ''}
        `}
      >
        {board.map((cell, index) => (
          <GameCell
            key={index}
            value={cell}
            onClick={() => onCellClick(index)}
            isWinning={winningLine.includes(index)}
            disabled={gameStatus !== 'playing'}
          />
        ))}
      </div>

      {/* Winning Line Animation */}
      {winningLine.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className={`
              absolute bg-gradient-to-r from-transparent via-white to-transparent
              h-1 rounded-full opacity-80 animate-pulse
              ${getWinningLineStyle(winningLine)}
            `}
          />
        </div>
      )}
    </div>
  );
};

const getWinningLineStyle = (winningLine: number[]): string => {
  const [a, b, c] = winningLine;
  
  // Rows
  if ([0, 1, 2].every(i => winningLine.includes(i))) return 'top-[25%] left-[10%] right-[10%] rotate-0';
  if ([3, 4, 5].every(i => winningLine.includes(i))) return 'top-[50%] left-[10%] right-[10%] rotate-0';
  if ([6, 7, 8].every(i => winningLine.includes(i))) return 'top-[75%] left-[10%] right-[10%] rotate-0';
  
  // Columns
  if ([0, 3, 6].every(i => winningLine.includes(i))) return 'left-[25%] top-[10%] bottom-[10%] w-1 h-auto rotate-90';
  if ([1, 4, 7].every(i => winningLine.includes(i))) return 'left-[50%] top-[10%] bottom-[10%] w-1 h-auto rotate-90';
  if ([2, 5, 8].every(i => winningLine.includes(i))) return 'left-[75%] top-[10%] bottom-[10%] w-1 h-auto rotate-90';
  
  // Diagonals
  if ([0, 4, 8].every(i => winningLine.includes(i))) return 'top-[10%] left-[10%] right-[10%] bottom-[10%] rotate-45 origin-center';
  if ([2, 4, 6].every(i => winningLine.includes(i))) return 'top-[10%] left-[10%] right-[10%] bottom-[10%] -rotate-45 origin-center';
  
  return '';
};

export default GameBoard;
