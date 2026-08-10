'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wine,
  Send,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  Building2,
  Award,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { useAdminStore } from '@/store/useAdminStore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const addToast = useToastStore((state) => state.addToast);
  const { storeSettings } = useAdminStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Email không hợp lệ',
        description: 'Vui lòng nhập đúng định dạng email để nhận bản tin ưu đãi.',
      });
      return;
    }
    addToast({
      type: 'success',
      title: 'Đăng ký nhận tin thành công!',
      description: `Cảm ơn bạn đã tham gia ${storeSettings.storeName} Club. Mã ưu đãi WELCOME500 đã được gửi đến email của bạn.`,
    });
    setEmail('');
  };

  return (
    <footer className="bg-dark-surface border-t border-gold/20 pt-16 pb-12 font-sans relative overflow-hidden text-cream">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-burgundy/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Banner */}
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-gold/30 mb-16 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-semibold uppercase tracking-wider border border-gold/30">
                <Award className="w-3.5 h-3.5" /> Exclusive VIP Club
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-gold-light font-bold">
                Đăng Ký Nhận Đặc Quyền & Thử Vang Hiếm
              </h3>
              <p className="text-sm text-cream/75 leading-relaxed">
                Nhận ngay voucher <strong className="text-gold">500.000₫</strong> cho đơn hàng đầu tiên và thông báo sớm nhất về các lô vang Grand Cru vừa cập cảng.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="flex-1 px-4 py-3.5 rounded-xl bg-dark/90 border border-gold/20 text-cream placeholder-cream/40 focus:outline-none focus:border-gold text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-wine-gradient text-gold-light font-bold text-sm border border-gold/40 hover:border-gold hover:shadow-wine-glow transition-all duration-300 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>Đăng Ký</span>
                  <Send className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 text-sm">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-burgundy border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
                <Wine className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-gold-light">
                {storeSettings.storeName}
              </span>
            </Link>

            <p className="text-xs text-cream/70 leading-relaxed max-w-sm">
              <strong className="text-gold-light font-serif">{storeSettings.storeName}</strong> là đơn vị nhập khẩu và phân phối rượu vang cao cấp chính hãng hàng đầu Việt Nam. Nơi lưu trữ hàng nghìn tuyệt tác từ các điền trang lâu đời bậc nhất thế giới.
            </p>

            <div className="space-y-2.5 text-xs text-cream/80 pt-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Địa chỉ: <strong className="text-cream">{storeSettings.address}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Hotline: <strong className="text-gold-light font-bold">{storeSettings.phone}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Email: <strong className="text-cream">{storeSettings.email}</strong></span>
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Youtube, href: 'https://youtube.com' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-dark-card border border-gold/20 flex items-center justify-center text-cream/70 hover:text-gold hover:border-gold transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base text-gold-light font-semibold mb-4 tracking-wide uppercase">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2.5 text-xs text-cream/70">
              <li><Link href="/products?category=vang-do" className="hover:text-gold transition-colors">Rượu Vang Đỏ (Red Wine)</Link></li>
              <li><Link href="/products?category=vang-trang" className="hover:text-gold transition-colors">Rượu Vang Trắng (White Wine)</Link></li>
              <li><Link href="/products?category=vang-hong" className="hover:text-gold transition-colors">Rượu Vang Hồng (Rosé Wine)</Link></li>
              <li><Link href="/products?category=champagne" className="hover:text-gold transition-colors">Champagne Pháp Cao Cấp</Link></li>
              <li><Link href="/products?category=sparkling" className="hover:text-gold transition-colors">Vang Sủi Bọt (Sparkling)</Link></li>
              <li><Link href="/products?category=vang-cao-cap" className="hover:text-gold transition-colors">Vang Đắt Giá Icon Wine</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-base text-gold-light font-semibold mb-4 tracking-wide uppercase">
              Dịch Vụ & Hỗ Trợ
            </h4>
            <ul className="space-y-2.5 text-xs text-cream/70">
              <li><Link href="/ai-assistant" className="hover:text-gold transition-colors">Trợ Lý AI Tư Vấn Chọn Vang</Link></li>
              <li><Link href="/account" className="hover:text-gold transition-colors">Theo Dõi Đơn Hàng</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Chính Sách Giao Hàng Hỏa Tốc</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Bảo Quản & Đổi Trả 1-1</Link></li>
              <li><Link href="/blog" className="hover:text-gold transition-colors">Cẩm Nang Kiến Thức Rượu Vang</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Giải Đáp Thắc Mắc (FAQ)</Link></li>
            </ul>
          </div>

          {/* Payment Methods Integrations Showcase */}
          <div>
            <h4 className="font-serif text-base text-gold-light font-semibold mb-4 tracking-wide uppercase">
              Thanh Toán An Toàn
            </h4>
            <p className="text-xs text-cream/70 mb-4">
              Hỗ trợ đa dạng phương thức thanh toán bảo mật với mã hóa 256-bit:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-dark-card border border-gold/15 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Thanh Toán COD</span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-card border border-gold/15 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Chuyển Khoản QR</span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-card border border-gold/15 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Cổng VNPay</span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-card border border-gold/15 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                <span>Ví MoMo / ZaloPay</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-burgundy/30 border border-gold/20 text-[11px] text-gold-light">
              ✨ Miễn phí vận chuyển cho đơn hàng từ {storeSettings.freeShippingThreshold.toLocaleString('vi-VN')}₫
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="border-t border-gold/15 pt-8 text-center text-xs text-cream/50 space-y-2">
          <p>
            © {new Date().getFullYear()} {storeSettings.storeName}. Tất cả quyền được bảo lưu.
          </p>
          <p className="max-w-3xl mx-auto text-[11px] leading-relaxed text-cream/40">
            * Cảnh báo: Tuân thủ quy định của Luật Phòng, chống tác hại của rượu, bia. Sản phẩm rượu vang không dành cho người dưới 18 tuổi và phụ nữ đang mang thai. Thưởng thức rượu vang có trách nhiệm - Không lái xe sau khi uống rượu bia.
          </p>
        </div>
      </div>
    </footer>
  );
}
