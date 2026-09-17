import React from 'react';
import { cn } from '@/shared/utils/cn';

export const BackgroundGrid = ({ children, className }) => {
  return (
    <div className={cn("relative w-full overflow-hidden bg-zinc-900 min-h-screen", className)}>
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      {/* Radial gradient mask for vignette / spotlight effect */}
      <div className="absolute inset-0 bg-zinc-900 pointer-events-none" />
      
      <div className="relative z-10 w-full h-full flex flex-col justify-center">{children}</div>
    </div>
  );
};

