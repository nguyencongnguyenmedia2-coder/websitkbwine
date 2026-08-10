'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Star, Flame, Award, Shield } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, calculateDiscountPct } from '@/lib/utils/format';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscountPct(product.price, product.comparePrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    addToast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng!',
      description: `Đã thêm "${product.name}" vào giỏ hàng của bạn.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast({
      type: 'info',
      title: inWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích',
    });
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl glass-panel border border-gold/20 hover:border-gold/50 shadow-luxury overflow-hidden flex flex-col justify-between transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-dark-card">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-wine text-gold-light text-[11px] font-extrabold shadow-wine-glow border border-gold/30">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 rounded-full bg-gold/20 backdrop-blur-md text-gold-light text-[10px] font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1">
              <Award className="w-3 h-3 text-gold" /> Iconic
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-burgundy/90 backdrop-blur-md text-cream text-[10px] font-bold uppercase tracking-wider border border-gold/20 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Bán Chạy
            </span>
          )}
        </div>

        {/* Quick action buttons on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleToggleWishlist}
            className={`p-2.5 rounded-full backdrop-blur-xl border transition-all ${
              inWishlist
                ? 'bg-wine border-gold/40 text-rose-400 shadow-wine-glow'
                : 'bg-dark/70 border-white/10 text-cream/80 hover:text-gold hover:border-gold'
            }`}
            title={inWishlist ? 'Xóa khỏi Yêu thích' : 'Thêm vào Yêu thích'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-400' : ''}`} />
          </button>
          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="p-2.5 rounded-full bg-dark/70 backdrop-blur-xl border border-white/10 text-cream/80 hover:text-gold hover:border-gold transition-all"
              title="Xem Nhanh Sản Phẩm"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3 font-sans">
        <div>
          {/* Country & Region & Vintage */}
          <div className="flex items-center justify-between text-[11px] text-cream/50 mb-1">
            <span className="truncate">{product.country} • {product.region}</span>
            <span className="font-semibold text-gold/80">{product.vintage}</span>
          </div>

          {/* Brand */}
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-1">
            {product.brand}
          </span>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-cream group-hover:text-gold transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating & Volume */}
        <div className="flex items-center justify-between text-xs text-cream/60 pt-1 border-t border-gold/10">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold text-cream text-xs">{product.ratingAvg}</span>
            <span className="text-[10px] text-cream/40">({product.ratingCount})</span>
          </div>
          <span className="text-[11px] text-cream/50">{product.volumeMl}ml • {product.alcoholPct}% Vol</span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <span className="font-serif text-base font-bold text-gold-light block">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-cream/40 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2.5 rounded-xl bg-wine-gradient text-gold-light text-xs font-bold border border-gold/40 hover:border-gold hover:shadow-wine-glow transition-all flex items-center gap-1.5 active:scale-95"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Thêm Giỏ</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
