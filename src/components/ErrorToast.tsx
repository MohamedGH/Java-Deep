import React from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { AlertTriangle, X } from 'lucide-react';

export const ErrorToast: React.FC = () => {
  const { errors, clearErrors } = useJavaStore();

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full space-y-2">
      {errors.map((err, idx) => (
        <div key={idx} className="bg-red-950/95 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur animate-fadeIn">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{err}</span>
          </div>
          <button
            onClick={clearErrors}
            className="p-1 rounded-lg hover:bg-red-900/50 text-red-300 transition-all"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
