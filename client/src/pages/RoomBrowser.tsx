import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { FiPlus, FiSearch } from 'react-icons/fi';

export default function RoomBrowser() {
  const navigate = useNavigate();
  const { joinRoom, leaveRoom, room, error } = useRoom();
  const [joinCode, setJoinCode] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  const handleJoin = () => {
    if (joinCode.trim().length < 4) return;
    joinRoom(joinCode.trim());
    setShowJoin(false);
    navigate(`/game/${joinCode.trim().toUpperCase()}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {room && (
        <div className="glass-card mb-6 bg-primary-900/20 border-primary-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-primary-400">Active Game: {room.roomCode}</h2>
            <p className="text-sm text-text/70">You are currently in a room.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="danger" onClick={leaveRoom} className="flex-1 sm:flex-none">Leave Room</Button>
            <Button variant="primary" onClick={() => navigate(`/game/${room.roomCode}`)} className="flex-1 sm:flex-none">Return</Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Public Rooms</h1>
          <p className="text-sm text-white/50">Join an existing game or create your own</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<FiSearch />} onClick={() => setShowJoin(true)}>
            Join by Code
          </Button>
          <Button variant="primary" icon={<FiPlus />} onClick={() => navigate('/')}>
            Create Room
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-400 text-sm bg-red-500/10 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Placeholder for public rooms list */}
      <div className="text-center py-16 text-white/30">
        <FiSearch className="mx-auto mb-3" size={48} />
        <p className="text-lg font-medium">No public rooms available</p>
        <p className="text-sm mt-1">Create a room or join with a code</p>
      </div>

      {/* Join by Code Modal */}
      <Modal isOpen={showJoin} onClose={() => setShowJoin(false)} title="Join Room">
        <div className="space-y-4">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-letter code"
            className="input-field text-center text-2xl font-mono tracking-[0.5em] uppercase"
            maxLength={6}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          <Button variant="primary" size="lg" onClick={handleJoin} disabled={joinCode.length < 4} className="w-full">
            Join Room
          </Button>
        </div>
      </Modal>
    </div>
  );
}
