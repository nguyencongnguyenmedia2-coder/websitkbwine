'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wine, ChevronRight, Award, Globe, Flame } from 'lucide-react';
import { MOCK_BRANDS, MOCK_REGIONS } from '@/lib/data/mockData';

export default function MegaMenu() {
  return (
    <div className="absolute top-full left-0 w-full bg-dark/95 backdrop-blur-2xl border-t border-b border-gold/20 shadow-luxury py-8 px-12 z-50 text-cream transition-all duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* Categories column */}
        <div className="col-span-4 border-r border-gold/10 pr-8">
          <div className="flex items-center gap-2 text-gold-light font-serif text-sm tracking-wider uppercase mb-4">
            <Wine className="w-4 h-4 text-gold" />
            <span>Danh Mục Sản Phẩm</span>
          </div>
          <ul className="space-y-3 font-sans text-sm">
            {[
              { label: 'Rượu Vang Đỏ (Red Wine)', href: '/products?category=vang-do', desc: 'Lafite, Barolo, Opus One, Cabernet Sauvignon' },
              { label: 'Rượu Vang Trắng (White Wine)', href: '/products?category=vang-trang', desc: 'Chablis, Sauvignon Blanc, Chardonnay' },
              { label: 'Rượu Vang Hồng (Rosé Wine)', href: '/products?category=vang-hong', desc: 'Whispering Angel, Côtes de Provence' },
              { label: 'Champagne Pháp Cao Cấp', href: '/products?category=champagne', desc: 'Dom Pérignon, Cristal, Veuve Clicquot' },
              { label: 'Rượu Vang Sủi Bọt (Sparkling)', href: '/products?category=sparkling', desc: 'Prosecco Superiore, Cava' },
              { label: 'Bộ Sưu Tập Vang Cao Cấp (Iconic)', href: '/products?category=vang-cao-cap', desc: 'Grand Cru Classé 1855, Super Tuscan' },
            ].map((cat, idx) => (
              <li key={idx}>
                <Link
                  href={cat.href}
                  className="group flex flex-col p-2 rounded-lg hover:bg-gold/10 transition-colors"
                >
                  <span className="font-medium text-cream group-hover:text-gold transition-colors flex items-center justify-between">
                    {cat.label}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold" />
                  </span>
                  <span className="text-xs text-cream/50 mt-0.5">{cat.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Famous Regions & Brands */}
        <div className="col-span-4 border-r border-gold/10 pr-8">
          <div className="flex items-center gap-2 text-gold-light font-serif text-sm tracking-wider uppercase mb-4">
            <Globe className="w-4 h-4 text-gold" />
            <span>Thương Hiệu & Vùng Nho</span>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gold/80 uppercase tracking-widest mb-3">Vùng Nho Danh Tiếng</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {MOCK_REGIONS.slice(0, 6).map((reg) => (
                <Link
                  key={reg.id}
                  href={`/products?region=${encodeURIComponent(reg.name)}`}
                  className="p-2 rounded bg-dark-surface/60 hover:bg-gold/15 text-cream/80 hover:text-gold transition-colors"
                >
                  {reg.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gold/80 uppercase tracking-widest mb-3">Thương Hiệu Đẳng Cấp</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {MOCK_BRANDS.slice(0, 6).map((b) => (
                <Link
                  key={b.id}
                  href={`/products?brand=${encodeURIComponent(b.name)}`}
                  className="p-2 rounded bg-dark-surface/60 hover:bg-gold/15 text-cream/80 hover:text-gold transition-colors truncate"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="col-span-4">
          <div className="relative h-full rounded-xl overflow-hidden glass-panel p-6 flex flex-col justify-end border border-gold/30 group">
            <Image
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80"
              alt="Grand Cru Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-semibold uppercase tracking-wider mb-2 border border-gold/30">
                <Award className="w-3.5 h-3.5" /> Iconic Collection 2026
              </span>
              <h3 className="font-serif text-xl text-cream font-bold mb-2">
                Tuyệt Tác Grand Cru Classé 1855
              </h3>
              <p className="text-xs text-cream/70 mb-4 line-clamp-2">
                Bộ sưu tập các dòng vang biểu tượng Château Lafite, Château Margaux, Dom Pérignon với số lượng giới hạn.
              </p>
              <Link
                href="/products?category=vang-cao-cap"
                className="inline-flex items-center text-xs font-semibold text-gold hover:text-gold-light transition-colors gap-1"
              >
                <span>Khám Phá Ngay</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
