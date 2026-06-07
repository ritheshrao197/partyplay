import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RoomBrowser from './pages/RoomBrowser';
import Game from './pages/Game';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/rooms" element={<RoomBrowser />} />
                  <Route path="/game/:roomCode" element={<Game />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
