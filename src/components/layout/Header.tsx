'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Wine,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  Gift,
  Zap,
  BookOpen,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Grape,
  Globe,
} from 'lucide-react';
import MegaMenu from './MegaMenu';
import SearchModal from './SearchModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';

export default function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { storeSettings } = useAdminStore();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  const navLinks = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Sản Phẩm', href: '/products', hasMegaMenu: true },
    { label: 'Bộ Sưu Tập', href: '/products?category=vang-cao-cap' },
    { label: 'Khuyến Mãi', href: '/products?discount=true' },
    { label: 'Blog', href: '/blog' },
    { label: 'Liên Hệ', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-wine-dark text-cream text-[11px] py-1.5 px-4 border-b border-gold/20 font-sans">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-gold font-medium">
              <Phone className="w-3 h-3 mr-1" /> Hotline VIP: {storeSettings.phone}
            </span>
            <span className="hidden md:flex items-center text-cream/70">
              <Clock className="w-3 h-3 mr-1 text-gold" /> Giao hàng siêu tốc Hỏa Tốc trong 2 giờ
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/ai-assistant"
              className="flex items-center text-gold-light hover:text-gold transition-colors font-bold"
            >
              <Sparkles className="w-3 h-3 mr-1 text-gold animate-pulse" /> Trợ Lý AI Wine Sommelier
            </Link>
            <span className="hidden sm:inline text-cream/40">|</span>
            <span className="hidden sm:flex items-center text-cream/70">
              <ShieldCheck className="w-3 h-3 mr-1 text-gold" /> Cam kết 100% Chính Hãng
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0F0E13] border-b border-gold/20 shadow-2xl transition-all relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-cream/80 hover:text-gold hover:bg-gold/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-wine border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow group-hover:scale-105 transition-transform">
                <Wine className="w-6 h-6 text-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-wider gold-text-gradient uppercase">
                  KBWINE
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-cream/60 font-sans -mt-1">
                  LUXURY WINE BOUTIQUE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-sans">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                if (link.hasMegaMenu) {
                  return (
                    <div
                      key={link.href}
                      className="py-6 px-1"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={link.href}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
                          isActive || isMegaMenuOpen
                            ? 'text-gold bg-gold/10 border border-gold/30 shadow-gold-glow'
                            : 'text-cream/90 hover:text-gold hover:bg-gold/10'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180 text-gold' : ''}`} />
                      </Link>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'text-gold bg-gold/10 border border-gold/30 shadow-gold-glow'
                        : 'text-cream/90 hover:text-gold hover:bg-gold/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Tools */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-cream/90 hover:text-gold hover:bg-gold/10 transition-colors relative"
                aria-label="Search"
                title="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2 rounded-full text-cream/90 hover:text-gold hover:bg-gold/10 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
                title="Danh sách yêu thích"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-wine text-cream text-[10px] font-bold flex items-center justify-center border border-gold/40">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon with badge count */}
              <Link
                href="/cart"
                className="px-3 py-2 rounded-xl bg-wine-gradient text-gold-light hover:text-gold border border-gold/40 hover:border-gold transition-all duration-300 flex items-center gap-1.5 shadow-wine-glow active:scale-95"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 w-4.5 h-4.5 rounded-full bg-gold text-dark text-[10px] font-extrabold flex items-center justify-center border border-dark">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">Giỏ Hàng</span>
              </Link>

              {/* Explicit Mobile & Desktop Account Register/Login Button */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 rounded-xl bg-[#1C1A26] border border-gold/30 text-cream/90 hover:text-gold transition-colors flex items-center gap-1.5"
                    title="Tài khoản"
                  >
                    <User className="w-5 h-5 text-gold" />
                    <span className="hidden md:inline text-xs text-gold-light max-w-[90px] truncate font-bold">
                      {user.fullName}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#16141D] rounded-xl border border-gold/30 shadow-2xl py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-gold/10">
                        <p className="font-semibold text-gold-light">{user.fullName}</p>
                        <p className="text-[11px] text-cream/60 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-gold/20 text-gold text-[10px] uppercase font-bold">
                          Hạng: {user.tier}
                        </span>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-cream hover:bg-gold/10 hover:text-gold transition-colors"
                      >
                        Quản Lý Tài Khoản VIP
                      </Link>
                      {['super_admin', 'admin', 'manager', 'sales', 'warehouse', 'content_editor'].includes(user.role) && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gold-light font-bold hover:bg-burgundy/50 transition-colors border-t border-gold/10"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/40 transition-colors border-t border-gold/10 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account"
                  className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40 hover:border-gold transition-all text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-gold-glow"
                  title="Đăng Ký hoặc Đăng Nhập"
                >
                  <UserPlus className="w-4 h-4 text-gold" />
                  <span className="text-[11px] font-extrabold whitespace-nowrap">Đăng Ký / Đăng Nhập</span>
                </Link>
              )}

            </div>
          </div>
        </div>

        {/* Full-width MegaMenu Dropdown */}
        {isMegaMenuOpen && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute top-full left-0 w-full z-50 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-2 bg-[#0F0E13]"
          >
            <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0F0E13] border-b border-gold/25 p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            
            {/* Direct Mobile Register / Login Banner inside Drawer */}
            <div className="p-3.5 rounded-2xl bg-wine-gradient border border-gold/40 shadow-wine-glow flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-card border border-gold/40 flex items-center justify-center text-gold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-gold-light">
                    {isAuthenticated && user ? user.fullName : 'Tài Khoản KBWINE'}
                  </h4>
                  <p className="text-[11px] text-cream/70">
                    {isAuthenticated && user ? user.email : 'Đăng ký nhận ưu đãi chiết khấu 10%'}
                  </p>
                </div>
              </div>

              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-gold text-dark font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-transform"
              >
                {isAuthenticated ? 'Vào Hồ Sơ' : 'Đăng Ký / Nhập'}
              </Link>
            </div>

            <nav className="flex flex-col space-y-2 font-sans">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  pathname === '/' ? 'bg-gold/20 text-gold border border-gold/30' : 'text-cream/90 hover:bg-white/5 hover:text-gold'
                }`}
              >
                Trang Chủ
              </Link>

              {/* Expandable Mobile Product Category Accordion */}
              <div className="rounded-xl border border-gold/20 overflow-hidden bg-dark-card/40">
                <button
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  className="w-full flex items-center justify-between py-3 px-3.5 text-xs font-bold uppercase tracking-wider text-gold-light hover:bg-gold/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Wine className="w-4 h-4 text-gold" /> Danh Mục Sản Phẩm
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCategoriesOpen ? 'rotate-180 text-gold' : ''}`} />
                </button>

                {isMobileCategoriesOpen && (
                  <div className="p-3 space-y-3 bg-dark/60 border-t border-gold/15 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold/70 tracking-widest block mb-1.5">
                        Loại Rượu Vang
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Link href="/products?category=vang-do" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface hover:bg-gold/15 text-cream/80 hover:text-gold">Vang Đỏ</Link>
                        <Link href="/products?category=vang-trang" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface hover:bg-gold/15 text-cream/80 hover:text-gold">Vang Trắng</Link>
                        <Link href="/products?category=vang-hong" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface hover:bg-gold/15 text-cream/80 hover:text-gold">Vang Hồng</Link>
                        <Link href="/products?category=champagne" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface hover:bg-gold/15 text-cream/80 hover:text-gold">Champagne</Link>
                        <Link href="/products?category=sparkling" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface hover:bg-gold/15 text-cream/80 hover:text-gold">Sparkling</Link>
                        <Link href="/products?category=vang-cao-cap" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface hover:bg-gold/15 text-cream/80 text-gold font-bold">Icon Grand Cru</Link>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold/70 tracking-widest block mb-1.5 flex items-center gap-1">
                        <Grape className="w-3 h-3 text-gold" /> Giống Nho Nổi Bật
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Link href="/products?grape=Cabernet%20Sauvignon" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface text-cream/70 hover:text-gold truncate">Cabernet Sauv.</Link>
                        <Link href="/products?grape=Pinot%20Noir" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface text-cream/70 hover:text-gold truncate">Pinot Noir</Link>
                        <Link href="/products?grape=Chardonnay" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface text-cream/70 hover:text-gold truncate">Chardonnay</Link>
                        <Link href="/products?grape=Shiraz" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-dark-surface text-cream/70 hover:text-gold truncate">Shiraz / Syrah</Link>
                      </div>
                    </div>

                    <Link
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center py-2 rounded-lg bg-gold/20 text-gold font-bold hover:bg-gold/30 transition-colors mt-2"
                    >
                      Xem Tất Cả Sản Phẩm →
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/products?category=vang-cao-cap"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-cream/90 hover:bg-white/5 hover:text-gold"
              >
                Bộ Sưu Tập
              </Link>
              <Link
                href="/products?discount=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gold-light hover:bg-white/5"
              >
                Khuyến Mãi
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-cream/90 hover:bg-white/5 hover:text-gold"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-cream/90 hover:bg-white/5 hover:text-gold"
              >
                Liên Hệ
              </Link>
            </nav>

            <div className="pt-3 border-t border-gold/10">
              <Link
                href="/ai-assistant"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gold-gradient text-dark font-bold text-xs shadow-gold-glow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trợ Lý Trí Tuệ Nhân Tạo Wine Sommelier</span>
              </Link>
            </div>
          </div>
        )}
      </header>


      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
