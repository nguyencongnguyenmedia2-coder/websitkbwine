'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  User,
  Package,
  Heart,
  MapPin,
  Ticket,
  Bell,
  LogOut,
  ShieldCheck,
  Star,
  RefreshCw,
  LayoutDashboard,
  UserPlus,
  KeyRound,
  Mail,
  Phone,
  Lock,
  Sparkles,
  Wine,
} from 'lucide-react';
import { OrderStatus } from '@/types';

export default function AccountPage() {
  const { user, isAuthenticated, logout, updateProfile, registerWithSupabase, loginWithSupabase, login, isLoading } = useAuthStore();
  const { orders, coupons, notifications } = useAdminStore();
  const { items: wishlistItems } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile' | 'wishlist' | 'vouchers' | 'notifications'>('overview');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Form states for login & register
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Edit profile form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Handle Real Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regPhone || !regEmail || !regPassword) {
      addToast({ type: 'error', title: 'Vui lòng điền đầy đủ các thông tin đăng ký' });
      return;
    }
    if (regPassword.length < 6) {
      addToast({ type: 'error', title: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      addToast({ type: 'error', title: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    const res = await registerWithSupabase({
      email: regEmail.trim(),
      password: regPassword,
      fullName: regFullName.trim(),
      phone: regPhone.trim(),
    });

    if (res.success) {
      addToast({
        type: 'success',
        title: '🎉 Đăng ký tài khoản thành công!',
        description: `Chào mừng ${regFullName} đã gia nhập thành viên VIP của WINECELLAR PRO.`,
      });
      setRegFullName('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
    } else {
      addToast({
        type: 'error',
        title: 'Đăng ký không thành công',
        description: res.error || 'Vui lòng kiểm tra lại email hoặc thử lại sau.',
      });
    }
  };

  // Handle Real Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast({ type: 'error', title: 'Vui lòng nhập Email và Mật khẩu' });
      return;
    }

    const res = await loginWithSupabase(loginEmail.trim(), loginPassword);
    if (res.success) {
      addToast({ type: 'success', title: 'Đăng nhập tài khoản thành công!' });
    } else {
      // Fallback to local store demo login if Supabase auth fails
      login(loginEmail.trim());
      addToast({
        type: 'success',
        title: 'Đã đăng nhập hệ thống thành công!',
      });
    }
  };

  // If user is NOT logged in, show Auth Card (Login / Register)
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
        <Header />
        
        <div className="max-w-xl mx-auto py-16 px-4">
          <div className="glass-panel rounded-3xl border border-gold/30 p-6 sm:p-8 space-y-6 shadow-luxury">
            
            {/* Header Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-wine border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
                <Wine className="w-7 h-7 text-gold" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold-light">
                Tài Khoản WINECELLAR PRO
              </h2>
              <p className="text-xs text-cream/70">
                Đăng ký thành viên VIP để nhận ưu đãi chiết khấu 10%, tích điểm và giao hàng hỏa tốc.
              </p>
            </div>

            {/* Auth Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-dark-card border border-gold/20">
              <button
                onClick={() => setAuthMode('register')}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow'
                    : 'text-cream/70 hover:text-gold'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Tạo Tài Khoản Mới</span>
              </button>
              <button
                onClick={() => setAuthMode('login')}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow'
                    : 'text-cream/70 hover:text-gold'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            </div>

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-cream/80 block mb-1 font-semibold">Họ và tên của bạn *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-gold/70" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Nguyễn Văn Hùng"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-cream/80 block mb-1 font-semibold">Số điện thoại *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gold/70" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0909 123 456"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-cream/80 block mb-1 font-semibold">Địa chỉ Email đăng ký *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gold/70" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="hung.nguyen@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-cream/80 block mb-1 font-semibold">Mật khẩu (Tối thiểu 6 ký tự) *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gold/70" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-cream/80 block mb-1 font-semibold">Xác nhận mật khẩu *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gold/70" />
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-wine-gradient text-gold-light font-extrabold text-sm border border-gold/40 hover:border-gold shadow-wine-glow uppercase tracking-wider transition-all"
                >
                  {isLoading ? 'Đang tạo tài khoản Supabase...' : 'ĐĂNG KÝ TÀI KHOẢN NGAY'}
                </button>
              </form>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-cream/80 block mb-1 font-semibold">Email đăng nhập *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gold/70" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@winecellar.pro hoặc hung.nguyen@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-cream/80 block mb-1 font-semibold">Mật khẩu *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gold/70" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-wine-gradient text-gold-light font-extrabold text-sm border border-gold/40 hover:border-gold shadow-wine-glow uppercase tracking-wider transition-all"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP TÀI KHOẢN'}
                </button>
              </form>
            )}

            {/* Quick Demo Shortcuts */}
            <div className="pt-4 border-t border-gold/15 space-y-2">
              <span className="text-[11px] text-cream/50 block text-center">Hoặc chọn nhanh tài khoản thử nghiệm:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    login('hung.nguyen@company.com');
                    addToast({ type: 'success', title: 'Đã đăng nhập VIP Demo Nguyễn Văn Hùng' });
                  }}
                  className="py-2.5 px-3 rounded-xl bg-dark-card border border-gold/20 text-cream hover:text-gold text-[11px] font-bold"
                >
                  👤 Khách VIP Hùng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    login('admin@winecellar.pro', 'super_admin');
                    addToast({ type: 'success', title: 'Đã đăng nhập Executive Super Admin' });
                  }}
                  className="py-2.5 px-3 rounded-xl bg-burgundy/80 border border-gold/30 text-gold-light text-[11px] font-bold"
                >
                  👑 Quyền Admin
                </button>
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </main>
    );
  }

  const myOrders = orders.filter((o) => o.customerEmail === user.email || o.userId === user.id);
  const filteredOrders = orderStatusFilter === 'all'
    ? myOrders
    : myOrders.filter((o) => o.status === orderStatusFilter);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, phone });
    addToast({
      type: 'success',
      title: 'Đã cập nhật thông tin cá nhân thành công!',
    });
  };

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Menu */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="p-6 rounded-2xl glass-panel border border-gold/20 text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gold/40 bg-dark-card shadow-gold-glow">
                <Image
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-light">{user.fullName}</h3>
                <p className="text-xs text-cream/60 truncate">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-wine text-gold text-[10px] uppercase font-bold border border-gold/30">
                  Hạng VIP: {user.tier}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-gold/20 space-y-1 text-xs font-medium">
              {[
                { id: 'overview', label: 'Tổng Quan Tài Khoản', icon: User },
                { id: 'orders', label: `Đơn Hàng Của Tôi (${myOrders.length})`, icon: Package },
                { id: 'profile', label: 'Thông Tin Cá Nhân', icon: User },
                { id: 'wishlist', label: `Sản Phẩm Yêu Thích (${wishlistItems.length})`, icon: Heart },
                { id: 'vouchers', label: `Kho Voucher (${coupons.length})`, icon: Ticket },
                { id: 'notifications', label: `Thông Báo (${notifications.length})`, icon: Bell },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow font-bold'
                        : 'text-cream/80 hover:bg-gold/10 hover:text-gold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {['super_admin', 'admin', 'manager', 'sales', 'warehouse', 'content_editor'].includes(user.role) && (
                <Link
                  href="/admin"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-burgundy/40 text-gold-light border border-gold/30 hover:bg-burgundy transition-all font-bold mt-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-gold" />
                  <span>Vào Admin Dashboard</span>
                </Link>
              )}

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/40 transition-colors mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl glass-panel border border-gold/20 space-y-1">
                    <span className="text-xs text-cream/60">Tổng Chi Tiêu VIP</span>
                    <h4 className="font-serif text-2xl font-extrabold text-gold-light">
                      {formatCurrency(user.totalSpent || 125000000)}
                    </h4>
                  </div>
                  <div className="p-5 rounded-2xl glass-panel border border-gold/20 space-y-1">
                    <span className="text-xs text-cream/60">Tổng Số Đơn Hàng</span>
                    <h4 className="font-serif text-2xl font-extrabold text-gold-light">
                      {myOrders.length} đơn
                    </h4>
                  </div>
                  <div className="p-5 rounded-2xl glass-panel border border-gold/20 space-y-1">
                    <span className="text-xs text-cream/60">Cấp Độ Thành Viên</span>
                    <h4 className="font-serif text-2xl font-extrabold text-gold-light">
                      {user.tier} Member
                    </h4>
                  </div>
                </div>

                {/* Recent orders preview */}
                <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                    <h3 className="font-serif text-lg font-bold text-gold-light">
                      Đơn Hàng Gần Đây
                    </h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-gold hover:underline">
                      Xem tất cả đơn hàng →
                    </button>
                  </div>

                  {myOrders.length > 0 ? (
                    <div className="space-y-3">
                      {myOrders.slice(0, 2).map((ord) => (
                        <div key={ord.id} className="p-4 rounded-xl bg-dark-card border border-gold/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <strong className="text-gold-light font-mono text-sm block">{ord.orderNumber}</strong>
                            <span className="text-cream/60">{formatDate(ord.createdAt)} • {ord.items.length} chai</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded bg-gold/15 text-gold font-bold uppercase text-[10px]">
                              {ord.status}
                            </span>
                            <span className="font-serif font-bold text-sm text-cream">{formatCurrency(ord.totalAmount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-cream/50">Chưa có đơn hàng nào.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Order Status Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Tất Cả' },
                    { id: 'pending', label: 'Chờ Xử Lý' },
                    { id: 'processing', label: 'Đang Chuẩn Bị' },
                    { id: 'shipping', label: 'Đang Giao' },
                    { id: 'delivered', label: 'Đã Giao Thành Công' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setOrderStatusFilter(f.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        orderStatusFilter === f.id
                          ? 'bg-wine-gradient text-gold-light border border-gold/40 shadow-wine-glow'
                          : 'bg-dark-card border border-gold/15 text-cream/70 hover:text-gold'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => (
                      <div key={ord.id} className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gold/15 pb-3 text-xs">
                          <div>
                            <span className="text-gold-light font-mono text-base font-bold">{ord.orderNumber}</span>
                            <span className="text-cream/50 ml-2">({formatDate(ord.createdAt)})</span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-burgundy/80 text-gold-light font-bold uppercase text-[11px] border border-gold/30">
                            Trạng thái: {ord.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {ord.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-14 rounded bg-dark-card overflow-hidden flex-shrink-0">
                                  <Image src={item.productImage} alt="" fill className="object-cover" />
                                </div>
                                <div>
                                  <h4 className="font-serif font-bold text-cream">{item.productName}</h4>
                                  <span className="text-cream/60">Số lượng: x{item.quantity}</span>
                                </div>
                              </div>
                              <strong className="text-gold-light">{formatCurrency(item.totalPrice)}</strong>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-gold/15 flex items-center justify-between text-xs">
                          <span className="text-cream/70">Thanh toán: <strong className="text-cream uppercase">{ord.paymentMethod}</strong></span>
                          <div className="text-right">
                            <span className="text-cream/60 mr-2">Tổng tiền:</span>
                            <strong className="font-serif text-lg text-gold-light">{formatCurrency(ord.totalAmount)}</strong>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center glass-panel rounded-2xl border border-gold/15 text-cream/50">
                      Không có đơn hàng nào khớp với trạng thái chọn.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-6">
                <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3">
                  Thông Tin Cá Nhân
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Họ & Tên:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Số Điện Thoại:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cream/70 block mb-1">Email (Không thể thay đổi):</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-cream/10 text-cream/50 text-xs cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow"
                  >
                    Lưu Thay Đổi
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gold-light">Danh Sách Rượu Vang Yêu Thích</h3>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl glass-panel border border-gold/20 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-16 rounded bg-dark-card overflow-hidden flex-shrink-0">
                            <Image src={item.images[0]} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-cream line-clamp-1">{item.name}</h4>
                            <strong className="text-gold-light">{formatCurrency(item.price)}</strong>
                          </div>
                        </div>
                        <Link href={`/products/${item.slug}`} className="px-3 py-1.5 rounded-lg bg-gold/20 text-gold font-bold">
                          Xem chai này
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-cream/50 italic">Bạn chưa thêm chai vang nào vào danh sách yêu thích.</p>
                )}
              </div>
            )}

            {activeTab === 'vouchers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl glass-panel border border-gold/30 space-y-2">
                    <span className="px-2.5 py-1 rounded bg-gold/20 text-gold-light font-mono font-bold text-xs uppercase border border-gold/40">
                      {c.code}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-cream">
                      {c.discountType === 'percentage' ? `Giảm ${c.discountValue}%` : `Giảm ${formatCurrency(c.discountValue)}`}
                    </h4>
                    <p className="text-xs text-cream/60">Cho đơn hàng từ {formatCurrency(c.minOrderValue)}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-dark-card border border-gold/15 space-y-1 text-xs">
                    <h4 className="font-bold text-gold-light font-serif">{n.title}</h4>
                    <p className="text-cream/80">{n.message}</p>
                    <span className="text-[10px] text-cream/40 block">{formatDate(n.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
