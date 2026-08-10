'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { useAdminStore } from '@/store/useAdminStore';
import { useToastStore } from '@/store/useToastStore';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const { storeSettings } = useAdminStore();
  const addToast = useToastStore((state) => state.addToast);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !message) {
      addToast({ type: 'error', title: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }
    addToast({
      type: 'success',
      title: 'Đã gửi lời nhắn thành công!',
      description: 'Chuyên viên Sommelier VIP của WINECELLAR PRO sẽ phản hồi lại bạn trong vòng 15 phút.',
    });
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <main className="min-h-screen bg-dark text-cream font-sans selection:bg-gold selection:text-dark">
      <Header />

      <div className="bg-dark-surface border-b border-gold/20 py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-gold">LIÊN HỆ KBWINE</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gold-light">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-sm text-cream/70">
            Hệ thống showroom & hầm rượu vang chính hãng bảo quản nhiệt độ chuẩn tại Hà Nội & TP. Hồ Chí Minh.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl glass-panel border border-gold/30 space-y-6 shadow-luxury">
              <h3 className="font-serif text-xl font-bold text-gold-light border-b border-gold/15 pb-3">
                Showroom WINECELLAR PRO
              </h3>

              <div className="space-y-4 text-xs text-cream/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cream block font-serif">Địa chỉ hầm vang chính:</strong>
                    <p>{storeSettings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cream block font-serif">Hotline VIP tư vấn 24/7:</strong>
                    <p className="text-gold font-bold">{storeSettings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cream block font-serif">Email hỗ trợ:</strong>
                    <p>{storeSettings.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cream block font-serif">Giờ mở cửa Showroom:</strong>
                    <p>8:00 AM - 10:00 PM (Tất cả các ngày trong tuần)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl glass-panel border border-gold/30 space-y-6 shadow-luxury">
              <h3 className="font-serif text-xl font-bold text-gold-light border-b border-gold/15 pb-3">
                Gửi Yêu Cầu Tư Vấn Rượu Vang VIP
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-cream/70 block mb-1">Họ & Tên của bạn *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn Hùng"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-cream/70 block mb-1">Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0908 123 456"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-cream/70 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hung.nguyen@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-cream/70 block mb-1">Nội dung thắc mắc / Yêu cầu đặt tiệc *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tư vấn set quà tặng doanh nghiệp hoặc đặt hầm vang làm tiệc..."
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-card border border-gold/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-wine-gradient text-gold-light font-bold text-xs border border-gold/40 hover:border-gold shadow-wine-glow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>Gửi Lời Nhắn</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
