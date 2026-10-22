import { SITE_CONFIG } from './siteConfig';

export interface QualityCommitment {
  id: string;
  title: string;
  description: string;
  iconType: 'flame' | 'check' | 'sparkles' | 'shield';
}

export interface TimelineStep {
  step: string;
  title: string;
  description: string;
}

export interface AboutContentData {
  pageTitle: string;
  heroBadge: string;
  slogan: string;
  videoQuote: string;
  leadQuoteParagraph: string;
  introParagraph: string;
  productLines: {
    name: string;
    description: string;
  }[];
  commitmentsSection: {
    subtitle: string;
    title: string;
    introParagraph: string;
    items: QualityCommitment[];
  };
  timelineSection: {
    subtitle: string;
    title: string;
    introParagraph: string;
    steps: TimelineStep[];
  };
  suggestedSection: {
    subtitle: string;
    title: string;
    introParagraph: string;
    productIds: string[];
  };
}

/**
 * Toàn bộ nội dung trang Về Bùi Vị (/ve-bui-vi).
 * Chỉnh sửa file này để cập nhật tức thì nội dung trên trang Về Bùi Vị.
 */
export const ABOUT_CONTENT: AboutContentData = {
  pageTitle: 'Về Bùi Vị – Câu Chuyện Thương Hiệu & Hành Trình Di Sản | BÙI VỊ',
  heroBadge: 'Câu chuyện Bùi Vị',
  slogan: SITE_CONFIG.slogan,
  videoQuote: '“Mỗi lần mở hộp là một lần chạm vào di sản”',
  leadQuoteParagraph: SITE_CONFIG.brandDescription,
  introParagraph: SITE_CONFIG.productIntroduction,
  productLines: SITE_CONFIG.storyProductLines,
  commitmentsSection: {
    subtitle: 'Chuẩn mực chế tác thủ công',
    title: '4 Cam Kết Chất Lượng Của Bùi Vị',
    introParagraph:
      'Mỗi sản phẩm Bùi Vị ra đời là sự kết tinh giữa chuẩn mực vệ sinh thực phẩm hiện đại và bàn tay tài hoa của những nghệ nhân làng nghề Thuận Thành – Bắc Ninh, từ hạt thính gạo nếp cái hoa vàng đến từng tờ giấy Điệp vỏ sò tự nhiên.',
    items: [
      {
        id: 'commit-1',
        title: '1. Thính gạo rang củi',
        description:
          'Gạo tẻ thơm phối cùng nếp cái hoa vàng ngâm nước mưa, rang tay trên chảo gang đun củi nhãn và xay bằng cối đá để giữ trọn hương bùi thơm nồng đượm.',
        iconType: 'flame',
      },
      {
        id: 'commit-2',
        title: '2. Nguyên liệu tươi trong ngày',
        description:
          'Thịt nạc mông heo thảo mộc và thịt ngựa tươi tuyển chọn ngay trong sáng sớm, thái lát thủ công theo thớ để giữ độ ngọt tự nhiên và độ giòn sần sật của bì.',
        iconType: 'check',
      },
      {
        id: 'commit-3',
        title: '3. Giấy Điệp & Tranh Đông Hồ',
        description:
          'Hộp quà chế tác từ giấy dó phết điệp vỏ sò óng ánh tự nhiên, in mộc bản màu khoáng thực vật, mở phẳng thành bức tranh di sản bền màu theo năm tháng.',
        iconType: 'sparkles',
      },
      {
        id: 'commit-4',
        title: '4. Vệ sinh & An toàn tuyệt đối',
        description:
          'Quy trình đóng gói hút chân không và khay lạnh khép kín, không sử dụng chất bảo quản nhân tạo, vận chuyển kèm đá gel giữ nhiệt chuyên dụng.',
        iconType: 'shield',
      },
    ],
  },
  timelineSection: {
    subtitle: 'Dấu ấn phát triển',
    title: 'Hành Trình Vun Đắp Di Sản Bùi Vị',
    introParagraph:
      'Khởi nguồn từ niềm tự hào với thức quà quê Kinh Bắc, Bùi Vị từng bước kết nối nghề làm nem gia truyền làng Bùi Xá với nghệ thuật tranh dân gian Đông Hồ bên bờ sông Đuống.',
    steps: [
      {
        step: 'Chặng 01',
        title: 'Gìn giữ lửa nghề Bùi Xá',
        description:
          'Kế thừa công thức làm nem bùi thính gạo, nem chua lá ổi và nem ngựa cổ truyền tại xã Ninh Xá, Thuận Thành, Bắc Ninh.',
      },
      {
        step: 'Chặng 02',
        title: 'Cuộc hội ngộ cùng Đông Hồ',
        description:
          'Hợp tác cùng các nghệ nhân làm giấy Điệp vỏ sò và khắc ván in tranh dân gian Đông Hồ bên bờ sông Đuống.',
      },
      {
        step: 'Chặng 03',
        title: 'Sáng tạo Hộp Lục Giác Độc Bản',
        description:
          'Hoàn thiện cấu trúc hộp quà lục giác mở 6 cánh thành bức tranh Đông Hồ vẹn nguyên để ngắm nhìn và lưu giữ.',
      },
      {
        step: 'Chặng 04',
        title: 'Lan tỏa Quà Biếu Di Sản Việt',
        description:
          'Ra mắt 3 dòng sản phẩm Vinh Hoa - Phú Quý, Bình An - Sung Túc và Độc Bản phục vụ thực khách tại Bắc Ninh, Hà Nội và TP.HCM.',
      },
    ],
  },
  suggestedSection: {
    subtitle: 'Tuyệt tác hộp quà mở thành tranh (1 hộp – 5 nem)',
    title: 'Gợi ý thưởng thức và trao quà',
    introParagraph:
      'Chọn thức quà di sản Kinh Bắc phù hợp cho từng dịp sum họp gia đình, tri ân đối tác hay biếu tặng thượng khách. Mỗi hộp quà đều gửi kèm túi giấy Điệp và thiệp viết tay trang trọng.',
    productIds: [
      'prod-set-vinh-hoa',
      'prod-set-binh-an',
      'prod-set-doc-ban',
      'prod-nem-chua',
      'prod-nem-bui',
      'prod-combo-3-set',
    ],
  },
};
