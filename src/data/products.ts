export interface ProductImage {
  url: string;
  alt: string;
  caption: string;
  theme: 'hex-red' | 'hex-green' | 'hex-gold' | 'nem-bui' | 'nem-chua' | 'nem-ngua' | 'combo';
  angleIndex: number;
}

export interface IncludedSetInfo {
  id: string;
  slug: string;
  name: string;
  price: number;
  packSpec: string;
  nemMixPerBox: string;
}

export interface Product {
  id: string;
  slug: string;
  legacySlugs?: string[];
  name: string;
  tagline: string;
  category:
    | 'Nem chua'
    | 'Nem bùi'
    | 'Nem ngựa'
    | 'Set Vinh Hoa - Phú Quý'
    | 'Set Bình An - Sung Túc'
    | 'Set Độc Bản'
    | 'Combo 3 set';
  shortDesc: string;
  longDesc: string;
  description: string;
  price: number;
  oldPrice?: number;
  packSpec: string;
  /**
   * Cấu hình chi tiết số lượng từng vị nem trong hộp quà (Dễ dàng chỉnh sửa tại một nơi)
   */
  nemMixPerBox?: string;
  includedSets?: IncludedSetInfo[];
  packOptions: string[];
  weightOrCount: string;
  images: [ProductImage, ProductImage, ProductImage, ProductImage, ProductImage];
  stock: number;
  tags: string[];
  promoTag?: string;
  voucherEligibility: string[];
  ingredients: string[];
  usage: string;
  enjoyment: string;
  storage: string;
  shelfLife: string;
  giftBoxStory: string;
  boxStory: string;
  shippingReturnPolicy: string;
  shipping: string;
  featured: boolean;
  isBestSeller: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  isGiftSet: boolean;
}

export const PRODUCT_CATEGORIES = [
  'Tất cả',
  'Nem chua',
  'Nem bùi',
  'Nem ngựa',
  'Set Vinh Hoa - Phú Quý',
  'Set Bình An - Sung Túc',
  'Set Độc Bản',
  'Combo 3 set',
] as const;

export const PRODUCTS: Product[] = [
  // 1. NEM CHUA – 85.000đ (Giá thấp nhất trong dòng nem lẻ: Nem chua < Nem bùi < Nem ngựa)
  {
    id: 'prod-nem-chua',
    slug: 'nem-chua',
    legacySlugs: ['nem-chua-kinh-bac-hop-10-cai'],
    name: 'Nem chua Kinh Bắc',
    tagline: 'Lên men tự nhiên trong lá ổi và lá chuối, vị chua thanh dịu ngọt hậu',
    category: 'Nem chua',
    shortDesc:
      'Hộp 10 chiếc nem chua gói lá chuối truyền thống, lên men tự nhiên đạt độ giòn dai và vị chua thanh tao nhã.',
    longDesc:
      'Nem chua Kinh Bắc của Bùi Vị giữ nguyên phương thức ủ men tự nhiên từ thịt heo nóng vừa mổ, kết hợp bì heo thái sợi mảnh, thính gạo mỏng, lá ổi non, tỏi thái lát và ớt hiểm. Hộp 10 chiếc được xếp ngay ngắn trong khay tre lót giấy Điệp, thuận tiện cho mâm cỗ gia đình hay những buổi sum họp bạn hiền.',
    description:
      'Nem chua Kinh Bắc của Bùi Vị giữ nguyên phương thức ủ men tự nhiên từ thịt heo nóng vừa mổ, kết hợp bì heo thái sợi mảnh, thính gạo mỏng, lá ổi non, tỏi thái lát và ớt hiểm. Hộp 10 chiếc được xếp ngay ngắn trong khay tre lót giấy Điệp, thuận tiện cho mâm cỗ gia đình hay những buổi sum họp bạn hiền.',
    price: 85000,
    packSpec: 'Hộp 10 cái',
    packOptions: ['Hộp 10 cái ăn ngay', 'Hộp 10 cái ủ dùng sau 1 ngày'],
    weightOrCount: 'Hộp 10 cái (~350g tịnh)',
    images: [
      {
        url: '/images/products/nem-chua-1.svg',
        alt: 'Hộp 10 cái Nem chua Kinh Bắc xếp trong khay giấy Điệp',
        caption: 'Góc 1: Hộp 10 cái Nem chua Kinh Bắc truyền thống',
        theme: 'nem-chua',
        angleIndex: 1,
      },
      {
        url: '/images/products/nem-chua-2.svg',
        alt: 'Bóc lớp lá chuối xanh để lộ thân nem chua hồng tươi',
        caption: 'Góc 2: Sắc hồng tự nhiên cùng lát tỏi ớt và lá ổi non',
        theme: 'nem-chua',
        angleIndex: 2,
      },
      {
        url: '/images/products/nem-chua-3.svg',
        alt: 'Đĩa nem chua bày biện cùng tương ớt và lá đinh lăng',
        caption: 'Góc 3: Bày biện tinh tế trên đĩa gốm mộc',
        theme: 'nem-chua',
        angleIndex: 3,
      },
      {
        url: '/images/products/nem-chua-4.svg',
        alt: 'Tem niêm phong Bùi Vị trên hộp nem chua 10 cái',
        caption: 'Góc 4: Hộp giấy thủ công kèm tem niêm phong Bùi Vị',
        theme: 'nem-chua',
        angleIndex: 4,
      },
      {
        url: '/images/products/nem-chua-5.svg',
        alt: 'Chi tiết thông tin ngày sản xuất và hướng dẫn độ chín của nem',
        caption: 'Góc 5: Nhãn thông tin nguyên liệu và thời điểm thưởng thức',
        theme: 'nem-chua',
        angleIndex: 5,
      },
    ],
    stock: 60,
    tags: ['Bán chạy', 'Lên men tự nhiên', 'Hộp 10 cái', 'Không chất bảo quản'],
    promoTag: 'Có voucher BUIVI10',
    voucherEligibility: ['BUIVI10', 'FREESHIP', 'THANHVIEN50'],
    ingredients: [
      'Thịt thăn và nạc mông heo tươi ấm (75%)',
      'Bì heo sơ chế sạch thái sợi mỏng (18%)',
      'Thính gạo rang thơm, lá ổi non, tỏi ta, ớt tươi, tiêu hạt (7%)',
    ],
    usage:
      'Bóc lớp lá chuối bên ngoài, chấm trực tiếp với tương ớt hoặc nướng nhẹ trên than hồng để dậy hương thơm lá chuối.',
    enjoyment:
      'Bóc lớp lá chuối bên ngoài, chấm trực tiếp với tương ớt hoặc nướng nhẹ trên than hồng để dậy hương thơm lá chuối.',
    storage:
      'Khi nem đã đạt độ chua vừa ý, bảo quản ngay trong ngăn mát tủ lạnh (2°C – 5°C) để hãm độ chua và giữ độ giòn.',
    shelfLife: '07 ngày ở ngăn mát tủ lạnh kể từ ngày nem chín.',
    giftBoxStory:
      'Hộp 10 chiếc nem chua được thiết kế gọn gàng với nắp hộp in họa tiết mộc bản Đông Hồ, thích hợp làm thức quà quê thanh lịch khi ghé thăm người thân.',
    boxStory:
      'Hộp 10 chiếc nem chua được thiết kế gọn gàng với nắp hộp in họa tiết mộc bản Đông Hồ, thích hợp làm thức quà quê thanh lịch khi ghé thăm người thân.',
    shippingReturnPolicy:
      'Giao hàng kèm hướng dẫn canh giờ nem chín theo nhiệt độ thời tiết. Đổi trả miễn phí nếu sản phẩm không đúng quy cách.',
    shipping:
      'Giao hàng kèm hướng dẫn canh giờ nem chín theo nhiệt độ thời tiết. Đổi trả miễn phí nếu sản phẩm không đúng quy cách.',
    featured: true,
    isBestSeller: true,
    bestSeller: true,
    isGiftSet: false,
  },

  // 2. NEM BÙI – 95.000đ
  {
    id: 'prod-nem-bui',
    slug: 'nem-bui',
    legacySlugs: ['nem-bui-kinh-bac-500g'],
    name: 'Nem bùi Kinh Bắc',
    tagline: 'Vị bùi thơm của thính gạo rang tay, giòn sần sật chuẩn vị làng nghề Bùi Xá',
    category: 'Nem bùi',
    shortDesc:
      'Thịt heo thảo mộc thái tay hòa quyện cùng thính gạo nếp cái hoa vàng rang củi, gói trong lá sung và lá chuối tươi.',
    longDesc:
      'Bắt đầu từ vị bùi thơm của thính gạo, vị ngọt tự nhiên và độ giòn đặc trưng của nem Kinh Bắc, mỗi gói Nem bùi Bùi Vị được chế tác thủ công theo bí quyết gia truyền làng Bùi Xá (Ninh Xá, Thuận Thành). Từng thớ thịt nạc mông và bì heo làm sạch kỹ lưỡng, thái mỏng đều tay, trộn cùng thính gạo rang vàng dậy hương và ủ đúng độ để giữ trọn vị ngọt thanh, bùi béo tự nhiên.',
    description:
      'Bắt đầu từ vị bùi thơm của thính gạo, vị ngọt tự nhiên và độ giòn đặc trưng của nem Kinh Bắc, mỗi gói Nem bùi Bùi Vị được chế tác thủ công theo bí quyết gia truyền làng Bùi Xá (Ninh Xá, Thuận Thành). Từng thớ thịt nạc mông và bì heo làm sạch kỹ lưỡng, thái mỏng đều tay, trộn cùng thính gạo rang vàng dậy hương và ủ đúng độ để giữ trọn vị ngọt thanh, bùi béo tự nhiên.',
    price: 95000,
    packSpec: 'Gói 500g',
    packOptions: ['Gói 500g tiêu chuẩn', 'Gói 500g hút chân không đi xa'],
    weightOrCount: 'Gói 500g (Kèm lá sung tươi & tương ớt gia truyền)',
    images: [
      {
        url: '/images/products/nem-bui-1.svg',
        alt: 'Nem bùi Kinh Bắc gói 500g chính diện trên mẹt tre và lá chuối',
        caption: 'Góc 1: Chính diện gói Nem bùi Kinh Bắc 500g truyền thống',
        theme: 'nem-bui',
        angleIndex: 1,
      },
      {
        url: '/images/products/nem-bui-2.svg',
        alt: 'Cận cảnh sợi nem bùi trộn thính gạo vàng óng và lá sung tươi',
        caption: 'Góc 2: Cận cảnh sợi nem trộn thính gạo nếp rang vàng',
        theme: 'nem-bui',
        angleIndex: 2,
      },
      {
        url: '/images/products/nem-bui-3.svg',
        alt: 'Cách cuốn nem bùi trong lá sung non chấm tương ớt Kinh Bắc',
        caption: 'Góc 3: Thưởng thức nem bùi cuốn lá sung chấm tương ớt',
        theme: 'nem-bui',
        angleIndex: 3,
      },
      {
        url: '/images/products/nem-bui-4.svg',
        alt: 'Bao bì giấy Điệp bọc ngoài gói nem bùi Kinh Bắc',
        caption: 'Góc 4: Đai giấy Điệp in họa tiết dân gian Đông Hồ',
        theme: 'nem-bui',
        angleIndex: 4,
      },
      {
        url: '/images/products/nem-bui-5.svg',
        alt: 'Quy cách đóng gói hút chân không kèm túi đá gel giữ lạnh',
        caption: 'Góc 5: Quy cách đóng gói sạch, an toàn khi vận chuyển',
        theme: 'nem-bui',
        angleIndex: 5,
      },
    ],
    stock: 48,
    tags: ['Bán chạy', 'Đặc sản Kinh Bắc', 'Thính gạo rang củi', 'Gói 500g'],
    promoTag: 'Có voucher BUIVI10',
    voucherEligibility: ['BUIVI10', 'FREESHIP', 'THANHVIEN50'],
    ingredients: [
      'Thịt nạc mông heo tươi tuyển chọn trong ngày (70%)',
      'Bì heo luộc chín thái chỉ giòn tự nhiên (20%)',
      'Thính gạo tẻ & nếp cái hoa vàng rang củi xay mịn (8%)',
      'Gia vị truyền thống: muối biển hầm, tiêu rừng, tỏi ta, lá sung non (2%)',
    ],
    usage:
      'Dùng trực tiếp ngay sau khi mở gói. Ngon nhất khi cuốn cùng lá sung non, lá đinh lăng, thêm lát tỏi tươi và chấm tương ớt Bắc Ninh.',
    enjoyment:
      'Dùng trực tiếp ngay sau khi mở gói. Ngon nhất khi cuốn cùng lá sung non, lá đinh lăng, thêm lát tỏi tươi và chấm tương ớt Bắc Ninh.',
    storage:
      'Bảo quản ở ngăn mát tủ lạnh (2°C – 6°C). Khi lấy ra khỏi tủ lạnh nên để ở nhiệt độ phòng 10 phút trước khi thưởng thức để thính gạo dậy mùi thơm.',
    shelfLife: '05 ngày ở ngăn mát tủ lạnh kể từ ngày sản xuất in trên bao bì.',
    giftBoxStory:
      'Dù là dòng sản phẩm thưởng thức hàng ngày, mỗi gói Nem bùi vẫn được thắt đai giấy Điệp in mộc bản họa tiết dân gian Kinh Bắc, thể hiện sự trân trọng với nghề làm nem truyền thống vùng Thuận Thành.',
    boxStory:
      'Dù là dòng sản phẩm thưởng thức hàng ngày, mỗi gói Nem bùi vẫn được thắt đai giấy Điệp in mộc bản họa tiết dân gian Kinh Bắc, thể hiện sự trân trọng với nghề làm nem truyền thống vùng Thuận Thành.',
    shippingReturnPolicy:
      'Giao hỏa tốc trong ngày tại Bắc Ninh & Hà Nội bằng túi giữ nhiệt chuyên dụng. Đổi mới 1-1 miễn phí trong 24h nếu sản phẩm bị ảnh hưởng chất lượng trong quá trình vận chuyển.',
    shipping:
      'Giao hỏa tốc trong ngày tại Bắc Ninh & Hà Nội bằng túi giữ nhiệt chuyên dụng. Đổi mới 1-1 miễn phí trong 24h nếu sản phẩm bị ảnh hưởng chất lượng trong quá trình vận chuyển.',
    featured: true,
    isBestSeller: true,
    bestSeller: true,
    isGiftSet: false,
  },

  // 3. NEM NGỰA – 110.000đ
  {
    id: 'prod-nem-ngua',
    slug: 'nem-ngua-kinh-bac-hop-300g',
    name: 'Nem ngựa Kinh Bắc',
    tagline: 'Thức ngon trứ danh vùng Kinh Bắc – Ngọt đậm đà, thơm nồng thính gạo cổ truyền',
    category: 'Nem ngựa',
    shortDesc:
      'Chế biến từ thịt ngựa tuyển chọn vùng trung du Bắc Bộ, vị ngọt đậm, thớ thịt mềm hòa quyện cùng thính gạo nếp.',
    longDesc:
      'Nem ngựa là thức đặc sản hiếm quý của vùng đất Kinh Bắc – Bắc Ninh. Thịt ngựa tươi giàu đạm, ít mỡ, có vị ngọt đậm đặc trưng được thái lát mỏng theo thớ, ướp gia vị thảo mộc rồi trộn đều với thính gạo rang củi và bì giòn. Khi cuốn cùng lá sung, lá mơ hoặc lá đinh lăng, vị ngọt bùi lan tỏa sâu nơi đầu lưỡi.',
    description:
      'Nem ngựa là thức đặc sản hiếm quý của vùng đất Kinh Bắc – Bắc Ninh. Thịt ngựa tươi giàu đạm, ít mỡ, có vị ngọt đậm đặc trưng được thái lát mỏng theo thớ, ướp gia vị thảo mộc rồi trộn đều với thính gạo rang củi và bì giòn. Khi cuốn cùng lá sung, lá mơ hoặc lá đinh lăng, vị ngọt bùi lan tỏa sâu nơi đầu lưỡi.',
    price: 110000,
    packSpec: 'Hộp 300g',
    packOptions: ['Hộp 300g tiêu chuẩn', 'Hộp 300g đóng gói biếu tặng'],
    weightOrCount: 'Hộp 300g (Kèm nước chấm tương gừng & lá ăn kèm)',
    images: [
      {
        url: '/images/products/nem-ngua-1.svg',
        alt: 'Hộp Nem ngựa Kinh Bắc 300g đặt trên khay gỗ truyền thống',
        caption: 'Góc 1: Hộp Nem ngựa Kinh Bắc 300g đặc sản',
        theme: 'nem-ngua',
        angleIndex: 1,
      },
      {
        url: '/images/products/nem-ngua-2.svg',
        alt: 'Cận cảnh thớ thịt ngựa thái mỏng quyện thính gạo vàng',
        caption: 'Góc 2: Thớ thịt ngựa ngọt mềm áo đều lớp thính gạo',
        theme: 'nem-ngua',
        angleIndex: 2,
      },
      {
        url: '/images/products/nem-ngua-3.svg',
        alt: 'Nem ngựa thưởng thức cùng lá sung và tương gừng Bắc Ninh',
        caption: 'Góc 3: Kết hợp hoàn hảo cùng tương gừng và lá sung',
        theme: 'nem-ngua',
        angleIndex: 3,
      },
      {
        url: '/images/products/nem-ngua-4.svg',
        alt: 'Hộp đựng Nem ngựa với hoa văn mộc bản truyền thống',
        caption: 'Góc 4: Bao bì hộp giấy mỹ thuật chỉn chu',
        theme: 'nem-ngua',
        angleIndex: 4,
      },
      {
        url: '/images/products/nem-ngua-5.svg',
        alt: 'Trọn bộ phụ kiện lá sung, tỏi ớt và tương chấm đi kèm hộp 300g',
        caption: 'Góc 5: Đầy đủ gia vị và lá cuốn tươi sạch đi kèm',
        theme: 'nem-ngua',
        angleIndex: 5,
      },
    ],
    stock: 35,
    tags: ['Đặc sản hiếm quý', 'Thịt ngựa tuyển chọn', 'Kèm tương gừng'],
    promoTag: 'Có voucher BUIVI10',
    voucherEligibility: ['BUIVI10', 'FREESHIP', 'THANHVIEN50'],
    ingredients: [
      'Thịt thăn ngựa tươi tuyển chọn (72%)',
      'Bì thái chỉ giòn (15%)',
      'Thính gạo nếp cái hoa vàng rang tay (10%)',
      'Riềng non, tỏi ta, tiêu bắc, lá chanh, tương gừng đi kèm (3%)',
    ],
    usage:
      'Trộn nhẹ với lá chanh thái chỉ trước khi ăn. Cuốn cùng lá sung, lá đinh lăng và chấm tương gừng hoặc tương ớt.',
    enjoyment:
      'Trộn nhẹ với lá chanh thái chỉ trước khi ăn. Cuốn cùng lá sung, lá đinh lăng và chấm tương gừng hoặc tương ớt.',
    storage:
      'Bảo quản lạnh ở nhiệt độ 2°C – 5°C. Sử dụng trong vòng 24 giờ sau khi mở nắp hộp.',
    shelfLife: '04 ngày ở ngăn mát tủ lạnh kể từ ngày sản xuất.',
    giftBoxStory:
      'Hộp Nem ngựa 300g mang sắc xanh rừng thẫm và đỏ di sản, lấy cảm hứng từ nét khắc khỏe khoắn của tranh dân gian Đông Hồ.',
    boxStory:
      'Hộp Nem ngựa 300g mang sắc xanh rừng thẫm và đỏ di sản, lấy cảm hứng từ nét khắc khỏe khoắn của tranh dân gian Đông Hồ.',
    shippingReturnPolicy:
      'Đóng gói kèm đá gel bảo quản lạnh suốt hành trình. Hỗ trợ đổi trả 100% nếu sản phẩm có bất kỳ sai sót nào.',
    shipping:
      'Đóng gói kèm đá gel bảo quản lạnh suốt hành trình. Hỗ trợ đổi trả 100% nếu sản phẩm có bất kỳ sai sót nào.',
    featured: true,
    isBestSeller: false,
    bestSeller: false,
    isNew: true,
    isGiftSet: false,
  },

  // 4. SET 1 – VINH HOA - PHÚ QUÝ: 290.000đ (oldPrice 320.000đ) – Bán chạy, 1 hộp – 5 nem
  {
    id: 'prod-set-vinh-hoa',
    slug: 'set-vinh-hoa-phu-quy',
    name: 'Set Vinh Hoa - Phú Quý',
    tagline: 'Quà biếu trang trọng – 1 hộp 5 nem kết hợp giấy Điệp ánh kim & tranh Đông Hồ',
    category: 'Set Vinh Hoa - Phú Quý',
    shortDesc:
      'Set quà biếu trang trọng bán chạy nhất của Bùi Vị (1 hộp – 5 nem), lấy cảm hứng từ tích tranh Đông Hồ Vinh Hoa – Phú Quý trên nền giấy Điệp.',
    longDesc:
      'Có những món quà giá trị không chỉ ở thức ngon bên trong, mà ở xúc cảm khi trải nghiệm. Set Vinh Hoa - Phú Quý (1 hộp – 5 nem) là dòng set quà có mức giá dễ tiếp cận nhất của Bùi Vị, được thiết kế chỉn chu cho nhu cầu biếu tặng người thân, đồng nghiệp và đối tác. Ngay cả khi hương vị đã trôi qua, chiếc hộp vẫn mở ra thành một bức tranh di sản vẹn nguyên để ngắm nhìn và lưu giữ.',
    description:
      'Có những món quà giá trị không chỉ ở thức ngon bên trong, mà ở xúc cảm khi trải nghiệm. Set Vinh Hoa - Phú Quý (1 hộp – 5 nem) là dòng set quà có mức giá dễ tiếp cận nhất của Bùi Vị, được thiết kế chỉn chu cho nhu cầu biếu tặng người thân, đồng nghiệp và đối tác. Ngay cả khi hương vị đã trôi qua, chiếc hộp vẫn mở ra thành một bức tranh di sản vẹn nguyên để ngắm nhìn và lưu giữ.',
    price: 290000,
    oldPrice: 320000,
    packSpec: '1 hộp – 5 nem',
    nemMixPerBox: '02 Nem bùi + 02 Nem chua + 01 Nem ngựa (Có thể tùy chỉnh theo yêu cầu)',
    packOptions: [
      '1 hộp – 5 nem (Tiêu chuẩn: 2 Nem bùi + 2 Nem chua + 1 Nem ngựa)',
      '1 hộp – 5 nem (Kèm Thiệp Lời Chúc Viết Tay)',
    ],
    weightOrCount: '1 hộp – 5 nem (Kèm lá sung tươi & bộ chấm truyền thống)',
    images: [
      {
        url: '/images/products/set-vinh-hoa-1.svg',
        alt: 'Set Vinh Hoa - Phú Quý (1 hộp – 5 nem) bằng giấy Điệp ánh kim vỏ sò',
        caption: 'Góc 1: Hộp quà Set Vinh Hoa - Phú Quý (1 hộp – 5 nem)',
        theme: 'hex-red',
        angleIndex: 1,
      },
      {
        url: '/images/products/set-vinh-hoa-2.svg',
        alt: 'Hộp quà mở ra thành bức tranh Đông Hồ Vinh Hoa Phú Quý',
        caption: 'Góc 2: Hộp mở thành bức tranh Đông Hồ Vinh Hoa - Phú Quý',
        theme: 'hex-red',
        angleIndex: 2,
      },
      {
        url: '/images/products/set-vinh-hoa-3.svg',
        alt: 'Bên trong Set Vinh Hoa - Phú Quý gồm 5 phần nem Kinh Bắc',
        caption: 'Góc 3: Sắp đặt tinh tế 5 phần nem Kinh Bắc trong 1 hộp quà',
        theme: 'hex-red',
        angleIndex: 3,
      },
      {
        url: '/images/products/set-vinh-hoa-4.svg',
        alt: 'Chi tiết bề mặt giấy Điệp óng ánh vỏ sò điệp tự nhiên',
        caption: 'Góc 4: Cận cảnh vân giấy Điệp làng Đông Hồ óng ánh tự nhiên',
        theme: 'hex-red',
        angleIndex: 4,
      },
      {
        url: '/images/products/set-vinh-hoa-5.svg',
        alt: 'Trọn bộ Set Vinh Hoa - Phú Quý kèm túi xách giấy Điệp và thiệp chúc',
        caption: 'Góc 5: Trọn bộ túi quà di sản và thiệp lời chúc trang trọng',
        theme: 'hex-red',
        angleIndex: 5,
      },
    ],
    stock: 32,
    tags: ['Bán chạy', 'Quà biếu trang trọng', '1 hộp – 5 nem', 'Giấy Điệp Đông Hồ'],
    promoTag: 'Giảm 15% (QUATET15)',
    voucherEligibility: ['QUATET15', 'BUIVI10', 'FREESHIP', 'THANHVIEN50', 'TANGHOP'],
    ingredients: [
      'Quy cách chuẩn: 1 hộp – 5 nem (02 Nem bùi + 02 Nem chua + 01 Nem ngựa)',
      'Đi kèm: Tương ớt Bắc Ninh, tương gừng gia truyền & lá sung non tươi',
      'Bao bì: 01 Hộp tranh giấy Điệp tích tranh "Vinh Hoa - Phú Quý" mở phẳng để trưng bày',
    ],
    usage:
      'Mở nắp hộp quà để thưởng thức 5 phần nem bên trong và giữ lại phần khung tranh Đông Hồ để trưng bày.',
    enjoyment:
      'Mở nắp hộp quà để thưởng thức 5 phần nem bên trong và giữ lại phần khung tranh Đông Hồ để trưng bày.',
    storage:
      'Các phần nem bên trong được đóng gói khay lạnh riêng biệt (bảo quản 2°C – 6°C). Vỏ hộp giấy Điệp bảo quản nơi khô ráo để trưng bày lâu dài.',
    shelfLife:
      'Nem bên trong dùng trong 05 – 07 ngày ở ngăn mát; Hộp tranh giấy Điệp lưu giữ bền màu nhiều năm.',
    giftBoxStory:
      'Lấy cảm hứng từ cặp tranh "Vinh Hoa" và "Phú Quý" của làng tranh dân gian Đông Hồ (Thuận Thành, Bắc Ninh), chiếc hộp sử dụng giấy dó quét điệp vỏ sò tự nhiên. Khi dùng hết thức quà bên trong, phần khung hộp mở phẳng thành tác phẩm nghệ thuật dân gian vẹn nguyên.',
    boxStory:
      'Lấy cảm hứng từ cặp tranh "Vinh Hoa" và "Phú Quý" của làng tranh dân gian Đông Hồ (Thuận Thành, Bắc Ninh), chiếc hộp sử dụng giấy dó quét điệp vỏ sò tự nhiên. Khi dùng hết thức quà bên trong, phần khung hộp mở phẳng thành tác phẩm nghệ thuật dân gian vẹn nguyên.',
    shippingReturnPolicy:
      'Miễn phí vận chuyển nội thành cho đơn từ 500.000đ (mã FREESHIP). Mua từ 2 Set bất kỳ tặng ngay 1 hộp Nem chua (mã TANGHOP).',
    shipping:
      'Miễn phí vận chuyển nội thành cho đơn từ 500.000đ (mã FREESHIP). Mua từ 2 Set bất kỳ tặng ngay 1 hộp Nem chua (mã TANGHOP).',
    featured: true,
    isBestSeller: true,
    bestSeller: true,
    isGiftSet: true,
  },

  // 5. SET 2 – BÌNH AN - SUNG TÚC: 330.000đ (oldPrice 360.000đ) – 1 hộp – 5 nem
  {
    id: 'prod-set-binh-an',
    slug: 'set-binh-an-sung-tuc',
    name: 'Set Bình An - Sung Túc',
    tagline: 'Sum họp ấm cúng – 1 hộp 5 nem mang đậm hơi ấm đoàn viên Kinh Bắc',
    category: 'Set Bình An - Sung Túc',
    shortDesc:
      'Thiết kế dành cho những bữa cơm sum họp ấm cúng (1 hộp – 5 nem), kết hợp trọn vẹn Nem bùi, Nem chua, Nem ngựa trong hộp giấy Điệp thanh nhã.',
    longDesc:
      'Set Bình An - Sung Túc (1 hộp – 5 nem) gửi gắm lời chúc gia đạo êm ấm, đủ đầy quanh mâm cơm đoàn viên. Chiếc hộp mang sắc xanh rừng thẫm kết hợp nền giấy Điệp kem ấm và họa tiết tranh Đông Hồ dân gian, bên trong hội tụ 5 phần nem đặc trưng của Bùi Vị để cả gia đình cùng quây quần thưởng thức.',
    description:
      'Set Bình An - Sung Túc (1 hộp – 5 nem) gửi gắm lời chúc gia đạo êm ấm, đủ đầy quanh mâm cơm đoàn viên. Chiếc hộp mang sắc xanh rừng thẫm kết hợp nền giấy Điệp kem ấm và họa tiết tranh Đông Hồ dân gian, bên trong hội tụ 5 phần nem đặc trưng của Bùi Vị để cả gia đình cùng quây quần thưởng thức.',
    price: 330000,
    oldPrice: 360000,
    packSpec: '1 hộp – 5 nem',
    nemMixPerBox: '02 Nem bùi + 01 Nem chua + 02 Nem ngựa (Có thể tùy chỉnh theo yêu cầu)',
    packOptions: [
      '1 hộp – 5 nem (Tiêu chuẩn: 2 Nem bùi + 1 Nem chua + 2 Nem ngựa)',
      '1 hộp – 5 nem (Kèm Thiệp Sum Họp Gia Đình)',
    ],
    weightOrCount: '1 hộp – 5 nem (Kèm bộ gia vị chấm & Hộp tranh giấy Điệp)',
    images: [
      {
        url: '/images/products/set-binh-an-1.svg',
        alt: 'Set Bình An - Sung Túc (1 hộp – 5 nem) với sắc xanh rừng và họa tiết Đông Hồ',
        caption: 'Góc 1: Diện mạo thanh lịch của Set Bình An - Sung Túc (1 hộp – 5 nem)',
        theme: 'hex-green',
        angleIndex: 1,
      },
      {
        url: '/images/products/set-binh-an-2.svg',
        alt: 'Mở hộp Set Bình An - Sung Túc với 5 phần nem Kinh Bắc',
        caption: 'Góc 2: Cấu trúc bên trong 1 hộp – 5 nem Kinh Bắc',
        theme: 'hex-green',
        angleIndex: 2,
      },
      {
        url: '/images/products/set-binh-an-3.svg',
        alt: 'Tranh dân gian Đông Hồ in trên mặt trong nắp hộp Bình An',
        caption: 'Góc 3: Bức tranh dân gian Đông Hồ lưu giữ sau khi mở hộp',
        theme: 'hex-green',
        angleIndex: 3,
      },
      {
        url: '/images/products/set-binh-an-4.svg',
        alt: 'Mâm cỗ sum họp gia đình với các món nem trong Set Bình An',
        caption: 'Góc 4: Trải nghiệm sum họp ấm cúng bên mâm cơm gia đình',
        theme: 'hex-green',
        angleIndex: 4,
      },
      {
        url: '/images/products/set-binh-an-5.svg',
        alt: 'Túi xách và thiệp chúc đi kèm Set Bình An - Sung Túc',
        caption: 'Góc 5: Đi kèm túi xách giấy mỹ thuật và thiệp chúc',
        theme: 'hex-green',
        angleIndex: 5,
      },
    ],
    stock: 30,
    tags: ['Sum họp ấm cúng', '1 hộp – 5 nem', 'Giấy Điệp Đông Hồ'],
    promoTag: 'Giảm 10% (BUIVI10)',
    voucherEligibility: ['BUIVI10', 'FREESHIP', 'THANHVIEN50', 'TANGHOP'],
    ingredients: [
      'Quy cách chuẩn: 1 hộp – 5 nem (02 Nem bùi + 01 Nem chua + 02 Nem ngựa)',
      'Đi kèm: Bộ gia vị chấm truyền thống, lá sung non tươi & Thiệp câu chuyện di sản',
      'Bao bì: 01 Hộp quà giấy Điệp tích tranh Đông Hồ Bình An - Sung Túc',
    ],
    usage:
      'Thích hợp làm quà biếu cha mẹ, người thân hoặc bày biện mâm tiệc sum họp cuối tuần, lễ Tết.',
    enjoyment:
      'Thích hợp làm quà biếu cha mẹ, người thân hoặc bày biện mâm tiệc sum họp cuối tuần, lễ Tết.',
    storage:
      'Bảo quản các phần nem ở ngăn mát tủ lạnh (2°C – 6°C). Hộp quà giấy Điệp cất giữ nơi khô thoáng.',
    shelfLife: '05 – 07 ngày ở ngăn mát tủ lạnh.',
    giftBoxStory:
      'Mang thông điệp "Bình An - Sung Túc", chiếc hộp tái hiện khung cảnh sum vầy an vui của làng quê Việt Nam trên nền giấy Điệp quét vỏ sò truyền thống.',
    boxStory:
      'Mang thông điệp "Bình An - Sung Túc", chiếc hộp tái hiện khung cảnh sum vầy an vui của làng quê Việt Nam trên nền giấy Điệp quét vỏ sò truyền thống.',
    shippingReturnPolicy:
      'Giao hàng toàn quốc bảo quản lạnh tiêu chuẩn. Mua từ 2 Set bất kỳ được tặng thêm 1 hộp Nem chua (mã TANGHOP).',
    shipping:
      'Giao hàng toàn quốc bảo quản lạnh tiêu chuẩn. Mua từ 2 Set bất kỳ được tặng thêm 1 hộp Nem chua (mã TANGHOP).',
    featured: true,
    isBestSeller: false,
    bestSeller: false,
    isGiftSet: true,
  },

  // 6. SET 3 – ĐỘC BẢN: 390.000đ (no oldPrice) – Phiên bản giới hạn, Hộp lục giác độc bản, 1 hộp – 5 nem
  {
    id: 'prod-set-doc-ban',
    slug: 'set-doc-ban',
    legacySlugs: ['set-doc-ban-gioi-han'],
    name: 'Set Độc Bản',
    tagline: 'Phiên bản giới hạn đánh số thứ tự – Cấu trúc hộp lục giác độc bản mở thành tranh di sản',
    category: 'Set Độc Bản',
    shortDesc:
      'Phiên bản cao cấp giới hạn đánh số thứ tự (1 hộp – 5 nem), sở hữu cấu trúc hộp lục giác độc bản mở 6 cánh thành bức tranh Đông Hồ mộc bản.',
    longDesc:
      'Set Độc Bản (1 hộp – 5 nem) là đỉnh cao chế tác của Bùi Vị – nơi mỗi chiếc hộp lục giác độc bản đều được đánh số thứ tự riêng biệt (Limited Numbered Edition). Nắp và thân hộp lục giác tích hợp bức tranh Đông Hồ in mộc bản thủ công bằng màu tự nhiên trên nền giấy Điệp vỏ sò, mở phẳng thành tác phẩm nghệ thuật treo tường. Bên trong là 5 phần nem thượng hạng tuyển chọn khắt khe nhất của xứ Kinh Bắc.',
    description:
      'Set Độc Bản (1 hộp – 5 nem) là đỉnh cao chế tác của Bùi Vị – nơi mỗi chiếc hộp lục giác độc bản đều được đánh số thứ tự riêng biệt (Limited Numbered Edition). Nắp và thân hộp lục giác tích hợp bức tranh Đông Hồ in mộc bản thủ công bằng màu tự nhiên trên nền giấy Điệp vỏ sò, mở phẳng thành tác phẩm nghệ thuật treo tường. Bên trong là 5 phần nem thượng hạng tuyển chọn khắt khe nhất của xứ Kinh Bắc.',
    price: 390000,
    packSpec: '1 hộp – 5 nem',
    nemMixPerBox: '02 Nem ngựa thượng hạng + 02 Nem bùi đặc biệt + 01 Nem chua ủ lá ổi',
    packOptions: [
      '1 hộp – 5 nem (Hộp lục giác Độc Bản đánh số thứ tự)',
      '1 hộp – 5 nem (Kèm Thiệp Viết Tay Cá Nhân Hóa Người Nhận)',
    ],
    weightOrCount: '1 hộp – 5 nem (Hộp lục giác giấy Điệp đánh số thứ tự + Tranh mộc bản)',
    images: [
      {
        url: '/images/products/set-doc-ban-1.svg',
        alt: 'Set Độc Bản hộp lục giác phiên bản giới hạn đánh số thứ tự (1 hộp – 5 nem)',
        caption: 'Góc 1: Set Độc Bản hộp lục giác chế tác thủ công đánh số thứ tự',
        theme: 'hex-gold',
        angleIndex: 1,
      },
      {
        url: '/images/products/set-doc-ban-2.svg',
        alt: 'Cấu trúc hộp lục giác Set Độc Bản mở ra thành bức tranh Đông Hồ',
        caption: 'Góc 2: Hộp lục giác mở 6 cánh thành bức tranh di sản Đông Hồ nguyên bản',
        theme: 'hex-gold',
        angleIndex: 2,
      },
      {
        url: '/images/products/set-doc-ban-3.svg',
        alt: 'Tem khắc số thứ tự phiên bản giới hạn của Set Độc Bản',
        caption: 'Góc 3: Biển số thứ tự độc bản và chứng nhận chế tác thủ công',
        theme: 'hex-gold',
        angleIndex: 3,
      },
      {
        url: '/images/products/set-doc-ban-4.svg',
        alt: 'Bên trong Set Độc Bản với 5 phần nem thượng hạng',
        caption: 'Góc 4: 5 phần nem thượng hạng đặt trong khay lục giác giấy Điệp',
        theme: 'hex-gold',
        angleIndex: 4,
      },
      {
        url: '/images/products/set-doc-ban-5.svg',
        alt: 'Trọn bộ túi quà giấy Điệp cao cấp và thiệp viết tay đi kèm Set Độc Bản',
        caption: 'Góc 5: Túi giấy Điệp cao cấp và ấn phẩm câu chuyện di sản Kinh Bắc',
        theme: 'hex-gold',
        angleIndex: 5,
      },
    ],
    stock: 15,
    tags: ['Phiên bản giới hạn', 'Hộp lục giác độc bản', '1 hộp – 5 nem'],
    promoTag: 'Giảm 15% (QUATET15)',
    voucherEligibility: ['QUATET15', 'BUIVI10', 'FREESHIP', 'THANHVIEN50', 'TANGHOP'],
    ingredients: [
      'Quy cách chuẩn: 1 hộp – 5 nem (02 Nem ngựa thượng hạng + 02 Nem bùi đặc biệt + 01 Nem chua ủ lá ổi)',
      'Đi kèm: Tương ớt & tương gừng ủ chum sành + Lá sung, đinh lăng tuyển chọn',
      'Bao bì: 01 Hộp lục giác giấy Điệp tự nhiên in tranh mộc bản Đông Hồ kèm chứng nhận số thứ tự',
    ],
    usage:
      'Quà biếu ngoại giao, thượng khách, doanh nhân hoặc sưu tầm văn hóa. Hộp lục giác mở ra thành tranh di sản có sẵn móc treo trang trọng.',
    enjoyment:
      'Quà biếu ngoại giao, thượng khách, doanh nhân hoặc sưu tầm văn hóa. Hộp lục giác mở ra thành tranh di sản có sẵn móc treo trang trọng.',
    storage:
      'Thực phẩm bên trong bảo quản ngăn mát 2°C – 6°C. Tranh giấy Điệp và hộp lục giác trưng bày nơi khô thoáng, tránh ánh nắng trực tiếp.',
    shelfLife: 'Thực phẩm dùng trong 05 – 07 ngày; Hộp lục giác & tranh giấy Điệp lưu giữ lâu dài.',
    giftBoxStory:
      'Mỗi chiếc hộp lục giác Set Độc Bản được chế tác tỉ mỉ từ khâu nghiền vỏ sò điệp phết lên giấy dó, phơi sương, in từng bản khắc gỗ màu tự nhiên cho đến lắp ghép cấu trúc lục giác 6 cánh mở phẳng.',
    boxStory:
      'Mỗi chiếc hộp lục giác Set Độc Bản được chế tác tỉ mỉ từ khâu nghiền vỏ sò điệp phết lên giấy dó, phơi sương, in từng bản khắc gỗ màu tự nhiên cho đến lắp ghép cấu trúc lục giác 6 cánh mở phẳng.',
    shippingReturnPolicy:
      'Giao hàng chuyên biệt bảo quản lạnh, kiểm tra hộp quà trước khi nhận. Mua kèm Set thứ 2 được tặng ngay 01 hộp Nem chua (mã TANGHOP).',
    shipping:
      'Giao hàng chuyên biệt bảo quản lạnh, kiểm tra hộp quà trước khi nhận. Mua kèm Set thứ 2 được tặng ngay 01 hộp Nem chua (mã TANGHOP).',
    featured: true,
    isBestSeller: false,
    bestSeller: false,
    isNew: true,
    isGiftSet: true,
  },

  // 7. COMBO 3 HỘP QUÀ (1 OF EACH SET): 950.000đ (oldPrice 1.010.000đ -> -6%, Tiết kiệm 60.000đ)
  {
    id: 'prod-combo-3-set',
    slug: 'combo-3-hop-qua',
    legacySlugs: ['combo-3-set-qua-di-san'],
    name: 'Combo 3 hộp quà (Trọn bộ 3 Set Di Sản)',
    tagline: 'Tiết kiệm 60.000đ (-6%) – Hội tụ đủ 3 dòng hộp quà Bùi Vị (3 hộp – 15 nem)',
    category: 'Combo 3 set',
    shortDesc:
      'Trọn bộ 3 hộp quà gồm: 01 Set Vinh Hoa - Phú Quý (290.000đ) + 01 Set Bình An - Sung Túc (330.000đ) + 01 Set Độc Bản (390.000đ). Tự động giảm thêm 50.000đ (mã COMBO3) + tặng túi giấy Điệp & thiệp viết tay.',
    longDesc:
      'Combo 3 hộp quà mang đến trọn vẹn 3 dòng sản phẩm tinh tế của Bùi Vị: Set 1 – Vinh Hoa - Phú Quý (290.000đ, quà biếu trang trọng), Set 2 – Bình An - Sung Túc (330.000đ, sum họp ấm cúng), và Set 3 – Độc Bản (390.000đ, hộp lục giác phiên bản giới hạn). Tổng giá trị mua lẻ là 1.010.000đ, ưu đãi Combo chỉ còn 950.000đ (Tiết kiệm 60.000đ, tương đương -6%), đồng thời tự động áp dụng thêm mã COMBO3 giảm thêm 50.000đ + tặng túi giấy Điệp & thiệp viết tay và tặng 01 hộp Nem chua (mã TANGHOP).',
    description:
      'Combo 3 hộp quà mang đến trọn vẹn 3 dòng sản phẩm tinh tế của Bùi Vị: Set 1 – Vinh Hoa - Phú Quý (290.000đ, quà biếu trang trọng), Set 2 – Bình An - Sung Túc (330.000đ, sum họp ấm cúng), và Set 3 – Độc Bản (390.000đ, hộp lục giác phiên bản giới hạn). Tổng giá trị mua lẻ là 1.010.000đ, ưu đãi Combo chỉ còn 950.000đ (Tiết kiệm 60.000đ, tương đương -6%), đồng thời tự động áp dụng thêm mã COMBO3 giảm thêm 50.000đ + tặng túi giấy Điệp & thiệp viết tay và tặng 01 hộp Nem chua (mã TANGHOP).',
    price: 950000,
    oldPrice: 1010000,
    packSpec: '3 hộp – 15 nem (01 Vinh Hoa - Phú Quý + 01 Bình An - Sung Túc + 01 Độc Bản)',
    nemMixPerBox: 'Tổng cộng 3 hộp quà = 15 nem (Mỗi hộp 5 nem đặc sản Kinh Bắc)',
    includedSets: [
      {
        id: 'prod-set-vinh-hoa',
        slug: 'set-vinh-hoa-phu-quy',
        name: 'Set 1 – Vinh Hoa - Phú Quý (Bán chạy)',
        price: 290000,
        packSpec: '1 hộp – 5 nem',
        nemMixPerBox: '02 Nem bùi + 02 Nem chua + 01 Nem ngựa',
      },
      {
        id: 'prod-set-binh-an',
        slug: 'set-binh-an-sung-tuc',
        name: 'Set 2 – Bình An - Sung Túc',
        price: 330000,
        packSpec: '1 hộp – 5 nem',
        nemMixPerBox: '02 Nem bùi + 01 Nem chua + 02 Nem ngựa',
      },
      {
        id: 'prod-set-doc-ban',
        slug: 'set-doc-ban',
        name: 'Set 3 – Độc Bản (Hộp lục giác giới hạn)',
        price: 390000,
        packSpec: '1 hộp – 5 nem',
        nemMixPerBox: '02 Nem ngựa thượng hạng + 02 Nem bùi đặc biệt + 01 Nem chua ủ lá ổi',
      },
    ],
    packOptions: [
      'Trọn bộ 3 hộp quà (15 nem) – Giao cùng lúc',
      'Trọn bộ 3 hộp quà + Kèm 03 Túi giấy Điệp & 03 Thiệp viết tay riêng',
    ],
    weightOrCount: 'Trọn bộ 3 hộp quà = 15 nem (Kèm 03 túi giấy Điệp & 03 thiệp viết tay)',
    images: [
      {
        url: '/images/products/combo-3-set-1.svg',
        alt: 'Bộ sưu tập Combo 3 hộp quà Bùi Vị gồm Vinh Hoa, Bình An và Độc Bản',
        caption: 'Góc 1: Trọn bộ 3 hộp quà di sản Bùi Vị (Vinh Hoa + Bình An + Độc Bản)',
        theme: 'combo',
        angleIndex: 1,
      },
      {
        url: '/images/products/combo-3-set-2.svg',
        alt: 'Ba chiếc hộp quà mở ra thành bộ ba tranh dân gian Đông Hồ',
        caption: 'Góc 2: Bộ ba bức tranh Đông Hồ trên nền giấy Điệp ánh kim',
        theme: 'combo',
        angleIndex: 2,
      },
      {
        url: '/images/products/combo-3-set-3.svg',
        alt: 'Toàn bộ 15 phần nem Kinh Bắc bên trong Combo 3 hộp quà (mỗi hộp 5 nem)',
        caption: 'Góc 3: Đầy đủ 15 phần Nem chua, Nem bùi, Nem ngựa (3 hộp × 5 nem)',
        theme: 'combo',
        angleIndex: 3,
      },
      {
        url: '/images/products/combo-3-set-4.svg',
        alt: 'Quà tặng kèm túi giấy Điệp và thiệp viết tay thủ công cho Combo 3 hộp quà',
        caption: 'Góc 4: Tặng kèm bộ túi giấy Điệp và thiệp viết tay riêng cho mỗi hộp',
        theme: 'combo',
        angleIndex: 4,
      },
      {
        url: '/images/products/combo-3-set-5.svg',
        alt: 'Đóng gói thùng bảo vệ chuyên nghiệp dành cho khách biếu tặng',
        caption: 'Góc 5: Quy cách đóng gói trang trọng, sẵn sàng trao tặng',
        theme: 'combo',
        angleIndex: 5,
      },
    ],
    stock: 20,
    tags: ['Tiết kiệm 60.000đ', 'Tự động giảm thêm 50.000đ', '3 hộp – 15 nem'],
    promoTag: 'Tiết kiệm 60.000đ + Giảm 50.000đ (COMBO3)',
    voucherEligibility: ['COMBO3', 'FREESHIP', 'THANHVIEN50', 'TANGHOP'],
    ingredients: [
      '01 Set Vinh Hoa - Phú Quý (1 hộp – 5 nem, giá lẻ 290.000đ)',
      '01 Set Bình An - Sung Túc (1 hộp – 5 nem, giá lẻ 330.000đ)',
      '01 Set Độc Bản hộp lục giác đánh số thứ tự (1 hộp – 5 nem, giá lẻ 390.000đ)',
      'Ưu đãi tự động COMBO3: Giảm thêm 50.000đ + Tặng túi giấy Điệp & thiệp viết tay',
      'Ưu đãi tự động TANGHOP: Tặng thêm 01 hộp Nem chua Kinh Bắc (trị giá 85.000đ)',
    ],
    usage:
      'Giải pháp quà biếu trọn gói dành cho gia đình, đối tác, khách quý. Mỗi set đóng hộp độc lập (1 hộp – 5 nem) thuận tiện trao tặng.',
    enjoyment:
      'Giải pháp quà biếu trọn gói dành cho gia đình, đối tác, khách quý. Mỗi set đóng hộp độc lập (1 hộp – 5 nem) thuận tiện trao tặng.',
    storage:
      'Bảo quản lạnh các phần nem ở 2°C – 6°C. Ba hộp tranh giấy Điệp trưng bày làm bộ tranh tam đa di sản.',
    shelfLife: '05 – 07 ngày ở ngăn mát tủ lạnh cho thực phẩm; Hộp tranh lưu giữ lâu dài.',
    giftBoxStory:
      'Khi đặt 3 chiếc hộp cạnh nhau, người thưởng lãm sẽ sở hữu trọn vẹn câu chuyện di sản Kinh Bắc: từ sum họp Bình An, thăng hoa Vinh Hoa Phú Quý đến đỉnh cao hộp lục giác Độc Bản.',
    boxStory:
      'Khi đặt 3 chiếc hộp cạnh nhau, người thưởng lãm sẽ sở hữu trọn vẹn câu chuyện di sản Kinh Bắc: từ sum họp Bình An, thăng hoa Vinh Hoa Phú Quý đến đỉnh cao hộp lục giác Độc Bản.',
    shippingReturnPolicy:
      'Miễn phí vận chuyển nội thành (đơn trên 500.000đ). Tự động áp dụng ưu đãi COMBO3 giảm thêm 50.000đ và tặng thêm 1 hộp Nem chua (mã TANGHOP).',
    shipping:
      'Miễn phí vận chuyển nội thành (đơn trên 500.000đ). Tự động áp dụng ưu đãi COMBO3 giảm thêm 50.000đ và tặng thêm 1 hộp Nem chua (mã TANGHOP).',
    featured: true,
    isBestSeller: false,
    bestSeller: false,
    isGiftSet: true,
  },
];

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export function formatPriceWords(amount: number): string {
  return `${formatPrice(amount).replace(/đ$/, '')} đồng`;
}

export function findProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(
    (p) => p.slug === slug || (p.legacySlugs && p.legacySlugs.includes(slug))
  );
}

export const formatCurrency = formatPrice;

export function getDiscountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function getSavingsAmount(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return oldPrice - price;
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

