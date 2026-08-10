'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  Wine,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d' | '3m' | '12m'>('30d');

  const { products, orders, reviews } = useAdminStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  // Mock revenue chart data
  const chartData = [
    { name: '01/02', revenue: 45000000, profit: 18000000, orders: 4 },
    { name: '02/02', revenue: 62000000, profit: 24800000, orders: 6 },
    { name: '03/02', revenue: 38000000, profit: 15200000, orders: 3 },
    { name: '04/02', revenue: 89000000, profit: 35600000, orders: 9 },
    { name: '05/02', revenue: 125000000, profit: 50000000, orders: 12 },
    { name: '06/02', revenue: 78000000, profit: 31200000, orders: 7 },
    { name: '07/02', revenue: 94000000, profit: 37600000, orders: 10 },
  ];

  const categoryPieData = [
    { name: 'Vang Đỏ', value: 45, color: '#721121' },
    { name: 'Champagne', value: 25, color: '#D4AF37' },
    { name: 'Vang Cao Cấp', value: 15, color: '#4A0E17' },
    { name: 'Vang Trắng', value: 15, color: '#F3E5AB' },
  ];

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-8">
          {/* Executive Header & Timeframe selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold-light">
                Executive Dashboard Overview
              </h1>
              <p className="text-xs text-cream/60">
                Báo cáo tổng quan hiệu suất kinh doanh WINECELLAR PRO toàn hệ thống
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-dark-card border border-gold/20 text-xs">
              {[
                { id: 'today', label: 'Hôm nay' },
                { id: '7d', label: '7 Ngày' },
                { id: '30d', label: '30 Ngày' },
                { id: '3m', label: '3 Tháng' },
                { id: '12m', label: '12 Tháng' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    timeframe === tf.id
                      ? 'bg-wine-gradient text-gold-light border border-gold/30 shadow-wine-glow'
                      : 'text-cream/60 hover:text-gold'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl glass-panel border border-gold/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cream/60 font-semibold uppercase">Doanh Thu Tháng</span>
                <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-gold-light">
                {formatCurrency(totalRevenue + 450000000)}
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% so với tháng trước
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-gold/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cream/60 font-semibold uppercase">Tổng Đơn Hàng</span>
                <div className="w-9 h-9 rounded-xl bg-burgundy/40 border border-gold/30 flex items-center justify-center text-gold">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-cream">
                {orders.length + 142} đơn
              </h3>
              <div className="flex items-center gap-1 text-xs text-gold-light font-bold">
                <span>{pendingOrders.length} đơn đang chờ xử lý</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-gold/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cream/60 font-semibold uppercase">Tồn Kho Thấp</span>
                <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-amber-400">
                {lowStockProducts.length} sản phẩm
              </h3>
              <span className="text-[11px] text-cream/50">Cần nhập thêm lô mới</span>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-gold/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cream/60 font-semibold uppercase">Tỷ Lệ Chuyển Đổi</span>
                <div className="w-9 h-9 rounded-xl bg-wine/40 border border-gold/30 flex items-center justify-center text-gold">
                  <Wine className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-gold-light">
                4.82%
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold">+0.6% tăng trưởng</span>
            </div>
          </div>

          {/* Recharts Graphical Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Area Chart Revenue Trend */}
            <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                <h3 className="font-serif text-lg font-bold text-gold-light">
                  Biểu Đồ Doanh Thu & Lợi Nhuận
                </h3>
                <span className="text-xs text-cream/50">Đơn vị: VNĐ</span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6B657B" fontSize={11} />
                    <YAxis stroke="#6B657B" fontSize={11} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F1C28', borderColor: '#D4AF37', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: number) => formatCurrency(val)}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart Categories */}
            <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3">
                Tỷ Trọng Doanh Thu Theo Loại
              </h3>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryPieData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {categoryPieData.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-cream/80">{c.name} ({c.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders & Low Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Orders Table */}
            <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3">
                Đơn Hàng Mới Nhất
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="uppercase text-gold font-bold border-b border-gold/15 text-[10px]">
                    <tr>
                      <th className="p-3">Mã Đơn</th>
                      <th className="p-3">Khách Hàng</th>
                      <th className="p-3">Tổng Tiền</th>
                      <th className="p-3">Thanh Toán</th>
                      <th className="p-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-gold/5 transition-colors">
                        <td className="p-3 font-mono font-bold text-gold-light">{o.orderNumber}</td>
                        <td className="p-3 font-medium text-cream">{o.customerName}</td>
                        <td className="p-3 font-serif font-bold text-gold-light">{formatCurrency(o.totalAmount)}</td>
                        <td className="p-3 uppercase text-cream/70">{o.paymentMethod}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-burgundy/80 text-gold-light font-bold text-[10px] uppercase">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low stock alerts widget */}
            <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Cảnh Báo Tồn Kho Low Stock</span>
              </h3>

              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-dark-card border border-amber-500/30 flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <strong className="text-cream font-serif block truncate">{p.name}</strong>
                      <span className="text-[10px] text-cream/50">SKU: {p.sku}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 font-bold flex-shrink-0">
                      Còn {p.stock} chai
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
