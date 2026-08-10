'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency } from '@/lib/utils/format';
import { Product, WineCategory } from '@/types';
import {
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  Wine,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Star,
  Globe,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import Image from 'next/image';

const SAMPLE_WINE_IMAGES = [
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
];

export default function AdminProductsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { products, addProduct, updateProduct, deleteProduct, duplicateProduct } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<WineCategory>('vang-do');
  const [country, setCountry] = useState('Pháp');
  const [region, setRegion] = useState('Bordeaux');
  const [grape, setGrape] = useState('Cabernet Sauvignon');
  const [vintage, setVintage] = useState(2018);
  const [volumeMl, setVolumeMl] = useState(750);
  const [alcoholPct, setAlcoholPct] = useState(13.5);
  const [price, setPrice] = useState(2500000);
  const [stock, setStock] = useState(15);
  const [description, setDescription] = useState('');
  const [wineNotes, setWineNotes] = useState('');
  const [foodPairing, setFoodPairing] = useState('Bò bít tết Wagyu, Phô mai lâu năm');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');

  const filteredProducts = products.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`WCP-${Math.floor(1000 + Math.random() * 9000)}`);
    setBrand('Château Lafite Rothschild');
    setCategory('vang-do');
    setCountry('Pháp');
    setRegion('Bordeaux');
    setGrape('Cabernet Sauvignon');
    setVintage(2018);
    setVolumeMl(750);
    setAlcoholPct(13.5);
    setPrice(3500000);
    setStock(15);
    setDescription('Rượu vang cao cấp hương vị phong phú, hương thơm mâm xôi, tuyết tùng và gỗ sồi Pháp...');
    setWineNotes('Cấu trúc tanin mượt mà, tiềm năng lưu trữ tới 30 năm.');
    setFoodPairing('Thịt bò Wagyu nướng, cừu đút lò, phô mai Cheddar');
    setIsFeatured(true);
    setIsBestSeller(true);
    setIsNewArrival(true);
    setImages([SAMPLE_WINE_IMAGES[0]]);
    setUrlInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setBrand(p.brand);
    setCategory(p.category);
    setCountry(p.country);
    setRegion(p.region);
    setGrape(p.grape);
    setVintage(p.vintage);
    setVolumeMl(p.volumeMl);
    setAlcoholPct(p.alcoholPct);
    setPrice(p.price);
    setStock(p.stock);
    setDescription(p.description);
    setWineNotes(p.wineNotes || '');
    setFoodPairing(p.foodPairing || '');
    setIsFeatured(p.isFeatured ?? true);
    setIsBestSeller(p.isBestSeller ?? true);
    setIsNewArrival(p.isNewArrival ?? true);
    setImages(p.images && p.images.length > 0 ? p.images : [SAMPLE_WINE_IMAGES[0]]);
    setUrlInput('');
    setIsModalOpen(true);
  };

  // Image Upload Handling (File & Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
          addToast({
            type: 'success',
            title: 'Tải ảnh lên thành công!',
            description: `Đã thêm ảnh ${file.name} vào danh sách ảnh sản phẩm.`,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
    addToast({ type: 'info', title: 'Đã thêm liên kết ảnh mới!' });
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      addToast({ type: 'warning', title: 'Cần ít nhất 1 hình ảnh sản phẩm' });
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImages(updated);
    addToast({ type: 'success', title: 'Đã thiết lập làm ảnh đại diện chính!' });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price) {
      addToast({ type: 'error', title: 'Vui lòng điền đầy đủ tên, SKU và giá sản phẩm' });
      return;
    }

    const finalImages = images.length > 0 ? images : [SAMPLE_WINE_IMAGES[0]];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        sku,
        brand,
        category,
        country,
        region,
        grape,
        vintage,
        volumeMl,
        alcoholPct,
        price,
        stock,
        description,
        wineNotes,
        foodPairing,
        isFeatured,
        isBestSeller,
        isNewArrival,
        images: finalImages,
      });
      addToast({ type: 'success', title: 'Đã cập nhật sản phẩm thành công!' });
    } else {
      addProduct({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sku,
        brand,
        category,
        categoryName:
          category === 'vang-do'
            ? 'Rượu Vang Đỏ'
            : category === 'vang-trang'
            ? 'Rượu Vang Trắng'
            : category === 'champagne'
            ? 'Champagne Pháp'
            : 'Rượu Vang Cao Cấp',
        country,
        region,
        grape,
        vintage,
        volumeMl,
        alcoholPct,
        price,
        stock,
        lowStockThreshold: 3,
        description,
        wineNotes: wineNotes || 'Tasting notes chuẩn Master Sommelier',
        foodPairing: foodPairing || 'Bò bít tết Wagyu, phô mai lâu năm',
        servingTemp: '16°C - 18°C',
        images: finalImages,
        isFeatured,
        isBestSeller,
        isNewArrival,
        ratingAvg: 5.0,
        ratingCount: 1,
        status: 'published',
      });
      addToast({ type: 'success', title: 'Đã đăng sản phẩm lên trang chủ thành công!' });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-extrabold text-gold-light">Quản Lý Đăng Sản Phẩm Rượu Vang</h1>
              <p className="text-xs text-cream/60">Tải ảnh sản phẩm, cập nhật tồn kho, vị trí hiển thị Trang Chủ và đăng bán trực tiếp</p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-3 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Đăng Sản Phẩm Mới</span>
            </button>
          </div>

          {/* Search & Filter bar */}
          <div className="p-4 rounded-2xl glass-panel border border-gold/20 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-cream/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên sản phẩm, SKU, thương hiệu..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-card border border-gold/15 text-xs text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-dark-card border border-gold/15 text-xs text-cream focus:outline-none focus:border-gold font-medium"
            >
              <option value="">Tất cả danh mục sản phẩm</option>
              <option value="vang-do">Rượu Vang Đỏ</option>
              <option value="vang-trang">Rượu Vang Trắng</option>
              <option value="vang-hong">Rượu Vang Hồng</option>
              <option value="champagne">Champagne Pháp</option>
              <option value="sparkling">Vang Sủi Bọt (Sparkling)</option>
              <option value="vang-cao-cap">Bộ Sưu Tập Cao Cấp</option>
            </select>
          </div>

          {/* Products Table */}
          <div className="p-6 rounded-2xl glass-panel border border-gold/20 overflow-x-auto shadow-luxury">
            <table className="w-full text-xs text-left">
              <thead className="uppercase text-gold font-bold border-b border-gold/15 text-[10px]">
                <tr>
                  <th className="p-3">Hình Ảnh</th>
                  <th className="p-3">Tên Rượu Vang</th>
                  <th className="p-3">Mã SKU</th>
                  <th className="p-3">Hiển Thị Trang Chủ</th>
                  <th className="p-3">Giá Niêm Yết</th>
                  <th className="p-3">Tồn Kho</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                    <td className="p-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-dark-card border border-gold/20">
                        <Image src={p.images[0]} alt="" fill className="object-cover" />
                        {p.images.length > 1 && (
                          <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-burgundy/90 text-gold text-[9px] font-bold">
                            +{p.images.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <strong className="font-serif font-bold text-cream block truncate">{p.name}</strong>
                      <span className="text-[10px] text-cream/50">{p.brand} • {p.country} ({p.vintage})</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-gold-light">{p.sku}</td>
                    <td className="p-3 space-x-1">
                      {p.isNewArrival && (
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                          Mới Về
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="px-2 py-0.5 rounded bg-gold/20 text-gold text-[10px] font-bold border border-gold/30">
                          Nổi Bật
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="px-2 py-0.5 rounded bg-wine/60 text-gold-light text-[10px] font-bold border border-wine">
                          Bán Chạy
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-serif font-bold text-gold-light">{formatCurrency(p.price)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${p.stock <= p.lowStockThreshold ? 'bg-amber-950 text-amber-400 border border-amber-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'}`}>
                        {p.stock} chai
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleOpenEditModal(p)} className="p-2 rounded bg-dark-card text-gold hover:bg-gold/20" title="Chỉnh sửa">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          duplicateProduct(p.id);
                          addToast({ type: 'info', title: 'Đã nhân bản sản phẩm thành công!' });
                        }}
                        className="p-2 rounded bg-dark-card text-cream/70 hover:text-gold"
                        title="Nhân bản"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteProduct(p.id);
                          addToast({ type: 'warning', title: 'Đã xóa sản phẩm khỏi sàn!' });
                        }}
                        className="p-2 rounded bg-dark-card text-red-400 hover:bg-red-950"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Product Upload & Edit Modal with Image Uploader */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/95 backdrop-blur-2xl">
          <div className="w-full max-w-3xl glass-panel rounded-3xl border border-gold/30 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-light flex items-center gap-2">
                <Wine className="w-6 h-6 text-gold" />
                <span>{editingProduct ? 'Chỉnh Sửa Sản Phẩm Rượu Vang' : 'Tạo & Đăng Sản Phẩm Mới Lên Sàn'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-cream/50 hover:text-gold hover:bg-gold/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              
              {/* SECTION: Image Upload & Gallery Manager */}
              <div className="p-5 rounded-2xl bg-dark-card/90 border border-gold/25 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-serif text-sm font-bold text-gold-light flex items-center gap-2">
                    <ImageIcon className="w-4.5 h-4.5 text-gold" />
                    <span>Quản Lý Hình Ảnh Sản Phẩm ({images.length}) *</span>
                  </label>
                  <span className="text-[11px] text-cream/50">Kéo thả hoặc tải nhiều file ảnh cùng lúc</span>
                </div>

                {/* Upload Zone */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Drag & Drop File Input */}
                  <label className="sm:col-span-7 border-2 border-dashed border-gold/40 hover:border-gold bg-dark/50 hover:bg-gold/5 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center space-y-2 group">
                    <UploadCloud className="w-8 h-8 text-gold group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-cream">Nhấp vào đây hoặc kéo thả tập tin ảnh</span>
                    <span className="text-[10px] text-cream/50">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Add Image via URL link */}
                  <div className="sm:col-span-5 flex flex-col justify-between p-3.5 rounded-2xl bg-dark-surface border border-gold/15 space-y-2">
                    <span className="text-[11px] font-semibold text-cream/80">Hoặc chèn đường dẫn ảnh URL:</span>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://domain.com/wine.jpg"
                      className="w-full px-3 py-2 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="w-full py-2 rounded-xl bg-wine border border-gold/30 text-gold-light font-bold hover:border-gold"
                    >
                      + Thêm URL Ảnh
                    </button>
                  </div>
                </div>

                {/* Sample Wine Preset Images */}
                <div className="pt-2">
                  <span className="text-[11px] text-cream/60 block mb-2">Chọn mẫu ảnh rượu vang có sẵn:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {SAMPLE_WINE_IMAGES.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          if (!images.includes(img)) {
                            setImages((prev) => [...prev, img]);
                            addToast({ type: 'info', title: 'Đã thêm ảnh mẫu!' });
                          }
                        }}
                        className="relative w-12 h-12 rounded-xl overflow-hidden border border-gold/30 hover:border-gold flex-shrink-0 group"
                      >
                        <Image src={img} alt="" fill className="object-cover group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Uploaded Images Gallery Previews */}
                {images.length > 0 && (
                  <div className="pt-3 border-t border-gold/15 space-y-2">
                    <span className="text-[11px] text-gold font-semibold block">Danh sách ảnh sản phẩm (Click vào ảnh để đặt làm Ảnh Chính Đại Diện):</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {images.map((imgUrl, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                            index === 0
                              ? 'border-gold shadow-gold-glow ring-2 ring-gold/40'
                              : 'border-gold/20 hover:border-gold/50'
                          }`}
                        >
                          <Image src={imgUrl} alt={`Wine image ${index + 1}`} fill className="object-cover" />

                          {/* Primary Badge */}
                          {index === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gold text-dark text-[9px] font-extrabold flex items-center gap-0.5 shadow">
                              <CheckCircle2 className="w-3 h-3" /> Ảnh Chính
                            </span>
                          )}

                          {/* Controls overlay */}
                          <div className="absolute inset-0 bg-dark/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(index)}
                                className="p-1.5 rounded-lg bg-gold text-dark font-bold text-[10px] hover:scale-105"
                                title="Đặt làm ảnh chính"
                              >
                                Chính
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                              title="Xóa ảnh"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: Homepage Visibility Settings */}
              <div className="p-4 rounded-2xl bg-dark-card/60 border border-gold/20 space-y-2">
                <label className="font-serif text-sm font-bold text-gold-light flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-gold" />
                  <span>Vị Trí Hiển Thị Trên Trang Chủ (Homepage Visibility)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-dark-surface border border-gold/15 hover:border-gold">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="font-bold text-cream">✨ Mục Mới Về (New)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-dark-surface border border-gold/15 hover:border-gold">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="font-bold text-gold-light">🏆 Mục Nổi Bật (Featured)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-dark-surface border border-gold/15 hover:border-gold">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="font-bold text-cream">🔥 Mục Bán Chạy</span>
                  </label>
                </div>
              </div>

              {/* SECTION: Product Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Tên sản phẩm rượu vang *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Château Lafite Rothschild Pauillac 2018"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Mã SKU duy nhất *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="WCP-2026-99"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream font-mono uppercase focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Loại Rượu Vang *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WineCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold font-medium"
                  >
                    <option value="vang-do">Rượu Vang Đỏ (Red Wine)</option>
                    <option value="vang-trang">Rượu Vang Trắng (White Wine)</option>
                    <option value="vang-hong">Rượu Vang Hồng (Rosé Wine)</option>
                    <option value="champagne">Champagne Pháp Cao Cấp</option>
                    <option value="sparkling">Vang Sủi Bọt (Sparkling)</option>
                    <option value="vang-cao-cap">Bộ Sưu Tập Vang Cao Cấp</option>
                  </select>
                </div>

                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Thương hiệu / Nhà sản xuất *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Château Margaux, Dom Pérignon..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Quốc Gia Xuất Xứ *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold font-medium"
                  >
                    <option value="Pháp">🇫🇷 Pháp (France)</option>
                    <option value="Ý">🇮🇹 Ý (Italy)</option>
                    <option value="Chile">🇨🇱 Chile</option>
                    <option value="Mỹ">🇺🇸 Mỹ (USA)</option>
                    <option value="Úc">🇦🇺 Úc (Australia)</option>
                    <option value="Tây Ban Nha">🇪🇸 Tây Ban Nha (Spain)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Giá bán (VND) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-gold-light font-bold focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Tồn kho (Số chai) *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Niên vụ (Vintage)</label>
                  <input
                    type="number"
                    value={vintage}
                    onChange={(e) => setVintage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Dung tích (ml)</label>
                  <input
                    type="number"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-cream/70 block mb-1 font-semibold">Mô tả sản phẩm chi tiết</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả hương vị, lịch sử nhà làm vang và ghi chú Sommelier..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Ghi chú nếm thử (Sommelier Wine Notes)</label>
                  <input
                    type="text"
                    value={wineNotes}
                    onChange={(e) => setWineNotes(e.target.value)}
                    placeholder="Tuyết tùng, mâm xôi đen, gia vị sồi Pháp..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1 font-semibold">Gởi ý món ăn kết hợp (Wine Pairing)</label>
                  <input
                    type="text"
                    value={foodPairing}
                    onChange={(e) => setFoodPairing(e.target.value)}
                    placeholder="Bò bít tết Wagyu, đùi cừu đút lò..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gold/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-dark-card border border-gold/20 text-cream/70 hover:text-cream"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-wine-gradient text-gold-light font-bold border border-gold/40 hover:border-gold shadow-wine-glow uppercase tracking-wider"
                >
                  {editingProduct ? 'Lưu Cập Nhật' : 'Đăng Sản Phẩm Lên Sàn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
