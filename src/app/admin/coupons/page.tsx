'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Coupon } from '@/types';
import { Ticket, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { coupons, addCoupon, deleteCoupon } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(3000000);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    addCoupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue,
      perUserLimit: 1,
      startDate: new Date().toISOString(),
      endDate: '2026-12-31T23:59:59Z',
      isActive: true,
    });
    addToast({
      type: 'success',
      title: 'Tạo mã voucher thành công!',
      description: `Mã ${code.toUpperCase()} đã sẵn sàng áp dụng.`,
    });
    setCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-extrabold text-gold-light">Quản Lý Mã Giảm Giá (Coupons)</h1>
              <p className="text-xs text-cream/60">Tạo mã ưu đãi %, số tiền cố định, giới hạn lượt dùng và đơn tối thiểu</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Tạo Voucher Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl glass-panel border border-gold/30 space-y-4 shadow-luxury">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-gold/20 text-gold-light font-mono font-bold text-sm border border-gold/40">
                    {c.code}
                  </span>
                  <button
                    onClick={() => {
                      deleteCoupon(c.id);
                      addToast({ type: 'warning', title: 'Đã xóa mã coupon' });
                    }}
                    className="text-cream/40 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-cream">
                    {c.discountType === 'percentage' ? `Giảm ${c.discountValue}%` : `Giảm ${formatCurrency(c.discountValue)}`}
                  </h3>
                  <p className="text-xs text-cream/70">Đơn tối thiểu: {formatCurrency(c.minOrderValue)}</p>
                </div>

                <div className="pt-3 border-t border-gold/15 flex justify-between text-xs text-cream/60">
                  <span>Đã dùng: <strong className="text-gold">{c.usedCount}</strong> lượt</span>
                  <span>Hạn dùng: 31/12/2026</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-xl">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-gold/30 p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-gold-light border-b border-gold/15 pb-3">Tạo Mã Voucher Mới</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="text-cream/70 block mb-1">Mã Coupon (Code) *</label>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="WINEVIP20" className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream uppercase font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-cream/70 block mb-1">Loại giảm giá</label>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream">
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VND)</option>
                  </select>
                </div>
                <div>
                  <label className="text-cream/70 block mb-1">Giá trị giảm</label>
                  <input type="number" required value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream" />
                </div>
              </div>
              <div>
                <label className="text-cream/70 block mb-1">Đơn hàng tối thiểu (VND)</label>
                <input type="number" required value={minOrderValue} onChange={(e) => setMinOrderValue(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream/70">Hủy</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-wine-gradient text-gold-light font-bold border border-gold/40">Tạo Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
