'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useAdminStore } from '@/store/useAdminStore';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency } from '@/lib/utils/format';
import { Sparkles, Wine, Utensils, DollarSign, Calendar, Flame, ShoppingBag, ArrowRight, Bot } from 'lucide-react';
import { Product } from '@/types';

export default function AIAssistantPage() {
  const { products } = useAdminStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const [food, setFood] = useState('steak');
  const [budget, setBudget] = useState('medium'); // low, medium, high, ultra
  const [occasion, setOccasion] = useState('romantic');
  const [taste, setTaste] = useState('bold');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{ product: Product; reason: string }>>([]);

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setRecommendations([]);

    setTimeout(() => {
      let filtered = [...products];

      // Filter budget
      if (budget === 'low') {
        filtered = filtered.filter((p) => p.price <= 2000000);
      } else if (budget === 'medium') {
        filtered = filtered.filter((p) => p.price > 2000000 && p.price <= 6000000);
      } else if (budget === 'high') {
        filtered = filtered.filter((p) => p.price > 6000000 && p.price <= 18000000);
      } else if (budget === 'ultra') {
        filtered = filtered.filter((p) => p.price > 18000000);
      }

      if (filtered.length === 0) {
        filtered = products.slice(0, 4);
      }

      const results = filtered.slice(0, 3).map((product, idx) => {
        let reason = '';
        if (food === 'steak') {
          reason = `Cấu trúc tanin đậm đà của ${product.grape} hòa tan vị béo ngậy của bò Wagyu/Ribeye, hậu vị kéo dài nồng nàn sô cô la và gỗ sồi.`;
        } else if (food === 'seafood') {
          reason = `Axit thanh tịnh sống động cuốn phăng vị tanh của hải sản tươi sống, bùng nổ hương citrus tươi mát.`;
        } else if (food === 'cheese') {
          reason = `Hương anh đào đỏ chín mọng và thảo mộc khô Ý quyện hòa tuyệt đối cùng vị béo bùi của phô mai lâu năm.`;
        } else {
          reason = `Sự cân bằng vị giác hoàn hảo giữa hoa quả mọng chín và khoáng chất quý phái tôn vinh khoảnh khắc đại tiệc.`;
        }
        return { product, reason };
      });

      setRecommendations(results);
      setIsAnalyzing(false);
      addToast({
        type: 'success',
        title: 'Sommelier AI đã hoàn tất phân tích!',
        description: `Đã tìm thấy ${results.length} chai vang hoàn hảo cho thực đơn của bạn.`,
      });
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Banner header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy-deep border border-gold/40 text-gold-light text-xs font-bold uppercase tracking-widest shadow-gold-glow">
            <Bot className="w-4 h-4 text-gold" />
            <span>WINECELLAR PRO AI SOMMELIER</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gold-light">
            Trợ Lý AI Tư Vấn Rượu Vang
          </h1>
          <p className="text-sm text-cream/70">
            Nhập thực đơn, ngân sách và dịp đặc biệt. AI Sommelier của chúng tôi sẽ đề xuất những chai vang tinh tế nhất được cá nhân hóa cho bạn.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl glass-panel border border-gold/30 shadow-luxury mb-16 space-y-6">
          <form onSubmit={handleRecommend} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Food Selection */}
              <div>
                <label className="text-xs font-bold text-gold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4" /> Món Ăn Chính (Food Pairing)
                </label>
                <select
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card border border-gold/20 text-xs text-cream focus:outline-none focus:border-gold font-medium"
                >
                  <option value="steak">Steak Bò Bít Tết (Ribeye, Tomahawk, Wagyu)</option>
                  <option value="seafood">Hải Sản & Hàu Tươi (Tôm hùm, Cá hồi)</option>
                  <option value="cheese">Phô Mai & Đùi Heo Muối Ibérico</option>
                  <option value="pasta">Mỳ Ý & Đồ Ăn Âu (Bolognese, Carbonara)</option>
                  <option value="bbq">Sườn Nướng BBQ & Thịt Cừu Đút Lò</option>
                </select>
              </div>

              {/* Budget Selection */}
              <div>
                <label className="text-xs font-bold text-gold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> Hạn Mức Ngân Sách
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card border border-gold/20 text-xs text-cream focus:outline-none focus:border-gold font-medium"
                >
                  <option value="low">Dưới 2.000.000₫ (Standard Fine Wine)</option>
                  <option value="medium">2.000.000₫ - 6.000.000₫ (Premium Reserve)</option>
                  <option value="high">6.000.000₫ - 18.000.000₫ (Grand Cru Classé)</option>
                  <option value="ultra">Trên 18.000.000₫ (Icon Collector Wine)</option>
                </select>
              </div>

              {/* Occasion Selection */}
              <div>
                <label className="text-xs font-bold text-gold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Dịp Thưởng Thức
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card border border-gold/20 text-xs text-cream focus:outline-none focus:border-gold font-medium"
                >
                  <option value="romantic">Tiệc Tối Lãng Mạn (Candlelight Dinner)</option>
                  <option value="corporate">Quà Tặng / Biếu Tặng Đối Tác VIP</option>
                  <option value="wedding">Tiệc Cưới & Kỷ Niệm Ngày Cưới</option>
                  <option value="party">Tiệc Sinh Nhật & Gặp Mặt Bạn Bè</option>
                </select>
              </div>

              {/* Taste Selection */}
              <div>
                <label className="text-xs font-bold text-gold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Wine className="w-4 h-4" /> Khẩu Vị Ưu Thích
                </label>
                <select
                  value={taste}
                  onChange={(e) => setTaste(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-card border border-gold/20 text-xs text-cream focus:outline-none focus:border-gold font-medium"
                >
                  <option value="bold">Vang Đỏ Đậm Đà (Full-Bodied Red)</option>
                  <option value="fresh">Vang Trắng Tươi Mát Thanh Khiết (Crisp White)</option>
                  <option value="sparkling">Vang Sủi Bọt Rộn Ràng (Sparkling / Champagne)</option>
                  <option value="sweet">Vang Ngọt Quý Tộc Sauternes (Sweet Dessert Wine)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-4 rounded-xl bg-wine-gradient text-gold-light font-bold text-sm tracking-wider uppercase border border-gold/50 hover:border-gold hover:shadow-wine-glow transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold animate-spin" />
                  Sommelier AI Đang Phân Tích Thực Đơn & Hương Vị...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>AI ĐỀ XUẤT RƯỢU VANG PHÙ HỢP</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Recommendation Results Showcase */}
        {recommendations.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Kết Quả Đề Xuất Trí Tuệ Nhân Tạo</span>
              <h2 className="font-serif text-3xl font-extrabold text-gold-light">Top Chai Vang Hoàn Hảo Cho Bạn</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {recommendations.map(({ product, reason }, idx) => (
                <div
                  key={product.id}
                  className="p-6 rounded-3xl glass-panel border border-gold/30 shadow-luxury flex flex-col justify-between space-y-6 relative overflow-hidden group"
                >
                  <span className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-wine text-gold-light font-serif font-bold text-xs flex items-center justify-center border border-gold/40">
                    #{idx + 1}
                  </span>

                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-dark-card border border-gold/15">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                      {product.brand} • {product.vintage}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-cream line-clamp-1">{product.name}</h3>
                    <span className="font-serif text-xl font-bold text-gold-light block">{formatCurrency(product.price)}</span>

                    <div className="p-4 rounded-xl bg-burgundy/30 border border-gold/20 text-xs text-cream/80 leading-relaxed italic">
                      💡 <strong>Lý do đề xuất:</strong> {reason}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        addItem(product, 1);
                        addToast({
                          type: 'success',
                          title: 'Đã thêm vào giỏ hàng!',
                          description: `Đã thêm "${product.name}" vào giỏ hàng.`,
                        });
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4 text-gold" />
                      <span>THÊM VÀO GIỎ</span>
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="py-3 px-4 rounded-xl bg-dark-card border border-gold/20 text-cream hover:text-gold text-xs font-bold flex items-center justify-center"
                    >
                      <span>XEM SẢN PHẨM</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
