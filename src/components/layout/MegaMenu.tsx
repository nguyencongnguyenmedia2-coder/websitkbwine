'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wine, ChevronRight, Award, Globe, Grape, Sparkles, ShieldCheck } from 'lucide-react';
import { MOCK_BRANDS, MOCK_REGIONS } from '@/lib/data/mockData';

interface MegaMenuProps {
  onClose?: () => void;
}

export default function MegaMenu({ onClose }: MegaMenuProps) {
  const categories = [
    { label: 'Rượu Vang Đỏ', href: '/products?category=vang-do', desc: 'Bordeaux, Barolo, Opus One, Cabernet Sauvignon', count: '150+' },
    { label: 'Rượu Vang Trắng', href: '/products?category=vang-trang', desc: 'Chablis, Sauvignon Blanc, Chardonnay', count: '85+' },
    { label: 'Rượu Vang Hồng (Rosé)', href: '/products?category=vang-hong', desc: 'Whispering Angel, Côtes de Provence', count: '40+' },
    { label: 'Champagne Pháp', href: '/products?category=champagne', desc: 'Dom Pérignon, Cristal, Veuve Clicquot', count: '50+' },
    { label: 'Vang Sủi Bọt (Sparkling)', href: '/products?category=sparkling', desc: 'Prosecco Superiore, Cava, Asti', count: '60+' },
    { label: 'Bộ Sưu Tập Vang Cao Cấp', href: '/products?category=vang-cao-cap', desc: 'Grand Cru Classé 1855, Super Tuscan', count: '30+' },
  ];

  const popularGrapes = [
    { name: 'Cabernet Sauvignon', desc: 'Đậm đà, cấu trúc vững chắc' },
    { name: 'Pinot Noir', desc: 'Tinh tế, hương hoa & quả đỏ' },
    { name: 'Chardonnay', desc: 'Tròn vị, bơ nướng & vani' },
    { name: 'Shiraz / Syrah', desc: 'Nồng nàn, gia vị & việt quất' },
    { name: 'Sauvignon Blanc', desc: 'Tươi mát, chanh gọt & thảo mộc' },
    { name: 'Carmenère', desc: 'Đặc sản Chile, mượt như nhung' },
  ];

  return (
    <div className="w-full bg-[#0F0E13] border-t border-b border-gold/30 shadow-2xl py-8 px-6 lg:px-12 text-cream relative z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        
        {/* Column 1: Categories */}
        <div className="lg:col-span-4 border-r-0 lg:border-r border-gold/15 pr-0 lg:pr-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gold/15">
            <div className="flex items-center gap-2 text-gold-light font-serif text-sm font-bold tracking-wider uppercase">
              <Wine className="w-4 h-4 text-gold" />
              <span>Danh Mục Rượu Vang</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gold/60 font-mono">Select Type</span>
          </div>

          <ul className="space-y-2 font-sans text-xs">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-[#181622] hover:bg-gold/20 transition-all border border-gold/10 hover:border-gold/30 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-cream group-hover:text-gold transition-colors flex items-center gap-1.5">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-cream/60 mt-0.5">{cat.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold-light text-[10px] font-mono border border-gold/30 font-bold">
                      {cat.count}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Grapes */}
        <div className="lg:col-span-3 border-r-0 lg:border-r border-gold/15 pr-0 lg:pr-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gold/15">
            <div className="flex items-center gap-2 text-gold-light font-serif text-sm font-bold tracking-wider uppercase">
              <Grape className="w-4 h-4 text-gold" />
              <span>Giống Nho Nổi Bật</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gold/60 font-mono">Varietals</span>
          </div>

          <div className="space-y-2 text-xs">
            {popularGrapes.map((g, idx) => (
              <Link
                key={idx}
                href={`/products?grape=${encodeURIComponent(g.name)}`}
                onClick={onClose}
                className="group block p-2.5 rounded-xl bg-[#181622] hover:bg-gold/20 border border-gold/10 hover:border-gold/30 transition-all"
              >
                <div className="font-bold text-cream group-hover:text-gold transition-colors">
                  {g.name}
                </div>
                <div className="text-[10px] text-cream/60 mt-0.5">{g.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Regions & Brands */}
        <div className="lg:col-span-3 border-r-0 lg:border-r border-gold/15 pr-0 lg:pr-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-gold-light font-serif text-sm font-bold tracking-wider uppercase mb-3 pb-2 border-b border-gold/15">
              <Globe className="w-4 h-4 text-gold" />
              <span>Vùng Nho Danh Tiếng</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {MOCK_REGIONS.slice(0, 6).map((reg) => (
                <Link
                  key={reg.id}
                  href={`/products?region=${encodeURIComponent(reg.name.split(' ')[0])}`}
                  onClick={onClose}
                  className="p-2 rounded-lg bg-[#181622] hover:bg-gold/25 text-cream hover:text-gold transition-colors font-semibold border border-gold/15 hover:border-gold/40 truncate text-[11px]"
                >
                  {reg.name.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gold-light font-serif text-sm font-bold tracking-wider uppercase mb-3 pb-2 border-b border-gold/15">
              <Award className="w-4 h-4 text-gold" />
              <span>Thương Hiệu Biểu Tượng</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {MOCK_BRANDS.slice(0, 6).map((b) => (
                <Link
                  key={b.id}
                  href={`/products?brand=${encodeURIComponent(b.name)}`}
                  onClick={onClose}
                  className="p-2 rounded-lg bg-[#181622] hover:bg-gold/25 text-cream hover:text-gold transition-colors font-semibold border border-gold/15 hover:border-gold/40 truncate text-[11px]"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Column 4: Showcase Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-full min-h-[260px] rounded-2xl overflow-hidden bg-[#181622] p-5 flex flex-col justify-end border border-gold/30 group shadow-wine-glow">
            <Image
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80"
              alt="Grand Cru Showcase"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E13] via-[#0F0E13]/80 to-transparent" />
            
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/20 text-gold-light text-[10px] font-bold uppercase tracking-wider border border-gold/30">
                <Sparkles className="w-3 h-3 text-gold" /> VIP Selection 2026
              </span>
              <h4 className="font-serif text-base text-cream font-bold leading-snug">
                Tuyệt Tác Vang Grand Cru 1855
              </h4>
              <p className="text-[11px] text-cream/70 line-clamp-2">
                Hơn 30+ mẫu vang bảo quản kho lạnh 15°C tiêu chuẩn Sommelier quốc tế.
              </p>
              <Link
                href="/products?category=vang-cao-cap"
                onClick={onClose}
                className="inline-flex items-center justify-between w-full px-3 py-2 rounded-xl bg-gold-gradient text-dark font-extrabold text-xs shadow-gold-glow hover:scale-102 transition-transform mt-2"
              >
                <span>Khám Phá Ngay</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar inside MegaMenu */}
      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-gold/15 flex flex-wrap items-center justify-between gap-4 text-xs text-cream/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-gold-light font-medium">
            <ShieldCheck className="w-4 h-4 text-gold" /> Cam kết 100% nhập khẩu chính ngạch
          </span>
          <span className="hidden sm:inline text-gold/30">|</span>
          <span className="hidden sm:inline">Giao hàng bảo quản hỏa tốc trong 2 giờ tại TPHCM & Hà Nội</span>
        </div>
        <Link
          href="/ai-assistant"
          onClick={onClose}
          className="text-gold hover:text-gold-light font-bold flex items-center gap-1 underline underline-offset-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" /> Bạn chưa biết chọn vang nào? Hỏi ngay Trợ lý AI Sommelier
        </Link>
      </div>
    </div>
  );
}

