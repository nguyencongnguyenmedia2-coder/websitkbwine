'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, ArrowRight, Wine, Sparkles } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/lib/utils/format';

const PAIRINGS = [
  {
    id: 'steak',
    title: 'Steak & Beef (Bò Bít Tết)',
    desc: 'Thịt bò Wagyu, Tomahawk Ribeye nhiều vân mỡ cần tanin mạnh mẽ của Cabernet Sauvignon hoặc Syrah để hòa tan vị ngậy.',
    matchedGrapes: ['Cabernet Sauvignon', 'Shiraz'],
    wineIds: ['p-1', 'p-3', 'p-5'],
  },
  {
    id: 'cheese',
    title: 'Cheese & Charcuterie (Phô Mai & Thịt Nguội)',
    desc: 'Đùi heo muối Ibérico và phô mai Parmigiano lâu năm tuyệt vời khi kết hợp cùng Barolo hoặc Brunello di Montalcino.',
    matchedGrapes: ['Nebbiolo', 'Sangiovese'],
    wineIds: ['p-8', 'p-14', 'p-28'],
  },
  {
    id: 'seafood',
    title: 'Seafood & Oysters (Hải Sản & Hàu Tươi)',
    desc: 'Hàu Pháp Fine de Claire và tôm hùmAlaska bơ tỏi tôn vinh vị khoáng thanh khiết của Chablis Grand Cru hoặc Sauvignon Blanc.',
    matchedGrapes: ['Chardonnay', 'Sauvignon Blanc'],
    wineIds: ['p-11', 'p-15', 'p-26'],
  },
  {
    id: 'pasta',
    title: 'Italian Pasta (Mỳ Ý Sốt Kem & Bò Bằm)',
    desc: 'Mỳ Ý Bolognaise và Carbonara hợp nhất cùng vang đỏ Tuscany Chianti hoặc Super Tuscan nồng nàn thảo mộc.',
    matchedGrapes: ['Sangiovese', 'Merlot'],
    wineIds: ['p-6', 'p-22'],
  },
  {
    id: 'bbq',
    title: 'BBQ & Grilled Ribs (Sườn Nướng BBQ)',
    desc: 'Sườn cừu đút lò và lợn rừng nướng cay nồng cháy hòa quyện cùng Malbec hoặc Syrah đậm đà nồng ấp.',
    matchedGrapes: ['Syrah', 'Carmenère'],
    wineIds: ['p-4', 'p-10', 'p-19'],
  },
];

export default function WinePairingSection() {
  const [activePairingId, setActivePairingId] = useState('steak');
  const { products } = useAdminStore();

  const currentPairing = PAIRINGS.find((p) => p.id === activePairingId) || PAIRINGS[0];
  const matchedWines = products.filter((p) => currentPairing.wineIds.includes(p.id));

  return (
    <section className="py-20 bg-dark relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-widest">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Nghệ Thuật Kết Hợp Món Ăn
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold-light font-bold">
            Wine Pairing Guide
          </h2>
          <p className="text-sm text-cream/70">
            Biến mỗi bữa ăn thành đại tiệc ẩm thực đỉnh cao với sự hài hòa tuyệt đối giữa rượu vang và món ăn.
          </p>
        </div>

        {/* Pairing Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          {PAIRINGS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePairingId(p.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activePairingId === p.id
                  ? 'bg-wine-gradient text-gold-light border-gold shadow-wine-glow'
                  : 'bg-dark-card border-gold/20 text-cream/70 hover:text-gold hover:border-gold/40'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Active Pairing Banner & Recommended Wines */}
        <div className="glass-panel p-8 rounded-2xl border border-gold/30 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-xs font-bold text-gold uppercase tracking-widest">
                Món ăn chọn: {currentPairing.title}
              </span>
              <h3 className="font-serif text-2xl text-cream font-bold">
                Bí Quyết Phối Vị Chuẩn Sommelier
              </h3>
              <p className="text-sm text-cream/80 leading-relaxed">
                {currentPairing.desc}
              </p>
            </div>
            <div className="lg:col-span-4 bg-burgundy/40 p-4 rounded-xl border border-gold/20 text-xs space-y-1">
              <strong className="text-gold-light block">Giống nho đề xuất:</strong>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentPairing.matchedGrapes.map((g, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-gold/20 text-gold text-[11px] font-bold">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Matched Wines List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedWines.map((wine) => (
              <Link
                key={wine.id}
                href={`/products/${wine.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-dark-surface/80 border border-gold/15 hover:border-gold/50 hover:bg-gold/10 transition-all group"
              >
                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-dark-card flex-shrink-0">
                  <Image
                    src={wine.images[0]}
                    alt={wine.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="overflow-hidden space-y-1">
                  <span className="text-[10px] text-gold uppercase font-bold tracking-wider">
                    {wine.brand} • {wine.vintage}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-cream group-hover:text-gold transition-colors truncate">
                    {wine.name}
                  </h4>
                  <p className="text-xs font-bold text-gold-light">
                    {formatCurrency(wine.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
