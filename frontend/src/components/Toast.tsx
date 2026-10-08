import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    info: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-2xl animate-slideUp">
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-stone-400 hover:text-stone-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
