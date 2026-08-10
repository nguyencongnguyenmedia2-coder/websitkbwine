'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function PromotionBannerSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 35,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-dark-surface relative font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-gold/40 shadow-luxury p-8 sm:p-12">
          {/* Background image & gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1920&auto=format&fit=crop&q=80"
              alt="Flash Sale Wine Promotion"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark via-dark/90 to-dark/60" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Flash Sale details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wine text-gold-light text-xs font-bold uppercase tracking-wider border border-gold/40 shadow-wine-glow">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>FLASH SALE ĐẶC BIỆT THÁNG 2</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl text-gold-light font-extrabold leading-tight">
                Ưu Đãi Lên Đến <span className="text-cream underline decoration-gold">25%</span> Cho Dòng Vang Grand Cru
              </h2>

              <p className="text-sm text-cream/80 leading-relaxed max-w-xl">
                Sở hữu ngay các kiệt tác Château Lafite 2018, Dom Pérignon 2013 và Opus One 2019 với mức giá độc quyền ưu đãi dành riêng cho thành viên VIP.
              </p>

              {/* Real-time Countdown Timer */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs text-cream/60 flex items-center gap-1 font-medium uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-gold" /> Kết thúc sau:
                </span>
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-dark">
                  <div className="bg-gold-gradient px-3 py-1.5 rounded-lg shadow-gold-glow">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </div>
                  <span className="text-gold">:</span>
                  <div className="bg-gold-gradient px-3 py-1.5 rounded-lg shadow-gold-glow">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </div>
                  <span className="text-gold">:</span>
                  <div className="bg-gold-gradient px-3 py-1.5 rounded-lg shadow-gold-glow">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/products?discount=true"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-wine-gradient text-gold-light font-bold text-sm tracking-wider uppercase border border-gold/50 hover:border-gold hover:shadow-wine-glow transition-all"
                >
                  <span>MUA NGAY KẺO HẾT</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
              </div>
            </div>

            {/* Right highlighted product */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="p-6 rounded-2xl glass-panel-dark border border-gold/30 text-center space-y-3">
                <span className="text-[10px] uppercase font-bold text-gold tracking-widest">
                  Sản Phẩm Flash Sale Hot
                </span>
                <h4 className="font-serif text-lg text-cream font-bold">
                  Château Lafite Rothschild 2018
                </h4>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-serif text-xl font-bold text-gold-light">
                    {formatCurrency(32500000)}
                  </span>
                  <span className="text-xs text-cream/40 line-through">
                    {formatCurrency(36000000)}
                  </span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-wine text-gold text-xs font-bold">
                  Tiết kiệm 3.500.000₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
