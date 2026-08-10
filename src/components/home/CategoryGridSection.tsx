'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wine, Sparkles, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Vang Đỏ',
    slug: 'vang-do',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    count: '150+ chai',
    desc: 'Lafite, Opus One, Barolo, Brunello, Cabernet Sauvignon',
  },
  {
    name: 'Vang Trắng',
    slug: 'vang-trang',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    count: '85+ chai',
    desc: 'Chablis Grand Cru, Puligny-Montrachet, Sauvignon Blanc',
  },
  {
    name: 'Vang Hồng',
    slug: 'vang-hong',
    image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=800&auto=format&fit=crop&q=80',
    count: '40+ chai',
    desc: 'Whispering Angel, Côtes de Provence, Grenache',
  },
  {
    name: 'Sparkling Wine',
    slug: 'sparkling',
    image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&auto=format&fit=crop&q=80',
    count: '60+ chai',
    desc: 'Prosecco Superiore DOCG, Cava, Moscato d’Asti',
  },
  {
    name: 'Champagne Pháp',
    slug: 'champagne',
    image: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=800&auto=format&fit=crop&q=80',
    count: '50+ chai',
    desc: 'Dom Pérignon, Cristal Louis Roederer, Veuve Clicquot',
  },
  {
    name: 'Vang Cao Cấp Icon',
    slug: 'vang-cao-cap',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80',
    count: '30+ chai',
    desc: 'Grand Cru Classé 1855, Super Tuscan, Vintage Collector',
  },
];

export default function CategoryGridSection() {
  return (
    <section className="py-20 bg-dark relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-widest">
            <Wine className="w-3.5 h-3.5" /> Danh Mục Sản Phẩm
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold-light font-bold">
            Thế Giới Rượu Vang Tuyển Chọn
          </h2>
          <p className="text-sm text-cream/70">
            Khám phá sự đa dạng tinh tế từ những chai vang đỏ nồng nàn đến dòng Champagne sủi bọt hoàng gia.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden glass-panel border border-gold/20 hover:border-gold/60 shadow-luxury block p-6 flex flex-col justify-end transition-all duration-500"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-burgundy/80 text-gold-light text-[11px] font-semibold border border-gold/30">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-2xl text-cream font-bold group-hover:text-gold transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold" />
                  </h3>
                  <p className="text-xs text-cream/70 line-clamp-2 font-sans">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
