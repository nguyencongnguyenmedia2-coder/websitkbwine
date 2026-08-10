'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { Bell, Search, User, Shield, Check, Menu } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user } = useAuthStore();
  const { notifications } = useAdminStore();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark/95 backdrop-blur-xl border-b border-gold/20 px-6 flex items-center justify-between font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-dark-card border border-gold/20 text-cream/80 hover:text-gold transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-cream/40" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng, sản phẩm, SKU..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-card border border-gold/15 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl bg-dark-card border border-gold/20 text-cream/80 hover:text-gold transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-wine text-cream text-[10px] font-bold flex items-center justify-center border border-gold/30">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl border border-gold/30 shadow-luxury p-4 z-50 text-xs space-y-3">
              <h4 className="font-serif font-bold text-gold-light border-b border-gold/15 pb-2">
                Thông Báo Hệ Thống ({notifications.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-dark-card border border-gold/10 space-y-1">
                    <strong className="text-gold-light block font-serif">{n.title}</strong>
                    <p className="text-cream/75">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin profile */}
        {user && (
          <div className="flex items-center gap-3 border-l border-gold/15 pl-4">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/40 bg-dark-card">
              <Image
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-gold-light">{user.fullName}</span>
              <span className="text-[10px] uppercase font-semibold text-gold tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
