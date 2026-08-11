import type { Metadata } from 'next';
import './globals.css';
import ToastContainer from '@/components/ui/ToastContainer';
import AgeGateModal from '@/components/ui/AgeGateModal';
import PromoBannerModal from '@/components/ui/PromoBannerModal';

export const metadata: Metadata = {
  title: 'KBWINE | Premium Luxury Wine Store',
  description: 'Hệ thống thương mại điện tử rượu vang cao cấp chính hãng KBWINE hàng đầu Việt Nam. Nơi lưu trữ tuyệt tác vang Bordeaux, Grand Cru Classé 1855, Dom Pérignon, Opus One, Barolo.',
  keywords: ['kbwine', 'rượu vang cao cấp', 'rượu vang hà nội', 'vang bordeaux', 'champagne dom perignon', 'opus one', 'vang pháp', 'vang ý'],
  openGraph: {
    title: 'KBWINE | Premium Luxury Wine Store',
    description: 'Nền tảng mua sắm rượu vang nhập khẩu cao cấp KBWINE, dịch vụ Sommelier AI và giao hàng bảo quản lạnh 2H.',
    url: 'https://kbwine.vn',
    siteName: 'KBWINE',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'KBWINE Luxury Wine Store',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KBWINE | Premium Luxury Wine Store',
    description: 'Hệ thống thương mại điện tử rượu vang cao cấp chính hãng KBWINE.',
    images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Winery',
    name: 'KBWINE',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80',
    telePhone: '0222.6882.000',
    url: 'https://kbwine.vn',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nguyễn Công Hoan – Ba Đình – Hà Nội',
      addressLocality: 'Hà Nội',
      addressCountry: 'VN',
    },
    priceRange: '$$$$',
  };

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-dark text-cream selection:bg-gold selection:text-dark min-h-screen">
        {children}
        <AgeGateModal />
        <PromoBannerModal />
        <ToastContainer />
      </body>
    </html>
  );
}

