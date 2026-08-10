'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-2xl border backdrop-blur-xl ${
                isSuccess
                  ? 'bg-burgundy-dark/95 border-gold/40 text-cream'
                  : isError
                  ? 'bg-red-950/95 border-red-500/40 text-cream'
                  : isWarning
                  ? 'bg-amber-950/95 border-amber-500/40 text-cream'
                  : 'bg-dark-card/95 border-gold/20 text-cream'
              }`}
            >
              <div className="mr-3 mt-0.5 flex-shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-gold" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-gold-light" />}
              </div>
              <div className="flex-1 mr-2">
                <h4 className="font-medium text-sm text-gold-light font-serif tracking-wide">{t.title}</h4>
                {t.description && (
                  <p className="text-xs text-cream/80 mt-1 leading-relaxed">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-cream/60 hover:text-cream transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
