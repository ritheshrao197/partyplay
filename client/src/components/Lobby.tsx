import { useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import { useAuthStore } from '../store/authStore';
import PlayerList from './PlayerList';
import Button from './Button';
import { FiCopy, FiCheck } from 'react-icons/fi';

const GAME_NAMES: Record<string, string> = {
  imposter: 'Find The Imposter',
  wordrush: 'Word Rush',
  neverhaveiever: 'Never Have I Ever',
  wronganswers: 'Only Wrong Answers',
};

export default function Lobby() {
  const { room, leaveRoom, toggleReady, startGame, error } = useRoom();
  const userId = useAuthStore((s) => s.user?.id);
  const [copied, setCopied] = useState(false);

  if (!room) return null;

  const isHost = room.hostId === userId;
  const currentPlayer = room.players.find((p) => p.userId === userId);
  const allReady = room.players.filter((p) => !p.isHost).every((p) => p.isReady);
  const canStart = isHost && allReady && room.players.length >= 2;

  const copyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Room Info */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold">{GAME_NAMES[room.gameType]}</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-white/50 text-sm">Room Code:</span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 font-mono font-bold text-lg tracking-widest transition-colors"
          >
            {room.roomCode}
            {copied ? <FiCheck className="text-green-400" size={14} /> : <FiCopy size={14} />}
          </button>
        </div>
      </div>

      {/* Players */}
      <div className="glass-card">
        <h3 className="text-sm font-medium text-white/50 mb-3">
          Players ({room.players.length}/{room.maxPlayers})
        </h3>
        <PlayerList players={room.players} showReady />
      </div>

      {/* Error */}
      {error && (
        <div className="text-center text-red-400 text-sm bg-red-500/10 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="danger" onClick={leaveRoom} className="flex-1">
          Leave
        </Button>
        {!isHost && (
          <Button
            variant={currentPlayer?.isReady ? 'secondary' : 'primary'}
            onClick={() => toggleReady(!currentPlayer?.isReady)}
            className="flex-1"
          >
            {currentPlayer?.isReady ? 'Not Ready' : 'Ready'}
          </Button>
        )}
        {isHost && (
          <Button variant="primary" onClick={startGame} disabled={!canStart} className="flex-1">
            Start Game
          </Button>
        )}
      </div>
    </div>
  );
}
