'use client';

import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmProvider } from './ConfirmProvider';

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        {children}
      </ConfirmProvider>
    </ToastProvider>
  );
}
