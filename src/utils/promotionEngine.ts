import { Product, PRODUCTS, formatPrice } from '../data/products';
import { Voucher, VOUCHERS } from '../data/vouchers';
import { SITE_CONFIG } from '../data/siteConfig';

export interface CartItemInput {
  productId: string;
  quantity: number;
  selectedPack?: string;
  selected?: boolean;
}

export interface EnrichedCartLine {
  product: Product;
  quantity: number;
  selectedPack: string;
  selected: boolean;
  lineSubtotal: number;
  lineOldSubtotal: number;
  lineDirectSaleSavings: number;
  lineVoucherDiscount: number;
  appliedTags: string[];
}

export interface VoucherEligibilityStatus {
  voucher: Voucher;
  eligible: boolean;
  estimatedDiscount: number;
  reasonIfIneligible?: string;
  amountNeededForMinOrder?: number;
}

export interface PromotionCalculationResult {
  lines: EnrichedCartLine[];
  subtotal: number;
  oldSubtotal: number;
  directSaleSavings: number;
  appliedDiscountCode: string | null;
  appliedDiscountVoucher: Voucher | null;
  voucherDiscountAmount: number;
  isAutoAppliedBestVoucher: boolean;
  freeshipApplied: boolean;
  shippingFeeBeforeDiscount: number;
  shippingDiscountAmount: number;
  finalShippingFee: number;
  tangHopGiftActive: boolean;
  combo3BonusGiftActive: boolean;
  gifts: {
    code: string;
    name: string;
    normalPrice: number;
    quantity: number;
    badgeText: string;
  }[];
  giftValueTotal: number;
  finalTotal: number;
  totalSavings: number;
  voucherStatuses: VoucherEligibilityStatus[];
  bestEligibleDiscountVoucher: VoucherEligibilityStatus | null;
}

export function countGiftSetsInCart(lines: { product: Product; quantity: number }[]): number {
  let count = 0;
  for (const line of lines) {
    if (line.product.category === 'Combo 3 set') {
      count += line.quantity * 3;
    } else if (line.product.isGiftSet) {
      count += line.quantity;
    }
  }
  return count;
}

export function getVoucherSelectToast(
  prevCode: string | null,
  prevDiscount: number,
  nextCode: string,
  nextDiscount: number
): string {
  if (!prevCode || prevCode === 'NONE' || prevCode === nextCode) {
    return `Đã áp dụng mã ${nextCode} – giảm ${formatPrice(nextDiscount)} cho đơn này`;
  }
  const diff = nextDiscount - prevDiscount;
  if (diff >= 0) {
    return `Đã đổi từ mã ${prevCode} sang ${nextCode} – bạn tiết kiệm thêm ${formatPrice(diff)}`;
  }
  return `Đã đổi từ mã ${prevCode} sang ${nextCode} – ít hơn ${formatPrice(Math.abs(diff))}`;
}

export function evaluateVoucherForLines(
  voucher: Voucher,
  activeLines: { product: Product; quantity: number }[],
  isAuthenticated: boolean,
  isFirstOrder: boolean = true
): VoucherEligibilityStatus {
  const subtotal = activeLines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);

  if (activeLines.length === 0 || subtotal === 0) {
    return {
      voucher,
      eligible: false,
      estimatedDiscount: 0,
      reasonIfIneligible: 'Giỏ hàng chưa có sản phẩm được chọn.',
    };
  }

  if (voucher.code === 'BUIVI10') {
    const eligibleLines = activeLines.filter((l) => l.product.category !== 'Combo 3 set');
    const eligibleSubtotal = eligibleLines.reduce(
      (sum, l) => sum + l.product.price * l.quantity,
      0
    );
    if (eligibleLines.length === 0) {
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        reasonIfIneligible: 'Chưa đủ điều kiện – Mã BUIVI10 không áp dụng cho Combo 3 hộp quà',
      };
    }
    if (eligibleSubtotal < voucher.minOrder) {
      const diff = voucher.minOrder - eligibleSubtotal;
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        amountNeededForMinOrder: diff,
        reasonIfIneligible: `Chưa đủ điều kiện – Mua thêm ${formatPrice(diff)} để dùng mã`,
      };
    }
    const rawDiscount = Math.round(eligibleSubtotal * (voucher.value / 100));
    const discount = Math.min(rawDiscount, voucher.maxDiscount);
    return {
      voucher,
      eligible: true,
      estimatedDiscount: discount,
    };
  }

  if (voucher.code === 'FREESHIP') {
    if (subtotal < voucher.minOrder) {
      const diff = voucher.minOrder - subtotal;
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        amountNeededForMinOrder: diff,
        reasonIfIneligible: `Chưa đủ điều kiện – Mua thêm ${formatPrice(diff)} để dùng mã`,
      };
    }
    return {
      voucher,
      eligible: true,
      estimatedDiscount: SITE_CONFIG.shipping.maxFreeShipSupport,
    };
  }

  if (voucher.code === 'QUATET15') {
    const eligibleLines = activeLines.filter(
      (l) =>
        l.product.category === 'Set Vinh Hoa - Phú Quý' || l.product.category === 'Set Độc Bản'
    );
    const eligibleSubtotal = eligibleLines.reduce(
      (sum, l) => sum + l.product.price * l.quantity,
      0
    );
    if (eligibleSubtotal === 0) {
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        reasonIfIneligible:
          'Chưa đủ điều kiện – Chỉ áp dụng cho Set Vinh Hoa - Phú Quý và Set Độc Bản',
      };
    }
    const rawDiscount = Math.round(eligibleSubtotal * (voucher.value / 100));
    const discount = Math.min(rawDiscount, voucher.maxDiscount);
    return {
      voucher,
      eligible: true,
      estimatedDiscount: discount,
    };
  }

  if (voucher.code === 'COMBO3') {
    const comboLines = activeLines.filter((l) => l.product.category === 'Combo 3 set');
    if (comboLines.length === 0) {
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        reasonIfIneligible: 'Chưa đủ điều kiện – Tự động áp dụng khi mua Combo 3 hộp quà',
      };
    }
    return {
      voucher,
      eligible: true,
      estimatedDiscount: voucher.value,
    };
  }

  if (voucher.code === 'THANHVIEN50') {
    if (subtotal < voucher.minOrder) {
      const diff = voucher.minOrder - subtotal;
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        amountNeededForMinOrder: diff,
        reasonIfIneligible: `Chưa đủ điều kiện – Mua thêm ${formatPrice(diff)} để dùng mã`,
      };
    }
    if (!isAuthenticated) {
      return {
        voucher,
        eligible: false,
        estimatedDiscount: voucher.value,
        reasonIfIneligible: 'Chưa đủ điều kiện – Yêu cầu đăng nhập thành viên mới để áp dụng mã',
      };
    }
    if (!isFirstOrder) {
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        reasonIfIneligible: 'Chưa đủ điều kiện – Chỉ áp dụng cho đơn đầu tiên của thành viên mới',
      };
    }
    return {
      voucher,
      eligible: true,
      estimatedDiscount: voucher.value,
    };
  }

  if (voucher.code === 'TANGHOP') {
    const setCount = countGiftSetsInCart(activeLines);
    if (setCount < 2) {
      const needed = 2 - setCount;
      return {
        voucher,
        eligible: false,
        estimatedDiscount: 0,
        reasonIfIneligible: `Chưa đủ điều kiện – Chọn thêm ${needed} Set quà để được tặng 1 hộp Nem chua`,
      };
    }
    return {
      voucher,
      eligible: true,
      estimatedDiscount: voucher.value,
    };
  }

  return {
    voucher,
    eligible: false,
    estimatedDiscount: 0,
    reasonIfIneligible: 'Mã không hợp lệ.',
  };
}

export function validateManualVoucherCode(
  rawCode: string,
  activeLines: { product: Product; quantity: number }[],
  isAuthenticated: boolean,
  isFirstOrder: boolean = true
): { ok: boolean; message: string; voucher?: Voucher; status?: VoucherEligibilityStatus } {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return { ok: false, message: 'Vui lòng nhập mã ưu đãi trước khi bấm Áp dụng.' };
  }
  const found = VOUCHERS.find((v) => v.code.toUpperCase() === normalized);
  if (!found) {
    return {
      ok: false,
      message: `Mã ưu đãi "${normalized}" không tồn tại hoặc đã hết hạn. Vui lòng kiểm tra lại!`,
    };
  }
  const status = evaluateVoucherForLines(found, activeLines, isAuthenticated, isFirstOrder);
  if (!status.eligible) {
    return {
      ok: false,
      message: status.reasonIfIneligible || `Đơn hàng chưa đủ điều kiện áp dụng mã ${found.code}.`,
      voucher: found,
      status,
    };
  }
  return {
    ok: true,
    message: `Đã áp dụng mã ${found.code} – giảm ${formatPrice(status.estimatedDiscount)} cho đơn này`,
    voucher: found,
    status,
  };
}

export function calculateCartPromotions(
  items: CartItemInput[],
  selectedVoucherCode: string | null,
  isAuthenticated: boolean,
  isFirstOrder: boolean = true,
  autoSelectBest: boolean = false
): PromotionCalculationResult {
  const resolvedLines = items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product || item.quantity <= 0) return null;
      return {
        product,
        quantity: item.quantity,
        selectedPack: item.selectedPack || product.packOptions[0] || product.packSpec,
        selected: item.selected !== false,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const activeLines = resolvedLines.filter((l) => l.selected);

  const voucherStatuses = VOUCHERS.map((v) =>
    evaluateVoucherForLines(v, activeLines, isAuthenticated, isFirstOrder)
  );

  // Find best eligible direct price-discount voucher (BUIVI10, QUATET15, COMBO3, THANHVIEN50)
  const discountCodes = ['BUIVI10', 'QUATET15', 'COMBO3', 'THANHVIEN50'];
  const eligibleDiscountStatuses = voucherStatuses
    .filter((s) => discountCodes.includes(s.voucher.code) && s.eligible)
    .sort((a, b) => b.estimatedDiscount - a.estimatedDiscount);

  const bestEligibleDiscountVoucher = eligibleDiscountStatuses[0] || null;

  let activeDiscountStatus: VoucherEligibilityStatus | null = null;
  let isAutoAppliedBestVoucher = false;

  const isExplicitNone = selectedVoucherCode === 'NONE';

  if (selectedVoucherCode && !isExplicitNone) {
    const normalized = selectedVoucherCode.trim().toUpperCase();
    const chosenStatus = voucherStatuses.find(
      (s) => s.voucher.code === normalized && discountCodes.includes(s.voucher.code)
    );
    if (chosenStatus && chosenStatus.eligible) {
      activeDiscountStatus = chosenStatus;
    }
  }

  // Auto-apply COMBO3 or best voucher unless user explicitly cleared voucher ('NONE')
  if (!activeDiscountStatus && !isExplicitNone) {
    const combo3Status = voucherStatuses.find((s) => s.voucher.code === 'COMBO3' && s.eligible);
    if (combo3Status) {
      activeDiscountStatus = combo3Status;
      isAutoAppliedBestVoucher = true;
    } else if (autoSelectBest && bestEligibleDiscountVoucher) {
      activeDiscountStatus = bestEligibleDiscountVoucher;
      isAutoAppliedBestVoucher = true;
    }
  }

  const subtotal = activeLines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const oldSubtotal = activeLines.reduce(
    (sum, l) => sum + (l.product.oldPrice || l.product.price) * l.quantity,
    0
  );
  const directSaleSavings = Math.max(0, oldSubtotal - subtotal);

  const voucherDiscountAmount = activeDiscountStatus ? activeDiscountStatus.estimatedDiscount : 0;

  // Allocate line-level voucher discount & tags
  let remainingDiscountToAllocate = voucherDiscountAmount;
  const enrichedLines: EnrichedCartLine[] = resolvedLines.map((line) => {
    const lineSubtotal = line.product.price * line.quantity;
    const lineOldSubtotal = (line.product.oldPrice || line.product.price) * line.quantity;
    const lineDirectSaleSavings = Math.max(0, lineOldSubtotal - lineSubtotal);
    const appliedTags: string[] = [];

    if (lineDirectSaleSavings > 0) {
      appliedTags.push(`Tiết kiệm trực tiếp ${formatPrice(lineDirectSaleSavings)}`);
    }

    let lineVoucherDiscount = 0;
    if (line.selected && activeDiscountStatus && remainingDiscountToAllocate > 0) {
      const code = activeDiscountStatus.voucher.code;
      let qualifiesForLine = false;
      if (code === 'BUIVI10' && line.product.category !== 'Combo 3 set') qualifiesForLine = true;
      if (
        code === 'QUATET15' &&
        (line.product.category === 'Set Vinh Hoa - Phú Quý' ||
          line.product.category === 'Set Độc Bản')
      ) {
        qualifiesForLine = true;
      }
      if (code === 'COMBO3' && line.product.category === 'Combo 3 set') qualifiesForLine = true;
      if (code === 'THANHVIEN50') qualifiesForLine = true;

      if (qualifiesForLine) {
        if (code === 'COMBO3' || code === 'THANHVIEN50') {
          lineVoucherDiscount = remainingDiscountToAllocate;
          remainingDiscountToAllocate = 0;
        } else {
          const rawLineDisc = Math.round(
            lineSubtotal * (activeDiscountStatus.voucher.value / 100)
          );
          lineVoucherDiscount = Math.min(rawLineDisc, remainingDiscountToAllocate);
          remainingDiscountToAllocate -= lineVoucherDiscount;
        }
        if (lineVoucherDiscount > 0) {
          appliedTags.push(`${code} – giảm ${formatPrice(lineVoucherDiscount)}`);
        }
      }
    }

    if (line.selected && line.product.category === 'Combo 3 set') {
      appliedTags.push('Quà tặng: Bộ túi giấy Điệp & thiệp viết tay – 0đ');
    }

    return {
      ...line,
      lineSubtotal,
      lineOldSubtotal,
      lineDirectSaleSavings,
      lineVoucherDiscount,
      appliedTags,
    };
  });

  // Check FREESHIP (stackable)
  const freeshipStatus = voucherStatuses.find((s) => s.voucher.code === 'FREESHIP');
  const freeshipApplied = Boolean(freeshipStatus?.eligible);
  const shippingFeeBeforeDiscount =
    activeLines.length > 0 ? SITE_CONFIG.shipping.defaultInnerCityFee : 0;
  const shippingDiscountAmount = freeshipApplied
    ? Math.min(shippingFeeBeforeDiscount, SITE_CONFIG.shipping.maxFreeShipSupport)
    : 0;
  const finalShippingFee = Math.max(0, shippingFeeBeforeDiscount - shippingDiscountAmount);

  // Check TANGHOP & COMBO3 gifts (stackable)
  const tangHopStatus = voucherStatuses.find((s) => s.voucher.code === 'TANGHOP');
  const tangHopGiftActive = Boolean(tangHopStatus?.eligible);
  const combo3BonusGiftActive = activeLines.some((l) => l.product.category === 'Combo 3 set');

  const gifts: PromotionCalculationResult['gifts'] = [];
  if (tangHopGiftActive) {
    gifts.push({
      code: 'TANGHOP',
      name: 'Quà tặng: 01 Hộp Nem chua Kinh Bắc (10 cái)',
      normalPrice: 85000,
      quantity: 1,
      badgeText: '0đ – Quà tặng',
    });
  }
  if (combo3BonusGiftActive) {
    gifts.push({
      code: 'COMBO3',
      name: 'Quà tặng: Bộ Túi giấy Điệp & Thiệp viết tay',
      normalPrice: 0,
      quantity: 1,
      badgeText: '0đ – Quà tặng kèm Combo',
    });
  }

  const giftValueTotal = gifts.reduce((sum, g) => sum + g.normalPrice * g.quantity, 0);
  const finalTotal = Math.max(0, subtotal - voucherDiscountAmount + finalShippingFee);
  const totalSavings =
    directSaleSavings + voucherDiscountAmount + shippingDiscountAmount + giftValueTotal;

  return {
    lines: enrichedLines,
    subtotal,
    oldSubtotal,
    directSaleSavings,
    appliedDiscountCode: activeDiscountStatus ? activeDiscountStatus.voucher.code : null,
    appliedDiscountVoucher: activeDiscountStatus ? activeDiscountStatus.voucher : null,
    voucherDiscountAmount,
    isAutoAppliedBestVoucher,
    freeshipApplied,
    shippingFeeBeforeDiscount,
    shippingDiscountAmount,
    finalShippingFee,
    tangHopGiftActive,
    combo3BonusGiftActive,
    gifts,
    giftValueTotal,
    finalTotal,
    totalSavings,
    voucherStatuses,
    bestEligibleDiscountVoucher,
  };
}
