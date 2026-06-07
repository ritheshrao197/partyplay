import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../socket';
import Button from '../components/Button';
import { FiUser, FiGlobe } from 'react-icons/fi';

interface AuthResponse {
  token: string;
  user: { id: string; username: string; avatar: string; level: number };
}

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const guestLogin = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<AuthResponse>('/auth/guest', { method: 'POST' });
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      console.error('Guest login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    // In production, use @react-oauth/google for real Google sign-in
    // For now, simulate with a mock
    setLoading(true);
    try {
      const data = await apiFetch<AuthResponse>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          googleId: 'mock-google-id',
          email: `user${Date.now()}@gmail.com`,
          name: `GoogleUser${Math.floor(Math.random() * 999)}`,
          picture: '',
        }),
      });
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      console.error('Google login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md w-full text-center space-y-8"
      >
        {/* Logo */}
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span className="text-4xl font-display font-black">L</span>
          </div>
          <h1 className="text-4xl font-display font-black text-gradient">partyplay</h1>
          <p className="text-white/50">Multiplayer party games for everyone</p>
        </div>

        {/* Login Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={guestLogin}
            disabled={loading}
            icon={<FiUser />}
            className="w-full"
          >
            Play as Guest
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={googleLogin}
            disabled={loading}
            icon={<FiGlobe />}
            className="w-full"
          >
            Sign in with Google
          </Button>
        </div>

        <p className="text-xs text-white/30">
          By playing, you agree to have a good time
        </p>
      </motion.div>
    </div>
  );
}
