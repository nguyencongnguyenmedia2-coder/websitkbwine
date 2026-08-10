'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Order, OrderStatus } from '@/types';
import { Package, Search, Printer, Edit, CheckCircle, Truck, XCircle, Eye } from 'lucide-react';
import Image from 'next/image';

export default function AdminOrdersPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { orders, updateOrderStatus } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    addToast({
      type: 'success',
      title: 'Đã cập nhật trạng thái đơn hàng!',
      description: `Đơn hàng đã được chuyển sang trạng thái: ${status.toUpperCase()}`,
    });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-extrabold text-gold-light">Quản Lý Đơn Hàng</h1>
              <p className="text-xs text-cream/60">Theo dõi, cập nhật trạng thái, in hóa đơn và mã vận đơn</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl glass-panel border border-gold/20 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-cream/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn WCP-, tên khách hàng, SĐT..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-card border border-gold/15 text-xs text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'pending', label: 'Chờ Duyệt' },
                { id: 'processing', label: 'Đang Chuẩn Bị' },
                { id: 'shipping', label: 'Đang Giao' },
                { id: 'delivered', label: 'Đã Giao' },
                { id: 'cancelled', label: 'Đã Hủy' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    statusFilter === f.id
                      ? 'bg-wine-gradient text-gold-light border border-gold/30 shadow-wine-glow'
                      : 'bg-dark-card text-cream/60 hover:text-gold'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="p-6 rounded-2xl glass-panel border border-gold/20 overflow-x-auto shadow-luxury">
            <table className="w-full text-xs text-left">
              <thead className="uppercase text-gold font-bold border-b border-gold/15 text-[10px]">
                <tr>
                  <th className="p-3">Mã Đơn</th>
                  <th className="p-3">Khách Hàng</th>
                  <th className="p-3">Ngày Đặt</th>
                  <th className="p-3">Sản Phẩm</th>
                  <th className="p-3">Tổng Tiền</th>
                  <th className="p-3">Thanh Toán</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gold/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-gold-light">{o.orderNumber}</td>
                    <td className="p-3">
                      <strong className="text-cream block font-serif">{o.customerName}</strong>
                      <span className="text-[10px] text-cream/50">{o.customerPhone}</span>
                    </td>
                    <td className="p-3 text-cream/70">{formatDate(o.createdAt)}</td>
                    <td className="p-3 font-medium text-cream">{o.items.length} chai</td>
                    <td className="p-3 font-serif font-bold text-gold-light">{formatCurrency(o.totalAmount)}</td>
                    <td className="p-3 uppercase text-cream/70">{o.paymentMethod}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 rounded bg-burgundy/80 text-gold-light border border-gold/30 font-bold text-[10px] uppercase focus:outline-none"
                      >
                        <option value="pending">PENDING</option>
                        <option value="confirmed">CONFIRMED</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipping">SHIPPING</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 rounded bg-dark-card text-gold hover:bg-gold/20"
                        title="Xem Hóa Đơn"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Invoice Preview Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-xl">
          <div className="w-full max-w-2xl glass-panel rounded-2xl border border-gold/30 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gold/15 pb-3">
              <h3 className="font-serif text-xl font-bold text-gold-light">
                Hóa Đơn Bán Hàng #{selectedOrder.orderNumber}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="px-3 py-1.5 rounded-lg bg-gold/20 text-gold font-bold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> In Hóa Đơn
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1.5 rounded-lg bg-dark-card text-cream/70 text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-dark-card border border-gold/15">
                <div>
                  <strong className="text-gold-light block font-serif">Thông Tin Khách Hàng:</strong>
                  <p className="text-cream">{selectedOrder.customerName}</p>
                  <p className="text-cream/70">{selectedOrder.customerPhone} • {selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <strong className="text-gold-light block font-serif">Địa Chỉ Giao Hàng:</strong>
                  <p className="text-cream">{selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.province}</p>
                </div>
              </div>

              <div className="space-y-2">
                <strong className="text-gold-light block font-serif">Sản Phẩm Đã Đặt:</strong>
                {selectedOrder.items.map((i) => (
                  <div key={i.id} className="flex justify-between p-2 rounded bg-dark-card text-xs">
                    <span>{i.productName} (x{i.quantity})</span>
                    <strong className="text-gold-light">{formatCurrency(i.totalPrice)}</strong>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold/15 pt-3 flex justify-between font-bold text-sm">
                <span>Tổng Cộng:</span>
                <span className="font-serif text-gold-light">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
