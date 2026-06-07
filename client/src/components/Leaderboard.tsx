import { motion } from 'framer-motion';
import Avatar from './Avatar';
import type { ScoreEntry } from '../store/gameStore';

interface LeaderboardProps {
  scores: ScoreEntry[];
  title?: string;
}

export default function Leaderboard({ scores, title = 'Leaderboard' }: LeaderboardProps) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const medals = ['', '', ''];

  return (
    <div className="glass-card">
      <h3 className="font-display font-bold text-lg mb-4 text-center">{title}</h3>
      <div className="space-y-2">
        {sorted.map((entry, idx) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              idx === 0 ? 'bg-yellow-400/10 border border-yellow-400/20' :
              idx === 1 ? 'bg-gray-300/5 border border-gray-300/10' :
              idx === 2 ? 'bg-orange-400/5 border border-orange-400/10' :
              'bg-white/5'
            }`}
          >
            <span className="w-8 text-center font-bold text-lg">
              {medals[idx] || <span className="text-white/30">{idx + 1}</span>}
            </span>
            <Avatar username={entry.username} size="sm" />
            <span className="flex-1 font-medium text-sm">{entry.username}</span>
            <motion.span
              className="font-display font-bold text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.3, type: 'spring' }}
            >
              {entry.score}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
