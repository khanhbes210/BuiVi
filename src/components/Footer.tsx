import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Logo } from './Logo';
import { SITE_CONFIG, isPlaceholder } from '../data/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F3D2A] text-[#FFF5E4] border-t-4 border-[#951722]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#FFF5E4]/15">
          {/* Col 1: Brand & Slogan (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <Logo variant="main" />
            </Link>
            <p className="font-display text-lg text-[#F3D27A] tracking-wide">
              “{SITE_CONFIG.slogan}”
            </p>
            <p className="text-sm text-[#FFF5E4]/85 leading-relaxed">
              Thương hiệu quà biếu di sản Nem Kinh Bắc trong cấu trúc hộp lục giác giấy Điệp ánh kim
              vỏ sò và nghệ thuật tranh dân gian Đông Hồ.
            </p>
          </div>

          {/* Col 2: Liên kết nhanh (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-lg text-[#F3D27A]">Khám Phá Bùi Vị</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/san-pham" className="hover:text-[#F3D27A] transition-colors">
                  Sản phẩm & Bộ sưu tập Hộp quà
                </Link>
              </li>
              <li>
                <Link to="/khuyen-mai" className="hover:text-[#F3D27A] transition-colors">
                  Khuyến mãi & Mã ưu đãi (Voucher)
                </Link>
              </li>
              <li>
                <Link to="/ve-bui-vi" className="hover:text-[#F3D27A] transition-colors">
                  Về Bùi Vị – Câu chuyện di sản
                </Link>
              </li>
              <li>
                <Link to="/bai-viet" className="hover:text-[#F3D27A] transition-colors">
                  Bài viết Văn hóa ẩm thực & Bí quyết
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="hover:text-[#F3D27A] transition-colors">
                  Liên hệ & Hệ thống cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dòng sản phẩm chủ đạo (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-lg text-[#F3D27A]">Dòng Sản Phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/san-pham/set-vinh-hoa-phu-quy"
                  className="hover:text-[#F3D27A] transition-colors"
                >
                  Set Vinh Hoa - Phú Quý
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/set-binh-an-sung-tuc"
                  className="hover:text-[#F3D27A] transition-colors"
                >
                  Set Bình An - Sung Túc
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/set-doc-ban"
                  className="hover:text-[#F3D27A] transition-colors"
                >
                  Set Độc Bản (Hộp lục giác)
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/combo-3-hop-qua"
                  className="hover:text-[#F3D27A] transition-colors"
                >
                  Combo 3 hộp quà (950.000đ)
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/nem-bui"
                  className="hover:text-[#F3D27A] transition-colors"
                >
                  Nem bùi Kinh Bắc 500g
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/nem-chua"
                  className="hover:text-[#F3D27A] transition-colors"
                >
                  Nem chua hộp 10 cái
                </Link>
              </li>
              <li>
                <Link
                  to="/san-pham/nem-ngua-kinh-bac-hop-300g"
                  className="hover:text-[#F3D27A] transition-colors"
                >
                  Nem ngựa hộp 300g
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Thông tin liên hệ & Kênh kết nối (3 cols) — hides any placeholder row per P0-2 */}
          <div className="lg:col-span-3 space-y-3 text-sm">
            <h3 className="font-display text-lg text-[#F3D27A]">Thông Tin Liên Hệ</h3>
            <div className="space-y-2.5 text-[#FFF5E4]/90">
              {!isPlaceholder(SITE_CONFIG.contact.headquarters) && (
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F3D27A] shrink-0 mt-1" />
                  <span>{SITE_CONFIG.contact.headquarters}</span>
                </p>
              )}
              {!isPlaceholder(SITE_CONFIG.contact.hotline) && (
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#F3D27A] shrink-0" />
                  <a
                    href={`tel:${SITE_CONFIG.contact.hotline.replace(/\s+/g, '')}`}
                    className="font-body text-base text-[#F3D27A] hover:underline"
                  >
                    Hotline: {SITE_CONFIG.contact.hotline}
                  </a>
                </p>
              )}
              {!isPlaceholder(SITE_CONFIG.contact.email) && (
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#F3D27A] shrink-0" />
                  <span>{SITE_CONFIG.contact.email}</span>
                </p>
              )}
              {!isPlaceholder(SITE_CONFIG.contact.workingHours) && (
                <p className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#F3D27A] shrink-0 mt-1" />
                  <span>{SITE_CONFIG.contact.workingHours}</span>
                </p>
              )}
            </div>

            {/* Social Channels: Facebook, Zalo, TikTok, Instagram */}
            <div className="pt-2">
              <h4 className="font-display text-base text-[#F3D27A] mb-2">
                Kênh chính thức:
              </h4>
              <div className="flex flex-wrap gap-2">
                <a
                  href={SITE_CONFIG.contact.fanpage}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FFF5E4]/10 hover:bg-[#951722] text-xs font-semibold transition-colors"
                >
                  Facebook Fanpage
                </a>
                <a
                  href={SITE_CONFIG.contact.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FFF5E4]/10 hover:bg-[#951722] text-xs font-semibold transition-colors"
                >
                  Zalo Official
                </a>
                <a
                  href={SITE_CONFIG.contact.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FFF5E4]/10 hover:bg-[#951722] text-xs font-semibold transition-colors"
                >
                  TikTok
                </a>
                <a
                  href={SITE_CONFIG.contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FFF5E4]/10 hover:bg-[#951722] text-xs font-semibold transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright, Slogan & Font License */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#FFF5E4]/85">
          <p className="text-sm">© {new Date().getFullYear()} BÙI VỊ – Công ty TNHH Di Sản Ẩm Thực Bùi Vị. Bảo lưu mọi quyền.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="/fonts/OFL.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#F3D27A] hover:underline"
            >
              Phông chữ: Yeseva One, Montserrat (SIL Open Font License)
            </a>
            <span aria-hidden="true" className="text-[#FFF5E4]/35">
              •
            </span>
            <span className="font-display text-sm text-[#F3D27A]">{SITE_CONFIG.slogan}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
