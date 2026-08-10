'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, ChevronRight } from 'lucide-react';

const COLLECTIONS = [
  {
    title: 'French Collection',
    country: 'Pháp 🇫🇷',
    subtitle: 'Thánh Địa Bordeaux & Burgundy',
    desc: 'Những kiệt tác vang đỏ Premier Grand Cru Classé 1855, Champagne Dom Pérignon và Chablis tinh khôi.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    link: '/products?country=Pháp',
  },
  {
    title: 'Italian Collection',
    country: 'Ý 🇮🇹',
    subtitle: 'Đỉnh Cao Barolo & Super Tuscan',
    desc: 'Huyền thoại Sassicaia, Solaia, Brunello di Montalcino mang hơi thở lãng mạn của vùng đồi Tuscany.',
    image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=800&auto=format&fit=crop&q=80',
    link: '/products?country=Ý',
  },
  {
    title: 'Chilean Collection',
    country: 'Chile 🇨🇱',
    subtitle: 'Almaviva & Don Melchor',
    desc: 'Sự giao thoa đỉnh cao giữa kỹ nghệ Pháp và thổ nhưỡng Maipo Valley trù phú dưới chân núi Andes.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80',
    link: '/products?country=Chile',
  },
  {
    title: 'Australian Collection',
    country: 'Úc 🇦🇺',
    subtitle: 'Shiraz Barossa Valley',
    desc: 'Di sản vang Úc Penfolds Grange & Bin 389 với phong cách đậm đà nồng nàn trái cây chín mọng.',
    image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=800&auto=format&fit=crop&q=80',
    link: '/products?country=Úc',
  },
];

export default function WineCollectionsSection() {
  return (
    <section className="py-20 bg-dark relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-gold text-xs font-semibold uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" /> Thổ Nhưỡng Toàn Cầu
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold-light font-bold">
            Bộ Sưu Tập Vùng Nho Quốc Tế
          </h2>
          <p className="text-sm text-cream/70">
            Hành trình thưởng thức từ các hầm vang cổ kính châu Âu đến những trang trại rạng nắng tân thế giới.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COLLECTIONS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={item.link}
                className="group relative h-96 rounded-2xl overflow-hidden glass-panel border border-gold/20 hover:border-gold/60 shadow-luxury block p-8 flex flex-col justify-end transition-all duration-500"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />

                <div className="relative z-10 space-y-3">
                  <span className="px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-bold uppercase border border-gold/30">
                    {item.country}
                  </span>
                  <h3 className="font-serif text-3xl text-cream font-bold group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <h4 className="text-sm font-serif text-gold-light italic">
                    {item.subtitle}
                  </h4>
                  <p className="text-xs text-cream/75 leading-relaxed max-w-lg">
                    {item.desc}
                  </p>
                  <div className="pt-2 inline-flex items-center gap-1 text-xs font-bold text-gold group-hover:text-gold-light transition-colors">
                    <span>Khám Phá Bộ Sưu Tập</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
