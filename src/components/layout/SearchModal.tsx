'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, TrendingUp, History, Wine, ArrowRight, Star } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/lib/utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Château Lafite',
    'Dom Pérignon',
    'Barolo',
    'Vang Pháp 2018',
  ]);
  const { products } = useAdminStore();

  const popularSearches = [
    'Cabernet Sauvignon',
    'Opus One',
    'Champagne Brut',
    'Almaviva',
    'Penfolds Grange',
    'Sassicaia',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.grape.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-3xl bg-[#0F0E13] rounded-2xl border border-gold/30 shadow-2xl overflow-hidden"
        >
          {/* Header search bar */}
          <div className="relative p-4 sm:p-6 border-b border-gold/15 flex items-center gap-3">
            <Search className="w-6 h-6 text-gold flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên rượu, giống nho, nhà làm vang, quốc gia, SKU..."
              className="w-full bg-transparent text-cream placeholder-cream/40 text-base sm:text-lg focus:outline-none font-sans"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-cream/50 hover:text-cream transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-dark-card text-cream/70 hover:text-gold transition-colors text-xs font-medium border border-gold/10"
            >
              Đóng (ESC)
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-light mb-3">
                      <History className="w-4 h-4 text-gold" />
                      <span>Tìm Kiếm Gần Đây</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectSearch(term)}
                          className="px-3 py-1.5 rounded-lg bg-dark-surface/80 hover:bg-gold/15 border border-cream/10 text-xs text-cream/80 hover:text-gold transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-light mb-3">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    <span>Từ Khóa Phổ Biến</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSearch(term)}
                        className="px-3.5 py-1.5 rounded-lg bg-burgundy/30 hover:bg-burgundy border border-gold/20 text-xs text-gold-light transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured suggestions */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-light mb-3">
                    Gợi Ý Nổi Bật Dành Cho Bạn
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.slice(0, 4).map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-surface/50 border border-cream/5 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                      >
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-dark-card flex-shrink-0">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="text-xs font-serif font-medium text-cream group-hover:text-gold transition-colors truncate">
                            {p.name}
                          </h5>
                          <span className="text-[11px] text-cream/50">{p.brand} • {p.country}</span>
                          <p className="text-xs font-semibold text-gold-light mt-0.5">
                            {formatCurrency(p.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-cream/60 mb-4">
                  <span>Tìm thấy <strong className="text-gold">{filteredProducts.length}</strong> kết quả phù hợp</span>
                  {filteredProducts.length > 0 && (
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-gold hover:underline flex items-center gap-1"
                    >
                      Xem tất cả kết quả <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="space-y-3">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl bg-dark-surface/70 border border-gold/10 hover:border-gold/40 hover:bg-gold/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-dark-card flex-shrink-0">
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                              {p.categoryName} • {p.vintage}
                            </span>
                            <h4 className="text-sm font-serif font-semibold text-cream group-hover:text-gold transition-colors">
                              {p.name}
                            </h4>
                            <p className="text-xs text-cream/60">
                              {p.brand} | {p.country} | Giống nho: {p.grape}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-gold-light block">
                            {formatCurrency(p.price)}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-amber-400 justify-end mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{p.ratingAvg}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Wine className="w-12 h-12 text-gold/30 mx-auto mb-3" />
                    <h4 className="font-serif text-lg text-cream mb-1">Không Tìm Thấy Kết Quả Phù Hợp</h4>
                    <p className="text-xs text-cream/60 mb-6">
                      Thử tìm kiếm từ khóa khác hoặc tham khảo các dòng rượu vang bán chạy của chúng tôi.
                    </p>

                    <h5 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                      Sản Phẩm Được Đề Xuất
                    </h5>
                    <div className="grid grid-cols-2 gap-3 text-left">
                      {products.slice(0, 2).map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={onClose}
                          className="p-3 rounded-xl bg-dark-card border border-gold/15 hover:border-gold transition-all"
                        >
                          <h6 className="text-xs font-serif font-semibold text-gold-light truncate">{p.name}</h6>
                          <span className="text-[11px] text-cream/60">{formatCurrency(p.price)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
