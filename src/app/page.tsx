'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import AgeGateModal from '@/components/ui/AgeGateModal';
import HeroSection from '@/components/home/HeroSection';
import CategoryGridSection from '@/components/home/CategoryGridSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import WineCollectionsSection from '@/components/home/WineCollectionsSection';
import WineOccasionSection from '@/components/home/WineOccasionSection';
import WinePairingSection from '@/components/home/WinePairingSection';
import PromotionBannerSection from '@/components/home/PromotionBannerSection';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';
import BlogSection from '@/components/home/BlogSection';
import { useAdminStore } from '@/store/useAdminStore';

export default function HomePage() {
  const { homepageSections } = useAdminStore();

  return (
    <main className="min-h-screen bg-dark text-cream selection:bg-gold selection:text-dark">
      <AgeGateModal />
      <Header />

      {homepageSections.hero && <HeroSection />}
      <CategoryGridSection />
      {homepageSections.featuredProducts && <FeaturedProductsSection />}
      {homepageSections.collections && <WineCollectionsSection />}
      <WineOccasionSection />
      <WinePairingSection />
      <PromotionBannerSection />
      {homepageSections.reviews && <CustomerReviewsSection />}
      {homepageSections.blog && <BlogSection />}

      <Footer />
      <FloatingActions />
    </main>
  );
}
