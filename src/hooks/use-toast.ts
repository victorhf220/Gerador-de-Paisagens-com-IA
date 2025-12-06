'use client';
import { useState, useCallback } from 'react';
import { Toast } from '@/lib/types';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = (toastId++).toString();
    const newToast: Toast = { id, message, type };
    
    setToasts((prevToasts) => [newToast, ...prevToasts]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
