import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import Timer from '../../components/Timer';
import Leaderboard from '../../components/Leaderboard';
import Button from '../../components/Button';
import { FiX, FiEdit3, FiAward } from 'react-icons/fi';

export default function WrongAnswersGame() {
  const { phase, timer, phaseData, scores, round, totalRounds, sendAction } = useGame();
  const [answer, setAnswer] = useState('');

  // Question Phase
  if (phase === 'question') {
    const data = phaseData as { prompt?: string };
    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <p className="text-sm text-white/50">Round {round}/{totalRounds}</p>
        <Timer seconds={timer} maxSeconds={5} size="sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
        >
          <div className="badge bg-yellow-500/20 text-yellow-400 mb-4">Only Wrong Answers!</div>
          <h2 className="text-2xl font-display font-bold">{data.prompt}</h2>
          <p className="text-sm text-white/40 mt-3">Think of the funniest WRONG answer!</p>
        </motion.div>
      </div>
    );
  }

  // Answer Phase
  if (phase === 'answer') {
    const data = phaseData as { prompt?: string; answersReceived?: number; totalPlayers?: number };
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <Timer seconds={timer} maxSeconds={20} label="Write your wrong answer!" />
        </div>

        <div className="glass-card space-y-4">
          <h3 className="text-lg font-display font-bold text-center">{data.prompt}</h3>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your hilariously wrong answer..."
            className="input-field min-h-[80px] resize-none"
            maxLength={200}
          />

          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (answer.trim()) {
                sendAction('submit-answer', { answer: answer.trim() });
                setAnswer('');
              }
            }}
            disabled={!answer.trim()}
            icon={<FiEdit3 />}
            className="w-full"
          >
            Submit Answer
          </Button>
        </div>

        {data.answersReceived !== undefined && (
          <p className="text-center text-xs text-white/40">
            {data.answersReceived}/{data.totalPlayers} submitted
          </p>
        )}
      </div>
    );
  }

  // Voting Phase
  if (phase === 'voting') {
    const data = phaseData as { prompt?: string; answers?: { index: number; answer: string }[] };
    const answers = data.answers || [];

    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <p className="text-sm text-white/50 mb-2">Vote for the funniest answer!</p>
          <Timer seconds={timer} maxSeconds={15} size="sm" />
        </div>

        <div className="grid gap-3">
          {answers.map((ans, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => sendAction('vote', { answerIndex: idx })}
              className="glass-card text-left py-3 px-4 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all flex items-center gap-3"
            >
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
                {idx + 1}
              </span>
              <p className="text-sm">{ans.answer}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Reveal Phase
  if (phase === 'reveal') {
    const data = phaseData as {
      prompt?: string;
      results?: { answer: string; username: string; votes: number }[];
    };
    const results = data.results || [];

    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <Timer seconds={timer} maxSeconds={8} size="sm" />
          <h3 className="text-lg font-display font-bold mt-2">{data.prompt}</h3>
        </div>

        <div className="space-y-2">
          {results.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`glass-card py-3 px-4 flex items-center gap-3 ${idx === 0 ? 'border-yellow-400/30 bg-yellow-400/5' : ''}`}
            >
              <div className="w-8 text-center">
                {idx === 0 ? <FiAward className="text-yellow-400 mx-auto" /> : (
                  <span className="text-white/30 text-sm">{idx + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{r.answer}</p>
                <p className="text-xs text-white/40">{r.username}</p>
              </div>
              <span className="text-sm font-bold text-yellow-400">
                {r.votes} {r.votes === 1 ? 'vote' : 'votes'}
              </span>
            </motion.div>
          ))}
        </div>

        <Leaderboard scores={scores} />
      </div>
    );
  }

  return (
    <div className="text-center py-20 animate-fade-in">
      <FiX className="mx-auto mb-3 text-white/30 animate-pulse-slow" size={48} />
      <p className="text-white/50">Preparing wrong answers...</p>
    </div>
  );
}
