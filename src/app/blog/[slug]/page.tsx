'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatDate } from '@/lib/utils/format';
import { Product } from '@/types';
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Wine,
  Sparkles,
  CheckCircle2,
  List,
} from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { blogs, products } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const post = blogs.find((b) => b.slug === slug) || blogs[0];

  // Embedded related products
  const relatedProducts = products.filter((p) => post.relatedProductIds?.includes(p.id));

  // Other related blog posts
  const otherPosts = blogs.filter((b) => b.id !== post.id).slice(0, 3);

  // Social Share
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Đã sao chép liên kết!',
        description: 'Đường dẫn bài viết đã được lưu vào khay nhớ tạm.',
      });
    }
  };

  // Structured Data (JSON-LD Article Schema)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    image: [post.thumbnail],
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorTitle || 'Master Sommelier',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KBWINE Luxury Wine Store',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://kbwine.vn/blog/${post.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-[#0F0E13] text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb Header */}
      <div className="bg-[#16141D] border-b border-gold/15 py-4 px-4 sm:px-6 lg:px-8 text-xs text-cream/60">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-gold transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-gold transition-colors">Cẩm nang Rượu vang</Link>
          <span>/</span>
          <span className="text-gold-light truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Category & Title Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-wine/90 text-gold-light text-xs font-extrabold border border-gold/40 shadow-wine-glow">
              {post.category}
            </span>
            {post.focusKeyword && (
              <span className="px-3 py-1 rounded-full bg-[#181622] text-gold text-xs font-bold border border-gold/20">
                SEO: {post.focusKeyword}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold-light leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-cream/80 leading-relaxed italic border-l-2 border-gold pl-4 py-1">
            {post.excerpt}
          </p>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-cream/60 border-y border-gold/15 py-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" /> {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold" /> {post.readTimeMinutes || 5} phút đọc
              </span>
              <span className="flex items-center gap-1.5 text-gold">
                <Eye className="w-4 h-4" /> {post.viewsCount || 1200} lượt xem
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181622] border border-gold/20 text-cream/80 hover:text-gold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>
              <button
                onClick={() => {
                  setIsSaved(!isSaved);
                  addToast({
                    type: 'info',
                    title: isSaved ? 'Đã bỏ lưu bài viết' : 'Đã lưu bài viết vào danh mục cá nhân!',
                  });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-gold text-dark border-gold font-bold'
                    : 'bg-[#181622] border-gold/20 text-cream/80 hover:text-gold'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Đã lưu' : 'Lưu bài'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-dark-card border border-gold/30 shadow-luxury">
          <Image src={post.thumbnail} alt={post.title} fill priority className="object-cover" />
        </div>

        {/* Author Sommelier Box */}
        <div className="p-4 rounded-2xl bg-[#16141D] border border-gold/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-burgundy/80 border border-gold/40 flex items-center justify-center text-gold font-bold font-serif shadow-gold-glow flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-gold-light flex items-center gap-1.5">
                <span>{post.author}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </h4>
              <p className="text-xs text-cream/60">{post.authorTitle || 'Chuyên Gia Sommelier KBWINE Boutique'}</p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-gold/80 italic font-serif">
            Kiểm duyệt chuyên môn Sommelier 5 sao
          </span>
        </div>

        {/* Article Body Content */}
        <div
          className="prose prose-invert max-w-none text-cream/85 text-sm sm:text-base leading-relaxed space-y-4 font-sans border-b border-gold/15 pb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Embedded Related Products Widget */}
        {relatedProducts.length > 0 && (
          <div className="p-6 rounded-3xl bg-[#16141D] border border-gold/30 space-y-6 shadow-luxury">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif text-xl font-bold text-gold-light flex items-center gap-2">
                <Wine className="w-5 h-5 text-gold" /> Tuyệt Tác Vang Được Nhắc Đến Trong Bài Viết
              </h3>
              <span className="text-xs text-gold/80">Nhập khẩu chính ngạch 100%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags list */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <Tag className="w-4 h-4 text-gold flex-shrink-0" />
            <span className="text-cream/60">Thẻ chủ đề:</span>
            {post.tags.map((t, idx) => (
              <Link
                key={idx}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className="px-3 py-1 rounded-full bg-[#181622] border border-gold/20 text-gold-light hover:border-gold transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {/* Other Related Blog Posts */}
        {otherPosts.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-gold/15">
            <h3 className="font-serif text-2xl text-gold-light font-bold">
              Bài Viết Cùng Chuyên Mục
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherPosts.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group rounded-2xl overflow-hidden bg-[#16141D] border border-gold/20 hover:border-gold/50 shadow-luxury transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-card">
                    <Image src={b.thumbnail} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-serif text-sm font-bold text-cream group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                      {b.title}
                    </h4>
                    <span className="text-[10px] text-cream/50 block">{formatDate(b.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <Footer />
      <FloatingActions />
    </main>
  );
}
