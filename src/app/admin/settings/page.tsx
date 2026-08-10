'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { Settings, Layout, Store, ShieldCheck, Save, Eye, EyeOff } from 'lucide-react';

export default function AdminSettingsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { homepageSections, toggleHomepageSection, storeSettings, updateStoreSettings } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [storeName, setStoreName] = useState(storeSettings.storeName);
  const [phone, setPhone] = useState(storeSettings.phone);
  const [email, setEmail] = useState(storeSettings.email);
  const [address, setAddress] = useState(storeSettings.address);
  const [shippingFee, setShippingFee] = useState(storeSettings.shippingFee);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(storeSettings.freeShippingThreshold);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      storeName,
      phone,
      email,
      address,
      shippingFee,
      freeShippingThreshold,
    });
    addToast({
      type: 'success',
      title: 'Đã lưu cấu hình cửa hàng thành công!',
    });
  };

  return (
    <div className="min-h-screen bg-dark text-cream font-sans flex">
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <main className="p-6 space-y-8">
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-gold-light">Cấu Hình Cửa Hàng & Tùy Biến Trang Chủ</h1>
            <p className="text-xs text-cream/60">Bật/tắt các Section trang chủ, thay đổi hotline, địa chỉ kho và phí giao hàng</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Homepage Section Toggles (Section 34 Requirement) */}
            <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-gold/20 space-y-6 shadow-luxury">
              <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2 border-b border-gold/15 pb-3">
                <Layout className="w-5 h-5 text-gold" />
                <span>Tùy Biến Giao Diện Trang Chủ (No-Code)</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { key: 'hero', label: 'Hero Banner Vang Cao Cấp' },
                  { key: 'featuredProducts', label: 'Khối Sản Phẩm Nổi Bật & Bán Chạy' },
                  { key: 'collections', label: 'Bộ Sưu Tập Quốc Gia (Pháp, Ý, Chile, Úc)' },
                  { key: 'blog', label: 'Góc Nhìn Sommelier & Blog Rượu Vang' },
                  { key: 'reviews', label: 'Đánh Giá & Nhận Xét Từ Khách Hàng VIP' },
                  { key: 'newsletter', label: 'Đăng Ký Nhận Bản Tin & Voucher 500k' },
                ].map((item) => {
                  const isVisible = (homepageSections as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-xl bg-dark-card border border-gold/15 flex items-center justify-between"
                    >
                      <span className="font-medium text-cream">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => {
                          toggleHomepageSection(item.key as any);
                          addToast({
                            type: 'info',
                            title: `Đã ${!isVisible ? 'bật' : 'tắt'} ${item.label}`,
                          });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                          isVisible
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-dark-surface text-cream/40 border border-white/10'
                        }`}
                      >
                        {isVisible ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Hiển Thị</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Đã Ẩn</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Store Information Settings */}
            <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-gold/20 space-y-6 shadow-luxury">
              <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2 border-b border-gold/15 pb-3">
                <Store className="w-5 h-5 text-gold" />
                <span>Thông Tin Cửa Hàng & Vận Chuyển</span>
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="text-cream/70 block mb-1">Tên Thương Hiệu:</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1">Hotline VIP:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1">Email Liên Hệ:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream"
                  />
                </div>
                <div>
                  <label className="text-cream/70 block mb-1">Địa Chỉ Hầm Vang:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-cream/70 block mb-1">Phí vận chuyển chuẩn (VND):</label>
                    <input
                      type="number"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream"
                    />
                  </div>
                  <div>
                    <label className="text-cream/70 block mb-1">Hạn mức Miễn Phí Ship (VND):</label>
                    <input
                      type="number"
                      value={freeShippingThreshold}
                      onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-gold" />
                  <span>Lưu Cấu Hình Cửa Hàng</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
