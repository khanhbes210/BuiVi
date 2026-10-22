import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Network, ArrowRight, Home } from 'lucide-react';
import { PRODUCTS, formatCurrency } from '../data/products';
import { VOUCHERS } from '../data/vouchers';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import {
  AnimationSlot,
  Reveal,
  Stagger,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export const SitemapPage: React.FC = () => {
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    document.title = 'Sơ Đồ Trang (Sitemap) | BÙI VỊ – Quà Biếu Di Sản';
  }, []);

  const svgNodes = [
    { x: 18, cx: 80, label: '1. Sản phẩm', path: '/san-pham', fill: '#1F3D2A' },
    { x: 155, cx: 217, label: '2. Khuyến mãi', path: '/khuyen-mai', fill: '#1F3D2A' },
    { x: 292, cx: 354, label: '3. Về Bùi Vị', path: '/ve-bui-vi', fill: '#1F3D2A' },
    { x: 429, cx: 491, label: '4. Bài viết', path: '/bai-viet', fill: '#1F3D2A' },
    { x: 566, cx: 628, label: '5. Liên hệ', path: '/lien-he', fill: '#1F3D2A' },
    { x: 703, cx: 765, label: '6. Tìm kiếm', path: '/tim-kiem', fill: '#171815' },
    { x: 840, cx: 902, label: '7. Tài khoản', path: '/tai-khoan', fill: '#171815' },
    { x: 978, cx: 1040, label: '8. Giỏ hàng', path: '/gio-hang', fill: '#171815' },
  ];

  return (
    <div>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Color Legend (Addendum #5) */}
        <Reveal>
          <div className="bg-[#FFFBF2] double-border-heritage rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
              <Network className="w-4 h-4 text-[#951722]" />
              <span>Kiến trúc thông tin & Luồng chuyển đổi Bùi Vị</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-[#951722]">
              Sơ Đồ Trang (Visual Sitemap)
            </h1>
            <p className="text-sm md:text-base text-[#171815]/80">
              Bản đồ cấu trúc toàn bộ website BÙI VỊ. Nhấp vào bất kỳ nút nào bên dưới để điều hướng
              trực tiếp đến trang tương ứng.
            </p>

            {/* Legend matching Addendum #5 */}
            <div className="p-4 rounded-2xl bg-[#FFF5E4] border border-[#951722]/25 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-bold uppercase tracking-wider text-[#171815]">
                  Chú giải phân loại trang (Nodes):
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <span className="w-3.5 h-3.5 rounded bg-[#951722] inline-block" />
                    <span>Trang chủ (Heritage Red)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <span className="w-3.5 h-3.5 rounded bg-[#1F3D2A] inline-block" />
                    <span>Trang điều hướng (Forest Green)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <span className="w-3.5 h-3.5 rounded bg-[#171815] inline-block" />
                    <span>Trang tiện ích (Ink Black)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <span className="w-3.5 h-3.5 rounded bg-[#9B0514]/20 border border-[#9B0514] inline-block" />
                    <span>Thao tác thất bại (Light Red)</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold uppercase tracking-wider text-[#171815]">
                  Chú giải luồng liên kết (Flows):
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-6 h-0.5 bg-[#171815] inline-block" />
                    <span>→ Điều hướng chuẩn</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#951722] font-bold">
                    <span className="w-6 h-0.5 bg-[#951722] inline-block" />
                    <span>→ Luồng CTA (Mua ngay / Thêm giỏ)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#1F3D2A] font-bold">
                    <span className="w-6 h-0.5 bg-[#1F3D2A] inline-block" />
                    <span>→ Luồng thành công</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#9B0514] font-bold">
                    <span className="w-6 h-0.5 border-b-2 border-dashed border-[#9B0514] inline-block" />
                    <span>⇢ Luồng thất bại / Quay lại</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* INTERACTIVE SVG VISUAL SITEMAP DIAGRAM (SVG connector lines draw 600ms, nodes pop in with 50ms stagger, titles in Yeseva One) */}
        <div className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-3xl p-4 md:p-6 overflow-x-auto">
          <svg
            viewBox="0 0 1120 230"
            className="w-full min-w-[880px] h-auto"
            role="img"
            aria-label="Sơ đồ cấu trúc tổng quan website Bùi Vị"
          >
            {/* Connector Lines with stroke-dashoffset draw */}
            <line
              x1="560"
              y1="56"
              x2="560"
              y2="95"
              stroke="#951722"
              strokeWidth="2.5"
              className="anim-stroke-draw"
            />
            <line
              x1="80"
              y1="95"
              x2="1040"
              y2="95"
              stroke="#1F3D2A"
              strokeWidth="2"
              className="anim-stroke-draw"
            />
            {[80, 217, 354, 491, 628, 765, 902, 1040].map((cx, i) => (
              <line
                key={i}
                x1={cx}
                y1="95"
                x2={cx}
                y2="132"
                stroke={i >= 5 ? '#171815' : '#1F3D2A'}
                strokeWidth="2"
                className="anim-stroke-draw"
              />
            ))}

            {/* Root Node: TRANG CHỦ */}
            <a href="/">
              <rect
                x="440"
                y="12"
                width="240"
                height="44"
                rx="12"
                fill="#951722"
              />
              <text
                x="560"
                y="40"
                textAnchor="middle"
                fill="#FFF5E4"
                fontSize="16"
                className="font-display"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
              >
                TRANG CHỦ (/)
              </text>
            </a>

            {/* 8 Level-1 Branch Nodes with 50ms stagger pop-in */}
            {svgNodes.map((node, idx) => (
              <motion.a
                key={node.path}
                href={node.path}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: reducedMotion ? 0 : idx * 0.05,
                  ease: MOTION_TOKENS.easings.standard,
                }}
              >
                <rect
                  x={node.x}
                  y="132"
                  width="124"
                  height="52"
                  rx="10"
                  fill={node.fill}
                />
                <text
                  x={node.cx}
                  y="156"
                  textAnchor="middle"
                  fill="#FFF5E4"
                  fontSize="15"
                  className="font-display"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                >
                  {node.label}
                </text>
                <text
                  x={node.cx}
                  y="174"
                  textAnchor="middle"
                  fill="#F3D27A"
                  fontSize="14"
                  className="font-display"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                >
                  {node.path}
                </text>
              </motion.a>
            ))}
          </svg>
        </div>

        {/* ROOT NODE: TRANG CHỦ */}
        <div className="flex flex-col items-center">
          <Link
            to="/"
            className="btn-sheen px-8 py-4 rounded-2xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] font-display text-xl shadow-lg flex items-center gap-2.5 transition-transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            <span>TRANG CHỦ (/)</span>
          </Link>
          <div className="w-0.5 h-8 bg-[#951722]" />
        </div>

        {/* TREE BRANCHES */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Branch 1: SẢN PHẨM */}
          <div className="bg-[#FFFBF2] border-2 border-[#1F3D2A]/30 rounded-2xl p-5 space-y-3">
            <Link
              to="/san-pham"
              className="block p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-display text-lg text-center hover:opacity-95"
            >
              1. Sản phẩm (/san-pham)
            </Link>
            <div className="pl-3 border-l-2 border-[#1F3D2A]/40 space-y-2 text-xs">
              <p className="text-[#1F3D2A] uppercase">7 Danh mục & Chi tiết:</p>
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className="space-y-1 bg-[#FFF5E4] p-2.5 rounded-lg border border-[#951722]/15"
                >
                  <Link
                    to={`/san-pham?danh-muc=${encodeURIComponent(p.category)}`}
                    className="text-[#1F3D2A] hover:underline block"
                  >
                    → Danh mục: {p.category}
                  </Link>
                  <Link
                    to={`/san-pham/${p.slug}`}
                    className="text-[#951722] hover:underline block pl-2"
                  >
                    ↳ Chi tiết: <span className="font-display">{p.name}</span> (
                    <span className="font-price">{formatCurrency(p.price)}</span>)
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Branch 2: KHUYẾN MÃI & VỀ BÙI VỊ */}
          <div className="space-y-6">
            <div className="bg-[#FFFBF2] border-2 border-[#1F3D2A]/30 rounded-2xl p-5 space-y-3">
              <Link
                to="/khuyen-mai"
                className="block p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-display text-lg text-center hover:opacity-95"
              >
                2. Khuyến mãi (/khuyen-mai)
              </Link>
              <div className="pl-3 border-l-2 border-[#1F3D2A]/40 space-y-2 text-xs">
                <Link
                  to="/khuyen-mai#uu-dai-hot"
                  className="block p-2 rounded bg-[#FFF5E4] text-[#171815] hover:text-[#951722]"
                >
                  → Ưu đãi hot / Khuyến mãi
                </Link>
                <Link
                  to="/khuyen-mai#combo-qua-tang"
                  className="block p-2 rounded bg-[#FFF5E4] text-[#171815] hover:text-[#951722]"
                >
                  → Combo & Quà tặng
                </Link>
                <div className="p-2 rounded bg-[#FFF5E4] space-y-1">
                  <span className="text-[#951722] block">↳ Chi tiết 6 mã ưu đãi:</span>
                  <div className="flex flex-wrap gap-1">
                    {VOUCHERS.map((v) => (
                      <Link
                        key={v.code}
                        to={`/khuyen-mai#ma-voucher-${v.code}`}
                        className="font-display px-2 py-0.5 rounded bg-[#1F3D2A] text-[#FFF5E4] text-xs"
                      >
                        {v.code}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFBF2] border-2 border-[#1F3D2A]/30 rounded-2xl p-5 space-y-3">
              <Link
                to="/ve-bui-vi"
                className="block p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-display text-lg text-center hover:opacity-95"
              >
                3. Về Bùi Vị (/ve-bui-vi)
              </Link>
              <div className="pl-3 border-l-2 border-[#1F3D2A]/40 space-y-2 text-xs">
                <Link
                  to="/ve-bui-vi#cau-chuyen"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Câu chuyện thương hiệu
                </Link>
                <Link
                  to="/ve-bui-vi#cam-ket"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Cam kết chất lượng
                </Link>
                <Link
                  to="/ve-bui-vi#hanh-trinh"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Hành trình Bùi Vị
                </Link>
              </div>
            </div>
          </div>

          {/* Branch 3: BÀI VIẾT, LIÊN HỆ & TÌM KIẾM */}
          <div className="space-y-6">
            <div className="bg-[#FFFBF2] border-2 border-[#1F3D2A]/30 rounded-2xl p-5 space-y-3">
              <Link
                to="/bai-viet"
                className="block p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-display text-lg text-center hover:opacity-95"
              >
                4. Bài viết (/bai-viet)
              </Link>
              <div className="pl-3 border-l-2 border-[#1F3D2A]/40 space-y-1.5 text-xs">
                <Link
                  to="/bai-viet?chuyen-muc=van-hoa-am-thuc"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Văn hóa ẩm thực
                </Link>
                <Link
                  to="/bai-viet?chuyen-muc=meo-hay-bi-quyet"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Mẹo hay & bí quyết
                </Link>
                <Link
                  to="/bai-viet?chuyen-muc=tin-tuc-su-kien"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Tin tức & Sự kiện
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFBF2] border-2 border-[#1F3D2A]/30 rounded-2xl p-5 space-y-3">
              <Link
                to="/lien-he"
                className="block p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-display text-lg text-center hover:opacity-95"
              >
                5. Liên hệ (/lien-he)
              </Link>
              <div className="pl-3 border-l-2 border-[#1F3D2A]/40 space-y-1.5 text-xs">
                <Link
                  to="/lien-he#form-lien-he"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Form liên hệ (“Gửi liên hệ”)
                </Link>
                <Link
                  to="/lien-he#he-thong-cua-hang"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Hệ thống cửa hàng
                </Link>
                <Link
                  to="/lien-he#kenh-ket-noi"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Hotline / Zalo / Fanpage
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFBF2] border-2 border-[#171815]/30 rounded-2xl p-5 space-y-2">
              <Link
                to="/tim-kiem"
                className="block p-3 rounded-xl bg-[#171815] text-[#FFF5E4] font-display text-lg text-center"
              >
                6. Tìm kiếm (/tim-kiem)
              </Link>
              <p className="text-xs text-[#171815]/80 pl-2">
                → Kết quả tức thì / Không có kết quả → Gợi ý sản phẩm bán chạy
              </p>
            </div>
          </div>

          {/* Branch 4: TÀI KHOẢN & GIỎ HÀNG / THANH TOÁN (UTILITY NODES = INK BLACK) */}
          <div className="space-y-6">
            <div className="bg-[#FFFBF2] border-2 border-[#171815]/30 rounded-2xl p-5 space-y-3">
              <Link
                to="/tai-khoan"
                className="block p-3 rounded-xl bg-[#171815] text-[#FFF5E4] font-display text-lg text-center"
              >
                7. Tài khoản (/tai-khoan)
              </Link>
              <div className="pl-3 border-l-2 border-[#171815]/40 space-y-1.5 text-xs">
                <Link
                  to="/tai-khoan/dang-nhap"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Đăng nhập (Thành công / Thất bại)
                </Link>
                <Link
                  to="/tai-khoan/dang-ky"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Đăng ký → Xác thực OTP → Tạo tài khoản
                </Link>
                <Link
                  to="/tai-khoan/ho-so"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Hồ sơ cá nhân
                </Link>
                <Link
                  to="/tai-khoan/don-hang"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Đơn hàng của tôi (Timeline)
                </Link>
                <Link
                  to="/tai-khoan/so-dia-chi"
                  className="block p-2 rounded bg-[#FFF5E4] hover:text-[#951722]"
                >
                  → Sổ địa chỉ (CRUD) & Đăng xuất
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFBF2] border-2 border-[#951722]/40 rounded-2xl p-5 space-y-3">
              <Link
                to="/gio-hang"
                className="block p-3 rounded-xl bg-[#171815] text-[#FFF5E4] font-display text-lg text-center"
              >
                8. Giỏ hàng (/gio-hang)
              </Link>
              <div className="pl-3 border-l-2 border-[#951722] space-y-2 text-xs">
                <div className="p-2 rounded bg-[#FFF5E4]">
                  1. Danh sách sản phẩm → Mã giảm giá → Tổng tiền & Tiết kiệm
                </div>
                <Link
                  to="/thanh-toan"
                  className="block p-2.5 rounded-lg bg-[#951722] text-[#FFF5E4] text-center"
                >
                  → CTA: Tiến hành thanh toán (/thanh-toan)
                </Link>
                <Link
                  to="/thanh-toan?mode=buynow"
                  className="block p-2 rounded-lg border border-[#951722] text-[#951722] text-center"
                >
                  → Luồng Mua Ngay (/thanh-toan?mode=buynow)
                </Link>
                <div className="p-2 rounded bg-[#FFF5E4]">
                  1. Giỏ hàng → 2. Thông tin giao hàng → 3. Thanh toán
                </div>
                <Link
                  to="/dat-hang-thanh-cong"
                  className="block p-2 rounded-lg bg-[#1F3D2A] text-[#FFF5E4] text-center"
                >
                  ✓ Thành công (/dat-hang-thanh-cong)
                </Link>
                <Link
                  to="/thanh-toan-that-bai"
                  className="block p-2 rounded-lg bg-[#9B0514]/15 border border-dashed border-[#9B0514] text-[#9B0514] text-center"
                >
                  ⇢ Thất bại (/thanh-toan-that-bai) → Quay lại giỏ
                </Link>
              </div>
            </div>
          </div>
        </Stagger>
      </div>

      <FeaturedProductsBlock />
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Không Tìm Thấy Trang (404) | BÙI VỊ';
  }, []);

  return (
    <div>
      <div className="py-12 md:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#FFFBF2] double-border-heritage rounded-3xl p-8 md:p-12 space-y-6">
          {/* Animation Slot #13: page-404 */}
          <AnimationSlot id="page-404" className="max-w-[240px] mx-auto" />
          <h1 className="font-display text-3xl md:text-4xl text-[#951722]">
            Không Tìm Thấy Trang Yêu Cầu
          </h1>
          <p className="text-base text-[#171815]/80 max-w-lg mx-auto">
            Đường dẫn quý khách truy cập không tồn tại hoặc đã được chuyển đổi. Hãy quay về Trang
            chủ, tra cứu Sơ đồ trang hoặc khám phá các sản phẩm nổi bật của Bùi Vị bên dưới.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/"
              className="btn-sheen min-h-[54px] px-6 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] font-bold text-[17px] inline-flex items-center gap-2 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Về trang chủ</span>
            </Link>
            <Link
              to="/so-do-trang"
              className="btn-sheen min-h-[54px] px-6 py-3 rounded-xl border-2 border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4] font-bold text-[17px] inline-flex items-center gap-2 transition-colors"
            >
              <Network className="w-5 h-5" />
              <span>Xem Sơ đồ trang</span>
            </Link>
            <Link
              to="/san-pham"
              className="btn-sheen min-h-[54px] px-6 py-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-bold text-[17px] inline-flex items-center gap-2 transition-colors"
            >
              <span>Tất cả sản phẩm</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <FeaturedProductsBlock />
    </div>
  );
};
