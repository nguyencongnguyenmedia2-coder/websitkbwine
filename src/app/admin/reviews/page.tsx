'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatDate } from '@/lib/utils/format';
import { MessageSquare, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { reviews, updateReviewStatus, deleteReview } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-6">
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-gold-light">Quản Lý Đánh Giá Khách Hàng</h1>
            <p className="text-xs text-cream/60">Duyệt, từ chối hoặc xóa các nhận xét hiển thị trên sản phẩm</p>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-6 rounded-2xl glass-panel border border-gold/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-luxury">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <strong className="font-serif text-base text-gold-light">{r.authorName}</strong>
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${r.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-400'}`}>
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs text-cream/80">{r.comment}</p>
                  <span className="text-[10px] text-cream/40 block">{formatDate(r.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => {
                        updateReviewStatus(r.id, 'approved');
                        addToast({ type: 'success', title: 'Đã duyệt đánh giá!' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-900 text-emerald-200 text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteReview(r.id);
                      addToast({ type: 'warning', title: 'Đã xóa đánh giá!' });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950 text-red-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
