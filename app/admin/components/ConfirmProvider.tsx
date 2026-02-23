'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'default';
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<(ConfirmOptions & { open: boolean }) | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm: ConfirmFn = useCallback((options) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setState({ ...options, open: true });
    });
  }, []);

  function handleConfirm() {
    resolveRef.current?.(true);
    setState(null);
  }

  function handleCancel() {
    resolveRef.current?.(false);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <ConfirmModal
          open={state.open}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title={state.title}
          message={state.message}
          confirmText={state.confirmText}
          variant={state.variant}
        />
      )}
    </ConfirmContext.Provider>
  );
}
