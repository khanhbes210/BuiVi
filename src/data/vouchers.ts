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
    applicableProductsText: 'Áp dụng: Nem lẻ và các Set lẻ. Không áp dụng Combo 3 hộp quà.',
    excludedCategories: ['Combo 3 set'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Còn 71 ngày',
    conditions: [
      'Đơn hàng có tổng giá trị các sản phẩm hợp lệ từ 300.000đ trở lên.',
      'Mức giảm tối đa: 50.000đ / đơn hàng.',
      'Áp dụng cho Nem chua (85.000đ), Nem bùi (95.000đ), Nem ngựa (110.000đ) và 3 Set quà lẻ (Vinh Hoa - Phú Quý, Bình An - Sung Túc, Độc Bản).',
      'Không áp dụng cho sản phẩm Combo 3 hộp quà.',
    ],
    howToUse: [
      'Bước 1: Chọn các sản phẩm Nem lẻ hoặc Set quà vào giỏ hàng đạt từ 300.000đ.',
      'Bước 2: Nhập mã BUIVI10 hoặc bấm "Áp dụng" tại trang Giỏ hàng / Thanh toán.',
      'Bước 3: Hệ thống tự động trừ 10% (tối đa 50.000đ) vào tổng tiền thanh toán.',
    ],
    stackable: false,
    stackableText: 'Không cộng gộp voucher giảm giá khác (Có thể dùng cùng FREESHIP & TANGHOP)',
    usageLimit: 'Không giới hạn số lần trong thời gian hiệu lực',
    detailedTerms: [
      'Mã ưu đãi BUIVI10 có giá trị đến 23:59 ngày 31/12/2026.',
      'Không có giá trị quy đổi thành tiền mặt.',
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
    applicableProductsText: 'Áp dụng toàn bộ sản phẩm Bùi Vị cho đơn từ 500.000đ.',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Còn 71 ngày',
    conditions: [
      'Đơn hàng có tạm tính từ 500.000đ trở lên.',
      'Miễn phí vận chuyển nội thành (hỗ trợ tối đa 40.000đ).',
      'Áp dụng cho toàn bộ danh mục sản phẩm (Nem lẻ, Set quà, Combo 3 hộp quà).',
    ],
    howToUse: [
      'Bước 1: Thêm sản phẩm bất kỳ vào giỏ hàng có tổng tạm tính từ 500.000đ.',
      'Bước 2: Chọn hoặc nhập mã FREESHIP tại ô ưu đãi.',
      'Bước 3: Phí vận chuyển nội thành 40.000đ sẽ được miễn phí 100%.',
    ],
    stackable: true,
    stackableText: 'Có thể cộng gộp với voucher giảm giá và quà tặng',
    usageLimit: 'Không giới hạn lượt dùng',
    detailedTerms: [
      'Áp dụng cho tất cả đơn hàng đạt ngưỡng 500.000đ.',
      'Được phép cộng gộp cùng lúc với 01 mã giảm giá đơn hàng (BUIVI10, QUATET15, COMBO3 hoặc THANHVIEN50).',
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
    applicableProductsText: 'Set Vinh Hoa - Phú Quý (290.000đ) và Set Độc Bản (390.000đ).',
    applicableCategories: ['Set Vinh Hoa - Phú Quý', 'Set Độc Bản'],
    startDate: '2026-11-01',
    endDate: '2027-02-15',
    expiryDisplay: '01/11/2026 – 15/02/2027',
    countdownText: 'Ưu đãi mùa Lễ/Tết – Đang mở đặt trước',
    conditions: [
      'Áp dụng cho 2 dòng hộp quà: Set Vinh Hoa - Phú Quý (290.000đ) và Set Độc Bản (390.000đ).',
      'Giảm 15% trên giá trị sản phẩm hợp lệ, giảm tối đa 60.000đ.',
      'Thời gian áp dụng dịp lễ/Tết: 01/11/2026 – 15/02/2027.',
    ],
    howToUse: [
      'Bước 1: Chọn Set Vinh Hoa - Phú Quý hoặc Set Độc Bản vào giỏ hàng.',
      'Bước 2: Nhập mã QUATET15 hoặc bấm nút "Dùng mã này".',
      'Bước 3: Giảm ngay 15% (tối đa 60.000đ) trực tiếp trên dòng sản phẩm.',
    ],
    stackable: false,
    stackableText: 'Không cộng gộp mã giảm giá khác (Cộng gộp được FREESHIP & TANGHOP)',
    usageLimit: 'Giới hạn 1 lần/khách',
    detailedTerms: [
      'Mỗi khách hàng được sử dụng mã QUATET15 tối đa 01 lần trong suốt chương trình Lễ/Tết.',
      'Mức giảm 15% được tính trên tổng giá trị của Set Vinh Hoa - Phú Quý và/hoặc Set Độc Bản trong đơn hàng, tối đa 60.000đ.',
    ],
    targetFilterCategory: 'Set Vinh Hoa - Phú Quý',
  },
  {
    code: 'COMBO3',
    title: 'Mua Combo 3 hộp quà được giảm thêm 50.000đ + tặng túi giấy Điệp và thiệp viết tay',
    valueText: 'Giảm thêm 50.000đ',
    section: 'combo',
    type: 'fixed',
    value: 50000,
    minOrder: 900000,
    maxDiscount: 50000,
    applicableProductsText: 'Áp dụng độc quyền cho Combo 3 hộp quà (950.000đ).',
    applicableCategories: ['Combo 3 set'],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Tự động áp dụng trong giỏ',
    conditions: [
      'Có sản phẩm "Combo 3 hộp quà" (950.000đ) trong giỏ hàng hoặc Mua ngay.',
      'Tự động giảm thêm 50.000đ (ngoài mức tiết kiệm 60.000đ sẵn có của Combo).',
      'Tặng kèm túi giấy Điệp và thiệp viết tay thủ công.',
    ],
    howToUse: [
      'Bước 1: Chọn sản phẩm "Combo 3 hộp quà".',
      'Bước 2: Hệ thống tự động áp dụng mã COMBO3 mà không cần nhập mã.',
      'Bước 3: Nhận mức giảm thêm 50.000đ cùng túi giấy Điệp và thiệp viết tay.',
    ],
    stackable: false,
    stackableText: 'Tự động áp dụng (Cộng gộp được với FREESHIP & TANGHOP)',
    usageLimit: 'Áp dụng cho mọi đơn hàng có Combo 3 hộp quà',
    detailedTerms: [
      'Chương trình tự động kích hoạt khi giỏ hàng có ít nhất 01 Combo 3 hộp quà.',
      'Khách hàng được giảm thêm 50.000đ (còn 900.000đ) và tặng kèm túi giấy Điệp cao cấp cùng thiệp viết tay.',
    ],
    autoApply: true,
    targetFilterCategory: 'Combo 3 set',
  },
  {
    code: 'THANHVIEN50',
    title: 'Giảm 30.000đ đơn đầu tiên của thành viên mới, đơn từ 200.000đ',
    valueText: 'Giảm 30.000đ',
    section: 'hot',
    type: 'fixed',
    value: 30000,
    minOrder: 200000,
    maxDiscount: 30000,
    applicableProductsText: 'Áp dụng toàn bộ sản phẩm cho đơn từ 200.000đ.',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Dành cho thành viên mới',
    conditions: [
      'Đơn hàng có giá trị tạm tính từ 200.000đ trở lên.',
      'Yêu cầu đăng nhập hoặc đăng ký tài khoản thành viên Bùi Vị.',
      'Giảm 30.000đ cho đơn hàng đầu tiên của tài khoản.',
    ],
    howToUse: [
      'Bước 1: Đăng ký hoặc Đăng nhập tài khoản tại mục Tài khoản.',
      'Bước 2: Chọn sản phẩm từ 200.000đ và nhập mã THANHVIEN50.',
      'Bước 3: Giảm ngay 30.000đ trên tổng đơn hàng.',
    ],
    stackable: false,
    stackableText: 'Không cộng gộp voucher giảm giá khác (Cộng gộp được FREESHIP & TANGHOP)',
    usageLimit: '01 lần duy nhất cho đơn đầu tiên của mỗi tài khoản',
    detailedTerms: [
      'Khách hàng cần đăng nhập tài khoản để hệ thống xác thực điều kiện thành viên.',
      'Nếu khách hàng chưa đăng nhập, hệ thống sẽ hướng dẫn đăng nhập/đăng ký nhanh để kích hoạt mã.',
    ],
    requiresAuth: true,
    targetFilterCategory: 'Tất cả',
  },
  {
    code: 'TANGHOP',
    title: 'Mua từ 2 set bất kỳ tặng 1 hộp Nem chua',
    valueText: 'Tặng 1 hộp Nem chua',
    section: 'combo',
    type: 'gift',
    value: 85000,
    minOrder: 0,
    maxDiscount: 85000,
    applicableProductsText: 'Áp dụng khi mua từ 2 Set quà bất kỳ (hoặc Combo 3 hộp quà).',
    applicableCategories: [
      'Set Vinh Hoa - Phú Quý',
      'Set Bình An - Sung Túc',
      'Set Độc Bản',
      'Combo 3 set',
    ],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    expiryDisplay: '31/12/2026',
    countdownText: 'Quà tặng 0đ tự động hiển thị trong giỏ',
    conditions: [
      'Đơn hàng có tổng số lượng từ 02 Set quà trở lên (Vinh Hoa - Phú Quý, Bình An - Sung Túc, Độc Bản hoặc 01 Combo 3 hộp quà).',
      'Quà tặng hiển thị trực tiếp là dòng "0đ – Quà tặng: 01 Hộp Nem chua Kinh Bắc (10 cái)" trong giỏ hàng.',
    ],
    howToUse: [
      'Bước 1: Chọn từ 02 Set quà bất kỳ (hoặc 01 Combo 3 hộp quà) vào giỏ hàng.',
      'Bước 2: Quà tặng 01 hộp Nem chua (trị giá 85.000đ) tự động thêm vào danh sách với giá 0đ.',
      'Bước 3: Nhận quà tặng kèm theo kiện hàng khi giao tới.',
    ],
    stackable: true,
    stackableText: 'Được cộng gộp cùng voucher giảm giá và FREESHIP',
    usageLimit: '01 phần quà tặng / đơn hàng đủ điều kiện',
    detailedTerms: [
      'Quà tặng là 01 hộp Nem chua Kinh Bắc (hộp 10 cái) trị giá 85.000đ, hiển thị thành dòng 0đ trong giỏ hàng và trang thanh toán.',
      'Áp dụng đồng thời với các chương trình giảm giá khác.',
    ],
    autoApply: true,
    giftProductId: 'prod-nem-chua',
    giftProductName: 'Nem chua Kinh Bắc – hộp 10 cái',
    giftProductNormalPrice: 85000,
    targetFilterCategory: 'Set Vinh Hoa - Phú Quý',
  },
];
