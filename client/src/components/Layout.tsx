import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import { FiHome, FiUsers, FiUser, FiLogOut } from 'react-icons/fi';

export default function Layout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  useSocket(); // Initialize socket connection

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <nav className="glass border-b border-white/5 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold font-display">
              L
            </div>
            <span className="font-display text-xl font-bold text-gradient hidden sm:block">partyplay</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" icon={<FiHome />} label="Home" />
            <NavLink to="/rooms" icon={<FiUsers />} label="Rooms" />
            <NavLink to="/profile" icon={<FiUser />} label="Profile" />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-xs font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-white/50">Lvl {user.level}</p>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
