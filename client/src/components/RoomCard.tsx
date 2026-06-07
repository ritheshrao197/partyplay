import type { RoomState, GameType } from '../store/roomStore';
import { FiUsers } from 'react-icons/fi';

const GAME_LABELS: Record<GameType, { name: string; color: string }> = {
  imposter: { name: 'Find The Imposter', color: 'text-red-400' },
  wordrush: { name: 'Word Rush', color: 'text-blue-400' },
  neverhaveiever: { name: 'Never Have I Ever', color: 'text-purple-400' },
  wronganswers: { name: 'Only Wrong Answers', color: 'text-yellow-400' },
};

interface RoomCardProps {
  room: RoomState;
  onJoin: () => void;
}

export default function RoomCard({ room, onJoin }: RoomCardProps) {
  const game = GAME_LABELS[room.gameType];

  return (
    <div className="glass-card hover:bg-white/8 transition-all cursor-pointer group" onClick={onJoin}>
      <div className="flex items-start justify-between mb-3">
        <span className={`badge ${game.color} bg-white/10`}>{game.name}</span>
        <span className="text-xs text-white/40 font-mono">{room.roomCode}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/60">
          <FiUsers size={14} />
          <span className="text-sm">{room.players.length}/{room.maxPlayers}</span>
        </div>
        <span className="text-xs text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to join
        </span>
      </div>
    </div>
  );
}
