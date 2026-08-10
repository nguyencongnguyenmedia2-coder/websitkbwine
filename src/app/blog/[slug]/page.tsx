'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useAdminStore } from '@/store/useAdminStore';
import { formatDate } from '@/lib/utils/format';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { blogs } = useAdminStore();

  const post = blogs.find((b) => b.slug === slug) || blogs[0];

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Link href="/blog" className="text-xs font-bold text-gold hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách bài viết
        </Link>

        <div className="space-y-4">
          <span className="px-3 py-1 rounded-full bg-wine text-gold-light text-xs font-bold uppercase tracking-wider border border-gold/30">
            {post.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gold-light leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-cream/60 border-b border-gold/15 pb-4">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold" /> {formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gold" /> Tác giả: {post.author}</span>
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden glass-panel border border-gold/30 shadow-luxury">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
        </div>

        <div className="prose prose-invert max-w-none text-cream/80 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
          <p>{post.content}</p>
          <p>
            Rượu vang không đơn thuần là một thức uống có cồn, mà là biểu tượng của tinh hoa văn hóa, lịch sử và tâm huyết của những gia tộc làm vang danh tiếng qua nhiều thế kỷ.
          </p>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-6 border-t border-gold/15 text-xs">
            <Tag className="w-4 h-4 text-gold" />
            <span className="text-cream/60">Thẻ tag:</span>
            {post.tags.map((t, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-dark-card border border-gold/20 text-gold-light">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
