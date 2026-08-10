'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useAdminStore } from '@/store/useAdminStore';
import { formatDate } from '@/lib/utils/format';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogListPage() {
  const { blogs } = useAdminStore();

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="bg-dark-surface border-b border-gold/20 py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-gold flex items-center justify-center gap-1.5">
            <BookOpen className="w-4 h-4" /> WINECELLAR ACADEMY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gold-light">
            Cẩm Nang Kiến Thức Rượu Vang
          </h1>
          <p className="text-sm text-cream/70">
            Khám phá văn hóa rượu vang thế giới, bí quyết thử vang, quy tắc Decant và sự phối vị tinh tế cùng các Master Sommelier.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden glass-panel border border-gold/20 hover:border-gold/50 shadow-luxury flex flex-col justify-between transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-card">
                <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-burgundy/90 text-gold-light text-[11px] font-bold border border-gold/30">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-[11px] text-cream/50">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold" /> {formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-gold" /> {post.author}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-cream group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-cream/70 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>

                <span className="text-xs font-bold text-gold inline-flex items-center gap-1 pt-2 group-hover:translate-x-1 transition-transform">
                  Đọc Bài Viết →
                </span>
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
