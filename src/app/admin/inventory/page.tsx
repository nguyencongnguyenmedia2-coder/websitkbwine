'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatDate } from '@/lib/utils/format';
import { Boxes, AlertTriangle, Plus, Minus, History, RefreshCw } from 'lucide-react';

export default function AdminInventoryPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { products, inventoryMovements, adjustStock } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [adjustQty, setAdjustQty] = useState<number>(5);
  const [adjustNote, setAdjustNote] = useState<string>('Nhập bổ sung từ hầm Pháp');

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    adjustStock(selectedProductId, adjustQty, adjustNote, 'Quản Lý Kho Hàng');
    addToast({
      type: 'success',
      title: 'Đã điều chỉnh kho thành công!',
      description: `Đã ${adjustQty >= 0 ? 'thêm' : 'trừ'} ${Math.abs(adjustQty)} chai vào kho.`,
    });
    setAdjustNote('');
  };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-8">
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-gold-light">Quản Lý Tồn Kho & Lịch Sử Xuất Nhập</h1>
            <p className="text-xs text-cream/60">Kiểm soát kho hàng, tồn khả dụng, cảnh báo hết hàng và lịch sử điều chỉnh</p>
          </div>

          {/* Quick stock adjustment form */}
          <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2">
              <Boxes className="w-5 h-5 text-gold" />
              <span>Điều Chỉnh Tồn Kho Thủ Công</span>
            </h3>

            <form onSubmit={handleAdjustStock} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-cream/70 block mb-1">Chọn sản phẩm:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                >
                  <option value="">-- Chọn sản phẩm rượu vang --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tồn hiện tại: {p.stock} chai)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-cream/70 block mb-1">Số lượng (+ / -):</label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold font-bold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-wine-gradient text-gold-light font-bold border border-gold/40 hover:border-gold shadow-wine-glow"
                >
                  Lưu Điều Chỉnh
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Stock Levels Table */}
            <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3">
                Bảng Cân Đối Tồn Kho
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="uppercase text-gold font-bold border-b border-gold/15 text-[10px]">
                    <tr>
                      <th className="p-3">Sản Phẩm</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Tồn Kho</th>
                      <th className="p-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                        <td className="p-3 font-serif font-bold text-cream max-w-xs truncate">{p.name}</td>
                        <td className="p-3 font-mono font-bold text-gold-light">{p.sku}</td>
                        <td className="p-3 font-bold text-cream">{p.stock} chai</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                              p.stock <= p.lowStockThreshold
                                ? 'bg-amber-950 text-amber-400'
                                : 'bg-emerald-950 text-emerald-300'
                            }`}
                          >
                            {p.stock <= p.lowStockThreshold ? 'Low Stock' : 'An Toàn'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Movements Audit History */}
            <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-gold" />
                <span>Nhật Ký Xuất Nhập Kho</span>
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {inventoryMovements.map((mov) => (
                  <div key={mov.id} className="p-3 rounded-xl bg-dark-card border border-gold/15 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-gold-light font-serif truncate">{mov.productName}</strong>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${mov.quantityChange >= 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                        {mov.quantityChange >= 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                      </span>
                    </div>
                    <p className="text-cream/70 text-[11px]">{mov.note}</p>
                    <div className="flex justify-between text-[10px] text-cream/40 pt-1">
                      <span>{mov.createdBy}</span>
                      <span>{formatDate(mov.createdAt)}</span>
                    </div>
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
