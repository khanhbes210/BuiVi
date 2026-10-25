export interface Voucher {
  code: string;
  title: string;
  valueText: string;
  section: 'hot' | 'combo';
  type: 'percent' | 'fixed' | 'freeship' | 'gift';
  value: number;
  minOrder: number;
  maxDiscount: number;
  applicableProductsText: string;
  excludedCategories?: string[];
  applicableCategories?: string[];
  defaultEligibleProductIds: string[];
  defaultBuyNowQuantity: number;
  startDate: string;
  endDate: string;
  expiryDisplay: string;
  countdownText: string;
  conditions: string[];
  howToUse: [string, string, string];
  stackable: boolean;
  stackableText: string;
  usageLimit: string;
  detailedTerms: string[];
  autoApply?: boolean;
  requiresAuth?: boolean;
  giftProductId?: string;
  giftProductName?: string;
  giftProductNormalPrice?: number;
  targetFilterCategory?: string;
}

export const VOUCHERS: Voucher[] = [
  {
    code: 'BUIVI10',
    title: 'Giảm 10% đơn từ 300.000đ (tối đa 50.000đ)',
    valueText: 'Giảm 10%',
    section: 'hot',
    type: 'percent',
    value: 10,
    minOrder: 300000,
    maxDiscount: 50000,
    applicableProductsText: 'Áp dụng cho Nem lẻ và các Set quà lẻ (Không áp dụng cho Combo 3 hộp quà).',
    excludedCategories: ['Combo 3 set'],
    defaultEligibleProductIds: ['prod-set-binh-an'],
    defaultBuyNowQuantity: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Đang áp dụng · Còn 67 ngày',
    conditions: [
      'Đơn hàng có tổng giá trị các sản phẩm hợp lệ từ 300.000đ trở lên.',
      'Mức giảm tối đa: 50.000đ / đơn hàng.',
      'Áp dụng cho Nem chua (85.000đ), Nem bùi (95.000đ), Nem ngựa (110.000đ) và 3 Set quà lẻ (Vinh Hoa - Phú Quý, Bình An - Sung Túc, Độc Bản).',
      'Không áp dụng cho sản phẩm Combo 3 hộp quà (đã có mã ưu đãi riêng COMBO3).',
    ],
    howToUse: [
      'Bước 1: Chọn các sản phẩm Nem lẻ hoặc Set quà lẻ vào giỏ hàng đạt từ 300.000đ.',
      'Bước 2: Bấm "Dùng mã này" hoặc chọn mã BUIVI10 tại trang Giỏ hàng / Thanh toán.',
      'Bước 3: Hệ thống tự động trừ 10% (tối đa 50.000đ) vào tổng tiền thanh toán.',
    ],
    stackable: false,
    stackableText: 'Không cộng gộp mã giảm giá khác (Được dùng cùng FREESHIP & quà tặng TANGHOP)',
    usageLimit: 'Không giới hạn số lần sử dụng trong thời gian hiệu lực',
    detailedTerms: [
      'Mã ưu đãi BUIVI10 có hiệu lực xuyên suốt đến 23:59 ngày 31/12/2026.',
      'Không có giá trị quy đổi thành tiền mặt hoặc hoàn trả tiền thừa.',
      'Không áp dụng đồng thời với các mã giảm giá trực tiếp khác (QUATET15, THANHVIEN50, COMBO3), nhưng được hưởng đồng thời với mã miễn phí vận chuyển FREESHIP và quà tặng TANGHOP.',
    ],
    targetFilterCategory: 'Tất cả',
  },
  {
    code: 'FREESHIP',
    title: 'Miễn phí vận chuyển nội thành đơn từ 500.000đ',
    valueText: 'Miễn phí vận chuyển',
    section: 'hot',
    type: 'freeship',
    value: 40000,
    minOrder: 500000,
    maxDiscount: 40000,
    applicableProductsText: 'Áp dụng cho toàn bộ sản phẩm và Set quà Bùi Vị với đơn từ 500.000đ.',
    defaultEligibleProductIds: ['prod-set-vinh-hoa'],
    defaultBuyNowQuantity: 2,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Đang áp dụng · Còn 67 ngày',
    conditions: [
      'Đơn hàng có tổng giá trị tạm tính từ 500.000đ trở lên.',
      'Miễn phí 100% phí vận chuyển tiêu chuẩn bảo quản lạnh (tối đa 40.000đ).',
      'Áp dụng cho toàn bộ danh mục sản phẩm (Nem lẻ, Set quà biếu và Combo 3 hộp quà).',
    ],
    howToUse: [
      'Bước 1: Thêm sản phẩm bất kỳ vào giỏ hàng có tổng tạm tính đạt từ 500.000đ.',
      'Bước 2: Hệ thống tự động kích hoạt hoặc bấm "Dùng mã này" để lưu mã FREESHIP.',
      'Bước 3: Phí vận chuyển 40.000đ được giảm trừ 100% ở bước Thanh toán.',
    ],
    stackable: true,
    stackableText: 'Được cộng gộp cùng mọi mã giảm giá đơn hàng và quà tặng TANGHOP',
    usageLimit: 'Không giới hạn số lượt sử dụng cho mọi đơn từ 500.000đ',
    detailedTerms: [
      'Áp dụng tự động cho tất cả đơn hàng đạt ngưỡng tạm tính từ 500.000đ trở lên.',
      'Được phép cộng gộp cùng lúc với 01 mã giảm giá đơn hàng (BUIVI10, QUATET15, COMBO3 hoặc THANHVIEN50) và quà tặng TANGHOP.',
    ],
    targetFilterCategory: 'Tất cả',
  },
  {
    code: 'QUATET15',
    title: 'Giảm 15% Set Vinh Hoa - Phú Quý và Set Độc Bản (tối đa 60.000đ)',
    valueText: 'Giảm 15%',
    section: 'hot',
    type: 'percent',
    value: 15,
    minOrder: 0,
    maxDiscount: 60000,
    applicableProductsText: 'Áp dụng cho Set Vinh Hoa - Phú Quý (290.000đ) và Set Độc Bản (390.000đ).',
    applicableCategories: ['Set Vinh Hoa - Phú Quý', 'Set Độc Bản'],
    defaultEligibleProductIds: ['prod-set-vinh-hoa', 'prod-set-doc-ban'],
    defaultBuyNowQuantity: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Ưu đãi đặc quyền · Đang áp dụng',
    conditions: [
      'Áp dụng trực tiếp cho 2 dòng hộp quà: Set Vinh Hoa - Phú Quý (290.000đ) và Set Độc Bản (390.000đ).',
      'Không yêu cầu giá trị đơn tối thiểu; giảm ngay 15% trên giá trị sản phẩm hợp lệ (tối đa 60.000đ).',
      'Ví dụ: Mua 01 Set Vinh Hoa - Phú Quý giảm ngay 43.500đ; mua 01 Set Độc Bản giảm ngay 58.500đ.',
    ],
    howToUse: [
      'Bước 1: Chọn Set Vinh Hoa - Phú Quý hoặc Set Độc Bản vào giỏ hàng.',
      'Bước 2: Bấm "Dùng mã này" hoặc chọn mã QUATET15 tại trang Giỏ hàng / Thanh toán.',
      'Bước 3: Hệ thống giảm ngay 15% (tối đa 60.000đ) trực tiếp trên dòng sản phẩm.',
    ],
    stackable: false,
    stackableText: 'Không cộng gộp mã giảm giá khác (Được dùng cùng FREESHIP & quà tặng TANGHOP)',
    usageLimit: '01 lần ưu đãi / đơn hàng có Set quà hợp lệ',
    detailedTerms: [
      'Mã QUATET15 đang mở áp dụng trực tiếp cho mọi đơn hàng đặt quà biếu di sản Bùi Vị đến 31/12/2026.',
      'Mức giảm 15% được tính trên tổng giá trị của Set Vinh Hoa - Phú Quý và/hoặc Set Độc Bản trong đơn hàng, tối đa 60.000đ.',
    ],
    targetFilterCategory: 'Set Vinh Hoa - Phú Quý',
  },
  {
    code: 'THANHVIEN50',
    title: 'Giảm 30.000đ đơn đầu tiên của thành viên mới (đơn từ 200.000đ)',
    valueText: 'Giảm 30.000đ',
    section: 'hot',
    type: 'fixed',
    value: 30000,
    minOrder: 200000,
    maxDiscount: 30000,
    applicableProductsText: 'Áp dụng cho toàn bộ sản phẩm Bùi Vị với đơn hàng từ 200.000đ.',
    defaultEligibleProductIds: ['prod-set-vinh-hoa'],
    defaultBuyNowQuantity: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Đặc quyền thành viên mới · Đang áp dụng',
    conditions: [
      'Đơn hàng có giá trị tạm tính từ 200.000đ trở lên.',
      'Áp dụng cho đơn hàng đầu tiên của khách hàng thành viên Bùi Vị.',
      'Giảm trực tiếp 30.000đ vào tổng tiền thanh toán.',
    ],
    howToUse: [
      'Bước 1: Chọn các sản phẩm bất kỳ của Bùi Vị có tổng tạm tính đạt từ 200.000đ.',
      'Bước 2: Bấm "Dùng mã này" hoặc chọn mã THANHVIEN50 tại ô ưu đãi.',
      'Bước 3: Hệ thống giảm trực tiếp 30.000đ vào tổng đơn hàng của bạn.',
    ],
    stackable: false,
    stackableText: 'Không cộng gộp mã giảm giá khác (Được dùng cùng FREESHIP & quà tặng TANGHOP)',
    usageLimit: '01 lần duy nhất cho đơn hàng đầu tiên của mỗi khách hàng',
    detailedTerms: [
      'Áp dụng cho mọi sản phẩm Nem lẻ, Set quà biếu và Combo 3 hộp quà khi đơn hàng đạt từ 200.000đ.',
      'Có thể kết hợp đồng thời với ưu đãi miễn phí vận chuyển FREESHIP (khi đơn đạt từ 500.000đ) và quà tặng TANGHOP.',
    ],
    requiresAuth: true,
    targetFilterCategory: 'Tất cả',
  },
  {
    code: 'COMBO3',
    title: 'Mua Combo 3 hộp quà giảm thêm 50.000đ + tặng túi giấy Điệp & thiệp viết tay',
    valueText: 'Giảm thêm 50.000đ',
    section: 'combo',
    type: 'fixed',
    value: 50000,
    minOrder: 950000,
    maxDiscount: 50000,
    applicableProductsText: 'Áp dụng độc quyền cho sản phẩm Combo 3 hộp quà (Trọn bộ 3 Set Di Sản – 950.000đ).',
    applicableCategories: ['Combo 3 set'],
    defaultEligibleProductIds: ['prod-combo-3-set'],
    defaultBuyNowQuantity: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Tự động kích hoạt trong giỏ hàng',
    conditions: [
      'Có sản phẩm "Combo 3 hộp quà (Trọn bộ 3 Set Di Sản)" giá ưu đãi 950.000đ (giá gốc 1.010.000đ) trong giỏ hàng.',
      'Tự động giảm thêm 50.000đ (chỉ còn 900.000đ, tổng tiết kiệm trực tiếp 110.000đ).',
      'Tặng kèm bộ 03 túi giấy Điệp Đông Hồ và 03 thiệp viết tay thủ công.',
    ],
    howToUse: [
      'Bước 1: Chọn sản phẩm "Combo 3 hộp quà" hoặc bấm nút "Mua ngay" bên dưới.',
      'Bước 2: Hệ thống tự động áp dụng mã COMBO3 giảm thêm 50.000đ.',
      'Bước 3: Nhận trọn bộ 3 Set quà (15 nem), 03 túi giấy Điệp, 03 thiệp tay kèm miễn phí ship & 01 hộp Nem chua tặng thêm.',
    ],
    stackable: false,
    stackableText: 'Tự động áp dụng đồng thời cùng FREESHIP (40.000đ) & quà tặng TANGHOP (85.000đ)',
    usageLimit: 'Áp dụng cho mọi đơn hàng có sản phẩm Combo 3 hộp quà',
    detailedTerms: [
      'Chương trình tự động kích hoạt khi giỏ hàng có ít nhất 01 Combo 3 hộp quà.',
      'Khách hàng vừa được hưởng giá ưu đãi Combo (950.000đ so với 1.010.000đ), vừa được trừ thêm 50.000đ (còn 900.000đ), miễn phí vận chuyển 40.000đ và tặng thêm 01 hộp Nem chua 85.000đ.',
    ],
    autoApply: true,
    targetFilterCategory: 'Combo 3 set',
  },
  {
    code: 'TANGHOP',
    title: 'Mua từ 2 Set quà bất kỳ tặng ngay 01 hộp Nem chua Kinh Bắc (trị giá 85.000đ)',
    valueText: 'Tặng 1 hộp Nem chua',
    section: 'combo',
    type: 'gift',
    value: 85000,
    minOrder: 0,
    maxDiscount: 85000,
    applicableProductsText: 'Áp dụng khi mua từ 02 Set quà biếu bất kỳ hoặc 01 Combo 3 hộp quà.',
    applicableCategories: [
      'Set Vinh Hoa - Phú Quý',
      'Set Bình An - Sung Túc',
      'Set Độc Bản',
      'Combo 3 set',
    ],
    defaultEligibleProductIds: ['prod-set-vinh-hoa'],
    defaultBuyNowQuantity: 2,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Quà tặng 0đ tự động thêm vào giỏ',
    conditions: [
      'Đơn hàng có tổng số lượng từ 02 Set quà trở lên (Vinh Hoa - Phú Quý, Bình An - Sung Túc, Độc Bản) hoặc 01 Combo 3 hộp quà.',
      'Quà tặng hiển thị trực tiếp thành dòng "0đ – Quà tặng: 01 Hộp Nem chua Kinh Bắc (10 cái)" trong giỏ hàng và thanh toán.',
    ],
    howToUse: [
      'Bước 1: Chọn từ 02 Set quà bất kỳ (hoặc 01 Combo 3 hộp quà) vào giỏ hàng.',
      'Bước 2: Quà tặng 01 hộp Nem chua Kinh Bắc (trị giá 85.000đ) tự động thêm vào đơn với giá 0đ.',
      'Bước 3: Nhận quà tặng đóng gói giữ lạnh kèm theo kiện hàng khi giao tới.',
    ],
    stackable: true,
    stackableText: 'Được cộng gộp cùng mọi mã giảm giá đơn hàng và mã FREESHIP',
    usageLimit: 'Tặng 01 hộp Nem chua (85.000đ) trên mỗi đơn hàng đủ điều kiện',
    detailedTerms: [
      'Quà tặng là 01 hộp Nem chua Kinh Bắc (hộp 10 cái, trị giá niêm yết 85.000đ), tự động hiển thị thành dòng 0đ trong giỏ hàng và trang thanh toán.',
      'Áp dụng đồng thời với các mã giảm giá trực tiếp (BUIVI10, QUATET15, COMBO3, THANHVIEN50) và miễn phí vận chuyển FREESHIP.',
    ],
    autoApply: true,
    giftProductId: 'prod-nem-chua',
    giftProductName: 'Nem chua Kinh Bắc – hộp 10 cái',
    giftProductNormalPrice: 85000,
    targetFilterCategory: 'Set Vinh Hoa - Phú Quý',
  },
];
