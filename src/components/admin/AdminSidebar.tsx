'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  Ticket,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Wine,
  Layers,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Đơn Hàng', href: '/admin/orders', icon: Package },
    { label: 'Sản Phẩm', href: '/admin/products', icon: ShoppingBag },
    { label: 'Kho Hàng', href: '/admin/inventory', icon: Boxes },
    { label: 'Khách Hàng CRM', href: '/admin/customers', icon: Users },
    { label: 'Mã Giảm Giá', href: '/admin/coupons', icon: Ticket },
    { label: 'Đánh Giá', href: '/admin/reviews', icon: MessageSquare },
    { label: 'Bài Viết Blog', href: '/admin/blog', icon: FileText },
    { label: 'Báo Cáo & Analytics', href: '/admin/reports', icon: BarChart3 },
    { label: 'Cấu Hình & Homepage', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-dark-surface border-r border-gold/20 transition-all duration-300 flex flex-col justify-between font-sans ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-gold/15 pb-4">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-burgundy border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow flex-shrink-0">
              <Wine className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif text-lg font-bold text-gold-light truncate">
                  WINECELLAR
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cream/50">
                  Admin Dashboard
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow'
                    : 'text-cream/70 hover:bg-gold/10 hover:text-gold'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-gold' : ''}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Back to Store */}
      <div className="p-4 border-t border-gold/15">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-dark-card border border-gold/20 text-xs text-gold-light hover:border-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {!isCollapsed && <span>Quay Lại Store</span>}
        </Link>
      </div>
    </aside>
  );
}
