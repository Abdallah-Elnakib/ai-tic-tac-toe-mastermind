
import React from 'react';
import { X, Circle } from 'lucide-react';

type Player = 'X' | 'O' | null;

interface GameCellProps {
  value: Player;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

const GameCell: React.FC<GameCellProps> = ({ value, onClick, isWinning, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !!value}
      className={`
        aspect-square flex items-center justify-center
        rounded-xl border-2 transition-all duration-300
        ${value 
          ? 'bg-white/10 border-white/30' 
          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 active:scale-95'
        }
        ${isWinning ? 'bg-gradient-to-br from-yellow-400/30 to-orange-400/30 border-yellow-400/50 animate-pulse' : ''}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        group
      `}
    >
      {value === 'X' && (
        <X 
          className={`
            w-8 h-8 text-cyan-400 transition-all duration-300
            ${isWinning ? 'animate-bounce text-yellow-300' : ''}
            animate-fade-in
          `} 
          strokeWidth={3}
        />
      )}
      {value === 'O' && (
        <Circle 
          className={`
            w-8 h-8 text-red-400 transition-all duration-300
            ${isWinning ? 'animate-bounce text-yellow-300' : ''}
            animate-fade-in
          `} 
          strokeWidth={3}
        />
      )}
      {!value && !disabled && (
        <div className="w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </button>
  );
};

export default GameCell;
