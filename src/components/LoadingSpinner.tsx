import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-amber-400 rounded-full animate-spin"></div>
        <div className="mt-4 text-white/80 text-center">
          <p className="text-sm">Loading prayer times...</p>
        </div>
      </div>
    </div>
  );
};