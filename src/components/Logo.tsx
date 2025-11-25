
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'minimal';
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  variant = "full"
}) => {
  const sizeClasses = {
    sm: variant === 'full' ? 'h-8' : 'h-6',
    md: variant === 'full' ? 'h-12' : 'h-8',
    lg: variant === 'full' ? 'h-20' : 'h-12',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="AlumniLink Logo"
        className={`${sizeClasses[size]} object-contain animate-fade-in`}
      />
    </div>
  );
};

export default Logo;
