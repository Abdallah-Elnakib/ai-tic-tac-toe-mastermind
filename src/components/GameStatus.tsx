
import React from 'react';
import { Brain, User, Trophy, Handshake } from 'lucide-react';

type Player = 'X' | 'O' | null;

interface GameStatusProps {
  gameStatus: 'playing' | 'won' | 'lost' | 'tie';
  isPlayerTurn: boolean;
  isAiThinking: boolean;
  winner: Player;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameStatus, isPlayerTurn, isAiThinking, winner }) => {
  const getStatusContent = () => {
    if (gameStatus === 'won') {
      return {
        icon: <Trophy className="w-6 h-6 text-yellow-400" />,
        text: 'مبروك! لقد فزت! 🎉',
        className: 'text-cyan-400 animate-bounce'
      };
    }
    
    if (gameStatus === 'lost') {
      return {
        icon: <Brain className="w-6 h-6 text-red-400" />,
        text: 'الذكاء الاصطناعي فاز! 🤖',
        className: 'text-red-400'
      };
    }
    
    if (gameStatus === 'tie') {
      return {
        icon: <Handshake className="w-6 h-6 text-yellow-400" />,
        text: 'تعادل! 🤝',
        className: 'text-yellow-400'
      };
    }
    
    if (isAiThinking) {
      return {
        icon: <Brain className="w-6 h-6 text-purple-400 animate-pulse" />,
        text: 'الذكاء الاصطناعي يفكر...',
        className: 'text-purple-400 animate-pulse'
      };
    }
    
    if (isPlayerTurn) {
      return {
        icon: <User className="w-6 h-6 text-cyan-400" />,
        text: 'دورك!',
        className: 'text-cyan-400'
      };
    }
    
    return {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      text: 'دور الذكاء الاصطناعي',
      className: 'text-purple-400'
    };
  };

  const status = getStatusContent();

  return (
    <div className="text-center">
      <div className={`
        flex items-center justify-center gap-2 text-lg font-semibold
        transition-all duration-300 ${status.className}
      `}>
        {status.icon}
        {status.text}
      </div>
      
      {isAiThinking && (
        <div className="mt-2 flex justify-center">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
