'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import QuickViewModal from '../products/QuickViewModal';
import { useAdminStore } from '@/store/useAdminStore';
import { Product } from '@/types';

export default function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new'>('new');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { products } = useAdminStore();

  // Filter & sort logic to ensure newly added admin products automatically show up!
  const sortedNewest = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const featuredWines = products.filter((p) => p.isFeatured || p.isNewArrival).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller || p.ratingAvg >= 4.8).slice(0, 8);
  const newArrivals = sortedNewest.slice(0, 8);

  const currentProducts =
    activeTab === 'featured'
      ? featuredWines
      : activeTab === 'bestsellers'
      ? bestSellers
      : newArrivals;

  return (
    <section className="py-20 bg-dark-surface relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" /> Tuyển Chọn Đặc Biệt
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-gold-light font-bold">
              Những Chai Vang Thượng Hạng
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-dark-card border border-gold/20 self-start md:self-auto overflow-x-auto">
            {[
              { id: 'new', label: 'Mới Về', icon: Sparkles },
              { id: 'featured', label: 'Nổi Bật', icon: Award },
              { id: 'bestsellers', label: 'Bán Chạy', icon: Flame },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow'
                      : 'text-cream/70 hover:text-gold'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-dark-card border border-gold/30 text-gold-light font-bold text-sm hover:border-gold hover:shadow-gold-glow transition-all"
          >
            <span>Xem Tất Cả Sản Phẩm Rượu Vang ({products.length})</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
