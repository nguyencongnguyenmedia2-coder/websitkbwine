'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useCartStore } from '@/store/useCartStore';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { formatCurrency } from '@/lib/utils/format';
import { ShoppingBag, Trash2, ArrowRight, Ticket, Plus, Minus, ShieldCheck, Wine } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    coupon,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotalAmount,
  } = useCartStore();

  const { coupons, storeSettings } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [couponInput, setCouponInput] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotalAmount();

  const freeShippingThreshold = storeSettings.freeShippingThreshold;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const found = coupons.find((c) => c.code.toLowerCase() === couponInput.trim().toLowerCase() && c.isActive);
    if (!found) {
      addToast({
        type: 'error',
        title: 'Mã giảm giá không hợp lệ',
        description: 'Vui lòng kiểm tra lại mã coupon hoặc điều kiện sử dụng.',
      });
      return;
    }

    if (subtotal < found.minOrderValue) {
      addToast({
        type: 'warning',
        title: 'Chưa đủ giá trị tối thiểu',
        description: `Mã ${found.code} áp dụng cho đơn hàng từ ${formatCurrency(found.minOrderValue)}.`,
      });
      return;
    }

    applyCoupon(found);
    addToast({
      type: 'success',
      title: 'Đã áp dụng ưu đãi!',
      description: `Áp dụng thành công mã voucher ${found.code}.`,
    });
    setCouponInput('');
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-burgundy border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-gold-light">Giỏ Hàng Của Bạn</h1>
            <p className="text-xs text-cream/60">Quản lý và kiểm tra danh sách sản phẩm rượu vang trước khi thanh toán</p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items List Table */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Indicator */}
              <div className="p-4 rounded-2xl glass-panel border border-gold/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gold-light font-semibold">
                    {subtotal >= freeShippingThreshold ? (
                      '🎉 Chúc mừng! Bạn được MIỄN PHÍ VẬN CHUYỂN Toàn Quốc'
                    ) : (
                      <>Mua thêm <strong className="text-gold">{formatCurrency(remainingForFreeShipping)}</strong> để được Miễn Phí Giao Hàng Hỏa Tốc</>
                    )}
                  </span>
                  <span className="font-bold text-gold">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-card overflow-hidden">
                  <div
                    className="h-full bg-gold-gradient transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl glass-panel border border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-dark-card flex-shrink-0 border border-gold/20">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-gold uppercase font-bold tracking-wider">
                          {product.brand} • {product.vintage}
                        </span>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-serif text-sm font-semibold text-cream hover:text-gold transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="text-xs font-bold text-gold-light block">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gold/10">
                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-xl bg-dark-card border border-gold/20 p-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-cream hover:bg-gold/20 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-gold-light">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-cream hover:bg-gold/20 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="font-serif text-sm font-bold text-gold-light w-28 text-right">
                        {formatCurrency(product.price * quantity)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-cream/40 hover:text-red-400 p-2 transition-colors"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={clearCart}
                  className="text-cream/50 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả giỏ hàng
                </button>
                <Link href="/products" className="text-gold hover:underline">
                  ← Tiếp tục chọn rượu vang
                </Link>
              </div>
            </div>

            {/* Cart Summary Column */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-2xl glass-panel border border-gold/30 space-y-6 shadow-luxury sticky top-28">
                <h3 className="font-serif text-lg font-bold text-gold-light border-b border-gold/15 pb-3">
                  Tóm Tắt Đơn Hàng
                </h3>

                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs text-cream/70 block">Mã ưu đãi / Voucher:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="LUXURYWINE, WELCOME500..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-wine border border-gold/40 text-gold-light font-bold text-xs hover:border-gold"
                    >
                      Áp Dụng
                    </button>
                  </div>

                  {coupon && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gold/15 border border-gold/30 text-xs text-gold-light">
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5 text-gold" /> Đã áp dụng: <strong>{coupon.code}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => applyCoupon(null)}
                        className="text-cream/60 hover:text-red-400 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </form>

                {/* Cost breakdown */}
                <div className="space-y-3 text-xs border-y border-gold/15 py-4">
                  <div className="flex justify-between text-cream/80">
                    <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm):</span>
                    <strong className="text-cream">{formatCurrency(subtotal)}</strong>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-gold-light">
                      <span>Giảm giá Voucher ({coupon?.code}):</span>
                      <strong>-{formatCurrency(discount)}</strong>
                    </div>
                  )}
                  <div className="flex justify-between text-cream/80">
                    <span>Phí vận chuyển bảo quản lạnh:</span>
                    <strong className="text-cream">
                      {shipping === 0 ? 'Miễn Phí' : formatCurrency(shipping)}
                    </strong>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-cream">Tổng Thanh Toán:</span>
                  <span className="font-serif text-2xl font-extrabold text-gold-light">
                    {formatCurrency(total)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="block w-full py-4 rounded-xl bg-wine-gradient text-gold-light font-bold text-sm text-center border border-gold/50 hover:border-gold hover:shadow-wine-glow transition-all uppercase tracking-wider"
                >
                  TIẾN HÀNH THANH TOÁN
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-cream/50 text-center">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Bảo mật giao dịch an toàn 100% qua SSL 256-bit</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center glass-panel rounded-2xl border border-gold/20 max-w-2xl mx-auto space-y-4">
            <Wine className="w-16 h-16 text-gold/30 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-cream">Giỏ Hàng Của Bạn Đang Trống</h2>
            <p className="text-xs text-cream/60 max-w-sm mx-auto">
              Hãy khám phá hầm rượu vang WINECELLAR PRO và bổ sung những chai vang tuyệt tác vào bộ sưu tập của bạn.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow"
            >
              <span>KHÁM PHÁ SẢN PHẨM NGAY</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        )}
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
