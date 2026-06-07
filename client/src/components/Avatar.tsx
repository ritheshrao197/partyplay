interface AvatarProps {
  username: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isHost?: boolean;
  isReady?: boolean;
}

const COLORS = [
  'from-primary-400 to-primary-600',
  'from-accent-400 to-accent-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-red-400 to-red-600',
  'from-orange-400 to-orange-600',
  'from-teal-400 to-teal-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
  'from-cyan-400 to-cyan-600',
];

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export default function Avatar({ username, size = 'md', isHost, isReady }: AvatarProps) {
  const colorIdx = username.charCodeAt(0) % COLORS.length;

  return (
    <div className="relative inline-flex">
      <div
        className={`${SIZE_MAP[size]} rounded-full bg-gradient-to-br ${COLORS[colorIdx]} flex items-center justify-center font-bold ring-2 ${
          isReady ? 'ring-green-400' : 'ring-white/10'
        }`}
      >
        {username.charAt(0).toUpperCase()}
      </div>
      {isHost && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
          <span className="text-[8px] text-black font-bold">H</span>
        </div>
      )}
      {isReady && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-gray-950" />
      )}
    </div>
  );
}
