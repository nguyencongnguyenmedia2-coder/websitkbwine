'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { MOCK_USERS } from '@/lib/data/mockData';
import { Users, Search, Award, Mail, Phone, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function AdminCustomersPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = MOCK_USERS.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-gold-light">Quản Lý Khách Hàng (Customer CRM)</h1>
            <p className="text-xs text-cream/60">Phân hạng khách hàng VIP, theo dõi tổng chi tiêu và lịch sử giao dịch</p>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-gold/20 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-cream/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên khách hàng, email, số điện thoại..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-card border border-gold/15 text-xs text-cream focus:outline-none focus:border-gold"
              />
            </div>
            <span className="text-xs text-cream/70">Tổng cộng: <strong className="text-gold">{MOCK_USERS.length}</strong> khách hàng</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-4 shadow-luxury">
                <div className="flex items-center gap-4 border-b border-gold/15 pb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gold/40 bg-dark-card">
                    <Image src={user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-gold-light">{user.fullName}</h3>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-wine text-gold text-[10px] uppercase font-bold border border-gold/30">
                      Cấp: {user.tier}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-cream/80">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gold" />
                    <span>{user.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    <span>{user.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    <span>Tham gia: {formatDate(user.createdAt)}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-gold/15 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-cream/50 block text-[10px]">Tổng đơn:</span>
                    <strong className="text-cream">{user.totalOrders} đơn</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-cream/50 block text-[10px]">Tổng chi tiêu:</span>
                    <strong className="font-serif text-gold-light text-sm">{formatCurrency(user.totalSpent)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
