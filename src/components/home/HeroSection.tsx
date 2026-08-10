'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wine, ArrowRight, Sparkles, Award, Star, ShieldCheck, Thermometer, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

const HERO_SLIDES = [
  {
    title: 'Château Lafite Rothschild 2018',
    region: 'Pauillac, Bordeaux • France',
    rating: 99,
    price: 32500000,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    tag: 'Premier Grand Cru Classé',
  },
  {
    title: 'Dom Pérignon Vintage Champagne 2013',
    region: 'Épernay, Champagne • France',
    rating: 98,
    price: 8900000,
    image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&auto=format&fit=crop&q=80',
    tag: 'Vintage Prestige Cuvée',
  },
  {
    title: 'Opus One Proprietary Red 2019',
    region: 'Napa Valley • California, USA',
    rating: 99,
    price: 18500000,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80',
    tag: 'Iconic Napa Valley Cult Wine',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden font-sans bg-dark text-cream py-12">
      {/* Background Hero Image with Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.image}
          alt="Luxury Wine Cellar Hero Background"
          fill
          priority
          className="object-cover object-center filter brightness-[0.35] contrast-125 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/70" />
      </div>

      {/* Subtle Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-burgundy/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy-deep/90 border border-gold/40 text-gold-light text-xs font-bold uppercase tracking-widest backdrop-blur-xl shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>PREMIUM LUXURY WINE BOUTIQUE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-cream leading-[1.08] tracking-tight">
              Khám Phá <br />
              <span className="gold-text-gradient italic font-normal drop-shadow-gold">Tuyệt Tác Vang</span> Thượng Hạng
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-cream/80 font-sans font-light leading-relaxed max-w-xl">
              Tuyển chọn độc quyền từ những điền trang huyền thoại bậc nhất thế giới tại <strong className="text-gold-light font-medium">Bordeaux, Burgundy, Tuscany & Napa Valley</strong>. Hầm bảo quản nhiệt độ chuẩn 15°C sẵn sàng giao hỏa tốc 2H.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/products"
                className="py-4 px-8 rounded-xl bg-wine-gradient text-gold-light font-bold text-sm tracking-wider uppercase border border-gold/50 hover:border-gold hover:shadow-wine-glow transition-all duration-300 flex items-center justify-center gap-2 group shadow-luxury"
              >
                <span>KHÁM PHÁ BỘ SƯU TẬP</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href="/ai-assistant"
                className="py-4 px-8 rounded-xl bg-dark-card/90 backdrop-blur-md text-cream hover:text-gold font-bold text-sm tracking-wider uppercase border border-gold/30 hover:border-gold/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                <span>TƯ VẤN SOMMELIER AI</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gold/20 max-w-lg text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-gold-light block leading-none mb-1">100%</span>
                  <span className="text-cream/60 text-[11px]">Chính Hãng Nhập Khẩu</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-gold-light block leading-none mb-1">15°C</span>
                  <span className="text-cream/60 text-[11px]">Hầm Bảo Quản Chuẩn</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-gold-light block leading-none mb-1">2 Giờ</span>
                  <span className="text-cream/60 text-[11px]">Giao Hỏa Tốc VIP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Floating 3D Wine Showcase Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md animate-bounce-slow">
              <div className="relative glass-panel rounded-3xl p-6 border border-gold/40 shadow-luxury overflow-hidden backdrop-blur-2xl transition-all duration-500">
                
                {/* Background Card Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top Info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-wine/80 text-gold-light text-[11px] font-bold uppercase tracking-wider border border-gold/30">
                    {slide.tag}
                  </span>
                  <div className="flex items-center gap-1 text-gold text-xs font-bold bg-dark-card/90 px-2.5 py-1 rounded-lg border border-gold/20">
                    <Star className="w-3.5 h-3.5 fill-gold" />
                    <span>{slide.rating}/100 Parker</span>
                  </div>
                </div>

                {/* Wine Bottle Image Box */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-dark-card border border-gold/20 mb-4 group">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-cream">
                    <span className="text-[11px] text-gold font-bold uppercase tracking-widest block">
                      {slide.region}
                    </span>
                  </div>
                </div>

                {/* Wine Title & Price */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-serif text-xl font-bold text-gold-light leading-snug">
                    {slide.title}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-cream/50 uppercase block">Giá niêm yết chính hãng</span>
                      <span className="font-serif text-2xl font-extrabold text-gold">
                        {formatCurrency(slide.price)}
                      </span>
                    </div>

                    <Link
                      href="/products"
                      className="px-4 py-2.5 rounded-xl bg-gold-gradient text-dark font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-1.5"
                    >
                      <Wine className="w-4 h-4" />
                      <span>Xem Ngay</span>
                    </Link>
                  </div>
                </div>

                {/* Slide Switcher Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-gold/15">
                  <div className="flex items-center gap-2">
                    {HERO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          currentSlide === idx ? 'w-8 bg-gold' : 'w-2 bg-gold/30 hover:bg-gold/60'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                      className="p-2 rounded-lg bg-dark-card border border-gold/20 text-cream/70 hover:text-gold hover:border-gold transition-colors"
                      title="Slide trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                      className="p-2 rounded-lg bg-dark-card border border-gold/20 text-cream/70 hover:text-gold hover:border-gold transition-colors"
                      title="Slide kế tiếp"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
