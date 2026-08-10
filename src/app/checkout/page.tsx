'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useCartStore } from '@/store/useCartStore';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency } from '@/lib/utils/format';
import { Order, PaymentMethod } from '@/types';
import { ShieldCheck, CheckCircle2, Truck, CreditCard, Building2, Smartphone, ArrowRight, QrCode } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, clearCart, getSubtotal, getDiscountAmount, getShippingFee, getTotalAmount } = useCartStore();
  const { addOrder } = useAdminStore();
  const { user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [province, setProvince] = useState('Thành phố Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [ward, setWard] = useState('Phường Bến Nghé');
  const [streetAddress, setStreetAddress] = useState('88 Nguyễn Du');
  const [note, setNote] = useState('');

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shippingFee = shippingMethod === 'express' ? getShippingFee() + 30000 : getShippingFee();
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !email || !streetAddress) {
      addToast({
        type: 'error',
        title: 'Vui lòng nhập đầy đủ thông tin',
        description: 'Họ tên, số điện thoại, email và địa chỉ nhận hàng là bắt buộc.',
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `WCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        userId: user?.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          fullName,
          phone,
          email,
          province,
          district,
          ward,
          streetAddress,
          note,
        },
        items: items.map((i) => ({
          id: `oi-${Math.random()}`,
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.images[0],
          unitPrice: i.product.price,
          quantity: i.quantity,
          totalPrice: i.product.price * i.quantity,
        })),
        subtotal,
        discountAmount: discount,
        shippingFee,
        totalAmount,
        couponCode: coupon?.code,
        status: 'pending',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        note,
        createdAt: new Date().toISOString(),
      };

      addOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      setCompletedOrder(newOrder);
      addToast({
        type: 'success',
        title: 'Đặt hàng thành công!',
        description: `Đơn hàng ${orderNumber} đã được hệ thống WINECELLAR PRO xác nhận.`,
      });
    }, 1200);
  };

  if (completedOrder) {
    return (
      <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-burgundy/80 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-gold-light font-extrabold">
            Cảm Ơn Bạn Đã Đặt Hàng!
          </h1>

          <div className="p-6 rounded-2xl glass-panel border border-gold/30 text-left space-y-3">
            <div className="flex justify-between border-b border-gold/15 pb-2 text-xs">
              <span className="text-cream/60">Mã đơn hàng:</span>
              <strong className="text-gold font-mono">{completedOrder.orderNumber}</strong>
            </div>
            <div className="flex justify-between border-b border-gold/15 pb-2 text-xs">
              <span className="text-cream/60">Khách hàng:</span>
              <strong className="text-cream">{completedOrder.customerName} ({completedOrder.customerPhone})</strong>
            </div>
            <div className="flex justify-between border-b border-gold/15 pb-2 text-xs">
              <span className="text-cream/60">Địa chỉ giao hàng:</span>
              <strong className="text-cream">{completedOrder.shippingAddress.streetAddress}, {completedOrder.shippingAddress.ward}, {completedOrder.shippingAddress.district}, {completedOrder.shippingAddress.province}</strong>
            </div>
            <div className="flex justify-between border-b border-gold/15 pb-2 text-xs">
              <span className="text-cream/60">Phương thức thanh toán:</span>
              <strong className="text-gold-light uppercase">{completedOrder.paymentMethod}</strong>
            </div>

            {completedOrder.paymentMethod === 'bank_transfer' && (
              <div className="p-4 rounded-xl bg-burgundy/40 border border-gold/30 text-center space-y-2 mt-4">
                <span className="text-xs text-gold uppercase font-bold block">Thông tin chuyển khoản Ngân hàng</span>
                <div className="w-40 h-40 mx-auto relative rounded-lg overflow-hidden bg-white p-2">
                  <Image src="https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=400&auto=format&fit=crop&q=80" alt="Vietcombank QR" fill className="object-cover" />
                </div>
                <p className="text-xs text-cream/90">Ngân hàng: <strong>Vietcombank (Chi nhánh Q1)</strong></p>
                <p className="text-xs text-cream/90">Số tài khoản: <strong className="text-gold font-mono">9999 8888 6666</strong></p>
                <p className="text-xs text-cream/90">Chủ tài khoản: <strong>CÔNG TY TNHH KBWINE</strong></p>
                <p className="text-xs text-gold-light">Cú pháp: <strong className="font-mono">{completedOrder.orderNumber}</strong></p>
              </div>
            )}

            <div className="flex justify-between pt-2 text-sm font-bold">
              <span>Tổng đơn hàng:</span>
              <span className="font-serif text-xl text-gold-light">{formatCurrency(completedOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="py-3.5 px-8 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow"
            >
              Xem Chi Tiết Đơn Hàng Của Tôi
            </Link>
            <Link
              href="/products"
              className="py-3.5 px-8 rounded-xl bg-dark-card border border-gold/20 text-cream hover:text-gold text-xs font-bold"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl font-extrabold text-gold-light mb-8">
          Thanh Toán Đơn Hàng
        </h1>

        <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Shipping Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Info & Shipping Address */}
            <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2 border-b border-gold/15 pb-3">
                <Truck className="w-5 h-5 text-gold" /> 1. Thông Tin Nhận Hàng
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-cream/70 block mb-1">Họ & Tên người nhận *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-cream/70 block mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-cream/70 block mb-1">Email nhận hóa đơn *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-cream/70 block mb-1">Tỉnh / Thành *</label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-cream/70 block mb-1">Quận / Huyện *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-cream/70 block mb-1">Phường / Xã *</label>
                  <input
                    type="text"
                    required
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-cream/70 block mb-1">Số nhà & Tên đường *</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Ví dụ: 88 Nguyễn Du, Căn hộ Penthouse 12"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs text-cream/70 block mb-1">Ghi chú giao hàng đặc biệt</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Giao giờ hành chính, bảo quản đá gel khô..."
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* 2. Shipping Option */}
            <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2 border-b border-gold/15 pb-3">
                <Truck className="w-5 h-5 text-gold" /> 2. Hình Thức Vận Chuyển
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    shippingMethod === 'standard'
                      ? 'bg-gold/15 border-gold shadow-gold-glow'
                      : 'bg-dark-card border-gold/15 hover:border-gold/40'
                  }`}
                >
                  <input type="radio" checked={shippingMethod === 'standard'} readOnly className="accent-gold mt-1" />
                  <div>
                    <strong className="text-xs font-serif text-gold-light block">Giao Tiêu Chuẩn (1-2 ngày)</strong>
                    <span className="text-[11px] text-cream/60">Bảo quản hầm chuyên dụng</span>
                  </div>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    shippingMethod === 'express'
                      ? 'bg-wine/30 border-wine shadow-wine-glow'
                      : 'bg-dark-card border-gold/15 hover:border-gold/40'
                  }`}
                >
                  <input type="radio" checked={shippingMethod === 'express'} readOnly className="accent-gold mt-1" />
                  <div>
                    <strong className="text-xs font-serif text-gold-light block">Giao Hỏa Tốc VIP 2 Giờ</strong>
                    <span className="text-[11px] text-cream/60">Thùng ướp lạnh sẵn sàng uống</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 rounded-2xl glass-panel border border-gold/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-gold-light flex items-center gap-2 border-b border-gold/15 pb-3">
                <CreditCard className="w-5 h-5 text-gold" /> 3. Phương Thức Thanh Toán
              </h3>

              <div className="space-y-3">
                {[
                  { id: 'bank_transfer', name: 'Chuyển Khoản Ngân Hàng (QR Code Vietcombank / BIDV)', icon: Building2, desc: 'Giảm 2% tối đa 200k khi thanh toán quét mã QR.' },
                  { id: 'cod', name: 'Thanh Toán Khi Nhận Hàng (COD)', icon: CreditCard, desc: 'Thanh toán tiền mặt cho nhân viên giao hàng sau khi kiểm tra rượu.' },
                  { id: 'vnpay', name: 'Cổng Thanh Toán VNPay (Thẻ ATM/Visa/MasterCard)', icon: ShieldCheck, desc: 'Tự động duyệt đơn lập tức qua VNPAY Gateway.' },
                  { id: 'momo', name: 'Ví Điện Tử MoMo', icon: Smartphone, desc: 'Thanh toán tức thì qua ứng dụng MoMo.' },
                  { id: 'zalopay', name: 'Ví Điện Tử ZaloPay', icon: Smartphone, desc: 'Thanh toán nhanh chóng qua ứng dụng ZaloPay.' },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <label
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-burgundy/50 border-gold shadow-wine-glow'
                          : 'bg-dark-card border-gold/15 hover:border-gold/40'
                      }`}
                    >
                      <input type="radio" checked={isSelected} readOnly className="accent-gold mt-1" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-cream flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gold" /> {pm.name}
                        </span>
                        <p className="text-[11px] text-cream/60">{pm.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Order Summary & Confirm */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl glass-panel border border-gold/30 space-y-6 shadow-luxury sticky top-28">
              <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3">
                Đơn Hàng Của Bạn ({items.length})
              </h3>

              {/* Items List Mini */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 text-xs">
                    <div className="relative w-10 h-12 rounded bg-dark-card overflow-hidden flex-shrink-0">
                      <Image src={product.images[0]} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 truncate">
                      <h4 className="font-serif font-semibold text-cream truncate">{product.name}</h4>
                      <span className="text-[11px] text-cream/50">x{quantity}</span>
                    </div>
                    <strong className="text-gold-light">{formatCurrency(product.price * quantity)}</strong>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs border-y border-gold/15 py-4">
                <div className="flex justify-between text-cream/80">
                  <span>Tạm tính:</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gold-light">
                    <span>Giảm giá Voucher:</span>
                    <strong>-{formatCurrency(discount)}</strong>
                  </div>
                )}
                <div className="flex justify-between text-cream/80">
                  <span>Phí giao hàng:</span>
                  <strong>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</strong>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-cream">Tổng Cộng:</span>
                <span className="font-serif text-2xl font-extrabold text-gold-light">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 rounded-xl bg-wine-gradient text-gold-light font-bold text-sm tracking-wider uppercase border border-gold/50 hover:border-gold hover:shadow-wine-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang Xử Lý Đơn Hàng...</span>
                ) : (
                  <>
                    <span>XÁC NHẬN ĐẶT HÀNG</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
