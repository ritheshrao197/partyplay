import { motion } from 'framer-motion';

interface TimerProps {
  seconds: number;
  maxSeconds?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Timer({ seconds, maxSeconds = 60, label, size = 'md' }: TimerProps) {
  const progress = maxSeconds > 0 ? (seconds / maxSeconds) * 100 : 0;
  const isUrgent = seconds <= 5;

  const sizeMap = {
    sm: { ring: 48, stroke: 4, text: 'text-lg' },
    md: { ring: 72, stroke: 5, text: 'text-2xl' },
    lg: { ring: 96, stroke: 6, text: 'text-3xl' },
  };

  const { ring, stroke, text } = sizeMap[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-xs text-white/50 uppercase tracking-wide">{label}</span>}
      <div className="relative" style={{ width: ring, height: ring }}>
        <svg width={ring} height={ring} className="-rotate-90">
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke={isUrgent ? '#ef4444' : '#6366f1'}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.3 }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${text} font-bold font-display ${isUrgent ? 'text-red-400' : 'text-white'}`}>
          {seconds}
        </div>
      </div>
    </div>
  );
}
