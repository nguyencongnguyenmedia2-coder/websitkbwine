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
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency, calculateDiscountPct } from '@/lib/utils/format';
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Wine,
  Thermometer,
  Sparkles,
  Utensils,
  Award,
  Plus,
  Minus,
  MessageSquare,
} from 'lucide-react';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { products, reviews, addReview } = useAdminStore();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  const product = products.find((p) => p.slug === slug) || products[0];
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'notes' | 'reviews'>('desc');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // New Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscountPct(product.price, product.comparePrice);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.country === product.country))
    .slice(0, 4);

  const fbtProducts = products
    .filter((p) => p.id !== product.id && p.category === 'champagne')
    .slice(0, 1);

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng!',
      description: `Đã thêm ${quantity} x "${product.name}" vào giỏ hàng của bạn.`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Đã sao chép liên kết!',
        description: 'Đường dẫn sản phẩm đã được lưu vào khay nhớ tạm.',
      });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) {
      addToast({
        type: 'error',
        title: 'Thông tin chưa đầy đủ',
        description: 'Vui lòng nhập tên và nhận xét của bạn.',
      });
      return;
    }
    addReview({
      productId: product.id,
      authorName: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      isVerifiedPurchase: true,
      status: 'approved',
    });
    addToast({
      type: 'success',
      title: 'Đánh giá đã gửi thành công!',
      description: 'Cảm ơn bạn đã chia sẻ trải nghiệm thưởng thức rượu vang.',
    });
    setReviewerName('');
    setReviewComment('');
  };

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-dark-surface border-b border-gold/15 py-4 px-4 sm:px-6 lg:px-8 text-xs text-cream/60">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-gold transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold transition-colors">Sản phẩm</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-gold transition-colors">{product.categoryName}</Link>
          <span>/</span>
          <span className="text-gold-light truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upper Grid: Gallery & Main Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Gallery Image Display */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-gold/30 shadow-luxury bg-dark-card">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-wine text-gold-light text-xs font-extrabold border border-gold/40 shadow-wine-glow">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-dark-card ${
                      selectedImageIndex === idx ? 'border-gold shadow-gold-glow scale-105' : 'border-gold/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details & Buy Actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-widest">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.country}</span>
                <span>•</span>
                <span>Niên Vụ {product.vintage}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-gold-light font-extrabold leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400">
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

              {/* Price block */}
              <div className="p-4 rounded-xl bg-dark-surface border border-gold/20 flex items-baseline gap-4">
                <span className="font-serif text-3xl font-extrabold text-gold-light">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-cream/40 line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
                <span className="text-xs text-cream/60 ml-auto">
                  Đã bao gồm thuế VAT
                </span>
              </div>

              <p className="text-sm text-cream/80 leading-relaxed font-sans">
                {product.shortDescription || product.description}
              </p>

              {/* Specs Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-gold/15 text-xs">
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-gold" />
                  <div>
                    <span className="text-cream/50 block text-[10px]">Giống Nho</span>
                    <strong className="text-cream truncate block">{product.grape.split(',')[0]}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-gold" />
                  <div>
                    <span className="text-cream/50 block text-[10px]">Nhiệt Độ</span>
                    <strong className="text-cream">{product.servingTemp}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  <div>
                    <span className="text-cream/50 block text-[10px]">Nồng Độ</span>
                    <strong className="text-cream">{product.alcoholPct}% Vol</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <div>
                    <span className="text-cream/50 block text-[10px]">Lưu Trữ</span>
                    <strong className="text-cream">{product.agingPotential || '15+ năm'}</strong>
                  </div>
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-cream/80 font-bold">Số lượng:</span>
                  <div className="flex items-center rounded-xl bg-dark-card border border-gold/30 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-cream hover:bg-gold/20 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-gold-light">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-cream hover:bg-gold/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 px-6 rounded-xl bg-burgundy hover:bg-burgundy-light border border-gold/40 text-gold-light font-bold text-sm shadow-wine-glow transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5 text-gold" />
                    <span>THÊM VÀO GIỎ HÀNG</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 px-6 rounded-xl bg-gold-gradient text-dark font-extrabold text-sm shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <span>MUA NGAY - GIAO 2H</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs pt-2">
                  <button
                    onClick={() => {
                      toggleWishlist(product);
                      addToast({
                        type: 'info',
                        title: inWishlist ? 'Đã xóa khỏi Wishlist' : 'Đã thêm vào Wishlist',
                      });
                    }}
                    className={`flex items-center gap-1.5 transition-colors ${
                      inWishlist ? 'text-rose-400 font-bold' : 'text-cream/70 hover:text-gold'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-400' : ''}`} />
                    <span>{inWishlist ? 'Đã yêu thích' : 'Thêm vào yêu thích'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-cream/70 hover:text-gold transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Chia sẻ chai vang này</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Policies */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-dark-card border border-gold/15 text-xs text-cream/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Giao hàng bảo quản lạnh 2H</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Hoàn tiền 200% nếu phát hiện hàng giả</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="glass-panel rounded-2xl border border-gold/20 p-6 sm:p-8 mb-16 shadow-luxury">
          <div className="flex items-center gap-4 border-b border-gold/15 pb-4 mb-6 overflow-x-auto">
            {[
              { id: 'desc', label: 'Mô Tả Sản Phẩm' },
              { id: 'specs', label: 'Thông Số Kỹ Thuật' },
              { id: 'notes', label: 'Ghi Chú Hương Vị & Pairing' },
              { id: 'reviews', label: `Đánh Giá Từ Khách Hàng (${productReviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow'
                    : 'text-cream/70 hover:text-gold'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6 text-sm text-cream/80 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-gold-light">
                  Về {product.name}
                </h3>
                <p>{product.description}</p>
                <p>
                  Điền trang {product.brand} tọa lạc tại {product.region}, {product.country}. Với hơn hai thế kỷ lưu giữ kỹ nghệ làm vang gia truyền, các trái nho được thu hoạch hoàn toàn bằng tay ở thời điểm đạt độ chín tối ưu nhất.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Tên thương hiệu:</span>
                  <strong className="text-gold-light">{product.brand}</strong>
                </div>
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Quốc gia:</span>
                  <strong className="text-gold-light">{product.country}</strong>
                </div>
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Vùng nho (Region):</span>
                  <strong className="text-gold-light">{product.region}</strong>
                </div>
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Niên vụ (Vintage):</span>
                  <strong className="text-gold-light">{product.vintage}</strong>
                </div>
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Giống nho:</span>
                  <strong className="text-gold-light">{product.grape}</strong>
                </div>
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Nồng độ cồn:</span>
                  <strong className="text-gold-light">{product.alcoholPct}% Vol</strong>
                </div>
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Dung tích chuẩn:</span>
                  <strong className="text-gold-light">{product.volumeMl} ml</strong>
                </div>
                <div className="p-3 bg-dark-card rounded-xl border border-gold/10 flex justify-between">
                  <span className="text-cream/60">Mã SKU:</span>
                  <strong className="text-gold-light">{product.sku}</strong>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-burgundy/40 to-dark-card border border-gold/30 space-y-3">
                  <h4 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2">
                    <Wine className="w-5 h-5 text-gold" /> Ghi Chú Hương Vị Từ Sommelier Quốc Tế
                  </h4>
                  <p className="text-sm leading-relaxed text-cream/90">{product.wineNotes}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gold/15 text-xs">
                    <div className="p-2.5 rounded-xl bg-dark/60 border border-gold/10">
                      <span className="text-gold/70 block text-[10px] uppercase font-bold">Thân Vị (Body)</span>
                      <strong className="text-gold-light">Đậm Đà (Full-Bodied)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-dark/60 border border-gold/10">
                      <span className="text-gold/70 block text-[10px] uppercase font-bold">Tannin (Độ Chát)</span>
                      <strong className="text-gold-light">Mượt Như Nhung</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-dark/60 border border-gold/10">
                      <span className="text-gold/70 block text-[10px] uppercase font-bold">Hậu Vị (Finish)</span>
                      <strong className="text-gold-light">Kéo Dài 45s+</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-dark/60 border border-gold/10">
                      <span className="text-gold/70 block text-[10px] uppercase font-bold">Thùng Ủ (Oak)</span>
                      <strong className="text-gold-light">18 - 24 Tháng Sồi Pháp</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-dark-card border border-gold/20 space-y-2">
                    <h4 className="font-serif text-base font-bold text-gold-light flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-gold" /> Món Ăn Kết Hợp Lý Tưởng (Food Pairing)
                    </h4>
                    <p className="text-xs text-cream/80 leading-relaxed">{product.foodPairing}</p>
                    <div className="pt-2 text-[11px] text-gold/80 italic">
                      💡 Mẹo Sommelier: Kết hợp cùng các món thịt đỏ có tỷ lệ vân mỡ cao giúp làm mềm cấu trúc tanin của vang.
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-dark-card border border-gold/20 space-y-2">
                    <h4 className="font-serif text-base font-bold text-gold-light flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-gold" /> Thở Vang & Nhiệt Độ Phục Vụ
                    </h4>
                    <p className="text-xs text-cream/80 leading-relaxed font-bold">
                      Nhiệt độ thích hợp: {product.servingTemp}
                    </p>
                    <p className="text-xs text-cream/70 leading-relaxed">
                      Khuyến nghị rót ra bình Decanter lắc nhẹ và thở trong khoảng 60 - 90 phút trước khi thưởng thức để các tầng hương mở bung tối đa.
                    </p>
                  </div>
                </div>

                {/* AI Sommelier Consultation Card */}
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-gold animate-pulse" />
                    <div>
                      <h5 className="font-serif text-sm font-bold text-gold-light">Bạn cần chọn thực đơn tiệc cao cấp đi cùng chai vang này?</h5>
                      <p className="text-xs text-cream/70">Hỏi ngay Trợ lý AI Sommelier để được tư vấn lộ trình kết hợp theo chuẩn 5 sao.</p>
                    </div>
                  </div>
                  <Link
                    href="/ai-assistant"
                    className="px-4 py-2 rounded-xl bg-gold text-dark font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-transform whitespace-nowrap"
                  >
                    Tư Vấn AI Sommelier
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Reviews List */}
                <div className="space-y-4">
                  {productReviews.length > 0 ? (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl bg-dark-card border border-gold/15 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-gold-light font-serif">{rev.authorName}</strong>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-cream/80">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-cream/50 italic">Chưa có đánh giá nào cho sản phẩm này. Hãy trở thành người đầu tiên đánh giá!</p>
                  )}
                </div>

                {/* Add Review Form */}
                <div className="p-6 rounded-xl bg-dark-surface border border-gold/20 space-y-4">
                  <h4 className="font-serif text-base font-bold text-gold-light">Viết Đánh Giá Của Bạn</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-cream/70 block mb-1">Họ & Tên của bạn:</label>
                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-cream/70 block mb-1">Đánh giá số sao:</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                        >
                          <option value={5}>5 sao (Rất Tuyệt Vời)</option>
                          <option value={4}>4 sao (Hài Lòng)</option>
                          <option value={3}>3 sao (Bình Thường)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-cream/70 block mb-1">Nội dung nhận xét:</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                        placeholder="Chia sẻ cảm nhận về hương vị, bao bì và dịch vụ giao hàng..."
                        className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-wine-gradient text-gold-light text-xs font-bold border border-gold/40 hover:border-gold shadow-wine-glow"
                    >
                      Gửi Đánh Giá
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-gold-light font-bold">
              Có Thể Bạn Cũng Thích
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={(prod) => setQuickViewProduct(prod)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <Footer />
      <FloatingActions />
    </main>
  );
}
