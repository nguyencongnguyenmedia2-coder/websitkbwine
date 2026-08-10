'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, ArrowRight, Award } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, calculateDiscountPct } from '@/lib/utils/format';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscountPct(product.price, product.comparePrice);

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng!',
      description: `Đã thêm ${quantity} x "${product.name}" vào giỏ hàng của bạn.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl glass-panel rounded-2xl border border-gold/30 shadow-luxury overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark/80 text-cream/70 hover:text-gold border border-gold/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Product Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-dark-card border border-gold/15">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-wine text-gold-light text-xs font-bold border border-gold/30">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gold uppercase tracking-wider font-semibold mb-1">
                  <span>{product.brand}</span>
                  <span>•</span>
                  <span>{product.country}</span>
                  <span>•</span>
                  <span>{product.vintage}</span>
                </div>

                <h2 className="font-serif text-2xl text-cream font-bold mb-2">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 text-xs mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-cream">{product.ratingAvg}</span>
                  </div>
                  <span className="text-cream/40">({product.ratingCount} đánh giá)</span>
                  <span className="text-cream/40">|</span>
                  <span className="text-cream/70">SKU: {product.sku}</span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-serif text-2xl font-bold text-gold-light">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-cream/40 line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-cream/75 leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>

                {/* Specs quick list */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-dark-surface/60 p-3 rounded-xl border border-cream/5 mb-6">
                  <div><strong className="text-gold-light">Giống nho:</strong> {product.grape}</div>
                  <div><strong className="text-gold-light">Dung tích:</strong> {product.volumeMl}ml</div>
                  <div><strong className="text-gold-light">Nồng độ:</strong> {product.alcoholPct}% Vol</div>
                  <div><strong className="text-gold-light">Vùng nho:</strong> {product.region}</div>
                </div>

                {/* Quantity Controls & Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-cream/80 font-medium">Số lượng:</span>
                    <div className="flex items-center rounded-xl bg-dark-card border border-gold/20 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-cream hover:bg-gold/15 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gold-light">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-cream hover:bg-gold/15 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-wine-gradient text-gold-light font-bold text-sm border border-gold/40 hover:border-gold hover:shadow-wine-glow transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-gold" />
                      <span>Thêm Vào Giỏ Hàng</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleWishlist(product);
                        addToast({
                          type: 'info',
                          title: inWishlist ? 'Đã xóa khỏi Wishlist' : 'Đã thêm vào Wishlist',
                        });
                      }}
                      className={`p-3.5 rounded-xl border transition-all ${
                        inWishlist
                          ? 'bg-wine/30 border-wine text-rose-400'
                          : 'bg-dark-card border-gold/20 text-cream/70 hover:text-gold'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-400' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* View detail page link */}
              <div className="pt-4 border-t border-gold/10 flex justify-end">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-gold hover:text-gold-light flex items-center gap-1 transition-colors"
                >
                  <span>Xem Chi Tiết Đầy Đủ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
