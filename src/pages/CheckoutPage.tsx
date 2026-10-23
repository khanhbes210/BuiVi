import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  QrCode,
  Truck,
  Gift,
  AlertTriangle,
  Minus,
  Plus,
  Clock,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SITE_CONFIG, shouldShowPaymentFailDemo } from '../data/siteConfig';
import { formatCurrency, formatPrice, getDiscountPercent } from '../data/products';
import { PromotionSummary } from '../components/PromotionSummary';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { Img } from '../components/Img';
import {
  AnimatedPrice,
  RollingNumber,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isBuyNowMode = searchParams.get('mode') === 'buynow';
  const showFailDemoToggle = shouldShowPaymentFailDemo(location.search);
  const navigate = useNavigate();
  const { reducedMotion } = useMotionPreferences();

  const {
    user,
    cartPromotion,
    buyNowPromotion,
    buyNowItem,
    startBuyNow,
    placeOrder,
    simulatePaymentFailure,
    setSimulatePaymentFailure,
    showToast,
  } = useStore();

  const activePromotion = isBuyNowMode ? buyNowPromotion : cartPromotion;
  const defaultAddress = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [province, setProvince] = useState(defaultAddress?.province || 'TP. Hà Nội');
  const [district, setDistrict] = useState(defaultAddress?.district || '');
  const [ward, setWard] = useState(defaultAddress?.ward || '');
  const [streetAddress, setStreetAddress] = useState(defaultAddress?.streetAddress || '');
  const [note, setNote] = useState('');
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeForm, setShakeForm] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(900); // 15 minutes
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    document.title = isBuyNowMode
      ? 'Thanh Toán Nhanh (Mua Ngay) | BÙI VỊ'
      : 'Thanh Toán Đơn Hàng | BÙI VỊ';
  }, [isBuyNowMode]);

  useEffect(() => {
    if (paymentMethod !== 'qr') return;
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!customerName.trim()) nextErrors.customerName = 'Vui lòng nhập họ và tên người nhận.';
    if (!phone.trim() || !/^[0-9\s+.-]{9,13}$/.test(phone.trim())) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ (9–11 chữ số).';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Địa chỉ email không đúng định dạng.';
    }
    if (!province.trim()) nextErrors.province = 'Vui lòng chọn hoặc nhập Tỉnh/Thành phố.';
    if (!district.trim()) nextErrors.district = 'Vui lòng nhập Quận/Huyện.';
    if (!ward.trim()) nextErrors.ward = 'Vui lòng nhập Phường/Xã.';
    if (!streetAddress.trim()) nextErrors.streetAddress = 'Vui lòng nhập số nhà, tên đường.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCompleteOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      setShakeForm(false);
      requestAnimationFrame(() => {
        setShakeForm(true);
        setTimeout(() => setShakeForm(false), 360);
      });
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    const res = placeOrder({
      mode: isBuyNowMode ? 'buynow' : 'cart',
      customerName,
      phone,
      email,
      province,
      district,
      ward,
      streetAddress,
      note,
      isGiftOrder,
      giftMessage,
      paymentMethod,
    });

    if (res.ok) {
      navigate('/dat-hang-thanh-cong');
    } else {
      navigate('/thanh-toan-that-bai');
    }
  };

  const tempOrderRef =
    'BV2610' + (activePromotion.finalTotal % 10000).toString().padStart(4, '0');
  const transferContentValue = `${tempOrderRef} ${phone || 'SDT'}`.trim();

  const handleCopyValue = (fieldKey: string, textToCopy: string, toastLabel: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
    setCopiedField(fieldKey);
    showToast(`Đã sao chép ${toastLabel}: ${textToCopy}`);
    setTimeout(() => {
      setCopiedField((prev) => (prev === fieldKey ? null : prev));
    }, 1500);
  };

  const handleCopyAllBankInfo = () => {
    const allText = [
      `Mã đơn hàng: ${tempOrderRef}`,
      `Ngân hàng: ${SITE_CONFIG.bankInfo.bankName}`,
      `Chủ tài khoản: ${SITE_CONFIG.bankInfo.accountHolder}`,
      `Số tài khoản: ${SITE_CONFIG.bankInfo.accountNumber}`,
      `Số tiền: ${activePromotion.finalTotal}`,
      `Nội dung chuyển khoản: ${transferContentValue}`,
    ].join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(allText).catch(() => {});
    }
    setCopiedField('all');
    showToast('Đã sao chép toàn bộ thông tin chuyển khoản');
    setTimeout(() => {
      setCopiedField((prev) => (prev === 'all' ? null : prev));
    }, 1500);
  };

  const singlePrimaryCtaLabel =
    paymentMethod === 'qr'
      ? 'Tôi đã chuyển khoản'
      : `Đặt hàng (${formatPrice(activePromotion.finalTotal)})`;

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Shared 3-Step Checkout Stepper (P1-2): 1. Giỏ hàng -> 2. Thông tin giao hàng -> 3. Thanh toán */}
      <CheckoutStepper currentStep={2} />

      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
          {isBuyNowMode
            ? 'Chế độ Mua Ngay – Tự động áp dụng mã ưu đãi tốt nhất'
            : 'Hoàn tất đơn hàng Bùi Vị'}
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-[#951722] mt-1">
          {isBuyNowMode ? 'Thanh Toán Nhanh (Mua Ngay)' : 'Thông Tin Giao Hàng & Thanh Toán'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Product Summary + Step 2 Shipping Form + Step 3 Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Selected Items Overview */}
          <div className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-5 md:p-6 space-y-4">
            <h2 className="font-display text-xl text-[#1F3D2A]">
              Sản Phẩm Đặt Mua ({activePromotion.lines.filter((l) => l.selected).length})
            </h2>
            <div className="space-y-3">
              {activePromotion.lines
                .filter((l) => l.selected)
                .map((line) => {
                  const disc = getDiscountPercent(line.product.price, line.product.oldPrice);
                  return (
                    <div
                      key={`${line.product.id}-${line.selectedPack}`}
                      className="p-3.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative bg-[#F5E6CC]">
                          <Img
                            src={line.product.images[0].url}
                            alt={line.product.name}
                            theme={line.product.images[0].theme}
                            className="w-full h-full object-cover"
                          />
                          {disc && (
                            <span className="absolute top-1 left-1 bg-[#9B0514] text-[#FFF5E4] font-price text-[10px] font-bold px-1.5 rounded">
                              -{disc}%
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-display text-lg text-[#171815]">{line.product.name}</p>
                          <p className="text-xs text-[#171815]/70">{line.selectedPack}</p>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="font-price text-base text-[#9B0514]">
                              {formatCurrency(line.product.price)}
                            </span>
                            {line.product.oldPrice && (
                              <span className="font-price text-xs text-[#171815]/50 line-through">
                                {formatCurrency(line.product.oldPrice)}
                              </span>
                            )}
                          </div>
                          {line.appliedTags.map((t, idx) => (
                            <p
                              key={idx}
                              className="text-[11px] font-semibold text-[#1F3D2A] mt-0.5"
                            >
                              • {t}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        {isBuyNowMode && buyNowItem ? (
                          <div className="inline-flex items-center border border-[#951722]/30 rounded-lg bg-[#FFFBF2]">
                            <button
                              type="button"
                              onClick={() =>
                                startBuyNow(
                                  line.product.id,
                                  Math.max(1, line.quantity - 1),
                                  line.selectedPack
                                )
                              }
                              aria-label="Giảm số lượng"
                              className="w-8 h-8 flex items-center justify-center active:scale-95 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <RollingNumber
                              value={line.quantity}
                              className="px-2.5 font-price font-bold text-sm"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                startBuyNow(
                                  line.product.id,
                                  Math.min(line.product.stock, line.quantity + 1),
                                  line.selectedPack
                                )
                              }
                              aria-label="Tăng số lượng"
                              className="w-8 h-8 flex items-center justify-center active:scale-95 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-[#171815]/70">
                            SL: {line.quantity}
                          </span>
                        )}
                        <AnimatedPrice
                          value={line.lineSubtotal}
                          className="font-price text-base font-bold text-[#9B0514]"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* STEP 2: SHIPPING INFO FORM */}
          <form
            id="checkout-shipping-form"
            onSubmit={handleCompleteOrder}
            className={`bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 md:p-8 space-y-5 ${
              shakeForm ? 'anim-shake-x' : ''
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#951722]/15 pb-3">
              <h2 className="font-display text-2xl text-[#951722]">
                Bước 2: Thông Tin Giao Hàng
              </h2>
              {user && user.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const addr = user.addresses[0];
                    setCustomerName(addr.recipientName);
                    setPhone(addr.phone);
                    setProvince(addr.province);
                    setDistrict(addr.district);
                    setWard(addr.ward);
                    setStreetAddress(addr.streetAddress);
                  }}
                  className="text-xs font-bold text-[#1F3D2A] underline cursor-pointer"
                >
                  Điền từ Sổ địa chỉ
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-name" className="block text-sm font-bold text-[#171815] mb-1.5">
                  Họ và tên người nhận *
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722] transition-shadow"
                />
                {errors.customerName && (
                  <p className="text-xs font-semibold text-[#9B0514] mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="chk-phone"
                  className="block text-sm font-bold text-[#171815] mb-1.5"
                >
                  Số điện thoại nhận hàng *
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722] transition-shadow"
                />
                {errors.phone && (
                  <p className="text-xs font-semibold text-[#9B0514] mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="chk-email" className="block text-sm font-bold text-[#171815] mb-1.5">
                Email nhận thông báo đơn hàng (Tùy chọn)
              </label>
              <input
                id="chk-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khachhang@example.com"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722] transition-shadow"
              />
              {errors.email && (
                <p className="text-xs font-semibold text-[#9B0514] mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="chk-province"
                  className="block text-sm font-bold text-[#171815] mb-1.5"
                >
                  Tỉnh / Thành phố *
                </label>
                <select
                  id="chk-province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full min-h-[48px] px-3 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#951722]"
                >
                  <option value="TP. Hà Nội">TP. Hà Nội</option>
                  <option value="Tỉnh Bắc Ninh">Tỉnh Bắc Ninh</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="TP. Hải Phòng">TP. Hải Phòng</option>
                  <option value="Tỉnh Quảng Ninh">Tỉnh Quảng Ninh</option>
                  <option value="TP. Đà Nẵng">TP. Đà Nẵng</option>
                  <option value="Tỉnh/Thành khác">Tỉnh / Thành phố khác</option>
                </select>
                {errors.province && (
                  <p className="text-xs font-semibold text-[#9B0514] mt-1">{errors.province}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="chk-district"
                  className="block text-sm font-bold text-[#171815] mb-1.5"
                >
                  Quận / Huyện / Thị xã *
                </label>
                <input
                  id="chk-district"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="VD: Quận Hoàn Kiếm / Thuận Thành"
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                />
                {errors.district && (
                  <p className="text-xs font-semibold text-[#9B0514] mt-1">{errors.district}</p>
                )}
              </div>

              <div>
                <label htmlFor="chk-ward" className="block text-sm font-bold text-[#171815] mb-1.5">
                  Phường / Xã / Thị trấn *
                </label>
                <input
                  id="chk-ward"
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="VD: Phường Hàng Trống / Ninh Xá"
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                />
                {errors.ward && (
                  <p className="text-xs font-semibold text-[#9B0514] mt-1">{errors.ward}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="chk-street" className="block text-sm font-bold text-[#171815] mb-1.5">
                Địa chỉ chi tiết (Số nhà, ngõ, tên đường) *
              </label>
              <input
                id="chk-street"
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="VD: Số 48 Phố Lý Quốc Sư"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
              />
              {errors.streetAddress && (
                <p className="text-xs font-semibold text-[#9B0514] mt-1">{errors.streetAddress}</p>
              )}
            </div>

            <div>
              <label htmlFor="chk-note" className="block text-sm font-bold text-[#171815] mb-1.5">
                Ghi chú giao hàng (Giờ nhận hàng, lưu ý cho tài xế...)
              </label>
              <textarea
                id="chk-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Giao trong khung giờ 10h - 11h sáng, gọi trước khi tới..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
              />
            </div>

            {/* Gift Card Option: "Gửi tặng – thêm thiệp lời chúc" */}
            <div className="p-4 rounded-xl bg-[#FFF5E4] border border-[#1F3D2A]/30 space-y-3">
              <label className="inline-flex items-center gap-2.5 cursor-pointer font-bold text-sm text-[#1F3D2A]">
                <input
                  type="checkbox"
                  checked={isGiftOrder}
                  onChange={(e) => setIsGiftOrder(e.target.checked)}
                  className="w-5 h-5 accent-[#951722] rounded cursor-pointer"
                />
                <Gift className="w-4 h-4 text-[#951722]" />
                <span>Gửi tặng – Thêm thiệp lời chúc viết tay trên giấy Điệp (Miễn phí)</span>
              </label>

              <AnimatePresence initial={false}>
                {isGiftOrder && (
                  <motion.div
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: MOTION_TOKENS.durations.fast }}
                  >
                    <label
                      htmlFor="chk-gift-msg"
                      className="block text-xs font-semibold text-[#171815]/80 mb-1"
                    >
                      Nội dung lời chúc trên thiệp (Bùi Vị sẽ nắn nót viết tay gửi kèm hộp quà):
                    </label>
                    <textarea
                      id="chk-gift-msg"
                      rows={3}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Kính chúc Gia đình Bình An – Sung Túc, Vinh Hoa – Phú Quý..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="font-display text-2xl text-[#951722] border-b border-[#951722]/15 pb-3">
              Bước 3: Phương Thức Thanh Toán
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                  paymentMethod === 'qr'
                    ? 'bg-[#951722]/10 border-[#951722]'
                    : 'bg-[#FFF5E4] border-[#171815]/20 hover:border-[#951722]/50'
                }`}
              >
                <QrCode className="w-6 h-6 text-[#951722] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[#171815]">
                    1. Chuyển khoản QR (VietQR 24/7)
                  </p>
                  <p className="text-xs text-[#171815]/70 mt-0.5">
                    Quét mã tự động điền số tiền & nội dung đơn hàng
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-[#951722]/10 border-[#951722]'
                    : 'bg-[#FFF5E4] border-[#171815]/20 hover:border-[#951722]/50'
                }`}
              >
                <Truck className="w-6 h-6 text-[#1F3D2A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[#171815]">
                    2. Thanh toán khi nhận hàng (COD)
                  </p>
                  <p className="text-xs text-[#171815]/70 mt-0.5">
                    Kiểm tra hộp quà nguyên vẹn trước khi thanh toán tiền mặt
                  </p>
                </div>
              </button>
            </div>

            {/* Option 1: VietQR Display with scan-line shimmer */}
            {paymentMethod === 'qr' && (
              <div className="p-5 rounded-2xl bg-[#FFF5E4] border-2 border-[#1F3D2A]/35 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* VietQR Frame with subtle scan-line */}
                <div className="md:col-span-5 bg-white p-4 rounded-2xl border-2 border-[#951722] text-center shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-[#951722] uppercase tracking-wider mb-2">
                    VIETQR · {SITE_CONFIG.bankInfo.bankShortName}
                  </div>
                  <div className="relative w-40 h-40 mx-auto overflow-hidden rounded-lg">
                    {/* Scan line shimmer across QR */}
                    <div
                      aria-hidden="true"
                      className="qr-scan-line pointer-events-none absolute inset-x-2 top-2 h-0.5 bg-gradient-to-r from-transparent via-[#951722] to-transparent z-10"
                    />
                    <svg
                      viewBox="0 0 180 180"
                      className="w-40 h-40 mx-auto border border-[#171815]/15 rounded-lg p-2"
                      role="img"
                      aria-label="Mã QR chuyển khoản ngân hàng Bùi Vị"
                    >
                      <rect width="180" height="180" fill="#FFFFFF" />
                      {/* Finder patterns */}
                      <rect
                        x="12"
                        y="12"
                        width="44"
                        height="44"
                        fill="none"
                        stroke="#171815"
                        strokeWidth="6"
                      />
                      <rect x="24" y="24" width="20" height="20" fill="#951722" />
                      <rect
                        x="124"
                        y="12"
                        width="44"
                        height="44"
                        fill="none"
                        stroke="#171815"
                        strokeWidth="6"
                      />
                      <rect x="136" y="24" width="20" height="20" fill="#951722" />
                      <rect
                        x="12"
                        y="124"
                        width="44"
                        height="44"
                        fill="none"
                        stroke="#171815"
                        strokeWidth="6"
                      />
                      <rect x="24" y="136" width="20" height="20" fill="#951722" />
                      {/* Data matrix blocks */}
                      <rect x="68" y="16" width="10" height="10" fill="#171815" />
                      <rect x="86" y="16" width="18" height="10" fill="#171815" />
                      <rect x="68" y="36" width="24" height="10" fill="#1F3D2A" />
                      <rect x="100" y="36" width="12" height="18" fill="#171815" />
                      <rect x="16" y="68" width="26" height="10" fill="#171815" />
                      <rect x="52" y="68" width="16" height="16" fill="#1F3D2A" />
                      <rect x="116" y="68" width="24" height="12" fill="#171815" />
                      <rect x="150" y="72" width="14" height="24" fill="#171815" />
                      <rect x="20" y="92" width="14" height="18" fill="#171815" />
                      <rect x="44" y="96" width="20" height="12" fill="#171815" />
                      <rect x="116" y="96" width="32" height="14" fill="#1F3D2A" />
                      <rect x="68" y="124" width="18" height="18" fill="#171815" />
                      <rect x="96" y="130" width="22" height="12" fill="#951722" />
                      <rect x="128" y="126" width="36" height="14" fill="#171815" />
                      <rect x="68" y="152" width="34" height="12" fill="#171815" />
                      <rect x="114" y="150" width="22" height="16" fill="#1F3D2A" />
                      <rect x="146" y="148" width="18" height="18" fill="#951722" />
                      {/* Center Brand Emblem (Image Logo) */}
                      <rect
                        x="72"
                        y="72"
                        width="36"
                        height="36"
                        rx="6"
                        fill="#FFF5E4"
                        stroke="#951722"
                        strokeWidth="2"
                      />
                      <image
                        href={SITE_CONFIG.logoPath}
                        x="75"
                        y="75"
                        width="30"
                        height="30"
                        preserveAspectRatio="xMidYMid contain"
                      />
                    </svg>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#9B0514]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hiệu lực mã QR: {formatCountdown(qrCountdown)}</span>
                  </div>
                </div>

                {/* Bank Info Details + 1-Tap Copy Buttons (P1-1) */}
                <div className="md:col-span-7 space-y-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[#1F3D2A] text-base">
                      Thông tin tài khoản thụ hưởng chính thức:
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyAllBankInfo}
                      className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[#1F3D2A] hover:bg-[#162D1F] text-[#FFF5E4] text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                    >
                      {copiedField === 'all' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#F3D27A]" />
                          <span>Xong</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#F3D27A]" />
                          <span>Sao chép tất cả</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Clear Order Code row with its own Copy button */}
                  <div className="p-3 rounded-xl bg-[#FFFBF2] border border-[#1F3D2A]/30 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-[#171815]/70 block">Mã đơn hàng:</span>
                      <span className="font-body text-[18px] text-[#1F3D2A] select-all">
                        {tempOrderRef}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyValue('orderCode', tempOrderRef, 'mã đơn hàng')}
                      aria-label="Sao chép mã đơn hàng"
                      className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[#1F3D2A]/40 bg-[#FFF5E4] hover:bg-[#1F3D2A] text-[#1F3D2A] hover:text-[#FFF5E4] text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                    >
                      {copiedField === 'orderCode' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Xong</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 bg-[#FFFBF2] p-3.5 rounded-xl border border-[#951722]/20">
                    <div className="flex justify-between gap-2 py-1 border-b border-[#951722]/10">
                      <span className="text-[#171815]/70">Ngân hàng:</span>
                      <span className="text-right">{SITE_CONFIG.bankInfo.bankName}</span>
                    </div>
                    <div className="flex justify-between gap-2 py-1 border-b border-[#951722]/10">
                      <span className="text-[#171815]/70">Chủ tài khoản:</span>
                      <span className="text-right">{SITE_CONFIG.bankInfo.accountHolder}</span>
                    </div>

                    {/* Số tài khoản + 1-tap Sao chép */}
                    <div className="flex items-center justify-between gap-2 py-1 border-b border-[#951722]/10">
                      <div>
                        <span className="text-xs text-[#171815]/70 block">Số tài khoản:</span>
                        <span className="font-body text-[18px] text-[#951722] select-all">
                          {SITE_CONFIG.bankInfo.accountNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyValue(
                            'accountNumber',
                            SITE_CONFIG.bankInfo.accountNumber,
                            'số tài khoản'
                          )
                        }
                        aria-label="Sao chép số tài khoản"
                        className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[#951722]/35 bg-[#FFF5E4] hover:bg-[#951722] text-[#951722] hover:text-[#FFF5E4] text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                      >
                        {copiedField === 'accountNumber' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Xong</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Số tiền + 1-tap Sao chép (Yeseva One for the amount) */}
                    <div className="flex items-center justify-between gap-2 py-1 border-b border-[#951722]/10">
                      <div>
                        <span className="font-display text-xs text-[#171815]/70 block">
                          Số tiền:
                        </span>
                        <span className="select-all inline-block">
                          <AnimatedPrice
                            value={activePromotion.finalTotal}
                            className="font-price text-[20px] text-[#9B0514] select-all"
                          />
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyValue(
                            'amount',
                            String(activePromotion.finalTotal),
                            'số tiền chuyển khoản'
                          )
                        }
                        aria-label="Sao chép số tiền"
                        className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[#951722]/35 bg-[#FFF5E4] hover:bg-[#951722] text-[#951722] hover:text-[#FFF5E4] text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                      >
                        {copiedField === 'amount' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Xong</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Nội dung chuyển khoản + 1-tap Sao chép */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div>
                        <span className="text-xs text-[#171815]/70 block">
                          Nội dung chuyển khoản:
                        </span>
                        <span className="font-body text-[18px] text-[#1F3D2A] select-all">
                          {transferContentValue}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyValue(
                            'transferContent',
                            transferContentValue,
                            'nội dung chuyển khoản'
                          )
                        }
                        aria-label="Sao chép nội dung chuyển khoản"
                        className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[#951722]/35 bg-[#FFF5E4] hover:bg-[#951722] text-[#951722] hover:text-[#FFF5E4] text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                      >
                        {copiedField === 'transferContent' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Xong</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Instruction line inside QR box (replaces duplicate primary button per P1-1) */}
                  <p className="p-3 rounded-xl bg-[#1F3D2A]/10 border border-[#1F3D2A]/25 text-xs sm:text-sm text-[#1F3D2A]">
                    Quét mã QR, kiểm tra đúng số tiền và nội dung, rồi bấm “Tôi đã chuyển khoản”.
                  </p>
                </div>
              </div>
            )}

            {/* Option 2: COD Display (no duplicate primary button inside COD box per P1-1) */}
            {paymentMethod === 'cod' && (
              <div className="p-5 rounded-2xl bg-[#FFF5E4] border border-[#1F3D2A]/35">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#1F3D2A] shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="text-[#171815]">Thanh toán tiền mặt khi nhận hàng (COD)</p>
                    <p className="text-[#171815]/80">
                      Quý khách được đồng kiểm hộp quà lục giác giấy Điệp và tem niêm phong lạnh
                      trước khi thanh toán số tiền{' '}
                      <strong className="font-price text-[#9B0514]">
                        {formatCurrency(activePromotion.finalTotal)}
                      </strong>{' '}
                      cho nhân viên giao hàng.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Failure Demo Toggle (P0-1: rendered ONLY when ENABLE_PAYMENT_FAIL_DEMO is true OR URL has ?demo=fail) */}
            {showFailDemoToggle && (
              <div className="pt-3 border-t border-[#951722]/15 flex items-center justify-between text-xs text-[#171815]/75">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulatePaymentFailure}
                    onChange={(e) => setSimulatePaymentFailure(e.target.checked)}
                    className="w-4 h-4 accent-[#9B0514] rounded cursor-pointer"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#9B0514]" />
                    <span>Chế độ kiểm thử: Mô phỏng giao dịch thanh toán thất bại</span>
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Always-Visible Order Summary & Single Primary CTA (P1-1) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <PromotionSummary
            promotion={activePromotion}
            primaryCtaLabel={singlePrimaryCtaLabel}
            onPrimaryCtaClick={() => handleCompleteOrder()}
          />
        </div>
      </div>
    </div>
  );
};
