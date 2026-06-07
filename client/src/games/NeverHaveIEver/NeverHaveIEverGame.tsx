import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import Timer from '../../components/Timer';
import Leaderboard from '../../components/Leaderboard';
import Button from '../../components/Button';
import { FiHelpCircle, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

export default function NeverHaveIEverGame() {
  const { phase, timer, phaseData, scores, round, totalRounds, sendAction } = useGame();

  // Question Phase (reading)
  if (phase === 'question') {
    const data = phaseData as { question?: string; pack?: string };
    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <p className="text-sm text-white/50">Round {round}/{totalRounds}</p>
        <Timer seconds={timer} maxSeconds={5} size="sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
        >
          <div className="badge bg-purple-500/20 text-purple-400 mb-4">
            {data.pack || 'party'} pack
          </div>
          <h2 className="text-2xl font-display font-bold leading-relaxed">
            {data.question}
          </h2>
        </motion.div>
      </div>
    );
  }

  // Answer Phase (anonymous)
  if (phase === 'answer') {
    const data = phaseData as { question?: string; answersReceived?: number; totalPlayers?: number };
    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <Timer seconds={timer} maxSeconds={10} label="Answer Anonymously" />

        <div className="glass-card">
          <h2 className="text-xl font-display font-bold mb-6">
            {data.question}
          </h2>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={<FiThumbsUp />}
              onClick={() => sendAction('answer', { hasDoneIt: true })}
              className="flex-1"
            >
              I have
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<FiThumbsDown />}
              onClick={() => sendAction('answer', { hasDoneIt: false })}
              className="flex-1"
            >
              I haven't
            </Button>
          </div>
        </div>

        {data.answersReceived !== undefined && (
          <p className="text-xs text-white/40">
            {data.answersReceived}/{data.totalPlayers} answered
          </p>
        )}
      </div>
    );
  }

  // Reveal Phase
  if (phase === 'reveal') {
    const data = phaseData as {
      question?: string;
      yesCount?: number;
      noCount?: number;
      totalPlayers?: number;
      percentage?: number;
      funFact?: string;
    };

    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <Timer seconds={timer} maxSeconds={8} size="sm" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card text-center space-y-4"
        >
          <h3 className="text-lg font-display font-bold">{data.question}</h3>

          {/* Stats Bar */}
          <div className="space-y-2">
            <div className="flex h-8 rounded-xl overflow-hidden">
              <motion.div
                className="bg-green-500 flex items-center justify-center text-sm font-bold"
                initial={{ width: 0 }}
                animate={{ width: `${data.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {data.percentage! > 15 && `${data.yesCount}`}
              </motion.div>
              <motion.div
                className="bg-red-500/50 flex items-center justify-center text-sm font-bold"
                initial={{ width: 0 }}
                animate={{ width: `${100 - (data.percentage || 0)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {100 - (data.percentage || 0) > 15 && `${data.noCount}`}
              </motion.div>
            </div>
            <div className="flex justify-between text-xs text-white/50">
              <span className="text-green-400">Done it ({data.yesCount})</span>
              <span className="text-red-400">Never ({data.noCount})</span>
            </div>
          </div>

          <p className="text-sm text-white/70 italic">{data.funFact}</p>
        </motion.div>

        <Leaderboard scores={scores} />
      </div>
    );
  }

  return (
    <div className="text-center py-20 animate-fade-in">
      <FiHelpCircle className="mx-auto mb-3 text-white/30 animate-pulse-slow" size={48} />
      <p className="text-white/50">Preparing question...</p>
    </div>
  );
}
