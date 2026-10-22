export const SHOW_ANIMATION_PLACEHOLDERS = false;
export const SHOW_MEDIA_PLACEHOLDERS = false;
export const ENABLE_PAYMENT_FAIL_DEMO = false;

/**
 * Helper to detect placeholder strings such as "[...]" or "có thể chỉnh sửa" or empty values.
 */
export function isPlaceholder(value?: string | null): boolean {
  if (!value || typeof value !== 'string') return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (/\[.*\]/.test(trimmed)) return true;
  if (trimmed.toLowerCase().includes('có thể chỉnh sửa')) return true;
  return false;
}

export function shouldShowAnimationPlaceholders(search?: string): boolean {
  if (SHOW_ANIMATION_PLACEHOLDERS) return true;
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  return new URLSearchParams(s).get('slots') === '1';
}

export function shouldShowMediaPlaceholders(search?: string): boolean {
  if (SHOW_MEDIA_PLACEHOLDERS) return true;
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  return new URLSearchParams(s).get('slots') === '1';
}

export function shouldShowPaymentFailDemo(search?: string): boolean {
  if (ENABLE_PAYMENT_FAIL_DEMO) return true;
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  return new URLSearchParams(s).get('demo') === 'fail';
}

export const SITE_CONFIG = {
  showAnimationPlaceholders: SHOW_ANIMATION_PLACEHOLDERS,
  showMediaPlaceholders: SHOW_MEDIA_PLACEHOLDERS,
  enablePaymentFailDemo: ENABLE_PAYMENT_FAIL_DEMO,
  logoPath: `${import.meta.env.BASE_URL}logo-main.png`,
  brandName: 'BÙI VỊ',
  slogan: 'BÙI VỊ – Một miền vun đắp, một vị lưu hương',
  brandStoryQuote:
    'Bắt đầu từ vị bùi thơm của thính gạo, vị ngọt tự nhiên và độ giòn đặc trưng của nem Kinh Bắc, Bùi Vị không chỉ giữ trọn hương vị quê nhà mà còn mở ra một cách thưởng thức hoàn toàn mới.',
  brandStoryContinuation:
    'Kết hợp cảm hứng từ nghệ thuật tranh dân gian và chất liệu giấy Điệp, chúng tôi biến món ăn bình dân thành một tác phẩm di sản thu nhỏ - nơi sản phẩm không chỉ để thưởng thức, mà còn để ngắm nhìn, lưu giữ và trao tặng.',
  brandDescription:
    'Bắt đầu từ vị bùi thơm của thính gạo, vị ngọt tự nhiên và độ giòn đặc trưng của nem Kinh Bắc, Bùi Vị không chỉ giữ trọn hương vị quê nhà mà còn mở ra một cách thưởng thức hoàn toàn mới. Kết hợp cảm hứng từ nghệ thuật tranh dân gian và chất liệu giấy Điệp, chúng tôi biến món ăn bình dân thành một tác phẩm di sản thu nhỏ - nơi sản phẩm không chỉ để thưởng thức, mà còn để ngắm nhìn, lưu giữ và trao tặng.',
  productIntroduction:
    'Có những món quà giá trị không chỉ ở thức ngon bên trong, mà ở xúc cảm khi trải nghiệm. Bùi Vị nâng tầm nem Kinh Bắc thành một hành trình trải nghiệm giác quan - nơi chất liệu giấy Điệp ánh kim vỏ sò, tích tranh Đông Hồ dân gian và cấu trúc hộp lục giác độc bản cùng hòa quyện. Mỗi lần mở hộp là một lần chạm vào di sản. Thương hiệu mang đến ba dòng sản phẩm tinh tế: Vinh Hoa - Phú Quý (quà biếu trang trọng), Bình An - Sung Túc (sum họp ấm cúng), và Độc Bản (phiên bản giới hạn). Ngay cả khi hương vị đã trôi qua, chiếc hộp vẫn mở ra thành một bức tranh di sản vẹn nguyên để ngắm nhìn và lưu giữ. Hãy chọn Bùi Vị để trao đi một món quà, kể tiếp một câu chuyện Việt!',
  storyProductLines: [
    {
      name: 'Vinh Hoa - Phú Quý (290.000đ – 1 hộp 5 nem)',
      description:
        'Dòng hộp quà biếu trang trọng lấy cảm hứng từ tích tranh Vinh Hoa – Phú Quý Đông Hồ, gửi trao lời chúc thịnh vượng, viên mãn và tài lộc.',
    },
    {
      name: 'Bình An - Sung Túc (330.000đ – 1 hộp 5 nem)',
      description:
        'Dòng hộp quà sum họp ấm cúng khắc họa hình tượng Gà Đàn – Lợn Đàn, biểu trưng cho sự gắn kết gia đình, no ấm và bình an.',
    },
    {
      name: 'Độc Bản (390.000đ – 1 hộp 5 nem)',
      description:
        'Phiên bản giới hạn chế tác kỳ công trên giấy Điệp vỏ sò ánh kim tự nhiên, hộp lục giác 6 cánh mở phẳng thành bức tranh di sản độc bản.',
    },
  ],
  contact: {
    hotline: '0988 688 999',
    hotlineDisplay: '0988.688.999',
    email: 'lienhe@buivi.vn',
    zalo: 'https://zalo.me/0988688999',
    zaloDisplay: 'Zalo Bùi Vị Official (0988.688.999)',
    fanpage: 'https://facebook.com/buividisan',
    fanpageDisplay: 'facebook.com/buividisan',
    instagram: 'https://instagram.com/buivi.disan',
    instagramDisplay: '@buivi.disan',
    tiktok: 'https://tiktok.com/@buivi.kinhbac',
    tiktokDisplay: '@buivi.kinhbac',
    headquarters: 'Làng nghề Bùi Xá, xã Ninh Xá, Thuận Thành, Bắc Ninh',
    workingHours: '08:00 – 20:30 hằng ngày',
  },
  bankInfo: {
    bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    bankShortName: 'Vietcombank',
    accountNumber: '0988688999',
    accountHolder: 'CONG TY TNHH DI SAN AM THUC BUI VI',
    branch: 'Chi nhánh Bắc Ninh',
  },
  stores: [
    {
      id: 'store-bac-ninh',
      visible: true,
      name: 'Không gian Di sản Bùi Vị – Thuận Thành, Bắc Ninh',
      address: 'Làng nghề Bùi Xá, xã Ninh Xá, Thuận Thành, Bắc Ninh',
      phone: '[Số điện thoại liên hệ – có thể chỉnh sửa]',
      hours: '08:00 – 20:30 hằng ngày',
      note: 'Tìm hiểu nghề làm nem Kinh Bắc, trải nghiệm văn hóa Đông Hồ và tham khảo dịch vụ quà tặng.',
      mapQuery: '[Tọa độ bản đồ – có thể chỉnh sửa]',
    },
    {
      id: 'store-branch-2',
      visible: false,
      name: 'Điểm giới thiệu quà biếu Bùi Vị – Cơ sở 2 [Có thể chỉnh sửa]',
      address: '[Địa chỉ cơ sở 2 – có thể chỉnh sửa]',
      phone: '[Số điện thoại – có thể chỉnh sửa]',
      hours: '08:00 – 20:30 hằng ngày [Có thể chỉnh sửa]',
      note: 'Điểm trưng bày hộp quà di sản và hỗ trợ giao hàng theo yêu cầu.',
      mapQuery: '[Tọa độ bản đồ – có thể chỉnh sửa]',
    },
    {
      id: 'store-branch-3',
      visible: false,
      name: 'Điểm giới thiệu quà biếu Bùi Vị – Cơ sở 3 [Có thể chỉnh sửa]',
      address: '[Địa chỉ cơ sở 3 – có thể chỉnh sửa]',
      phone: '[Số điện thoại – có thể chỉnh sửa]',
      hours: '08:00 – 20:30 hằng ngày [Có thể chỉnh sửa]',
      note: 'Bảo quản lạnh tiêu chuẩn, tư vấn quà tặng cá nhân và doanh nghiệp.',
      mapQuery: '[Tọa độ bản đồ – có thể chỉnh sửa]',
    },
  ],
  announcements: [
    {
      text: 'Nhập BUIVI10 – Giảm 10% đơn từ 300.000đ (tối đa 50.000đ) | Miễn phí vận chuyển đơn từ 500.000đ',
      code: 'BUIVI10',
    },
    {
      text: 'Ưu đãi Lễ/Tết: Nhập QUATET15 – Giảm 15% Set Vinh Hoa - Phú Quý & Set Độc Bản (tối đa 60.000đ)',
      code: 'QUATET15',
    },
    {
      text: 'Mua Combo 3 hộp quà (950.000đ) – Tiết kiệm 60.000đ (-6%) + Giảm thêm 50.000đ (COMBO3) + Tặng túi giấy Điệp & thiệp viết tay',
      code: 'COMBO3',
    },
    {
      text: 'Chương trình TANGHOP: Mua từ 2 Set quà bất kỳ – Tặng ngay 01 hộp Nem chua trị giá 85.000đ',
      code: 'TANGHOP',
    },
  ],
  shipping: {
    defaultInnerCityFee: 40000,
    freeShipThreshold: 500000,
    maxFreeShipSupport: 40000,
  },
};
