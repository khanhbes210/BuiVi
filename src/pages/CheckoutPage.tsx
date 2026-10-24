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
  ArrowRight,
  ArrowLeft,
  MapPin,
  Edit3,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SITE_CONFIG, shouldShowPaymentFailDemo } from '../data/siteConfig';
import { formatCurrency, formatPrice, getDiscountPercent } from '../data/products';
import { PromotionSummary } from '../components/PromotionSummary';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { HeritageDropdown, PROVINCE_OPTIONS } from '../components/HeritageDropdown';
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
  const initialStepParam = searchParams.get('step') === '3' ? 3 : 2;
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

  // Separated step state: 2 = Thông tin giao hàng, 3 = Thanh toán
  const [checkoutStep, setCheckoutStep] = useState<2 | 3>(initialStepParam);

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
    document.title =
      checkoutStep === 2
        ? 'Bước 2: Thông Tin Giao Hàng | BÙI VỊ'
        : 'Bước 3: Thanh Toán Đơn Hàng | BÙI VỊ';
  }, [checkoutStep]);

  useEffect(() => {
    if (paymentMethod !== 'qr' || checkoutStep !== 3) return;
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod, checkoutStep]);

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

  const triggerShakeAndScroll = () => {
    setShakeForm(false);
    requestAnimationFrame(() => {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 360);
    });
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const handleProceedToPaymentStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      triggerShakeAndScroll();
      return;
    }
    setCheckoutStep(3);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCompleteOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      setCheckoutStep(2);
      triggerShakeAndScroll();
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

  const rightColumnPrimaryCtaLabel =
    checkoutStep === 2
      ? 'Tiếp tục đến Thanh toán'
      : paymentMethod === 'qr'
      ? 'Tôi đã chuyển khoản'
      : `Đặt hàng (${formatPrice(activePromotion.finalTotal)})`;

  const handleRightColumnPrimaryCta = () => {
    if (checkoutStep === 2) {
      handleProceedToPaymentStep();
    } else {
      handleCompleteOrder();
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Shared 4-Step Checkout Stepper: 1. Giỏ hàng -> 2. Thông tin giao hàng -> 3. Thanh toán -> 4. Kết quả */}
      <CheckoutStepper
        currentStep={checkoutStep}
        onSelectStep={(step) => {
          if (step === 2) {
            setCheckoutStep(2);
            window.scrollTo({ top: 100, behavior: 'smooth' });
          }
        }}
      />

      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
            {checkoutStep === 2
              ? 'Bước 2 / 4 · Nhập địa chỉ người nhận & Gói quà biếu'
              : 'Bước 3 / 4 · Xác nhận phương thức thanh toán'}
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-[#951722] mt-1">
            {checkoutStep === 2 ? 'Thông Tin Giao Hàng' : 'Phương Thức Thanh Toán'}
          </h1>
        </div>

        {checkoutStep === 3 && (
          <button
            type="button"
            data-testid="back-to-shipping-step-btn"
            onClick={() => {
              setCheckoutStep(2);
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#F5E6CC] border border-[#951722]/35 text-xs sm:text-sm font-bold text-[#1F3D2A] inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#951722]" />
            <span>Quay lại sửa thông tin giao hàng</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Renders ONLY Step 2 (Shipping) OR Step 3 (Payment) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            {checkoutStep === 2 ? (
              <motion.div
                key="step-2-shipping-only"
                data-testid="checkout-step-shipping"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
                transition={{
                  duration: MOTION_TOKENS.durations.normal,
                  ease: MOTION_TOKENS.easings.standard,
                }}
                className="space-y-7"
              >
                {/* Selected Items Overview */}
                <div className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-xl text-[#1F3D2A]">
                      Sản Phẩm Đặt Mua ({activePromotion.lines.filter((l) => l.selected).length})
                    </h2>
                    {!isBuyNowMode && (
                      <button
                        type="button"
                        onClick={() => navigate('/gio-hang')}
                        className="text-xs font-bold text-[#951722] hover:underline cursor-pointer"
                      >
                        ← Quay lại Giỏ hàng
                      </button>
                    )}
                  </div>
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
                                <p className="font-display text-lg text-[#171815]">
                                  {line.product.name}
                                </p>
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

                {/* STEP 2 ONLY: SHIPPING INFO FORM */}
                <form
                  id="checkout-shipping-form"
                  onSubmit={handleProceedToPaymentStep}
                  className={`bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 md:p-8 space-y-5 ${
                    shakeForm ? 'anim-shake-x' : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#951722]/15 pb-3">
                    <h2 className="font-display text-2xl text-[#951722]">
                      Bước 2: Thông Tin Người Nhận & Địa Chỉ Giao Hàng
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
                      <label
                        htmlFor="chk-name"
                        className="block text-sm font-bold text-[#171815] mb-1.5"
                      >
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
                        <p className="text-xs font-semibold text-[#9B0514] mt-1">
                          {errors.customerName}
                        </p>
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
                    <label
                      htmlFor="chk-email"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
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
                      <label className="block text-sm font-bold text-[#171815] mb-1.5">
                        Tỉnh / Thành phố *
                      </label>
                      <HeritageDropdown
                        value={province}
                        onChange={(val) => setProvince(val)}
                        options={PROVINCE_OPTIONS}
                        headerTitle="Chọn Tỉnh / Thành phố"
                        triggerTestId="checkout-province-trigger"
                        listboxTestId="checkout-province-listbox"
                        optionTestIdPrefix="checkout-province-option"
                        size="sm"
                      />
                      {errors.province && (
                        <p className="text-xs font-semibold text-[#9B0514] mt-1">
                          {errors.province}
                        </p>
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
                        <p className="text-xs font-semibold text-[#9B0514] mt-1">
                          {errors.district}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="chk-ward"
                        className="block text-sm font-bold text-[#171815] mb-1.5"
                      >
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
                    <label
                      htmlFor="chk-street"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
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
                      <p className="text-xs font-semibold text-[#9B0514] mt-1">
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="chk-note"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
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
                            Nội dung lời chúc trên thiệp (Bùi Vị sẽ nắn nót viết tay gửi kèm hộp
                            quà):
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

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/gio-hang')}
                      className="min-h-[50px] px-5 py-2.5 rounded-xl border-2 border-[#1F3D2A]/30 text-[#1F3D2A] hover:bg-[#1F3D2A]/10 font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Quay lại Bước 1 (Giỏ hàng)</span>
                    </button>

                    <button
                      type="submit"
                      data-testid="proceed-to-payment-step-btn"
                      className="btn-sheen font-body min-h-[54px] px-7 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] active:scale-[0.98] text-[#FFF5E4] font-bold text-[17px] leading-normal tracking-[0.2px] inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                    >
                      <span>Tiếp tục đến Thanh toán (Bước 3)</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* STEP 3 ONLY: PAYMENT METHOD + COMPACT SHIPPING RECAP */
              <motion.div
                key="step-3-payment-only"
                data-testid="checkout-step-payment"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
                transition={{
                  duration: MOTION_TOKENS.durations.normal,
                  ease: MOTION_TOKENS.easings.standard,
                }}
                className="space-y-6"
              >
                {/* Compact Confirmed Shipping Info Bar */}
                <div className="bg-[#FFFBF2] border-2 border-[#1F3D2A]/35 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-sm">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
                      <MapPin className="w-4 h-4 text-[#951722]" />
                      <span>Địa chỉ nhận hàng đã xác nhận (Bước 2)</span>
                    </div>
                    <p className="font-bold text-base text-[#171815]">
                      {customerName} · <span className="font-price text-[#951722]">{phone}</span>
                    </p>
                    <p className="text-[#171815]/80">
                      {streetAddress}, {ward}, {district}, {province}
                    </p>
                    {isGiftOrder && (
                      <p className="text-xs font-semibold text-[#951722] flex items-center gap-1 pt-0.5">
                        <Gift className="w-3.5 h-3.5" />
                        <span>
                          Kèm thiệp viết tay giấy Điệp
                          {giftMessage ? `: “${giftMessage}”` : ''}
                        </span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-[#FFF5E4] hover:bg-[#F5E6CC] border border-[#951722]/30 text-xs font-bold text-[#951722] inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Thay đổi</span>
                  </button>
                </div>

                {/* Payment Method Card */}
                <div className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 md:p-8 space-y-6">
                  <h2 className="font-display text-2xl text-[#951722] border-b border-[#951722]/15 pb-3">
                    Bước 3: Chọn Phương Thức Thanh Toán
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

                      {/* Bank Info Details + 1-Tap Copy Buttons */}
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

                        <p className="p-3 rounded-xl bg-[#1F3D2A]/10 border border-[#1F3D2A]/25 text-xs sm:text-sm text-[#1F3D2A]">
                          Quét mã QR, kiểm tra đúng số tiền và nội dung, rồi bấm “Tôi đã chuyển
                          khoản”.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Option 2: COD Display */}
                  {paymentMethod === 'cod' && (
                    <div className="p-5 rounded-2xl bg-[#FFF5E4] border border-[#1F3D2A]/35">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-6 h-6 text-[#1F3D2A] shrink-0 mt-0.5" />
                        <div className="text-sm space-y-1">
                          <p className="text-[#171815] font-bold">
                            Thanh toán tiền mặt khi nhận hàng (COD)
                          </p>
                          <p className="text-[#171815]/80">
                            Quý khách được đồng kiểm hộp quà lục giác giấy Điệp và tem niêm phong
                            lạnh trước khi thanh toán số tiền{' '}
                            <strong className="font-price text-[#9B0514]">
                              {formatCurrency(activePromotion.finalTotal)}
                            </strong>{' '}
                            cho nhân viên giao hàng.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Failure Demo Toggle */}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Order Summary & Step-Aware Primary CTA */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <PromotionSummary
            promotion={activePromotion}
            primaryCtaLabel={rightColumnPrimaryCtaLabel}
            onPrimaryCtaClick={handleRightColumnPrimaryCta}
          />
        </div>
      </div>
    </div>
  );
};
