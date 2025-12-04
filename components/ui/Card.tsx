import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, onClick }) => {
  const containerStyle = `bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ${noPadding ? '' : 'p-5'} ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`;

  if (onClick) {
    return (
      <div 
        onClick={onClick}
        className={containerStyle}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      {children}
    </div>
  );
};
