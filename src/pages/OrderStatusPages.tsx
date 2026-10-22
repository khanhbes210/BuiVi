import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Gift,
  MapPin,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../data/products';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { AnimationSlot, Reveal, Stagger } from '../motion';

export const OrderSuccessPage: React.FC = () => {
  const { lastPlacedOrder } = useStore();

  useEffect(() => {
    document.title = 'Đặt Hàng Thành Công | BÙI VỊ – Quà Biếu Di Sản';
  }, []);

  return (
    <div>
      <div className="py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={3} />
        <div className="bg-[#FFFBF2] double-border-forest rounded-3xl p-6 md:p-10 space-y-8 shadow-md">
          {/* Header with Animation Slot #7: order-success-stamp */}
          <div className="text-center space-y-3">
            <AnimationSlot id="order-success-stamp" className="max-w-[240px] mx-auto" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A] block pt-1">
              Cảm ơn quý khách đã trao gửi niềm tin
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-[#951722]">
              Đặt Hàng Thành Công!
            </h1>
            {lastPlacedOrder && (
              <p className="text-base text-[#171815]/85">
                Mã đơn hàng của quý khách:{' '}
                <strong className="font-mono text-lg text-[#1F3D2A] bg-[#FFF5E4] px-3 py-1 rounded-lg border border-[#1F3D2A]/30">
                  {lastPlacedOrder.code}
                </strong>
              </p>
            )}
          </div>

          {lastPlacedOrder && (
            <Stagger className="space-y-6">
              {/* Delivery & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFF5E4] p-5 rounded-2xl border border-[#951722]/20 text-sm">
                <div className="space-y-1.5">
                  <p className="font-bold text-[#1F3D2A] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#951722]" />
                    <span>Thông tin người nhận:</span>
                  </p>
                  <p className="font-bold text-[#171815]">
                    {lastPlacedOrder.customerName} · {lastPlacedOrder.phone}
                  </p>
                  <p className="text-[#171815]/80">{lastPlacedOrder.fullAddress}</p>
                  {lastPlacedOrder.isGiftOrder && lastPlacedOrder.giftMessage && (
                    <p className="text-xs italic text-[#951722] pt-1">
                      Thiệp viết tay: “{lastPlacedOrder.giftMessage}”
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <p className="font-bold text-[#1F3D2A] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#951722]" />
                    <span>Thời gian giao hàng dự kiến:</span>
                  </p>
                  <p className="font-bold text-[#171815]">{lastPlacedOrder.estimatedDelivery}</p>
                  <p className="text-[#171815]/80">
                    Phương thức:{' '}
                    {lastPlacedOrder.paymentMethod === 'qr'
                      ? 'Chuyển khoản QR (Đã xác nhận)'
                      : 'Thanh toán khi nhận hàng (COD)'}
                  </p>
                </div>
              </div>

              {/* Order Items & Gifts Summary */}
              <div className="space-y-3">
                <h2 className="font-display text-xl text-[#171815]">Chi Tiết Đơn Hàng</h2>
                <div className="divide-y divide-[#951722]/15 border border-[#951722]/20 rounded-2xl bg-[#FFF5E4] overflow-hidden">
                  {lastPlacedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-display text-base text-[#171815]">
                          {item.productName}{' '}
                          <span className="font-price text-[#951722]">x{item.quantity}</span>
                        </p>
                        <p className="text-xs text-[#171815]/70">{item.packSpec}</p>
                      </div>
                      <span className="font-price text-lg text-[#9B0514]">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}

                  {lastPlacedOrder.gifts.map((g, idx) => (
                    <div
                      key={`gift-${idx}`}
                      className="p-3.5 bg-[#1F3D2A]/10 flex items-center justify-between gap-4 text-xs"
                    >
                      <span className="text-[#1F3D2A] flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-[#951722]" />
                        <span className="font-display text-sm">{g.name}</span>
                      </span>
                      <span className="font-price text-[#1F3D2A]">{g.badgeText}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="p-4 rounded-2xl bg-[#FFF5E4] border border-[#951722]/20 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-display">Tạm tính:</span>
                    <span className="font-price">
                      {formatCurrency(lastPlacedOrder.subtotal)}
                    </span>
                  </div>
                  {lastPlacedOrder.voucherDiscount > 0 && (
                    <div className="flex justify-between text-[#9B0514]">
                      <span>
                        Giảm giá voucher (
                        <span className="font-display">{lastPlacedOrder.voucherCode}</span>):
                      </span>
                      <span className="font-price">
                        -{formatCurrency(lastPlacedOrder.voucherDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="font-price text-[#1F3D2A]">
                      {lastPlacedOrder.shippingFee === 0
                        ? '0đ (Miễn phí FREESHIP)'
                        : formatCurrency(lastPlacedOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#951722]/20">
                    <span className="font-display text-lg">Tổng thanh toán:</span>
                    <span className="font-price text-2xl text-[#9B0514]">
                      {formatCurrency(lastPlacedOrder.totalAmount)}
                    </span>
                  </div>
                  {lastPlacedOrder.totalSavings > 0 && (
                    <p className="font-display text-sm text-[#1F3D2A] text-right">
                      Bạn đã tiết kiệm tổng cộng {formatCurrency(lastPlacedOrder.totalSavings)}
                    </p>
                  )}
                </div>
              </div>
            </Stagger>
          )}

          {/* Two Large Mandatory CTAs (Addendum #8) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              to="/"
              className="btn-sheen font-body min-h-[56px] px-6 py-3.5 rounded-xl bg-[#951722] hover:bg-[#9B0514] active:scale-[0.98] text-[#FFF5E4] text-[17px] leading-normal tracking-[0.2px] whitespace-nowrap shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Tiếp tục mua sắm</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/tai-khoan/don-hang"
              className="btn-sheen font-body min-h-[56px] px-6 py-3.5 rounded-xl border-2 border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4] active:scale-[0.98] text-[17px] leading-normal tracking-[0.2px] whitespace-nowrap flex items-center justify-center gap-2 transition-all"
            >
              <Package className="w-5 h-5" />
              <span>Xem đơn hàng của tôi</span>
            </Link>
          </div>
        </div>
      </div>

      <FeaturedProductsBlock />
    </div>
  );
};

export const PaymentFailedPage: React.FC = () => {
  const { appliedVoucherCode, totalCartItemsCount, setSimulatePaymentFailure } = useStore();

  useEffect(() => {
    document.title = 'Thanh Toán Chưa Hoàn Tất | BÙI VỊ';
  }, []);

  return (
    <div>
      <div className="py-12 md:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={3} />
        <div className="bg-[#FFFBF2] border-2 border-[#9B0514]/40 rounded-3xl p-6 md:p-10 text-center space-y-6 shadow-md">
          {/* Animation Slot #8: payment-failed */}
          <AnimationSlot id="payment-failed" className="max-w-[240px] mx-auto" />

          <Reveal>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#9B0514]">
                Giao dịch gián đoạn
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-[#9B0514]">
                Thanh Toán Chưa Thành Công
              </h1>
              <p className="text-base text-[#171815]/85 max-w-xl mx-auto leading-relaxed">
                Rất tiếc, quá trình xác nhận thanh toán đã bị gián đoạn hoặc hết thời gian chờ. Toàn
                bộ <strong>{totalCartItemsCount} sản phẩm</strong> trong giỏ hàng{' '}
                {appliedVoucherCode ? (
                  <>
                    cùng mã ưu đãi <strong className="font-display">{appliedVoucherCode}</strong>
                  </>
                ) : (
                  'cùng các chương trình khuyến mãi tự động'
                )}{' '}
                của quý khách vẫn được giữ nguyên.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              to="/gio-hang"
              onClick={() => setSimulatePaymentFailure(false)}
              className="btn-sheen font-body min-h-[56px] px-6 py-3.5 rounded-xl bg-[#951722] hover:bg-[#9B0514] active:scale-[0.98] text-[#FFF5E4] text-[17px] leading-normal tracking-[0.2px] whitespace-nowrap shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Quay lại giỏ hàng & thử lại</span>
            </Link>

            <Link
              to="/thanh-toan"
              onClick={() => setSimulatePaymentFailure(false)}
              className="btn-sheen font-body min-h-[56px] px-6 py-3.5 rounded-xl border-2 border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4] active:scale-[0.98] text-[17px] leading-normal tracking-[0.2px] whitespace-nowrap flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Thanh toán lại ngay</span>
            </Link>
          </div>
        </div>
      </div>

      <FeaturedProductsBlock />
    </div>
  );
};
