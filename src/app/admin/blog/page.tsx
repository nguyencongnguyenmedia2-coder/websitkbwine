'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatDate } from '@/lib/utils/format';
import { FileText, Plus, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

export default function AdminBlogPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { blogs, addBlogPost, deleteBlogPost } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kiến thức rượu vang');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addBlogPost({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      thumbnail,
      content,
      category,
      author: 'Sommelier Master',
      tags: ['Rượu vang', 'Thưởng thức'],
    });
    addToast({ type: 'success', title: 'Đã xuất bản bài viết mới thành công!' });
    setTitle('');
    setContent('');
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
              <h1 className="font-serif text-2xl font-extrabold text-gold-light">Quản Lý Bài Viết Blog</h1>
              <p className="text-xs text-cream/60">Tạo nội dung cẩm nang kiến thức thưởng rượu và gợi ý wine pairing</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Viết Bài Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl glass-panel border border-gold/20 space-y-3 shadow-luxury flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-dark-card">
                    <Image src={b.thumbnail} alt="" fill className="object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-burgundy/90 text-gold-light text-[10px] font-bold">
                      {b.category}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-cream text-sm line-clamp-2">{b.title}</h3>
                  <span className="text-[10px] text-cream/50 block">{formatDate(b.createdAt)} • {b.author}</span>
                </div>

                <div className="pt-2 border-t border-gold/10 flex justify-end">
                  <button
                    onClick={() => {
                      deleteBlogPost(b.id);
                      addToast({ type: 'warning', title: 'Đã xóa bài viết!' });
                    }}
                    className="p-2 rounded bg-dark-card text-red-400 hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-xl">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-gold/30 p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-gold-light border-b border-gold/15 pb-3">Viết Bài Blog Mới</h3>
            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="text-cream/70 block mb-1">Tiêu đề bài viết *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream" />
              </div>
              <div>
                <label className="text-cream/70 block mb-1">Chuyên mục</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream">
                  <option value="Kiến thức rượu vang">Kiến thức rượu vang</option>
                  <option value="Wine pairing">Wine pairing</option>
                  <option value="Quà tặng">Quà tặng</option>
                  <option value="Ẩm thực">Ẩm thực</option>
                </select>
              </div>
              <div>
                <label className="text-cream/70 block mb-1">Nội dung chi tiết</label>
                <textarea rows={5} required value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-dark-card text-cream/70">Hủy</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-wine-gradient text-gold-light font-bold border border-gold/40">Xuất Bản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
