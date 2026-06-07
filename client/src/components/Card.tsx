import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      className={`glass-card ${hover ? 'hover:bg-white/8 hover:border-white/20 cursor-pointer transition-all duration-300' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
