'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency } from '@/lib/utils/format';
import { Heart, ShoppingBag, Trash2, ArrowRight, Wine } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const handleMoveToCart = (product: any) => {
    addItem(product, 1);
    removeItem(product.id);
    addToast({
      type: 'success',
      title: 'Đã chuyển vào giỏ hàng!',
      description: `Đã chuyển "${product.name}" vào giỏ hàng của bạn.`,
    });
  };

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-burgundy border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-extrabold text-gold-light">Danh Sách Yêu Thích</h1>
              <p className="text-xs text-cream/60">Những chai rượu vang bạn quan tâm và muốn sở hữu trong tương lai</p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-cream/50 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl glass-panel border border-gold/20 hover:border-gold/50 shadow-luxury flex flex-col justify-between space-y-4"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-dark-card border border-gold/15">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-dark/80 text-cream/60 hover:text-red-400 border border-white/10 transition-colors"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                    {product.brand} • {product.country}
                  </span>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-serif text-base font-bold text-cream hover:text-gold transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="font-serif text-lg font-bold text-gold-light block">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                    <span>Chuyển Vào Giỏ Hàng</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-panel rounded-2xl border border-gold/20 max-w-xl mx-auto space-y-4">
            <Wine className="w-16 h-16 text-gold/30 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-cream">Chưa Có Sản Phẩm Yêu Thích</h2>
            <p className="text-xs text-cream/60">
              Nhấn vào biểu tượng trái tim ở các sản phẩm rượu vang bạn yêu thích để lưu trữ tại đây.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow"
            >
              <span>KHÁM PHÁ RƯỢU VANG</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        )}
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
