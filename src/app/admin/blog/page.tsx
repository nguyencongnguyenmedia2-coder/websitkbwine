'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatDate } from '@/lib/utils/format';
import { BlogPost } from '@/types';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Globe,
  Tag,
  Wine,
  BarChart2,
  X,
  Heading,
  Quote,
  List,
  Bold,
  Italic,
} from 'lucide-react';

export default function AdminBlogPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { blogs, products, addBlogPost, deleteBlogPost } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Kiến thức rượu vang');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Master Sommelier Hoàng Nam');
  const [authorTitle, setAuthorTitle] = useState('Giám định viên Vang Quốc Tế');
  const [thumbnail, setThumbnail] = useState(
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80'
  );
  const [tagsInput, setTagsInput] = useState('Rượu Vang, Thưởng Thức, Decant');
  const [focusKeyword, setFocusKeyword] = useState('Rượu vang Bordeaux');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // Open Modal for New Post
  const handleOpenNewModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setCategory('Kiến thức rượu vang');
    setExcerpt('');
    setContent('');
    setAuthor('Master Sommelier Hoàng Nam');
    setAuthorTitle('Giám định viên Vang Quốc Tế');
    setThumbnail('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80');
    setTagsInput('Rượu Vang, Thưởng Thức, Decant');
    setFocusKeyword('Rượu vang');
    setSeoTitle('');
    setSeoDescription('');
    setSelectedProductIds([]);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  // Open Modal for Editing Post
  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt || '');
    setContent(post.content);
    setAuthor(post.author);
    setAuthorTitle(post.authorTitle || 'Giám định viên KBWINE');
    setThumbnail(post.thumbnail);
    setTagsInput(post.tags.join(', '));
    setFocusKeyword(post.focusKeyword || '');
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setSelectedProductIds(post.relatedProductIds || []);
    setIsFeatured(!!post.isFeatured);
    setIsModalOpen(true);
  };

  // Title Auto Slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  // SEO Calculation
  const seoAudit = useMemo(() => {
    const kw = focusKeyword.trim().toLowerCase();
    const effectiveSeoTitle = seoTitle || title;
    const effectiveSeoDesc = seoDescription || excerpt;

    const titleLen = effectiveSeoTitle.length;
    const descLen = effectiveSeoDesc.length;
    const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;

    let score = 0;
    const checks = [
      {
        id: 'kw_in_title',
        label: 'Từ khóa chính có trong Tiêu đề SEO',
        passed: kw ? effectiveSeoTitle.toLowerCase().includes(kw) : false,
        pts: 20,
      },
      {
        id: 'kw_in_desc',
        label: 'Từ khóa chính có trong Meta Description',
        passed: kw ? effectiveSeoDesc.toLowerCase().includes(kw) : false,
        pts: 20,
      },
      {
        id: 'title_len',
        label: `Độ dài tiêu đề chuẩn (50-60 ký tự, hiện tại: ${titleLen})`,
        passed: titleLen >= 40 && titleLen <= 65,
        pts: 15,
      },
      {
        id: 'desc_len',
        label: `Độ dài Meta Description chuẩn (120-160 ký tự, hiện tại: ${descLen})`,
        passed: descLen >= 100 && descLen <= 170,
        pts: 15,
      },
      {
        id: 'word_count',
        label: `Độ dài bài viết phong phú (> 250 từ, hiện tại: ${wordCount} từ)`,
        passed: wordCount >= 250,
        pts: 15,
      },
      {
        id: 'has_thumbnail',
        label: 'Có ảnh đại diện bài viết (Featured Image)',
        passed: !!thumbnail,
        pts: 10,
      },
      {
        id: 'has_related_products',
        label: 'Đã gắn sản phẩm rượu vang liên quan vào bài viết',
        passed: selectedProductIds.length > 0,
        pts: 5,
      },
    ];

    checks.forEach((c) => {
      if (c.passed) score += c.pts;
    });

    return { score, checks, effectiveSeoTitle, effectiveSeoDesc, wordCount };
  }, [title, excerpt, content, focusKeyword, seoTitle, seoDescription, thumbnail, selectedProductIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      addToast({ type: 'error', title: 'Thiếu thông tin!', description: 'Vui lòng điền tiêu đề và nội dung bài viết.' });
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const readTimeMinutes = Math.max(1, Math.ceil(seoAudit.wordCount / 200));

    if (editingPost) {
      deleteBlogPost(editingPost.id);
    }

    addBlogPost({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      thumbnail,
      excerpt: excerpt || title,
      content,
      category,
      author,
      authorTitle,
      readTimeMinutes,
      tags,
      focusKeyword,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      relatedProductIds: selectedProductIds,
      viewsCount: editingPost ? editingPost.viewsCount : 0,
      isFeatured,
    });

    addToast({
      type: 'success',
      title: editingPost ? 'Đã cập nhật bài viết!' : 'Đã xuất bản bài viết chuẩn SEO mới!',
    });
    setIsModalOpen(false);
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F0E13] text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-extrabold text-gold-light flex items-center gap-2">
                <FileText className="w-6 h-6 text-gold" /> Trình Quản Lý Bài Viết Blog Chuẩn SEO
              </h1>
              <p className="text-xs text-cream/60">Tạo nội dung cẩm nang kiến thức thưởng rượu, wine pairing và tối ưu hóa thứ hạng Google</p>
            </div>

            <button
              onClick={handleOpenNewModal}
              className="px-5 py-3 rounded-xl bg-gold-gradient text-dark font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-dark" />
              <span>SOẠN BÀI MỚI CHUẨN SEO</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-cream/40 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề hoặc chuyên mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181622] border border-gold/20 text-xs text-cream focus:outline-none focus:border-gold"
            />
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBlogs.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-[#16141D] border border-gold/20 flex flex-col justify-between space-y-4 shadow-lg hover:border-gold/40 transition-colors">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-dark-card border border-gold/15">
                    <Image src={b.thumbnail} alt="" fill className="object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-wine/90 text-gold-light text-[10px] font-bold border border-gold/30">
                      {b.category}
                    </span>
                    {b.isFeatured && (
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-gold text-dark text-[10px] font-extrabold shadow-sm">
                        Nổi Bật
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-gold-light text-base line-clamp-2 leading-snug">{b.title}</h3>
                  <p className="text-xs text-cream/70 line-clamp-2 leading-relaxed">{b.excerpt || b.content}</p>

                  <div className="flex items-center justify-between text-[11px] text-cream/50 pt-1">
                    <span>{formatDate(b.createdAt)}</span>
                    <span className="flex items-center gap-1 text-gold"><Eye className="w-3.5 h-3.5" /> {b.viewsCount || 0} lượt đọc</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                  <div className="text-[11px] text-cream/60">
                    Từ khóa: <strong className="text-gold-light">{b.focusKeyword || 'Chưa đặt'}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(b)}
                      className="p-2 rounded-lg bg-[#1F1C28] text-gold hover:bg-gold/20 border border-gold/20 transition-colors"
                      title="Chỉnh sửa bài viết & SEO"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteBlogPost(b.id);
                        addToast({ type: 'warning', title: 'Đã xóa bài viết!' });
                      }}
                      className="p-2 rounded-lg bg-[#1F1C28] text-rose-400 hover:bg-rose-950 border border-rose-500/20 transition-colors"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Write / Edit Modal with Real-time SEO Assistant */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
          <div className="relative w-full max-w-6xl bg-[#0F0E13] rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-cream">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gold/20 flex items-center justify-between bg-[#16141D]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-wine/40 border border-gold/30 text-gold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-light">
                    {editingPost ? 'Chỉnh Sửa Bài Viết Chuẩn SEO' : 'Soạn Thảo Bài Viết Blog Mới Chuẩn SEO'}
                  </h3>
                  <p className="text-xs text-cream/60">Tối ưu hóa các chỉ số tiêu đề, thẻ meta description và mật độ từ khóa Google</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-[#1F1C28] text-cream/70 hover:text-gold border border-gold/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Article Content Fields */}
              <div className="lg:col-span-7 space-y-4">
                
                <div>
                  <label className="text-xs text-gold font-bold block mb-1">Tiêu Đề Bài Viết (H1) *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="VD: Hướng Dẫn Thưởng Thức Rượu Vang Bordeaux Chuẩn Phong Cách Sommelier"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181622] border border-gold/25 text-cream text-xs focus:outline-none focus:border-gold font-serif text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Đường Dẫn Chuẩn (Slug SEO)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="huong-dan-thuong-thuc-ruou-vang-bordeaux"
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Chuyên Mục</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs"
                    >
                      <option value="Kiến thức rượu vang">Kiến thức rượu vang</option>
                      <option value="Wine pairing">Wine pairing</option>
                      <option value="Quà tặng">Quà tặng</option>
                      <option value="Thưởng thức & Lưu trữ">Thưởng thức & Lưu trữ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-cream/70 block mb-1">Đoạn Tóm Tắt Mở Đầu (Sapo / Excerpt)</label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Tóm tắt ngắn gọn 2-3 câu gây ấn tượng kéo độc giả đọc tiếp bài viết..."
                    className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Content Editor formatting toolbar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gold font-bold block">Nội Dung Chi Tiết Bài Viết (HTML / Structured Text) *</label>
                    <div className="flex gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setContent((prev) => prev + '\n<h2>Tiêu đề H2 mới</h2>\n')}
                        className="px-2 py-1 rounded bg-[#1F1C28] border border-gold/20 hover:text-gold flex items-center gap-1"
                      >
                        <Heading className="w-3 h-3 text-gold" /> H2
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent((prev) => prev + '\n<blockquote>Trích dẫn nhận xét từ Master Sommelier...</blockquote>\n')}
                        className="px-2 py-1 rounded bg-[#1F1C28] border border-gold/20 hover:text-gold flex items-center gap-1"
                      >
                        <Quote className="w-3 h-3 text-gold" /> Sommelier Quote
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={10}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung bài viết. Có thể chèn các thẻ <h2>, <h3>, <blockquote>, <p>..."
                    className="w-full px-4 py-3 rounded-xl bg-[#181622] border border-gold/25 text-cream text-xs font-sans leading-relaxed focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Embedded Products Selector */}
                <div className="p-3.5 rounded-xl bg-[#16141D] border border-gold/20 space-y-2">
                  <label className="text-xs font-bold text-gold flex items-center gap-1.5">
                    <Wine className="w-4 h-4 text-gold" /> Gắn Sản Phẩm Rượu Vang Được Nhắc Đến Trong Bài (Product Widgets)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                    {products.slice(0, 8).map((p) => {
                      const isSelected = selectedProductIds.includes(p.id);
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedProductIds(selectedProductIds.filter((id) => id !== p.id));
                            } else {
                              setSelectedProductIds([...selectedProductIds, p.id]);
                            }
                          }}
                          className={`p-2 rounded-lg border text-left text-[11px] flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-wine/30 border-gold text-gold-light font-bold'
                              : 'bg-[#1F1C28] border-gold/10 text-cream/70 hover:text-cream'
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Tên Tác Giả</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Danh Hiệu Tác Giả</label>
                    <input
                      type="text"
                      value={authorTitle}
                      onChange={(e) => setAuthorTitle(e.target.value)}
                      placeholder="VD: Master Sommelier KBWINE"
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Ảnh Đại Diện Bài Viết (URL)</label>
                    <input
                      type="text"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Thẻ Tags (cách nhau bởi dấu phẩy)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Bordeaux, Tasting, Decant"
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-gold-light font-bold">
                    Đặt làm Bài viết Nổi bật trên Trang Chủ & Đầu Trang Blog
                  </label>
                </div>
              </div>

              {/* Right Column: Real-time SEO Assistant & Google Preview */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* SEO Score Card */}
                <div className="p-5 rounded-2xl bg-[#16141D] border border-gold/25 space-y-4">
                  <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-gold" />
                      <h4 className="font-serif text-sm font-bold text-gold-light">Điểm Đánh Giá SEO Real-time</h4>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                        seoAudit.score >= 80
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : seoAudit.score >= 50
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {seoAudit.score} / 100 ĐIỂM
                    </span>
                  </div>

                  <div>
                    <label className="text-xs text-gold font-bold block mb-1">Từ Khóa SEO Chính (Focus Keyword)</label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="VD: Rượu vang Bordeaux"
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Tùy Chỉnh Tiêu Đề SEO (Meta Title)</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || 'Tiêu đề hiển thị trên kết quả tìm kiếm Google'}
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Tùy Chỉnh Mô Tả SEO (Meta Description)</label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={excerpt || 'Đoạn mô tả ngắn hiển thị bên dưới tiêu đề trên Google (120-160 ký tự)...'}
                      className="w-full px-3 py-2 rounded-xl bg-[#181622] border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Google SERP Snippet Preview */}
                  <div className="p-4 rounded-xl bg-white text-slate-900 space-y-1 font-sans text-left shadow-md">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">https://kbwine.vn › blog › {slug || 'duong-dan-bai-viet'}</span>
                    </div>
                    <h5 className="text-base text-[#1a0dab] font-medium hover:underline line-clamp-1 leading-snug cursor-pointer">
                      {seoAudit.effectiveSeoTitle || 'Tiêu Đề Bài Viết Hiển Thị Trên Google Search'} | KBWINE Academy
                    </h5>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-normal">
                      {seoAudit.effectiveSeoDesc || 'Đoạn mô tả bài viết chuẩn SEO hiển thị trên kết quả tìm kiếm của Google giúp nâng cao tỷ lệ nhấp CTR...'}
                    </p>
                  </div>

                  {/* SEO Checklist */}
                  <div className="space-y-2 pt-2 border-t border-gold/15">
                    <h5 className="text-xs font-bold text-cream/80">Danh mục kiểm tra SEO (Checklist):</h5>
                    <div className="space-y-1.5 text-xs">
                      {seoAudit.checks.map((c) => (
                        <div key={c.id} className="flex items-center gap-2">
                          {c.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                          <span className={c.passed ? 'text-cream/90' : 'text-cream/50'}>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#181622] text-cream/70 hover:text-cream text-xs font-bold border border-gold/20"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gold-gradient text-dark font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-all"
                  >
                    {editingPost ? 'CẬP NHẬT BÀI VIẾT' : 'XUẤT BẢN CHUẨN SEO'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
