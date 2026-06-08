import type { PlayerState } from '../store/roomStore';
import Avatar from './Avatar';

interface PlayerListProps {
  players: PlayerState[];
  showScore?: boolean;
  showReady?: boolean;
  compact?: boolean;
}

export default function PlayerList({ players, showScore = false, showReady = false, compact = false }: PlayerListProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-2">
      {sorted.map((player, idx) => (
        <div
          key={player.userId}
          className={`flex items-center gap-3 p-2 rounded-xl ${compact ? '' : 'glass'} transition-all`}
        >
          <Avatar username={player.username} size={compact ? 'sm' : 'md'} isHost={player.isHost} isReady={showReady ? player.isReady : undefined} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text truncate">
                {player.username}
              </p>
              {player.isConnected && (
                <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(0,230,118,0.8)] flex-shrink-0 animate-pulse-slow" title="Online"></span>
              )}
              {player.isHost && <span className="text-yellow-400 text-[10px] font-bold border border-yellow-400/30 px-1 rounded">HOST</span>}
            </div>
            {showScore && (
              <p className="text-xs text-text-muted">{player.score} pts</p>
            )}
          </div>
          {showScore && (
            <span className={`text-xs font-bold ${idx === 0 ? 'text-yellow-400 drop-shadow-md' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-text-muted/40'}`}>
              #{idx + 1}
            </span>
          )}
          {!player.isConnected && (
            <span className="badge bg-red-500/20 text-red-400">Disconnected</span>
          )}
        </div>
      ))}
    </div>
  );
}
