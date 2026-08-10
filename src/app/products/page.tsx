'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { useAdminStore } from '@/store/useAdminStore';
import { Product } from '@/types';
import { MOCK_COUNTRIES, MOCK_REGIONS, MOCK_BRANDS } from '@/lib/data/mockData';
import { SlidersHorizontal, Grid, List, Filter, Wine, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialCountry = searchParams.get('country') || '';
  const initialRegion = searchParams.get('region') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialDiscount = searchParams.get('discount') === 'true';

  const { products } = useAdminStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedGrape, setSelectedGrape] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(35000000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state when URL query parameters change (e.g. clicking Header menu links)
  React.useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedCountry(initialCountry);
    setSelectedRegion(initialRegion);
    setSelectedBrand(initialBrand);
  }, [initialCategory, initialCountry, initialRegion, initialBrand]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedCountry && p.country.toLowerCase() !== selectedCountry.toLowerCase()) return false;
      if (selectedRegion && p.region.toLowerCase() !== selectedRegion.toLowerCase()) return false;
      if (selectedBrand && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      if (selectedGrape && !p.grape.toLowerCase().includes(selectedGrape.toLowerCase())) return false;
      if (minRating > 0 && p.ratingAvg < minRating) return false;
      if (p.price > maxPrice) return false;
      if (initialDiscount && (!p.comparePrice || p.comparePrice <= p.price)) return false;
      if (initialSearch) {
        const q = initialSearch.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.grape.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [
    products,
    selectedCategory,
    selectedCountry,
    selectedRegion,
    selectedBrand,
    selectedGrape,
    minRating,
    maxPrice,
    initialDiscount,
    initialSearch,
  ]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'best_seller') {
      return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      return list.sort((a, b) => b.ratingAvg - a.ratingAvg);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedRegion('');
    setSelectedBrand('');
    setSelectedGrape('');
    setMinRating(0);
    setMaxPrice(35000000);
    setSortBy('newest');
  };

  return (
    <>
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-gold/20 mb-8">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-4 py-2 rounded-xl bg-burgundy border border-gold/40 text-gold-light text-xs font-bold flex items-center gap-2"
          >
            <Filter className="w-4 h-4 text-gold" />
            <span>Bộ Lọc ({filteredProducts.length})</span>
          </button>

          <span className="text-xs text-cream/70 font-medium">
            Hiển thị <strong className="text-gold font-bold">{sortedProducts.length}</strong> / {products.length} sản phẩm
          </span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {/* View switcher */}
          <div className="hidden sm:flex items-center rounded-xl bg-dark-card border border-gold/20 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gold/20 text-gold' : 'text-cream/50 hover:text-cream'
              }`}
              title="Dạng Lưới"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-gold/20 text-gold' : 'text-cream/50 hover:text-cream'
              }`}
              title="Dạng Danh Sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-cream/60 whitespace-nowrap hidden sm:inline">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-dark-card border border-gold/20 text-xs text-cream focus:outline-none focus:border-gold font-medium"
            >
              <option value="newest">Mới Nhất</option>
              <option value="best_seller">Bán Chạy Nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh Giá Cao Nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-6">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold" />
                <span>Bộ Lọc Lựa Chọn</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-cream/60 hover:text-gold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Xóa lọc
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Loại Rượu Vang</h4>
              <div className="space-y-1.5 text-xs text-cream/80">
                {[
                  { label: 'Tất cả danh mục', val: '' },
                  { label: 'Rượu Vang Đỏ', val: 'vang-do' },
                  { label: 'Rượu Vang Trắng', val: 'vang-trang' },
                  { label: 'Rượu Vang Hồng', val: 'vang-hong' },
                  { label: 'Champagne Pháp', val: 'champagne' },
                  { label: 'Vang Sủi Bọt (Sparkling)', val: 'sparkling' },
                  { label: 'Bộ Sưu Tập Cao Cấp', val: 'vang-cao-cap' },
                ].map((item) => (
                  <label
                    key={item.val}
                    className="flex items-center gap-2 cursor-pointer hover:text-gold transition-colors p-1.5 rounded hover:bg-gold/5"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === item.val}
                      onChange={() => setSelectedCategory(item.val)}
                      className="accent-gold"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Quốc Gia Xuất Xứ</h4>
              <div className="space-y-1 text-xs text-cream/80">
                <button
                  onClick={() => setSelectedCountry('')}
                  className={`block w-full text-left p-1.5 rounded transition-colors ${
                    selectedCountry === '' ? 'bg-gold/20 text-gold font-bold' : 'hover:bg-gold/5'
                  }`}
                >
                  Tất cả quốc gia
                </button>
                {MOCK_COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountry(c.name.split(' ')[0])}
                    className={`block w-full text-left p-1.5 rounded transition-colors ${
                      selectedCountry.toLowerCase() === c.name.split(' ')[0].toLowerCase()
                        ? 'bg-gold/20 text-gold font-bold'
                        : 'hover:bg-gold/5'
                    }`}
                  >
                    {c.flagUrl} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Thương Hiệu</h4>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-xs text-cream focus:outline-none focus:border-gold"
              >
                <option value="">Tất cả nhà làm vang</option>
                {MOCK_BRANDS.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider text-gold">Khoảng Giá Tối Đa</span>
                <span className="font-bold text-gold-light">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={35000000}
                step={1000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold bg-dark-card cursor-pointer"
              />
            </div>

            {/* Minimum Rating */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Đánh Giá Tối Thiểu</h4>
              <div className="flex items-center gap-2">
                {[0, 4, 4.5, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      minRating === r
                        ? 'bg-wine border-gold text-gold-light shadow-wine-glow'
                        : 'bg-dark-card border-gold/20 text-cream/70 hover:text-gold'
                    }`}
                  >
                    {r === 0 ? 'Tất cả' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid / List View */}
        <div className="lg:col-span-9">
          {sortedProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-2xl border border-gold/20 space-y-4">
              <Wine className="w-16 h-16 text-gold/30 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-cream">
                Không Tìm Thấy Sản Phẩm Phù Hợp
              </h3>
              <p className="text-xs text-cream/60 max-w-md mx-auto">
                Thử thay đổi bộ lọc giá, vùng nho hoặc xóa các điều kiện tìm kiếm hiện tại.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-wine-gradient text-gold-light text-xs font-bold border border-gold/40 hover:border-gold shadow-wine-glow"
              >
                Xóa Tất Cả Bộ Lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      {/* Catalog Title Banner */}
      <div className="bg-dark-surface border-b border-gold/20 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-3 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-gold flex items-center gap-1.5">
            <Wine className="w-4 h-4" /> WINECELLAR PRO CATALOG
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gold-light">
            Danh Mục Rượu Vang Cao Cấp
          </h1>
          <p className="text-sm text-cream/70 max-w-2xl">
            Tất cả sản phẩm đều được nhập khẩu chính ngạch, lưu trữ trong hầm tiêu chuẩn 15°C - 65% độ ẩm tại hệ thống kho lạnh chuyên dụng.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={
          <div className="py-20 text-center text-gold-light font-serif">
            Đang tải danh mục rượu vang...
          </div>
        }>
          <ProductCatalogContent />
        </Suspense>
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
