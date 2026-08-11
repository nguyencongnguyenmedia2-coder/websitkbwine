'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  ArrowRight,
  Award,
  Wine,
  Thermometer,
  Sparkles,
  Utensils,
  Clock,
  Zap,
  CheckCircle2,
} from 'lucide-react';
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
  const router = useRouter();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
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

  const handleBuyNow = () => {
    addItem(product, quantity);
    onClose();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#0F0E13] rounded-3xl border border-gold/30 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto text-cream"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#1A1824] text-cream/70 hover:text-gold border border-gold/30 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#181622] border border-gold/20 shadow-wine-glow">
                <Image
                  src={product.images[selectedImgIdx] || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full bg-wine text-gold-light text-xs font-extrabold border border-gold/40 shadow-wine-glow">
                    -{discount}% OFF
                  </span>
                )}
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-dark/85 text-gold text-[10px] font-bold border border-gold/20 backdrop-blur-md">
                  15°C Cold Storage Vault
                </span>
              </div>

              {/* Thumbnails list */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#181622] ${
                        selectedImgIdx === idx
                          ? 'border-gold shadow-gold-glow scale-105'
                          : 'border-gold/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Storage & Quality Seals */}
              <div className="p-3.5 rounded-xl bg-[#16141D] border border-gold/15 space-y-2 text-xs text-cream/80">
                <div className="flex items-center gap-2 text-gold-light font-medium">
                  <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Cam kết 100% Chính Hãng (Đền 200% nếu giả)</span>
                </div>
                <div className="flex items-center gap-2 text-cream/70">
                  <Truck className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Giao hỏa tốc xe lạnh trong 2 giờ tại HCM & HN</span>
                </div>
              </div>
            </div>

            {/* Right: Detailed Wine Specifications & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                
                {/* Brand & Vintage Tag Header */}
                <div className="flex items-center gap-2 text-xs font-extrabold text-gold uppercase tracking-wider">
                  <span className="px-2.5 py-0.5 rounded bg-gold/15 border border-gold/30">{product.brand}</span>
                  <span>•</span>
                  <span>{product.country}</span>
                  <span>•</span>
                  <span>Niên vụ {product.vintage}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-gold-light font-extrabold leading-tight">
                  {product.name}
                </h2>

                {/* Rating, SKU & Stock info */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-cream">{product.ratingAvg}</span>
                    <span className="text-cream/50">({product.ratingCount} đánh giá)</span>
                  </div>
                  <span className="text-cream/30">|</span>
                  <span className="text-cream/70">SKU: <strong className="text-gold">{product.sku}</strong></span>
                  <span className="text-cream/30">|</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                    Còn hàng ({product.stock} chai)
                  </span>
                </div>

                {/* Price Box */}
                <div className="p-4 rounded-2xl bg-[#16141D] border border-gold/25 flex items-baseline gap-4 shadow-sm">
                  <span className="font-serif text-3xl font-extrabold text-gold-light">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-cream/40 line-through font-medium">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                  <span className="text-xs text-cream/60 ml-auto font-medium">
                    Đã bao gồm thuế VAT
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-cream/80 leading-relaxed font-sans">
                  {product.shortDescription || product.description}
                </p>

                {/* Rich Sommelier Wine Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-[#16141D] border border-gold/15 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#1F1C28] border border-gold/10">
                    <span className="text-gold/70 block text-[10px] font-bold uppercase tracking-wider">Giống Nho</span>
                    <strong className="text-cream truncate block mt-0.5">{product.grape.split(',')[0]}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1F1C28] border border-gold/10">
                    <span className="text-gold/70 block text-[10px] font-bold uppercase tracking-wider">Phục Vụ</span>
                    <strong className="text-cream truncate block mt-0.5">{product.servingTemp}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1F1C28] border border-gold/10">
                    <span className="text-gold/70 block text-[10px] font-bold uppercase tracking-wider">Nồng Độ</span>
                    <strong className="text-cream truncate block mt-0.5">{product.alcoholPct}% Vol</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1F1C28] border border-gold/10">
                    <span className="text-gold/70 block text-[10px] font-bold uppercase tracking-wider">Tiềm Năng Ủ</span>
                    <strong className="text-cream truncate block mt-0.5">{product.agingPotential || '15+ năm'}</strong>
                  </div>
                </div>

                {/* Wine Notes & Food Pairing Details */}
                <div className="space-y-2 text-xs">
                  {product.wineNotes && (
                    <div className="p-3 rounded-xl bg-[#181622] border border-gold/15">
                      <strong className="text-gold-light flex items-center gap-1.5 font-bold mb-1">
                        <Wine className="w-3.5 h-3.5 text-gold" /> Ghi Chú Hương Vị Sommelier:
                      </strong>
                      <p className="text-cream/80 leading-relaxed text-[11px]">{product.wineNotes}</p>
                    </div>
                  )}

                  {product.foodPairing && (
                    <div className="p-3 rounded-xl bg-[#181622] border border-gold/15">
                      <strong className="text-gold-light flex items-center gap-1.5 font-bold mb-1">
                        <Utensils className="w-3.5 h-3.5 text-gold" /> Món Ăn Kết Hợp Lý Tưởng:
                      </strong>
                      <p className="text-cream/80 leading-relaxed text-[11px]">{product.foodPairing}</p>
                    </div>
                  )}
                </div>

                {/* Quantity Controls & Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-cream/80 font-bold">Số lượng chai:</span>
                    <div className="flex items-center rounded-xl bg-[#181622] border border-gold/30 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-cream hover:bg-gold/20 transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gold-light">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-cream hover:bg-gold/20 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 px-5 rounded-xl bg-burgundy hover:bg-burgundy-light border border-gold/40 text-gold-light font-bold text-xs shadow-wine-glow transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-gold" />
                      <span>THÊM VÀO GIỎ HÀNG</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="flex-1 py-3.5 px-5 rounded-xl bg-gold-gradient text-dark font-extrabold text-xs shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-dark fill-dark" />
                      <span>MUA NGAY - GIAO 2H</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleWishlist(product);
                        addToast({
                          type: 'info',
                          title: inWishlist ? 'Đã xóa khỏi Yêu thích' : 'Đã thêm vào Yêu thích',
                        });
                      }}
                      className={`p-3 rounded-xl border transition-all ${
                        inWishlist
                          ? 'bg-wine/30 border-wine text-rose-400'
                          : 'bg-[#181622] border-gold/20 text-cream/70 hover:text-gold'
                      }`}
                      title="Danh sách yêu thích"
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-400' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* View full page link */}
              <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                <span className="text-[11px] text-cream/50">Mã kho: KBWINE-VAULT-{product.id}</span>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-bold text-gold hover:text-gold-light flex items-center gap-1 transition-colors underline underline-offset-4"
                >
                  <span>Xem Trang Chi Tiết Đầy Đủ</span>
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

