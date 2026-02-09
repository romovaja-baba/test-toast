import { useEffect, useState, useRef, useCallback } from 'react';
import type { Toast } from '../types/types';

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const { id, message, type, duration = 3000 } = toast;

  const [remainingTime, setRemainingTime] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleRemove = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => onClose(id), 300)
  }, [id, onClose]);

  useEffect(() => {
    if (isPaused || isClosing) return;

    startTimeRef.current = Date.now();

    timerIdRef.current = setTimeout(() => {
      handleRemove();
    }, remainingTime);

    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, [isPaused, remainingTime, isClosing, id, onClose, handleRemove]);

  const handleMouseEnter = () => {
    if (isClosing) return;
    setIsPaused(true);
    const elapsedTime = Date.now() - startTimeRef.current;
    setRemainingTime((prev) => Math.max(0, prev - elapsedTime));
    if (timerIdRef.current) clearTimeout(timerIdRef.current);
  };

  const handleMouseLeave = () => {
    if (isClosing) return;
    setIsPaused(false);
  };

  return (
    <div
      className={`toast toast-${type} ${isClosing ? 'closing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
    >
      {message}
      <button
        className="toast-close"
        onClick={handleRemove}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};