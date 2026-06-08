import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRoom } from '../hooks/useRoom';
import { useGame } from '../hooks/useGame';
import Lobby from '../components/Lobby';
import Chat from '../components/Chat';
import Leaderboard from '../components/Leaderboard';
import Button from '../components/Button';
import ImposterGame from '../games/Imposter/ImposterGame';
import WordRushGame from '../games/WordRush/WordRushGame';
import NeverHaveIEverGame from '../games/NeverHaveIEver/NeverHaveIEverGame';
import WrongAnswersGame from '../games/OnlyWrongAnswers/WrongAnswersGame';

export default function Game() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, leaveRoom } = useRoom();
  const { phase, gameEndData, reset } = useGame();

  useEffect(() => {
    if (roomCode && room && room.roomCode !== roomCode) {
      // Room code mismatch - might need to join
    }
  }, [roomCode, room]);

  // Not in a room
  if (!room) {
    return (
      <div className="text-center py-20 space-y-4 animate-fade-in">
        <p className="text-white/50 text-lg">Not in a room</p>
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  // Game ended
  if (phase === 'ended' && gameEndData) {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-black text-gradient">Game Over!</h2>
          <p className="text-lg text-white/70">
            Winner: <span className="text-yellow-400 font-bold">{gameEndData.winnerUsername}</span>
          </p>
        </div>
        <Leaderboard scores={gameEndData.scores} />
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => { reset(); navigate('/'); }}
            className="flex-1"
          >
            Go Home
          </Button>
        </div>
        <Chat />
      </div>
    );
  }

  // Lobby
  if (room.status === 'waiting') {
    return (
      <>
        <Lobby />
        <Chat />
      </>
    );
  }

  // Active game - render appropriate game component
  const gameComponents: Record<string, React.ReactNode> = {
    imposter: <ImposterGame />,
    wordrush: <WordRushGame />,
    neverhaveiever: <NeverHaveIEverGame />,
    wronganswers: <WrongAnswersGame />,
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="text-sm text-text/50 font-mono">Room: {room.roomCode}</div>
        <Button variant="danger" size="sm" onClick={() => leaveRoom()}>
          Leave Game
        </Button>
      </div>

      <div className="flex-1">
        {gameComponents[room.gameType] || (
          <div className="text-center py-20 text-white/50">
            Unknown game type: {room.gameType}
          </div>
        )}
      </div>
      
      <Chat />
    </div>
  );
}
