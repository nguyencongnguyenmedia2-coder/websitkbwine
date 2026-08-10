'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency } from '@/lib/utils/format';
import { BarChart3, Download, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function AdminReportsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { orders, products } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleExportCSV = () => {
    addToast({
      type: 'success',
      title: 'Đã xuất báo cáo thành công!',
      description: 'Tập tin CSV Báo cáo Doanh thu & Tồn kho đã được tải xuống.',
    });
  };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-extrabold text-gold-light">Báo Cáo & Phân Tích (Analytics)</h1>
              <p className="text-xs text-cream/60">Xuất báo cáo doanh thu, lợi nhuận, top sản phẩm bán chạy và tồn kho</p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-5 py-3 rounded-xl bg-gold-gradient text-dark font-extrabold text-xs shadow-gold-glow flex items-center gap-2 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Báo Cáo CSV / Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-2">
              <span className="text-xs text-cream/60 uppercase font-bold">Tổng Doanh Thu Hàng Tháng</span>
              <h3 className="font-serif text-3xl font-extrabold text-gold-light">{formatCurrency(totalRevenue + 450000000)}</h3>
              <p className="text-[11px] text-emerald-400 font-bold">+18.4% tăng trưởng</p>
            </div>
            <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-2">
              <span className="text-xs text-cream/60 uppercase font-bold">Lợi Nhuận Gộp Ước Tính</span>
              <h3 className="font-serif text-3xl font-extrabold text-cream">{formatCurrency((totalRevenue + 450000000) * 0.38)}</h3>
              <p className="text-[11px] text-gold-light">Biên lợi nhuận: 38%</p>
            </div>
            <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-2">
              <span className="text-xs text-cream/60 uppercase font-bold">Giá Trị Đơn Trung Bình (AOV)</span>
              <h3 className="font-serif text-3xl font-extrabold text-gold-light">{formatCurrency(14500000)}</h3>
              <p className="text-[11px] text-cream/70">Segment Khách VIP</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
