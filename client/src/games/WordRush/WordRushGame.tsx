import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import Timer from '../../components/Timer';
import Leaderboard from '../../components/Leaderboard';
import { FiZap, FiType, FiBarChart2 } from 'react-icons/fi';

export default function WordRushGame() {
  const { phase, timer, phaseData, scores, round, totalRounds, sendAction } = useGame();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === 'typing') {
      inputRef.current?.focus();
      setInput('');
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendAction('submit-answer', { answer: input.trim() });
    setInput('');
  };

  // Countdown Phase
  if (phase === 'countdown') {
    const data = phaseData as { category?: string };
    return (
      <div className="max-w-md mx-auto text-center space-y-8 animate-fade-in">
        <p className="text-sm text-white/50">Round {round}/{totalRounds}</p>
        <div className="glass-card">
          <p className="text-sm text-white/50 mb-2">Category:</p>
          <h2 className="text-4xl font-display font-black text-gradient">{data.category}</h2>
        </div>
        <Timer seconds={timer} maxSeconds={3} size="lg" label="Get Ready!" />
      </div>
    );
  }

  // Typing Phase
  if (phase === 'typing') {
    const data = phaseData as { category?: string };
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="badge bg-blue-500/20 text-blue-400 mb-3">
            <FiType className="mr-1" /> {data.category}
          </div>
          <Timer seconds={timer} maxSeconds={30} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type an answer..."
            className="input-field text-lg"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit" className="btn-primary shrink-0" disabled={!input.trim()}>
            <FiZap />
          </button>
        </form>

        {(phaseData.newAnswer as any) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-green-400"
          >
            +{(phaseData.newAnswer as any).points} pts!
          </motion.div>
        )}
      </div>
    );
  }

  // Scoring Phase
  if (phase === 'scoring') {
    const data = phaseData as { category?: string; validWords?: string[] };
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-white/50 mb-2">
            <FiBarChart2 />
            <span>Round {round}/{totalRounds} Results - {data.category}</span>
          </div>
          <Timer seconds={timer} maxSeconds={8} size="sm" />
        </div>

        <Leaderboard scores={scores} title="Current Standings" />
      </div>
    );
  }

  return (
    <div className="text-center py-20 animate-fade-in">
      <FiZap className="mx-auto mb-3 text-white/30 animate-pulse-slow" size={48} />
      <p className="text-white/50">Preparing Word Rush...</p>
    </div>
  );
}
