import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../socket';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import { FiEdit2, FiCheck } from 'react-icons/fi';

const AVATARS = Array.from({ length: 12 }, (_, i) => `avatar_${i + 1}`);

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!username.trim() || username.length < 3) return;
    setSaving(true);
    try {
      const updated = await apiFetch<typeof user>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ username: username.trim() }),
      });
      setUser(updated);
      setEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <Card className="text-center space-y-4">
        <Avatar username={user.username} size="xl" />
        <div>
          {editing ? (
            <div className="flex gap-2 items-center justify-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field text-center w-48"
                maxLength={30}
                minLength={3}
                autoFocus
              />
              <button onClick={handleSave} disabled={saving} className="p-2 rounded-lg bg-green-600 hover:bg-green-500 transition-colors">
                <FiCheck size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-display font-bold">{user.username}</h2>
              <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <FiEdit2 size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-8">
          <div>
            <p className="text-2xl font-display font-bold">{user.level}</p>
            <p className="text-xs text-white/50">Level</p>
          </div>
        </div>
      </Card>

      {/* Avatar Selection */}
      <Card>
        <h3 className="font-display font-bold mb-3">Choose Avatar</h3>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((av) => (
            <button
              key={av}
              onClick={async () => {
                try {
                  const updated = await apiFetch<typeof user>('/auth/profile', {
                    method: 'PUT',
                    body: JSON.stringify({ avatar: av }),
                  });
                  setUser(updated);
                } catch {}
              }}
              className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                user.avatar === av ? 'bg-primary-600 ring-2 ring-primary-400' : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              {av.split('_')[1]}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
