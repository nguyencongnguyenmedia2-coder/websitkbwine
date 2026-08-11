'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Gift, Wine, Utensils } from 'lucide-react';

export default function PromoBannerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check session storage to see if promo was closed in current session
    const hasSeenPromo = sessionStorage.getItem('kbwine_promo_seen');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }

    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open_kbwine_promo', handleOpenEvent);
    return () => window.removeEventListener('open_kbwine_promo', handleOpenEvent);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('kbwine_promo_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-4xl w-full bg-[#0F0E13] rounded-3xl border-2 border-gold/40 shadow-2xl overflow-hidden text-cream"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#181622]/90 text-cream/70 hover:text-gold border border-gold/40 transition-colors shadow-lg hover:scale-110"
            title="Đóng thông báo"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Luxury Banner Image Container */}
          <div className="relative aspect-[16/9] w-full bg-dark-card border-b border-gold/25 overflow-hidden">
            <Image
              src="/images/promo-popup.jpg"
              alt="Đã đến lúc THAY ĐỔI để TRẢI NGHIỆM - Bánh Cốm + Vang"
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E13] via-transparent to-black/30" />

            {/* Floating Top Tag */}
            <div className="absolute top-4 left-4 z-10 px-4 py-1.5 rounded-full bg-wine/90 text-gold-light text-xs font-extrabold border border-gold/50 shadow-wine-glow flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>XU HƯỚNG MỚI 2027</span>
            </div>
          </div>

          {/* Text Content & Call To Action */}
          <div className="p-6 sm:p-8 space-y-5 bg-[#0F0E13]">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-gold uppercase tracking-widest">
                <Wine className="w-4 h-4 text-gold" />
                <span>Trải Nghiệm Thưởng Vang Đột Phá</span>
                <Utensils className="w-4 h-4 text-gold" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold-light leading-tight">
                Đã đến lúc THAY ĐỔI để TRẢI NGHIỆM
              </h2>

              <p className="text-xs sm:text-sm text-cream/80 leading-relaxed font-sans max-w-2xl">
                Sự kết hợp bất ngờ giữa ẩm thực truyền thống và các chất vang ngọt Ý Moscato / Vang trắng cao cấp. Tạo nên hương vị thăng hoa cho những buổi thưởng trà & ngắm trăng sang trọng.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/products?category=sparkling"
                onClick={handleClose}
                className="flex-1 py-4 px-6 rounded-xl bg-gold-gradient text-dark font-extrabold text-sm shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5 text-dark" />
                <span>KHÁM PHÁ BỘ SƯU TẬP BÁNH + VANG</span>
                <ArrowRight className="w-4 h-4 text-dark" />
              </Link>

              <button
                onClick={handleClose}
                className="py-4 px-6 rounded-xl bg-[#181622] border border-gold/30 text-cream/80 hover:text-gold hover:border-gold transition-all text-xs font-bold"
              >
                Bỏ qua thông báo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
