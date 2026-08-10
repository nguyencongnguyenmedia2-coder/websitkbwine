'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgeGateStore } from '@/store/useAgeGateStore';
import { useAdminStore } from '@/store/useAdminStore';
import { Wine, ShieldCheck, AlertOctagon } from 'lucide-react';

export default function AgeGateModal() {
  const { isVerified, verifyAge } = useAgeGateStore();
  const { storeSettings } = useAdminStore();
  const [mounted, setMounted] = useState(false);
  const [underageAttempt, setUnderageAttempt] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isVerified) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-dark/95 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative max-w-lg w-full glass-panel p-8 sm:p-10 rounded-2xl border border-gold/30 shadow-luxury text-center overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-burgundy/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold/15 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-burgundy-deep/80 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
              <Wine className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-gold-light font-bold mb-3 tracking-wide">
              {storeSettings.storeName}
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-gold/80 mb-6 font-sans">
              PREMIUM LUXURY WINE STORE
            </p>

            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-6" />

            <h3 className="text-lg font-serif text-cream mb-2 font-medium">
              XÁC NHẬN ĐỘ TUỔI HỢP PHÁP
            </h3>
            <p className="text-sm text-cream/75 leading-relaxed mb-8">
              Theo quy định của pháp luật, nội dung và sản phẩm rượu vang trên website này chỉ dành cho người đủ <strong className="text-gold-light">18 tuổi trở lên</strong>.
            </p>

            {underageAttempt ? (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-sm mb-6 flex items-center gap-3">
                <AlertOctagon className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>Rất tiếc! Bạn chưa đủ tuổi hợp pháp để truy cập nội dung rượu vang.</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={verifyAge}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-wine-gradient text-gold-light font-semibold border border-gold/40 hover:border-gold hover:shadow-wine-glow transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShieldCheck className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                  <span>Tôi Đã Đủ 18 Tuổi</span>
                </button>
                <button
                  onClick={() => setUnderageAttempt(true)}
                  className="py-3.5 px-6 rounded-xl bg-dark-card border border-cream/10 text-cream/60 hover:text-cream hover:border-cream/30 transition-all text-sm"
                >
                  Chưa Đủ 18 Tuổi
                </button>
              </div>
            )}

            <p className="text-[11px] text-cream/40 mt-6 flex items-center justify-center gap-1">
              <span>Bằng việc truy cập, bạn đồng ý với Điều khoản & Chính sách bảo mật của chúng tôi.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
