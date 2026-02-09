import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Toast } from '../types/types';
import { ToastItem } from '../components/ToastItem';

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);

    setToasts((prev) => {
      const existingIndex = prev.findIndex(
        (t) => t.message === newToast.message && t.type === newToast.type
      );

      if (existingIndex !== -1) {
        const updatedToasts = [...prev];
        updatedToasts[existingIndex] = { ...newToast, id };
        return updatedToasts;
      }
      return [...prev, { ...newToast, id }];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-list">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('No context');
  }
  return context;
};