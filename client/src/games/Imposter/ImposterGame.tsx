import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import { useAuthStore } from '../../store/authStore';
import Timer from '../../components/Timer';
import Leaderboard from '../../components/Leaderboard';
import { FiEye, FiMessageCircle, FiCheckCircle, FiFlag } from 'react-icons/fi';

export default function ImposterGame() {
  const userId = useAuthStore((s) => s.user?.id);
  const { phase, timer, phaseData, scores, round, totalRounds, sendAction } = useGame();

  // Word Reveal Phase
  if (phase === 'word-reveal') {
    const data = phaseData as { word?: string; isImposter?: boolean; playerUserId?: string };
    const isMyReveal = data.playerUserId === userId;

    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <p className="text-sm text-white/50">Round {round}/{totalRounds}</p>
        <Timer seconds={timer} maxSeconds={5} size="sm" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
        >
          {isMyReveal ? (
            <>
              <div className={`text-xs uppercase tracking-wider mb-2 font-bold ${data.isImposter ? 'text-red-400' : 'text-green-400'}`}>
                {data.isImposter ? 'You are the IMPOSTER!' : 'Your word is:'}
              </div>
              <h2 className={`text-4xl font-display font-black ${data.isImposter ? 'text-red-400' : 'text-white'}`}>
                {data.word}
              </h2>
              {data.isImposter && (
                <p className="text-sm text-white/50 mt-3">
                  Pretend you know the word. Don't get caught!
                </p>
              )}
            </>
          ) : (
            <div className="py-8">
              <FiEye className="mx-auto mb-3 text-white/30" size={40} />
              <p className="text-white/50">Waiting for word reveal...</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Discussion Phase
  if (phase === 'discussion') {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-white/50">
          <FiMessageCircle />
          <span>Discussion Phase - Round {round}/{totalRounds}</span>
        </div>
        <Timer seconds={timer} maxSeconds={60} label="Discuss!" />
        <div className="glass-card">
          <p className="text-white/70">
            Describe your word without revealing it!
          </p>
          <p className="text-sm text-white/40 mt-2">
            The imposter is trying to blend in...
          </p>
        </div>
      </div>
    );
  }

  // Voting Phase
  if (phase === 'voting') {
    const data = phaseData as { eligiblePlayers?: { userId: string; username: string; avatar: string }[] };
    const eligiblePlayers = data.eligiblePlayers || [];

    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-white/50 mb-4">
            <FiCheckCircle />
            <span>Vote for the Imposter!</span>
          </div>
          <Timer seconds={timer} maxSeconds={30} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {eligiblePlayers
            .filter((p) => p.userId !== userId)
            .map((player) => (
              <motion.button
                key={player.userId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sendAction('vote', { targetId: player.userId })}
                className="glass-card text-center py-4 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-lg font-bold">
                  {player.username.charAt(0)}
                </div>
                <p className="text-sm font-medium">{player.username}</p>
              </motion.button>
            ))}
        </div>
      </div>
    );
  }

  // Reveal Phase
  if (phase === 'reveal') {
    const data = phaseData as {
      eliminatedUsername?: string;
      isImposterCaught?: boolean;
      crewWord?: string;
      imposterWord?: string;
    };

    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <Timer seconds={timer} maxSeconds={10} size="sm" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card space-y-4"
        >
          <div className={`text-5xl mb-2`}>
            {data.isImposterCaught ? '🎉' : '😈'}
          </div>
          <h3 className="text-xl font-display font-bold">
            {data.isImposterCaught ? 'Imposter Caught!' : 'Imposter Wins!'}
          </h3>
          <div className="space-y-1 text-sm">
            <p>Eliminated: <span className="font-bold text-red-400">{data.eliminatedUsername}</span></p>
            <p>Crew word: <span className="font-bold text-green-400">{data.crewWord}</span></p>
            <p>Imposter word: <span className="font-bold text-red-400">{data.imposterWord}</span></p>
          </div>
        </motion.div>

        {scores.length > 0 && <Leaderboard scores={scores} />}
      </div>
    );
  }

  // Default loading state
  return (
    <div className="text-center py-20 animate-fade-in">
      <FiFlag className="mx-auto mb-3 text-white/30 animate-pulse-slow" size={48} />
      <p className="text-white/50">Preparing game...</p>
    </div>
  );
}
