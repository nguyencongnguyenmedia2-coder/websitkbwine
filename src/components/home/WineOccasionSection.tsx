'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Gift, Building, Calendar, Utensils, Sparkles, GlassWater } from 'lucide-react';

const OCCASIONS = [
  {
    name: 'Tiệc Cưới Sang Trọng',
    icon: Heart,
    desc: 'Champagne sủi bọt rạng rỡ và những chai vang đỏ mềm mại gắn kết khoảnh khắc hạnh phúc lứa đôi.',
    query: 'Tiệc cưới',
  },
  {
    name: 'Sinh Nhật & Kỷ Niệm',
    icon: Calendar,
    desc: 'Những niêu vụ vintage năm sinh ấn tượng tô điểm cho ngày đặc biệt ghi dấu ký ức.',
    query: 'Sinh nhật',
  },
  {
    name: 'Quà Tặng VIP Doanh Nghiệp',
    icon: Gift,
    desc: 'Hộp gỗ mạ vàng bọc da sang trọng chứa đựng tuyệt tác vang đắt giá tôn vinh đối tác.',
    query: 'Quà tặng',
  },
  {
    name: 'Tiệc Cổ Cồn Doanh Nghiệp',
    icon: Building,
    desc: 'Dòng vang Bordeaux & Super Tuscan đĩnh đạc tạo không khí giao thương chuyên nghiệp.',
    query: 'Tiệc doanh nghiệp',
  },
  {
    name: 'Fine Dining Đẳng Cấp',
    icon: Utensils,
    desc: 'Rượu vang kết hợp hoàn hảo cùng thực đơn 5 sao Michelin từ các đầu bếp hàng đầu.',
    query: 'Dinner',
  },
  {
    name: 'Romantic Candlelight Dinner',
    icon: GlassWater,
    desc: 'Whispering Angel Rosé hoặc Champagne ngọt ngào làm bùng nổ cảm xúc lãng mạn dưới ánh nến.',
    query: 'Romantic',
  },
];

export default function WineOccasionSection() {
  return (
    <section className="py-20 bg-dark-surface relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Thưởng Vang Theo Dịp
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold-light font-bold">
            Rượu Vang Cho Mọi Khoảnh Khắc
          </h2>
          <p className="text-sm text-cream/70">
            Lựa chọn chai vang hoàn hảo nâng tầm cảm xúc cho từng dịp kỷ niệm ý nghĩa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occ, idx) => {
            const Icon = occ.icon;
            return (
              <Link
                key={idx}
                href={`/products?occasion=${encodeURIComponent(occ.query)}`}
                className="group p-6 rounded-2xl glass-panel border border-gold/20 hover:border-gold/60 hover:bg-gold/5 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-burgundy/80 border border-gold/30 flex items-center justify-center text-gold shadow-gold-glow group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-cream font-bold group-hover:text-gold transition-colors mb-2">
                    {occ.name}
                  </h3>
                  <p className="text-xs text-cream/70 leading-relaxed">
                    {occ.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-gold group-hover:underline inline-flex items-center gap-1">
                  Gợi Ý Chai Vang Phù Hợp →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
