import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ticket, Gift, Sparkles } from 'lucide-react';
import { VOUCHERS } from '../data/vouchers';
import { PRODUCTS, formatPrice, getDiscountPercent } from '../data/products';
import { VoucherCard } from '../components/VoucherCard';
import { MediaSlot } from '../components/MediaSlot';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import { AddToCartButton } from '../components/AddToCartButton';
import { BuyNowButton } from '../components/BuyNowButton';
import { useStore } from '../context/StoreContext';
import { Img } from '../components/Img';
import { Reveal, Stagger } from '../motion';

export const PromotionsPage: React.FC = () => {
  const { saveVoucherForLater, appliedVoucherCode, addToCart, startBuyNow } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Khuyến Mãi & Ưu Đãi Đặc Quyền | BÙI VỊ – Quà Biếu Di Sản';
  }, []);

  // Scroll to and highlight #ma-voucher-<code> when visiting with a hash
  useEffect(() => {
    if (location.hash && location.hash.startsWith('#ma-voucher-')) {
      const code = location.hash.replace('#ma-voucher-', '').toUpperCase();
      setHighlightedCode(code);
      const timer = setTimeout(() => {
        const el = document.getElementById(`ma-voucher-${code}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      const clearTimer = setTimeout(() => {
        setHighlightedCode(null);
      }, 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [location.hash]);

  const hotVouchers = VOUCHERS.filter((v) => v.section === 'hot');
  const comboVouchers = VOUCHERS.filter((v) => v.section === 'combo');
  const comboProduct = PRODUCTS.find((p) => p.id === 'prod-combo-3-set')!;
  const comboDiscount = getDiscountPercent(comboProduct.price, comboProduct.oldPrice);

  return (
    <div lang="vi">
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* MediaSlot 'promo-banner' (21:9) at top of /khuyen-mai — renders nothing when empty so H1 is above the fold (P0-3) */}
        <MediaSlot slotId="promo-banner" />

        {/* Hero Header */}
        <Reveal>
          <div className="bg-[#1F3D2A] text-[#FFF5E4] rounded-3xl p-6 md:p-10 border-2 border-[#F3D27A]/50 shadow-lg">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F3D27A]">
                <Sparkles className="w-4 h-4" />
                <span>Tổng hợp mã giảm giá & Quà tặng di sản Bùi Vị</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-[#FFF5E4]">
                Chương Trình Khuyến Mãi & Combo Quà Tặng
              </h1>
              <p lang="vi" className="story-justify text-base text-[#FFF5E4]/85 leading-[1.7]">
                Mọi mã ưu đãi của Bùi Vị đều hiển thị rõ phần trăm giảm giá, điều kiện đơn tối thiểu
                và quy định cộng gộp. Khi bạn bấm “Dùng mã này” hoặc “Mua ngay”, hệ thống sẽ tự động
                tính toán mức ưu đãi tốt nhất trong Giỏ hàng và Thanh toán nhanh.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#uu-dai-hot"
                  className="btn-sheen px-4 py-2 rounded-xl bg-[#951722] text-[#FFF5E4] font-bold text-sm hover:bg-[#9B0514] transition-colors"
                >
                  1. Ưu đãi hot / Khuyến mãi ({hotVouchers.length})
                </a>
                <a
                  href="#combo-qua-tang"
                  className="btn-sheen px-4 py-2 rounded-xl bg-[#FFF5E4]/15 text-[#F3D27A] font-bold text-sm hover:bg-[#FFF5E4]/25 transition-colors"
                >
                  2. Combo & Quà tặng ({comboVouchers.length})
                </a>
                <a
                  href="#bang-so-sanh"
                  className="btn-sheen px-4 py-2 rounded-xl bg-[#FFF5E4]/15 text-[#FFF5E4] font-bold text-sm hover:bg-[#FFF5E4]/25 transition-colors"
                >
                  3. Bảng so sánh các Voucher
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* SUB-SECTION 1: ƯU ĐÃI HOT / KHUYẾN MÃI */}
        <section id="uu-dai-hot" className="scroll-mt-24 space-y-6">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-[#951722]/20 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A] flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-[#951722]" />
                  <span>Phần 1 · Mã giảm giá trực tiếp & Vận chuyển</span>
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-[#951722] mt-1">
                  Ưu Đãi Hot / Khuyến Mãi Đang Áp Dụng
                </h2>
              </div>
              <p lang="vi" className="story-justify text-xs font-semibold text-[#1F3D2A] leading-[1.7]">
                Mẹo: Mã FREESHIP (đơn từ 500.000đ) được cộng gộp cùng mọi mã giảm giá đơn hàng!
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {hotVouchers.map((voucher) => (
              <div
                key={voucher.code}
                id={`ma-voucher-${voucher.code}`}
                className="scroll-mt-28"
              >
                <VoucherCard
                  voucher={voucher}
                  highlighted={highlightedCode === voucher.code}
                />
              </div>
            ))}
          </Stagger>
        </section>

        {/* SUB-SECTION 2: COMBO & QUÀ TẶNG */}
        <section id="combo-qua-tang" className="scroll-mt-24 space-y-6">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-[#951722]/20 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#951722]" />
                  <span>Phần 2 · Ưu đãi tự động kích hoạt trong giỏ hàng</span>
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-[#951722] mt-1">
                  Combo & Quà Tặng Di Sản
                </h2>
              </div>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {comboVouchers.map((voucher) => (
              <div
                key={voucher.code}
                id={`ma-voucher-${voucher.code}`}
                className="scroll-mt-28"
              >
                <VoucherCard
                  voucher={voucher}
                  highlighted={highlightedCode === voucher.code}
                />
              </div>
            ))}
          </Stagger>

          {/* Spotlight Card for Combo 3 Hộp Quà (Links to /san-pham/combo-3-hop-qua) */}
          <Reveal>
            <div className="bg-[#FFFBF2] double-border-heritage rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <Link
                to={`/san-pham/${comboProduct.slug}`}
                className="lg:col-span-5 aspect-[4/3] rounded-xl overflow-hidden relative block group"
              >
                <Img
                  src={comboProduct.images[0].url}
                  alt={comboProduct.name}
                  theme="combo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-[#9B0514] text-[#FFF5E4] font-price text-sm font-bold px-3 py-1 rounded-md">
                  -{comboDiscount}% (Tiết kiệm 60.000đ)
                </span>
              </Link>

              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
                  Gói ưu đãi lớn nhất mùa Lễ/Tết · {comboProduct.packSpec}
                </span>
                <Link
                  to={`/san-pham/${comboProduct.slug}`}
                  className="font-display text-2xl md:text-3xl text-[#951722] hover:underline block"
                >
                  {comboProduct.name}
                </Link>
                <p
                  lang="vi"
                  className="story-justify text-sm md:text-base text-[#171815]/85 leading-[1.7]"
                >
                  {comboProduct.longDesc}
                </p>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-price text-3xl font-bold text-[#9B0514]">
                    {formatPrice(comboProduct.price)}
                  </span>
                  <span className="font-price text-lg text-[#171815]/50 line-through">
                    {formatPrice(comboProduct.oldPrice!)}
                  </span>
                  <span className="text-xs font-bold text-[#1F3D2A] bg-[#1F3D2A]/10 px-2.5 py-1 rounded">
                    + Tự động giảm thêm 50.000đ + túi giấy Điệp & thiệp viết tay (COMBO3) + Tặng 1
                    hộp Nem chua (TANGHOP)
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <AddToCartButton
                    product={comboProduct}
                    onClick={() => addToCart(comboProduct.id, 1, comboProduct.packOptions[0])}
                  />
                  <BuyNowButton
                    product={comboProduct}
                    onClick={() => {
                      startBuyNow(comboProduct.id, 1, comboProduct.packOptions[0]);
                      navigate('/thanh-toan?mode=buynow');
                    }}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SUB-SECTION 3: BẢNG SO SÁNH CÁC VOUCHER */}
        <section id="bang-so-sanh" className="scroll-mt-24 space-y-4">
          <Reveal>
            <div className="border-b-2 border-[#951722]/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A] block">
                Tra cứu nhanh điều kiện áp dụng
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-[#951722] mt-1">
                Bảng So Sánh Các Voucher Bùi Vị
              </h2>
            </div>

            <div className="overflow-x-auto bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl shadow-xs">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#1F3D2A] text-[#FFF5E4]">
                    <th className="p-4 font-bold">Mã Voucher</th>
                    <th className="p-4 font-bold">Giá trị ưu đãi</th>
                    <th className="p-4 font-bold">Đơn tối thiểu</th>
                    <th className="p-4 font-bold">Giảm tối đa</th>
                    <th className="p-4 font-bold">Sản phẩm áp dụng</th>
                    <th className="p-4 font-bold">Cộng gộp</th>
                    <th className="p-4 font-bold">Thời hạn</th>
                    <th className="p-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#951722]/15">
                  {VOUCHERS.map((v) => {
                    const isSaved = appliedVoucherCode === v.code;
                    return (
                      <tr key={v.code} className="hover:bg-[#FFF5E4]/80 transition-colors">
                        <td className="p-4 text-[#951722] whitespace-nowrap">
                          <a href={`#ma-voucher-${v.code}`} className="font-display hover:underline">
                            {v.code}
                          </a>
                        </td>
                        <td className="p-4 text-[#9B0514] whitespace-nowrap">
                          <span className="font-display">{v.valueText}</span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-price">
                            {v.minOrder > 0 ? formatPrice(v.minOrder) : '0đ'}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-price">{formatPrice(v.maxDiscount)}</span>
                        </td>
                        <td className="p-4 max-w-xs">{v.applicableProductsText}</td>
                        <td className="p-4 text-xs">
                          {v.stackable ? (
                            <span className="font-bold text-[#1F3D2A]">Có cộng gộp</span>
                          ) : (
                            <span className="text-[#171815]/75">Không cộng gộp mã giảm khác</span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap text-xs">{v.expiryDisplay}</td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => saveVoucherForLater(v.code)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                isSaved
                                  ? 'bg-[#1F3D2A] text-[#FFF5E4]'
                                  : 'border border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4]'
                              }`}
                            >
                              {isSaved ? 'Đã lưu' : 'Dùng mã này'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                saveVoucherForLater(v.code);
                                navigate('/san-pham');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] text-xs font-bold cursor-pointer transition-colors"
                            >
                              Mua ngay
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>
      </div>

      {/* Featured Products Block at the bottom */}
      <FeaturedProductsBlock />
    </div>
  );
};
