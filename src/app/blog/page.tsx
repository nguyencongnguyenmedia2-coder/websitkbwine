'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useAdminStore } from '@/store/useAdminStore';
import { formatDate } from '@/lib/utils/format';
import { BookOpen, Calendar, User, ArrowRight, Search, Clock, Eye, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Tất cả',
  'Kiến thức rượu vang',
  'Wine pairing',
  'Quà tặng',
  'Thưởng thức & Lưu trữ',
];

export default function BlogListPage() {
  const { blogs } = useAdminStore();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Featured Post
  const featuredPost = blogs.find((b) => b.isFeatured) || blogs[0];

  // Filtered Posts
  const filteredBlogs = blogs.filter((post) => {
    const matchesCat = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.focusKeyword && post.focusKeyword.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0F0E13] text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      {/* Hero Header */}
      <div className="bg-[#16141D] border-b border-gold/20 py-12 sm:py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-gold flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 w-fit mx-auto">
            <BookOpen className="w-4 h-4 text-gold" /> KBWINE ACADEMY & SOMMELIER JOURNAL
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gold-light leading-tight">
            Cẩm Nang Kiến Thức Rượu Vang
          </h1>
          <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-sans max-w-2xl mx-auto">
            Khám phá văn hóa rượu vang thế giới, quy trình Decant đỉnh cao, bí quyết phối vị thực đơn chuẩn Michelin cùng các Master Sommelier quốc tế.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Featured Editorial Post Showcase */}
        {featuredPost && (
          <div className="relative rounded-3xl overflow-hidden bg-[#16141D] border border-gold/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
            <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-dark-card border border-gold/20 shadow-luxury">
              <Image src={featuredPost.thumbnail} alt={featuredPost.title} fill priority className="object-cover hover:scale-105 transition-transform duration-700" />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-wine/90 text-gold-light text-xs font-extrabold border border-gold/40 shadow-wine-glow flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> BÀI VIẾT BÌNH CHỌN
              </span>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-[#181622] text-gold text-xs font-bold border border-gold/20">
                  {featuredPost.category}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold-light leading-tight hover:text-gold transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-cream/80 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt || featuredPost.content}
                </p>

                <div className="flex items-center gap-4 text-xs text-cream/50 pt-2">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold" /> {formatDate(featuredPost.createdAt)}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" /> {featuredPost.readTimeMinutes || 5} phút đọc</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gold/15 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-4 h-4 text-gold" />
                  <span className="font-bold text-cream">{featuredPost.author}</span>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-dark font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span>ĐỌC BÀI VIẾT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-gold/15">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow'
                    : 'bg-[#181622] text-cream/70 hover:text-gold border border-gold/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-cream/40 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm bài viết, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#181622] border border-gold/25 text-xs text-cream focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBlogs.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-3xl overflow-hidden bg-[#16141D] border border-gold/20 hover:border-gold/50 shadow-luxury flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-card border-b border-gold/15">
                <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-wine/90 text-gold-light text-[11px] font-bold border border-gold/30">
                  {post.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/75 text-gold text-[10px] font-bold border border-gold/20 backdrop-blur-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold" /> {post.readTimeMinutes || 5} min
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-cream/50">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold" /> {formatDate(post.createdAt)}</span>
                    <span className="flex items-center gap-1 text-gold"><Eye className="w-3.5 h-3.5" /> {post.viewsCount || 0}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-cream group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-cream/70 line-clamp-3 leading-relaxed">
                    {post.excerpt || post.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold/10 flex items-center justify-between text-xs">
                  <span className="text-cream/60 truncate max-w-[140px] font-medium">{post.author}</span>
                  <span className="font-bold text-gold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Đọc Tiếp →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
