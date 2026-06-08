import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRoom } from '../hooks/useRoom';
import { useSocket } from '../hooks/useSocket';
import type { GameType } from '../store/roomStore';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { FiUsers, FiLock, FiZap, FiHelpCircle, FiMessageSquare, FiX } from 'react-icons/fi';

const GAMES: { type: GameType; name: string; desc: string; icon: React.ReactNode; color: string; players: string }[] = [
  { type: 'imposter', name: 'Find The Imposter', desc: 'One player is the imposter. Can you find them?', icon: <FiHelpCircle size={28} />, color: 'from-red-500 to-orange-500', players: '4-12' },
  { type: 'wordrush', name: 'Word Rush', desc: 'Race to type answers before time runs out!', icon: <FiZap size={28} />, color: 'from-blue-500 to-cyan-500', players: '2-20' },
  { type: 'neverhaveiever', name: 'Never Have I Ever', desc: 'Answer anonymously and discover surprising facts!', icon: <FiMessageSquare size={28} />, color: 'from-purple-500 to-pink-500', players: '2-20' },
  { type: 'wronganswers', name: 'Only Wrong Answers', desc: 'Give the funniest wrong answer to win!', icon: <FiX size={28} />, color: 'from-yellow-500 to-amber-500', players: '2-12' },
];

export default function Home() {
  const navigate = useNavigate();
  const { createRoom, room, error } = useRoom();
  useSocket();
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Navigate to game when room is created
  useEffect(() => {
    if (room && room.status === 'waiting') {
      setIsCreating(false);
      navigate(`/game/${room.roomCode}`);
    }
  }, [room, navigate]);

  const handleCreate = () => {
    if (!selectedGame || isCreating) return;
    setIsCreating(true);
    createRoom(selectedGame, isPublic);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-gradient">Choose a Game</h1>
        <p className="text-white/50">Pick a game mode and invite your friends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAMES.map((game, idx) => (
          <motion.div
            key={game.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card hover onClick={() => setSelectedGame(game.type)} className="h-full hover:scale-[1.02] transition-all duration-300 ease-out shadow-lg hover:shadow-[0_0_20px_rgba(37,117,252,0.3)]">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center shrink-0 shadow-lg border border-white/20`}>
                  {game.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg text-text">{game.name}</h3>
                  <p className="text-sm text-text-muted mt-1">{game.desc}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-text-muted/60">
                    <FiUsers size={12} />
                    <span className="text-xs">{game.players} players</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Room Modal */}
      <Modal isOpen={!!selectedGame} onClose={() => { setSelectedGame(null); setIsCreating(false); }} title="Create Room">
        <div className="space-y-4">
          {error && (
            <div className="text-center text-red-400 text-sm bg-red-500/10 rounded-xl p-3">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setIsPublic(true)}
              className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                isPublic ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:bg-white/5'
              }`}
            >
              <FiUsers className="mx-auto mb-1" />
              <span className="text-sm font-medium">Public</span>
            </button>
            <button
              onClick={() => setIsPublic(false)}
              className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                !isPublic ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:bg-white/5'
              }`}
            >
              <FiLock className="mx-auto mb-1" />
              <span className="text-sm font-medium">Private</span>
            </button>
          </div>

          <Button variant="primary" size="lg" onClick={handleCreate} className="w-full" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Room'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
