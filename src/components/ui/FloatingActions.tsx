'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowUp, PhoneCall, Home, Wine, ShoppingBag, User, Gift } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();
  const { storeSettings } = useAdminStore();
  const cartCount = useCartStore((state) => state.getCartCount());
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Floating Actions (Bottom Left - Clean Perfect Circles with Tooltips) */}
      <div className="hidden md:flex fixed bottom-6 left-6 z-40 flex-col gap-3.5 items-start">
        
        {/* 1. AI Sommelier Action Button */}
        <div className="group relative flex items-center">
          <Link
            href="/ai-assistant"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-wine to-burgundy-deep border border-gold/50 text-gold-light shadow-wine-glow hover:scale-110 transition-all duration-300 flex items-center justify-center relative"
            title="AI Wine Sommelier - Tư Vấn Trực Tuyến"
          >
            <Sparkles className="w-5 h-5 text-gold animate-spin-slow" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
            </span>
          </Link>

          {/* Clean Hover Tooltip */}
          <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-[#181622] border border-gold/30 text-gold-light text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Tư Vấn AI Sommelier</span>
          </div>
        </div>

        {/* 2. Promo Banner Re-open Action Button */}
        <div className="group relative flex items-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open_kbwine_promo'))}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-950 via-burgundy to-dark-card border border-gold/50 text-gold-light shadow-gold-glow hover:scale-110 transition-all duration-300 flex items-center justify-center"
            title="Xem Ưu Đãi Bánh + Vang"
          >
            <Gift className="w-5 h-5 text-gold animate-bounce" />
          </button>

          {/* Clean Hover Tooltip */}
          <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-[#181622] border border-gold/30 text-gold-light text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-gold" />
            <span>Ưu Đãi Bánh + Vang</span>
          </div>
        </div>

        {/* 3. Zalo / Hotline VIP Action Button */}
        <div className="group relative flex items-center">
          <a
            href={`tel:${storeSettings.phone.replace(/[^0-9]/g, '')}`}
            className="w-12 h-12 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-200 shadow-luxury hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
            title="Gọi điện Hotline VIP"
          >
            <PhoneCall className="w-5 h-5 text-emerald-300" />
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
          </a>

          {/* Clean Hover Tooltip */}
          <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-[#181622] border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hotline: {storeSettings.phone}</span>
          </div>
        </div>

        {/* 4. Scroll To Top Action Button */}
        {showScrollTop && (
          <div className="group relative flex items-center">
            <button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-[#181622] border border-gold/30 text-cream/80 hover:text-gold hover:border-gold shadow-luxury hover:scale-110 transition-all duration-300 flex items-center justify-center"
              title="Về Đầu Trang"
            >
              <ArrowUp className="w-5 h-5" />
            </button>

            {/* Clean Hover Tooltip */}
            <div className="absolute left-14 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out whitespace-nowrap px-3 py-1 rounded-xl bg-[#181622] border border-gold/20 text-cream/80 text-xs font-bold shadow-xl backdrop-blur-md">
              Về Đầu Trang
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Only for Mobile Phones) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-bottom-nav px-3 py-2">
        <div className="grid grid-cols-5 gap-1 text-center">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname === '/' ? 'text-gold font-bold' : 'text-cream/70 hover:text-gold'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Trang Chủ</span>
          </Link>

          <Link
            href="/products"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname.startsWith('/products') ? 'text-gold font-bold' : 'text-cream/70 hover:text-gold'
            }`}
          >
            <Wine className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Sản Phẩm</span>
          </Link>

          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
              pathname === '/cart' ? 'text-gold font-bold' : 'text-cream/70 hover:text-gold'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-gold text-dark text-[9px] font-extrabold flex items-center justify-center border border-dark">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">Giỏ Hàng</span>
          </Link>

          <Link
            href="/account"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname === '/account' ? 'text-gold font-bold' : 'text-gold-light hover:text-gold'
            }`}
          >
            <User className="w-5 h-5 mb-0.5 text-gold" />
            <span className="text-[10px] font-bold">{isAuthenticated ? 'Hồ Sơ' : 'Đăng Ký'}</span>
          </Link>

          <a
            href={`tel:${storeSettings.phone.replace(/[^0-9]/g, '')}`}
            className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <PhoneCall className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Hotline</span>
          </a>
        </div>
      </div>
    </>
  );
}
