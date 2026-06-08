import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../socket';
import Button from '../components/Button';
import { FiArrowRight } from 'react-icons/fi';

interface AuthResponse {
  token: string;
  user: { id: string; username: string; avatar: string; level: number };
}

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<AuthResponse>('/auth/guest', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim() || undefined }),
      });
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      console.error('Guest login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md w-full text-center space-y-8 shadow-[0_0_40px_rgba(37,117,252,0.15)]"
      >
        {/* Logo */}
        <div className="space-y-3">
          <img src="/logo.png" alt="partyplay logo" className="w-200 h-200 mx-auto object-contain drop-shadow-[0_0_15px_rgba(37,117,252,0.6)]" />
          <p className="text-text-muted">Multiplayer party games for everyone</p>
        </div>

        {/* Join Form */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <input
              type="text"
              className="input-field text-center text-lg py-4"
              placeholder="Enter your display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              disabled={loading}
              autoFocus
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={loading}
            icon={<FiArrowRight />}
            className="w-full text-lg py-4"
          >
            {loading ? 'Joining...' : 'Join the Party'}
          </Button>
        </form>

        <p className="text-xs text-text-muted/60">
          By playing, you agree to have a good time
        </p>
      </motion.div>
    </div>
  );
}
