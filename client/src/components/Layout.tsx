import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    <div className="min-h-screen flex flex-col relative pb-20 sm:pb-0">
      {/* Top Nav (Desktop & Mobile Header) */}
      <nav className="glass border-b border-white/5 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-sm font-bold font-display">
              L
            </div>
            <span className="font-display text-xl font-bold text-gradient">partyplay</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-2">
            <NavLink to="/" icon={<FiHome />} label="Home" />
            <NavLink to="/rooms" icon={<FiUsers />} label="Rooms" />
            <NavLink to="/profile" icon={<FiUser />} label="Profile" />
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-text/50">Lvl {user.level}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xs font-bold text-primary-500">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/5 text-text/50 hover:text-white transition-colors"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass rounded-t-2xl rounded-b-none border-t border-white/5 px-6 py-3 pb-safe">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <MobileNavLink to="/" icon={<FiHome size={22} />} label="Home" />
          <MobileNavLink to="/rooms" icon={<FiUsers size={22} />} label="Rooms" />
          <MobileNavLink to="/profile" icon={<FiUser size={22} />} label="Profile" />
        </div>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm ${
        isActive 
          ? 'bg-primary-500/10 text-primary-500 font-medium' 
          : 'hover:bg-white/5 text-text/60 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 p-2 ${
        isActive ? 'text-primary-500' : 'text-text/50'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
