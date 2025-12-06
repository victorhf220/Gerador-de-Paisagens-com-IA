
'use client';
import { useToast } from '@/hooks';
import { ToastContainer } from './Toast';

export function Toaster() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
}
