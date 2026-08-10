'use client';

import React from 'react';
import { Star, Quote, ShieldCheck, Award } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/data/mockData';

export default function CustomerReviewsSection() {
  return (
    <section className="py-20 bg-dark relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" /> Đánh Giá Từ Khách Hàng VIP
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold-light font-bold">
            Trải Nghiệm Thưởng Vang Đẳng Cấp
          </h2>
          <p className="text-sm text-cream/70">
            Hơn 10.000+ tín đồ sành vang và các Master Sommelier tin tưởng lựa chọn WINECELLAR PRO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-2xl glass-panel border border-gold/20 hover:border-gold/50 shadow-luxury flex flex-col justify-between space-y-6 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-gold/20" />
                </div>

                <p className="text-sm text-cream/80 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-cream text-sm">
                    {rev.authorName}
                  </h4>
                  <span className="text-[11px] text-gold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Đã Mua Hàng Khách Hàng VIP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
