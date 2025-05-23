
import React, { useState, useCallback, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'tie'>('playing');
  const [winner, setWinner] = useState<Player>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [ties, setTies] = useState(0);

  const checkWinner = useCallback((board: Board): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes(null) ? null : 'tie' as Player;
  }, []);

  const minimax = useCallback((board: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'tie') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, [checkWinner]);

  const getBestMove = useCallback((board: Board): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }, [minimax]);

  const playSound = (type: 'move' | 'win' | 'lose' | 'tie') => {
    if (!soundEnabled) return;
    // Sound simulation with toast
    const sounds = {
      move: '🔊 Click',
      win: '🎉 Victory!',
      lose: '😢 Defeat',
      tie: '🤝 Tie Game'
    };
    console.log(`Playing sound: ${sounds[type]}`);
  };

  const handleCellClick = useCallback((index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing' || isAiThinking) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
    playSound('move');

    const winner = checkWinner(newBoard);
    if (winner) {
      if (winner === 'X') {
        setGameStatus('won');
        setPlayerScore(prev => prev + 1);
        playSound('win');
        toast({
          title: "🎉 مبروك!",
          description: "لقد فزت في هذه الجولة!",
        });
      } else if (winner === 'tie') {
        setGameStatus('tie');
        setTies(prev => prev + 1);
        playSound('tie');
        toast({
          title: "🤝 تعادل",
          description: "لا أحد فاز في هذه الجولة",
        });
      }
      setWinner(winner === 'tie' ? null : winner);
      return;
    }

    // AI move
    setIsAiThinking(true);
    setTimeout(() => {
      const aiMove = getBestMove(newBoard);
      if (aiMove !== -1) {
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        playSound('move');

        const aiWinner = checkWinner(newBoard);
        if (aiWinner) {
          if (aiWinner === 'O') {
            setGameStatus('lost');
            setAiScore(prev => prev + 1);
            playSound('lose');
            toast({
              title: "🤖 الذكاء الاصطناعي فاز",
              description: "حاول مرة أخرى!",
            });
          } else if (aiWinner === 'tie') {
            setGameStatus('tie');
            setTies(prev => prev + 1);
            playSound('tie');
            toast({
              title: "🤝 تعادل",
              description: "لا أحد فاز في هذه الجولة",
            });
          }
          setWinner(aiWinner === 'tie' ? null : aiWinner);
        } else {
          setIsPlayerTurn(true);
        }
      }
      setIsAiThinking(false);
    }, 1000 + Math.random() * 1000); // Random delay for realism
  }, [board, isPlayerTurn, gameStatus, isAiThinking, checkWinner, getBestMove, soundEnabled]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setWinner(null);
    setIsAiThinking(false);
  }, []);

  const resetScores = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setTies(0);
    resetGame();
  }, [resetGame]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            AI Tic Tac Toe
          </h1>
          <p className="text-slate-300">اختبر مهاراتك ضد الذكاء الاصطناعي</p>
        </div>

        {/* Score Board */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-cyan-400">{playerScore}</div>
              <div className="text-xs text-slate-300">أنت</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-400">{ties}</div>
              <div className="text-xs text-slate-300">تعادل</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-400">{aiScore}</div>
              <div className="text-xs text-slate-300">AI</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <GameStatus
          gameStatus={gameStatus}
          isPlayerTurn={isPlayerTurn}
          isAiThinking={isAiThinking}
          winner={winner}
        />

        {/* Game Board */}
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          gameStatus={gameStatus}
          winner={winner}
        />

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={resetGame}
            variant="outline"
            className="flex-1 bg-black/20 backdrop-blur-lg border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            جولة جديدة
          </Button>
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="outline"
            size="icon"
            className="bg-black/20 backdrop-blur-lg border-white/20 text-white hover:bg-white/10"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        <Button
          onClick={resetScores}
          variant="outline"
          className="w-full bg-black/20 backdrop-blur-lg border-white/20 text-white hover:bg-white/10"
        >
          إعادة تعيين النتائج
        </Button>
      </div>
    </div>
  );
};

export default TicTacToe;
