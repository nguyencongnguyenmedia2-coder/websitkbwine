'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wine,
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import MegaMenu from './MegaMenu';
import SearchModal from './SearchModal';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { storeSettings } = useAdminStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Streamlined, luxury, uncluttered navigation links
  const navLinks = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Sản Phẩm', href: '/products', mega: true },
    { label: 'Bộ Sưu Tập', href: '/products?category=vang-cao-cap' },
    { label: 'Khuyến Mãi', href: '/products?discount=true' },
    { label: 'Blog', href: '/blog' },
    { label: 'Liên Hệ', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full font-sans">
        {/* Top bar info */}
        <div className="bg-burgundy-deep/95 text-cream/80 text-xs py-2 px-4 sm:px-8 border-b border-gold/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-gold-light">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>Hotline VIP: <strong className="text-gold font-bold">{storeSettings.phone}</strong></span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-cream/70">
                <span>📍 Giao hàng siêu tốc Hỏa Tốc trong 2 giờ</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-cream/70">
              <Link
                href="/ai-assistant"
                className="inline-flex items-center gap-1.5 text-gold hover:text-gold-light transition-colors font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                <span>Trợ Lý AI Wine Sommelier</span>
              </Link>
              <span className="hidden sm:inline border-l border-gold/20 pl-4 text-cream/60">Cam kết 100% Chính Hãng</span>
            </div>
          </div>
        </div>

        {/* Main Luxury Navbar */}
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? 'bg-dark/95 backdrop-blur-xl shadow-luxury py-3 border-b border-gold/20'
              : 'bg-dark/90 backdrop-blur-md py-4 border-b border-white/10'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-cream hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo Dynamic */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-burgundy border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
                <Wine className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-gold-light group-hover:text-gold transition-colors whitespace-nowrap">
                  {storeSettings.storeName}
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-gold/70 -mt-1 font-sans font-medium whitespace-nowrap">
                  Luxury Wine Boutique
                </span>
              </div>
            </Link>

            {/* Desktop Streamlined Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('?')[0]));
                return (
                  <div
                    key={link.href}
                    className="relative py-2"
                    onMouseEnter={() => link.mega && setIsMegaMenuOpen(true)}
                    onMouseLeave={() => link.mega && setIsMegaMenuOpen(false)}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className={`text-sm font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                        isActive
                          ? 'text-gold font-bold tracking-wide'
                          : 'text-cream/90 hover:text-gold tracking-wide'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.mega && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            isMegaMenuOpen ? 'rotate-180 text-gold' : 'text-gold/70'
                          }`}
                        />
                      )}
                    </Link>

                    {/* Active Underline Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-gradient rounded-full shadow-gold-glow" />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Tools */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-cream/90 hover:text-gold hover:bg-gold/10 transition-colors relative"
                aria-label="Search"
                title="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2.5 rounded-full text-cream/90 hover:text-gold hover:bg-gold/10 transition-colors relative"
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
                className="px-3.5 py-2.5 rounded-xl bg-wine-gradient text-gold-light hover:text-gold border border-gold/40 hover:border-gold transition-all duration-300 flex items-center gap-2 shadow-wine-glow active:scale-95"
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

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2.5 rounded-full text-cream/90 hover:text-gold hover:bg-gold/10 transition-colors flex items-center gap-1.5"
                  title="Tài khoản"
                >
                  <User className="w-5 h-5 text-gold" />
                  {isAuthenticated && user && (
                    <span className="hidden md:inline text-xs text-gold-light max-w-[100px] truncate font-medium">
                      {user.fullName}
                    </span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl border border-gold/30 shadow-luxury py-2 z-50 text-xs">
                    {isAuthenticated && user ? (
                      <div>
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
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-gold/15 text-cream hover:text-gold transition-colors"
                        >
                          <User className="w-4 h-4 text-gold" />
                          <span>Tài Khoản Của Tôi</span>
                        </Link>
                        {['super_admin', 'admin', 'manager', 'sales', 'warehouse', 'content_editor'].includes(user.role) && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-burgundy/40 hover:bg-burgundy text-gold-light font-semibold transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-gold" />
                            <span>Quản Lý Admin</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-red-400 hover:bg-red-950/40 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng Xuất</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 text-center">
                        <p className="text-cream/80 mb-3">Đăng nhập để xem thông tin đơn hàng và ưu đãi dành riêng cho bạn.</p>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block w-full py-2 rounded-lg bg-wine-gradient text-gold-light font-semibold border border-gold/30 hover:border-gold"
                        >
                          Đăng Nhập / Đăng Ký
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Mega Menu display */}
          {isMegaMenuOpen && (
            <div
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <MegaMenu />
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass-panel-dark border-b border-gold/20 p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col space-y-3 font-sans">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2.5 px-3.5 rounded-xl text-sm transition-colors ${
                    pathname === link.href
                      ? 'bg-gold/20 text-gold font-bold border border-gold/30'
                      : 'text-cream/90 hover:bg-white/5 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Quick Categories for Mobile Drawer */}
            <div className="pt-3 border-t border-gold/15">
              <span className="text-xs uppercase font-bold text-gold tracking-wider block mb-2">Danh Mục Nhanh</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link href="/products?category=vang-do" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-dark-card text-cream/80 hover:text-gold">Rượu Vang Đỏ</Link>
                <Link href="/products?category=vang-trang" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-dark-card text-cream/80 hover:text-gold">Rượu Vang Trắng</Link>
                <Link href="/products?category=champagne" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-dark-card text-cream/80 hover:text-gold">Champagne Pháp</Link>
                <Link href="/products?category=vang-cao-cap" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded bg-dark-card text-cream/80 hover:text-gold">Vang Cao Cấp Icon</Link>
              </div>
            </div>

            <div className="pt-4 border-t border-gold/10">
              <Link
                href="/ai-assistant"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gold-gradient text-dark font-bold text-sm shadow-gold-glow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trợ Lý Trí Tuệ Nhân Tạo Rượu Vang</span>
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
