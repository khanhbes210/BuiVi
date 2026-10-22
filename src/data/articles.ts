/**
 * ============================================================================
 * DỮ LIỆU 6 BÀI VIẾT CHÍNH THỨC BÙI VỊ (/bai-viet)
 * ============================================================================
 * Hỗ trợ tải qua getArticles() với cơ chế CSV fallback (/public/data/articles.csv).
 * ============================================================================
 */

import Papa from 'papaparse';
import {
  findProductBySlug,
  formatPriceWords,
  getSavingsAmount,
} from './products';
import { VOUCHERS } from './vouchers';
import { MediaSlotId } from './media';

export type ArticleCategoryLabel =
  | 'Văn hóa ẩm thực'
  | 'Mẹo hay & bí quyết'
  | 'Tin tức & Sự kiện';

export type ArticleCategorySlug =
  | 'van-hoa-am-thuc'
  | 'meo-hay-bi-quyet'
  | 'tin-tuc-su-kien';

export type ArticleContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

export interface Article {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  category: ArticleCategoryLabel;
  categorySlug: ArticleCategorySlug;
  content: ArticleContentBlock[];
  thumbnail: MediaSlotId;
  heroSlotId: MediaSlotId;
  author: string;
  date: string;
  publishedAt: string;
  relatedProductSlug: string;
  inlineProductSlug: string;
  readingTime: string;
  readTime: string;
}

export const ARTICLE_CATEGORY_MAP: {
  slug: 'all' | ArticleCategorySlug;
  label: 'Tất cả' | ArticleCategoryLabel;
}[] = [
  { slug: 'all', label: 'Tất cả' },
  { slug: 'van-hoa-am-thuc', label: 'Văn hóa ẩm thực' },
  { slug: 'meo-hay-bi-quyet', label: 'Mẹo hay & bí quyết' },
  { slug: 'tin-tuc-su-kien', label: 'Tin tức & Sự kiện' },
];

export const ARTICLE_CATEGORIES = [
  'Tất cả',
  'Văn hóa ẩm thực',
  'Mẹo hay & bí quyết',
  'Tin tức & Sự kiện',
] as const;

export function calculateReadingTime(blocks: ArticleContentBlock[]): string {
  const fullText = blocks
    .map((b) => (b.type === 'ul' ? b.items.join(' ') : b.text))
    .join(' ');
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} phút đọc`;
}

/**
 * Giải mã động các token giá và ưu đãi trong bài viết 4 & 5 tại thời điểm hiển thị
 * từ dữ liệu gốc products.ts và vouchers.ts (tuyệt đối không hard-code).
 */
export function resolveArticleTokens(text: string): string {
  if (!text) return text;

  let resolved = text.replace(/\{\{PRICE:([a-z0-9-]+)\}\}/g, (_match, productSlug: string) => {
    const prod = findProductBySlug(productSlug);
    if (!prod) return '';
    return formatPriceWords(prod.price);
  });

  resolved = resolved.replace(/\{\{VOUCHER:([A-Z0-9]+)\}\}/g, (_match, code: string) => {
    const voucher = VOUCHERS.find((v) => v.code === code);
    if (!voucher) return '';
    if (code === 'QUATET15') {
      return `Giảm ${voucher.value}%, tối đa ${formatPriceWords(voucher.maxDiscount)}`;
    }
    if (code === 'COMBO3') {
      return `Giảm thêm ${formatPriceWords(voucher.value)} khi mua combo`;
    }
    return voucher.title;
  });

  resolved = resolved.replace(/\{\{COMBO_SAVING\}\}/g, () => {
    const combo = findProductBySlug('combo-3-hop-qua');
    if (!combo) return '';
    const saving = getSavingsAmount(combo.price, combo.oldPrice);
    return `Tiết kiệm ${formatPriceWords(saving)}`;
  });

  return resolved;
}

interface RawArticleSeed {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  category: ArticleCategoryLabel;
  categorySlug: ArticleCategorySlug;
  date: string;
  relatedProductSlug: string;
  thumbnail: MediaSlotId;
  heroSlotId: MediaSlotId;
  content: ArticleContentBlock[];
}

const RAW_ARTICLES: RawArticleSeed[] = [
  // ARTICLE 1
  {
    id: 'art-1',
    slug: 'nghe-thuat-lam-nem-bui-kinh-bac',
    title: 'Nghệ thuật làm nem bùi Kinh Bắc: Khi hương thính gạo giữ trọn hồn quê',
    metaDescription:
      'Khám phá nét đặc trưng trong cách làm nem bùi Kinh Bắc qua sự kết hợp giữa thịt lợn, bì thái sợi và thính gạo rang thơm. Cùng Bùi Vị tìm hiểu hương vị đặc sản Bắc Ninh.',
    category: 'Văn hóa ẩm thực',
    categorySlug: 'van-hoa-am-thuc',
    date: '05/10/2026',
    relatedProductSlug: 'nem-bui',
    thumbnail: 'blog-thumb-nghe-thuat-lam-nem-bui-kinh-bac',
    heroSlotId: 'blog-hero-nghe-thuat-lam-nem-bui-kinh-bac',
    content: [
      { type: 'h2', text: 'Linh hồn nằm ở hương thính gạo rang' },
      {
        type: 'p',
        text: 'Nhắc đến đặc sản Bắc Ninh, nem bùi là món ăn mang đậm dấu ấn ẩm thực vùng Kinh Bắc. Với sự kết hợp giữa thịt lợn, bì lợn thái sợi và thính gạo rang, món ăn chinh phục thực khách bằng vị bùi thơm, kết cấu dai giòn và hương vị dân dã đặc trưng.',
      },
      {
        type: 'p',
        text: 'Trong đó, thính gạo là thành phần góp phần tạo nên nét riêng của nem bùi. Gạo được lựa chọn, rang chín rồi nghiền thành thính để trộn cùng các nguyên liệu. Quá trình rang đòi hỏi sự chú ý đến nhiệt độ và độ chín của hạt gạo, giúp thính dậy mùi thơm mà không bị cháy khét. Khi đạt độ mịn phù hợp, thính dễ dàng hòa quyện với thịt và bì, tạo nên hương vị đặc trưng cho thành phẩm.',
      },
      {
        type: 'p',
        text: 'Không chỉ bổ sung mùi thơm, thính gạo còn là yếu tố làm nên tên gọi và dấu ấn riêng của món đặc sản này. Chính vị bùi nhẹ, thơm dịu của thính đã tạo nên sức hấp dẫn cho nem bùi Kinh Bắc.',
      },
      { type: 'h2', text: 'Thịt nạc và bì lợn: Bí quyết tạo nên kết cấu hài hòa' },
      {
        type: 'p',
        text: 'Bên cạnh thính gạo, thịt nạc và bì lợn là hai thành phần quan trọng quyết định chất lượng nem bùi. Nguyên liệu cần được lựa chọn kỹ lưỡng, bảo đảm độ tươi và được sơ chế đúng cách trước khi phối trộn.',
      },
      {
        type: 'p',
        text: 'Thịt nạc mang đến vị ngọt tự nhiên, trong khi bì lợn thái sợi tạo độ dai giòn khi thưởng thức. Sự kết hợp giữa hai thành phần giúp nem có kết cấu phong phú, không quá mềm cũng không quá khô. Khi được trộn cùng lượng thính phù hợp, các nguyên liệu hòa quyện, tạo nên tổng thể cân bằng giữa hương thơm và vị béo bùi.',
      },
      {
        type: 'p',
        text: 'Mỗi công đoạn đều ảnh hưởng đến chất lượng thành phẩm. Từ khâu sơ chế nguyên liệu đến cách thái, phối trộn và bảo quản, sự cẩn thận là yếu tố cần thiết để giữ hương vị và bảo đảm vệ sinh an toàn thực phẩm.',
      },
      { type: 'h2', text: 'Thưởng thức nem bùi cùng lá sung' },
      {
        type: 'p',
        text: 'Nem bùi Kinh Bắc thường được thưởng thức cùng lá sung và các loại gia vị tùy khẩu vị. Đây cũng là cách kết hợp giúp làm nổi bật hương vị đặc trưng của món ăn.',
      },
      {
        type: 'p',
        text: 'Khi ăn, thực khách đặt một lượng nem vừa đủ lên lá sung, có thể thêm gia vị phù hợp rồi cuốn lại. Vị chát nhẹ của lá sung tạo sự tương phản với vị bùi thơm của thính, vị ngọt của thịt và độ dai giòn của bì lợn. Các thành phần bổ trợ cho nhau, tạo nên trải nghiệm thưởng thức mộc mạc nhưng đậm đà.',
      },
      {
        type: 'p',
        text: 'Không cần cách trình bày cầu kỳ, nem bùi vẫn có sức hấp dẫn riêng nhờ sự hòa quyện của những nguyên liệu quen thuộc. Món ăn phù hợp để thưởng thức trong bữa cơm gia đình, những buổi gặp gỡ hoặc làm quà dành tặng người thân, bạn bè.',
      },
      { type: 'h2', text: 'Bùi Vị gìn giữ hương vị đặc sản Kinh Bắc' },
      {
        type: 'p',
        text: 'Nem bùi không chỉ hấp dẫn bởi vị bùi thơm của thính gạo, độ dai giòn của bì lợn mà còn gợi nhắc nét mộc mạc trong văn hóa ẩm thực Kinh Bắc. Qua những món đặc sản địa phương, hương vị quê nhà tiếp tục được gìn giữ và trở thành món quà ý nghĩa dành tặng người thân, bạn bè.',
      },
      {
        type: 'p',
        text: 'Mang đậm dấu ấn ẩm thực Bắc Ninh, nem bùi Bùi Vị là lựa chọn đáng cân nhắc cho những ai yêu thích đặc sản truyền thống hoặc đang tìm kiếm một thức quà quê gần gũi. Sự hòa quyện của những nguyên liệu giản dị tạo nên nét hấp dẫn riêng, góp phần đưa hương vị Kinh Bắc đến gần hơn với mỗi gia đình.',
      },
    ],
  },

  // ARTICLE 2
  {
    id: 'art-2',
    slug: 'giay-diep-dong-ho-hop-qua-bui-vi',
    title: 'Giấy Điệp Đông Hồ và hành trình đưa di sản vào hộp quà Bùi Vị',
    metaDescription:
      'Khám phá cảm hứng tranh dân gian Đông Hồ và chất liệu giấy Điệp trong thiết kế hộp quà nem Kinh Bắc của Bùi Vị, nơi đặc sản truyền thống gặp gỡ giá trị văn hóa Việt.',
    category: 'Văn hóa ẩm thực',
    categorySlug: 'van-hoa-am-thuc',
    date: '08/10/2026',
    relatedProductSlug: 'set-doc-ban',
    thumbnail: 'blog-thumb-giay-diep-dong-ho-hop-qua-bui-vi',
    heroSlotId: 'blog-hero-giay-diep-dong-ho-hop-qua-bui-vi',
    content: [
      { type: 'h2', text: 'Giấy Điệp và ánh sắc đặc trưng của tranh Đông Hồ' },
      {
        type: 'p',
        text: 'Nhắc đến tranh dân gian Đông Hồ, bên cạnh những hình ảnh gần gũi với đời sống người Việt, giấy Điệp cũng là một yếu tố tạo nên dấu ấn riêng. Trên nền giấy dó, lớp điệp tạo hiệu ứng ánh sáng lấp lánh nhẹ nhàng, góp phần làm nổi bật màu sắc và nét mộc mạc của tranh.',
      },
      {
        type: 'p',
        text: 'Giấy Điệp truyền thống được tạo nên bằng cách phủ hỗn hợp có thành phần bột điệp lên giấy dó. Những hạt điệp nhỏ tạo nên bề mặt óng ánh tự nhiên, mang sắc trắng ngà đặc trưng. Khi kết hợp với màu sắc và đường nét dân gian, chất liệu này góp phần tạo nên vẻ đẹp vừa giản dị vừa giàu tính nghệ thuật cho tranh Đông Hồ.',
      },
      {
        type: 'p',
        text: 'Lấy cảm hứng từ nét đẹp ấy, Bùi Vị đưa hình ảnh tranh dân gian và tinh thần văn hóa Kinh Bắc vào thiết kế hộp quà nem. Đây là cách kết nối đặc sản địa phương với một giá trị văn hóa quen thuộc, giúp món quà không chỉ được chú ý bởi sản phẩm bên trong mà còn bởi câu chuyện được gửi gắm qua hình thức bên ngoài.',
      },
      { type: 'h2', text: 'Hộp quà lục giác: Khi bao bì trở thành một phần của món quà' },
      {
        type: 'p',
        text: 'Bao bì quà tặng không chỉ có chức năng bảo vệ sản phẩm mà còn góp phần thể hiện sự trân trọng của người trao dành cho người nhận. Với Bùi Vị, thiết kế hộp quà lục giác được phát triển theo hướng kết hợp hình thức đóng gói với cảm hứng từ tranh dân gian Đông Hồ.',
      },
      {
        type: 'p',
        text: 'Hình dáng lục giác tạo nên diện mạo khác biệt so với những mẫu hộp quà thông thường. Khi kết hợp với hình ảnh tranh dân gian và các họa tiết mang tinh thần Kinh Bắc, chiếc hộp trở thành một phần trong trải nghiệm nhận quà, gợi nhắc đến nét đẹp văn hóa truyền thống.',
      },
      {
        type: 'p',
        text: 'Điểm đáng chú ý trong ý tưởng thiết kế là khả năng tháo mở hộp để tận dụng phần tranh trang trí sau khi sử dụng. Thay vì kết thúc vòng đời ngay khi sản phẩm bên trong được thưởng thức, chiếc hộp có thể tiếp tục được lưu giữ như một vật phẩm trang trí, tùy theo cấu trúc và cách tháo mở thực tế.',
      },
      {
        type: 'p',
        text: 'Ý tưởng này mở rộng ý nghĩa của bao bì quà tặng: từ một vật dụng phục vụ đóng gói thành một chi tiết có giá trị lưu niệm, góp phần kéo dài trải nghiệm của người nhận.',
      },
      {
        type: 'h2',
        text: 'Vinh Hoa - Phú Quý, Bình An - Sung Túc: Gửi gắm ý nghĩa qua tranh dân gian',
      },
      {
        type: 'p',
        text: 'Trong văn hóa quà tặng Việt Nam, những hình ảnh mang ý nghĩa tốt lành thường được lựa chọn để gửi gắm lời chúc đến người nhận. Cảm hứng từ tranh dân gian Đông Hồ vì thế phù hợp với định hướng phát triển bộ hộp quà nem Kinh Bắc của Bùi Vị.',
      },
      {
        type: 'p',
        text: 'Các phiên bản Vinh Hoa - Phú Quý và Bình An - Sung Túc gợi nhắc đến những mong ước về cuộc sống đủ đầy, bình yên và thịnh vượng. Thông qua tên gọi và hình ảnh trang trí, mỗi hộp quà mang một thông điệp riêng, phù hợp với những dịp biếu tặng khác nhau.',
      },
      {
        type: 'p',
        text: 'Sự kết hợp giữa đặc sản Bắc Ninh và cảm hứng tranh Đông Hồ cũng tạo nên một cách kể chuyện về văn hóa địa phương. Nếu nem bùi gợi nhắc hương vị ẩm thực Kinh Bắc, thì hình ảnh dân gian trên hộp quà góp phần đưa những giá trị văn hóa ấy vào trải nghiệm trao tặng.',
      },
      { type: 'h2', text: 'Bùi Vị và hành trình kết nối đặc sản với văn hóa Việt' },
      {
        type: 'p',
        text: 'Một món quà ý nghĩa không chỉ nằm ở giá trị vật chất mà còn ở câu chuyện và tình cảm được gửi gắm. Với định hướng kết hợp đặc sản Kinh Bắc cùng cảm hứng từ tranh dân gian Đông Hồ, Bùi Vị hướng đến việc tạo nên những hộp quà vừa mang hương vị quê nhà, vừa thể hiện sự trân trọng đối với văn hóa truyền thống.',
      },
      {
        type: 'p',
        text: 'Từ chất liệu giấy Điệp, hình ảnh tranh dân gian đến thiết kế hộp lục giác, mỗi yếu tố đều góp phần tạo nên dấu ấn riêng cho bộ quà tặng. Đó cũng là cách để một món đặc sản địa phương trở thành món quà giàu ý nghĩa hơn, phù hợp dành tặng gia đình, đối tác và những người thân yêu.',
      },
      {
        type: 'p',
        text: 'Khám phá bộ sưu tập hộp quà Bùi Vị để tìm một thức quà kết hợp hương vị đặc sản Bắc Ninh với nét đẹp văn hóa Kinh Bắc, gửi trao lời chúc tốt lành qua từng món quà.',
      },
    ],
  },

  // ARTICLE 3
  {
    id: 'art-3',
    slug: 'bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac',
    title: 'Bí quyết bảo quản và thưởng thức nem Kinh Bắc giữ trọn hương vị',
    metaDescription:
      'Tìm hiểu cách bảo quản nem bùi, nem chua và nem ngựa Kinh Bắc đúng cách, cùng gợi ý lá ăn kèm và gia vị giúp thưởng thức đặc sản Bắc Ninh trọn vị.',
    category: 'Mẹo hay & bí quyết',
    categorySlug: 'meo-hay-bi-quyet',
    date: '12/10/2026',
    relatedProductSlug: 'nem-chua',
    thumbnail: 'blog-thumb-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac',
    heroSlotId: 'blog-hero-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac',
    content: [
      { type: 'h2', text: 'Bảo quản nem đúng cách để giữ hương vị' },
      {
        type: 'p',
        text: 'Nem Kinh Bắc hấp dẫn bởi sự kết hợp giữa nguyên liệu, cách chế biến và hương vị đặc trưng của từng loại. Tuy nhiên, để nem giữ được chất lượng khi thưởng thức, khâu bảo quản cũng quan trọng không kém. Mỗi loại nem có đặc điểm riêng nên cần tuân thủ hướng dẫn bảo quản của nhà sản xuất thay vì áp dụng chung một cách.',
      },
      {
        type: 'p',
        text: 'Với nem bùi và nem ngựa, nên bảo quản theo nhiệt độ ghi trên bao bì, đặc biệt khi sản phẩm cần giữ lạnh. Nếu sử dụng ngăn mát tủ lạnh, cần duy trì nhiệt độ ở mức an toàn, thông thường không quá 4°C đối với thực phẩm dễ hỏng. Nem nên được đặt trong bao bì kín, tránh tiếp xúc với thực phẩm sống để hạn chế nguy cơ nhiễm chéo.',
      },
      {
        type: 'p',
        text: 'Đối với nem chua, không nên mặc định rằng quá trình lên men khiến sản phẩm có thể bảo quản ở nhiệt độ phòng trong thời gian dài. Thời hạn sử dụng và điều kiện bảo quản phụ thuộc vào công thức, quy trình sản xuất và hướng dẫn của từng cơ sở. Vì vậy, hãy ưu tiên thông tin trên bao bì và sử dụng nem trong thời hạn được khuyến nghị.',
      },
      {
        type: 'p',
        text: 'Khi lấy nem ra khỏi tủ lạnh, chỉ nên lấy lượng vừa đủ cho bữa ăn. Không để nem ở nhiệt độ phòng quá lâu, đặc biệt trong thời tiết nóng. Phần chưa sử dụng cần được đóng kín và bảo quản trở lại theo hướng dẫn của nhà sản xuất.',
      },
      { type: 'h2', text: 'Nem bùi, nem chua và nem ngựa ăn kèm với gì?' },
      {
        type: 'p',
        text: 'Bên cạnh cách bảo quản, lựa chọn lá ăn kèm và gia vị phù hợp giúp làm nổi bật hương vị riêng của từng loại nem.',
      },
      {
        type: 'p',
        text: 'Nem bùi thường được thưởng thức cùng lá sung. Vị chát nhẹ của lá giúp cân bằng vị bùi thơm của thính gạo, đồng thời làm nổi bật độ dai giòn của bì lợn. Khi ăn, có thể cuốn một lượng nem vừa đủ với lá sung và dùng thêm gia vị tùy khẩu vị.',
      },
      {
        type: 'p',
        text: 'Nem chua có vị chua đặc trưng từ quá trình lên men, kết hợp cùng vị đậm đà của thịt và gia vị. Lá sung, lá đinh lăng hoặc các loại rau ăn kèm phù hợp có thể giúp cân bằng hương vị. Tương ớt cũng là lựa chọn phổ biến dành cho những người thích vị cay nhẹ.',
      },
      {
        type: 'p',
        text: 'Nem ngựa có cách thưởng thức tùy theo công thức chế biến của từng cơ sở. Một số loại có thể dùng cùng lá chanh thái chỉ hoặc gia vị phù hợp để tăng hương thơm. Tuy nhiên, nên tham khảo hướng dẫn của nhà sản xuất để lựa chọn cách ăn phù hợp với sản phẩm cụ thể.',
      },
      {
        type: 'p',
        text: 'Sự kết hợp hài hòa giữa nem, lá ăn kèm và gia vị không chỉ làm phong phú trải nghiệm thưởng thức mà còn giúp mỗi loại đặc sản thể hiện rõ nét riêng.',
      },
      { type: 'h2', text: 'Những lưu ý khi mở gói và thưởng thức nem' },
      {
        type: 'p',
        text: 'Để giữ chất lượng nem, nên mở bao bì ngay trước khi ăn và sử dụng dụng cụ sạch khi lấy sản phẩm. Nem đã mở cần được bảo quản kín nếu chưa dùng hết, đồng thời tuân thủ thời gian sử dụng sau mở gói theo hướng dẫn của nhà sản xuất.',
      },
      {
        type: 'p',
        text: 'Không nên để nem tiếp xúc lâu với không khí vì bề mặt có thể bị khô và chất lượng giảm. Đặc biệt, không sử dụng sản phẩm nếu có dấu hiệu bất thường như mùi lạ, bao bì phồng, rò rỉ hoặc thay đổi màu sắc không phù hợp. Với nem chua và các sản phẩm thịt lên men, không thể chỉ dựa vào màu sắc hay mùi vị để xác định độ an toàn.',
      },
      {
        type: 'p',
        text: 'Nem Kinh Bắc ngon hơn khi được thưởng thức đúng cách và bảo quản phù hợp. Từ vị bùi thơm của nem bùi, vị chua đậm đà của nem chua đến nét riêng của nem ngựa, mỗi loại đều mang đến một trải nghiệm ẩm thực khác biệt.',
      },
      {
        type: 'p',
        text: 'Nếu đang tìm kiếm đặc sản Kinh Bắc cho bữa ăn gia đình hoặc làm quà biếu, hãy khám phá các sản phẩm nem tại Bùi Vị và tham khảo hướng dẫn bảo quản đi kèm để thưởng thức trọn vẹn hương vị đặc trưng của từng loại.',
      },
    ],
  },

  // ARTICLE 4
  {
    id: 'art-4',
    slug: 'goi-y-chon-set-qua-bieu-di-san-bui-vi',
    title: 'Gợi ý chọn set quà biếu di sản Bùi Vị phù hợp cho từng dịp trọng đại',
    metaDescription:
      'Khám phá cách chọn set quà biếu BÙI VỊ qua ba phiên bản Vinh Hoa - Phú Quý, Bình An - Sung Túc và Độc Bản, phù hợp với nhiều dịp tặng quà cá nhân và doanh nghiệp.',
    category: 'Mẹo hay & bí quyết',
    categorySlug: 'meo-hay-bi-quyet',
    date: '15/10/2026',
    relatedProductSlug: 'set-binh-an-sung-tuc',
    thumbnail: 'blog-thumb-goi-y-chon-set-qua-bieu-di-san-bui-vi',
    heroSlotId: 'blog-hero-goi-y-chon-set-qua-bieu-di-san-bui-vi',
    content: [
      {
        type: 'p',
        text: 'Một món quà biếu ý nghĩa không chỉ nằm ở giá trị bên trong mà còn thể hiện qua cách lựa chọn và thông điệp gửi gắm đến người nhận. Với bộ sưu tập hộp quà nem Kinh Bắc lấy cảm hứng từ tranh dân gian Đông Hồ, BÙI VỊ mang đến ba phiên bản Vinh Hoa – Phú Quý, Bình An – Sung Túc và Độc Bản, mỗi phiên bản sở hữu cách phối màu và hình ảnh trang trí riêng. Vậy nên chọn set quà nào cho những dịp biếu tặng khác nhau?',
      },
      { type: 'h2', text: '1. Set Bình An - Sung Túc: Món quà gửi gắm lời chúc tốt lành' },
      {
        type: 'p',
        text: 'Với nền xanh kết hợp sắc vàng, hộp quà Bình An - Sung Túc mang diện mạo hài hòa, nổi bật với hình em bé cầm hoa sen, gà trống nhiều màu và hình người cưỡi trâu. Những hình ảnh mang tinh thần dân gian tạo nên nét gần gũi cho thiết kế, đồng thời gợi liên tưởng đến những lời chúc bình an và đủ đầy.',
      },
      {
        type: 'p',
        text: 'Phiên bản này có giá {{PRICE:set-binh-an-sung-tuc}}, gồm 2 nem bùi, 1 nem ngựa và 1 nem chua. Sự kết hợp nhiều loại nem giúp người nhận có thêm lựa chọn thưởng thức đặc sản Kinh Bắc.',
      },
      {
        type: 'p',
        text: 'Bình An - Sung Túc phù hợp để cân nhắc khi thăm hỏi ông bà, cha mẹ, tặng người thân, bạn bè hoặc chuẩn bị quà trong những dịp sum họp gia đình. Đây cũng là lựa chọn đáng tham khảo khi muốn gửi lời chúc tốt đẹp thông qua một món quà vừa có giá trị sử dụng, vừa mang dấu ấn văn hóa địa phương.',
      },
      {
        type: 'h2',
        text: '2. Set Vinh Hoa - Phú Quý: Lựa chọn cho những dịp biếu tặng trang trọng',
      },
      {
        type: 'p',
        text: 'Nổi bật với hai gam màu đỏ và vàng, hộp quà Vinh Hoa - Phú Quý tạo ấn tượng bằng diện mạo rực rỡ cùng các hình tranh dân gian như những vị môn thần, em bé ôm gà và hình cá. Cách phối màu và sắp xếp họa tiết giúp phiên bản này có điểm nhấn rõ ràng, phù hợp với những dịp cần sự chỉn chu trong hình thức quà tặng.',
      },
      {
        type: 'p',
        text: 'Với mức giá {{PRICE:set-vinh-hoa-phu-quy}}, Vinh Hoa - Phú Quý có thể được cân nhắc khi biếu tặng người lớn tuổi, thăm hỏi gia đình, chúc mừng dịp đặc biệt hoặc tri ân khách hàng, đối tác. Tên gọi của hộp quà cũng gợi đến những lời chúc về thành công, thịnh vượng và cuộc sống sung túc.',
      },
      {
        type: 'p',
        text: 'Nếu đang tìm kiếm một món quà kết hợp đặc sản Bắc Ninh với thiết kế mang đậm nét truyền thống, Vinh Hoa - Phú Quý là một phương án đáng tham khảo.',
      },
      { type: 'h2', text: '3. Set Độc Bản: Dành cho người yêu thích thiết kế khác biệt' },
      {
        type: 'p',
        text: 'Khác với sắc đỏ, vàng của Vinh Hoa - Phú Quý và sắc xanh, vàng của Bình An - Sung Túc, hộp Độc Bản sử dụng nền đen kết hợp họa tiết vàng. Các ô tranh khắc họa hình người thổi sáo, người ôm đàn và nhân vật nữ cầm nhạc cụ, tạo nên diện mạo riêng cho phiên bản này.',
      },
      {
        type: 'p',
        text: 'Với mức giá {{PRICE:set-doc-ban}}, Độc Bản phù hợp để cân nhắc trong những dịp kỷ niệm, tri ân hoặc biếu tặng khi người tặng muốn chú trọng đến tính khác biệt của món quà. Chi tiết đánh số thứ tự giới hạn cũng góp phần tạo dấu ấn riêng cho sản phẩm.',
      },
      {
        type: 'p',
        text: 'Phiên bản này có thể là lựa chọn dành cho những người yêu thích thiết kế có tính nhận diện rõ ràng hoặc muốn tìm một món quà mang giá trị lưu niệm bên cạnh sản phẩm đặc sản bên trong.',
      },
      { type: 'h2', text: '4. Chọn set quà theo dịp tặng và nhu cầu sử dụng' },
      {
        type: 'p',
        text: 'Bên cạnh thiết kế, người mua nên cân nhắc mối quan hệ với người nhận, ngân sách và mục đích tặng quà để lựa chọn phù hợp.',
      },
      {
        type: 'ul',
        items: [
          'Thăm hỏi gia đình, người thân: Bình An - Sung Túc là lựa chọn đáng cân nhắc nhờ mức giá dễ tiếp cận và sự kết hợp nhiều loại nem.',
          'Biếu tặng dịp lễ, Tết hoặc chúc mừng: Vinh Hoa - Phú Quý có thể phù hợp khi ưu tiên hình thức nổi bật và thông điệp thịnh vượng.',
          'Tri ân đối tác hoặc tặng trong dịp đặc biệt: Có thể tham khảo Vinh Hoa - Phú Quý hoặc Độc Bản tùy ngân sách và phong cách quà tặng mong muốn.',
          'Tặng quà cho nhiều đối tượng hoặc doanh nghiệp: Bộ ba hộp quà gồm cả Vinh Hoa - Phú Quý, Bình An - Sung Túc và Độc Bản là phương án để tham khảo khi muốn giới thiệu đầy đủ các thiết kế trong bộ sưu tập.',
        ],
      },
      {
        type: 'p',
        text: 'Trước khi đặt mua, nên tìm hiểu kỹ thành phần, quy cách đóng gói và điều kiện bảo quản của từng sản phẩm. Với nhu cầu đặt quà doanh nghiệp số lượng lớn, việc trao đổi trước về số lượng, ngân sách và thời gian nhận hàng cũng giúp quá trình chuẩn bị thuận tiện hơn.',
      },
      { type: 'h2', text: 'Lựa chọn hộp quà BÙI VỊ, gửi trao trọn vẹn tâm ý' },
      {
        type: 'p',
        text: 'Từ sắc xanh hài hòa của Bình An - Sung Túc, nét nổi bật của Vinh Hoa - Phú Quý đến thiết kế tương phản của Độc Bản, mỗi phiên bản mang một diện mạo riêng trong bộ sưu tập hộp quà nem Kinh Bắc BÙI VỊ.',
      },
      {
        type: 'p',
        text: 'Dù là món quà dành cho gia đình, bạn bè hay đối tác, việc lựa chọn một phiên bản phù hợp sẽ giúp lời chúc được gửi trao một cách tinh tế hơn. Khám phá bộ sưu tập hộp quà BÙI VỊ để tìm phương án phù hợp cho dịp biếu tặng sắp tới.',
      },
    ],
  },

  // ARTICLE 5
  {
    id: 'art-5',
    slug: 'bui-vi-ra-mat-bo-suu-tap-qua-tet-2027',
    title: 'Bùi Vị ra mắt bộ sưu tập quà Tết 2027 - Quà biếu Di sản',
    metaDescription:
      'Khám phá bộ sưu tập quà Tết 2027 của Bùi Vị với ba set quà lấy cảm hứng từ tranh Đông Hồ, kết hợp đặc sản Kinh Bắc và ưu đãi dành cho khách hàng cá nhân, doanh nghiệp.',
    category: 'Tin tức & Sự kiện',
    categorySlug: 'tin-tuc-su-kien',
    date: '20/10/2026',
    relatedProductSlug: 'combo-3-hop-qua',
    thumbnail: 'blog-thumb-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027',
    heroSlotId: 'blog-hero-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027',
    content: [
      { type: 'h2', text: 'Bùi Vị giới thiệu bộ sưu tập quà Tết 2027 mang dấu ấn Kinh Bắc' },
      {
        type: 'p',
        text: 'Thị trường quà Tết ngày càng đa dạng, từ giỏ quà truyền thống đến những bộ quà được đầu tư về thiết kế và câu chuyện thương hiệu. Với khách hàng đang tìm kiếm quà biếu cuối năm, việc lựa chọn sản phẩm có nguồn gốc rõ ràng, hình thức chỉn chu và phù hợp với người nhận là những yếu tố đáng cân nhắc.',
      },
      {
        type: 'p',
        text: 'Đón mùa Lễ Tết 2026 - 2027, Bùi Vị chính thức ra mắt Bộ sưu tập Quà biếu Di sản, gồm ba phiên bản Vinh Hoa - Phú Quý, Bình An - Sung Túc và Độc Bản. Bộ sưu tập kết hợp đặc sản nem Kinh Bắc với thiết kế hộp quà lấy cảm hứng từ tranh dân gian Đông Hồ, hướng đến nhu cầu quà Tết cho gia đình, người thân, đối tác và khách hàng doanh nghiệp.',
      },
      { type: 'h2', text: 'Khám phá ba set quà Tết Bùi Vị lấy cảm hứng từ tranh Đông Hồ' },
      {
        type: 'p',
        text: 'Điểm nhận diện của bộ sưu tập là thiết kế hộp quà lục giác với hình ảnh dân gian được thể hiện trên thân hộp. Mỗi phiên bản có cách phối màu và chủ đề riêng, tạo nên sự đa dạng cho khách hàng khi lựa chọn hộp quà Tết.',
      },
      {
        type: 'p',
        text: 'Vinh Hoa - Phú Quý nổi bật với sắc đỏ và vàng, kết hợp hình tượng dân gian gợi liên tưởng đến sự thịnh vượng, đủ đầy. Thiết kế phù hợp với những khách hàng yêu thích hộp quà có màu sắc nổi bật trong dịp lễ Tết.',
      },
      {
        type: 'p',
        text: 'Bình An - Sung Túc sử dụng tông xanh và vàng, với hình ảnh hoa sen, gà và trâu lấy cảm hứng từ tranh dân gian Đông Hồ. Những chi tiết này tạo nên diện mạo riêng cho phiên bản trong bộ sưu tập.',
      },
      {
        type: 'p',
        text: 'Độc Bản gây ấn tượng với sắc đen và vàng, cùng các hình tượng nghệ thuật dân gian như người thổi sáo và nhân vật chơi nhạc cụ. Thiết kế hướng đến khách hàng tìm kiếm một hộp quà có phong cách khác biệt.',
      },
      {
        type: 'p',
        text: 'Ba phiên bản tạo nên những lựa chọn đa dạng trong cùng bộ sưu tập quà Tết Bùi Vị. Khách hàng có thể chọn từng set riêng hoặc lựa chọn Combo 3 Set Quà Di Sản để sở hữu trọn bộ ba thiết kế.',
      },
      {
        type: 'h2',
        text: 'Ưu đãi quà Tết 2027 dành cho khách hàng cá nhân và doanh nghiệp',
      },
      {
        type: 'p',
        text: 'Nhân dịp ra mắt bộ sưu tập, Bùi Vị triển khai chương trình ưu đãi cho khách hàng có nhu cầu chuẩn bị quà biếu mùa Lễ Tết 2026–2027.',
      },
      {
        type: 'ul',
        items: [
          'Mã QUATET15: {{VOUCHER:QUATET15}}, áp dụng cho set Vinh Hoa - Phú Quý và Độc Bản.',
          'Combo 3 Set Quà Di Sản: {{COMBO_SAVING}} so với giá niêm yết theo thông tin chương trình.',
          'Mã COMBO3: {{VOUCHER:COMBO3}}, kèm bộ túi giấy Điệp và thiệp viết tay.',
        ],
      },
      {
        type: 'p',
        text: 'Với khách hàng cá nhân, các set quà là lựa chọn để tham khảo khi chuẩn bị quà biếu gia đình và người thân. Với doanh nghiệp, combo ba set có thể được cân nhắc khi lựa chọn quà tặng cho đối tác, khách hàng hoặc nhân sự dịp cuối năm.',
      },
      {
        type: 'p',
        text: 'Khách hàng có nhu cầu đặt quà Tết doanh nghiệp số lượng lớn nên liên hệ Bùi Vị để trao đổi về số lượng, ngân sách, phiên bản sản phẩm và thời gian giao hàng. Điều kiện áp dụng và thời hạn của từng ưu đãi cần được xác nhận trước khi đặt mua.',
      },
      { type: 'h2', text: 'Lựa chọn hộp quà Tết Bùi Vị cho mùa lễ hội cuối năm' },
      {
        type: 'p',
        text: 'Nếu đang tìm kiếm quà Tết 2027 kết hợp đặc sản Kinh Bắc với thiết kế lấy cảm hứng từ văn hóa truyền thống, Bộ sưu tập Quà biếu Di sản của Bùi Vị mang đến ba phiên bản để khách hàng tham khảo.',
      },
      {
        type: 'p',
        text: 'Tùy theo nhu cầu và ngân sách, khách hàng có thể lựa chọn một set quà riêng hoặc combo ba set. Liên hệ Bùi Vị để tìm hiểu thông tin sản phẩm, xác nhận ưu đãi hiện hành và lựa chọn phương án quà biếu phù hợp cho mùa Lễ Tết 2026 - 2027.',
      },
    ],
  },

  // ARTICLE 6
  {
    id: 'art-6',
    slug: 'khong-gian-di-san-bui-vi-thuan-thanh',
    title: 'Khám phá Không gian Di sản Bùi Vị tại Thuận Thành, Bắc Ninh',
    metaDescription:
      'Khám phá Không gian Di sản Bùi Vị tại Thuận Thành, Bắc Ninh, tìm hiểu nghề làm nem Kinh Bắc, trải nghiệm văn hóa Đông Hồ và tham khảo dịch vụ quà tặng.',
    category: 'Tin tức & Sự kiện',
    categorySlug: 'tin-tuc-su-kien',
    date: '22/10/2026',
    relatedProductSlug: 'set-vinh-hoa-phu-quy',
    thumbnail: 'blog-thumb-khong-gian-di-san-bui-vi-thuan-thanh',
    heroSlotId: 'blog-hero-khong-gian-di-san-bui-vi-thuan-thanh',
    content: [
      { type: 'h2', text: 'Điểm hẹn văn hóa và ẩm thực Kinh Bắc tại Thuận Thành' },
      {
        type: 'p',
        text: 'Không chỉ là nơi giới thiệu đặc sản địa phương, Không gian Di sản Bùi Vị hướng đến việc kết nối ẩm thực Kinh Bắc với những giá trị văn hóa truyền thống. Tại đây, du khách có cơ hội tìm hiểu câu chuyện về nghề làm nem, khám phá cảm hứng từ tranh dân gian Đông Hồ và tìm hiểu những sản phẩm quà biếu mang dấu ấn địa phương.',
      },
      {
        type: 'p',
        text: 'Không gian tọa lạc tại Làng nghề Bùi Xá, xã Ninh Xá, Thuận Thành, Bắc Ninh, theo thông tin do Bùi Vị cung cấp. Đây là điểm đến dành cho những người muốn tìm hiểu thêm về đặc sản Kinh Bắc và câu chuyện văn hóa gắn với các sản phẩm của thương hiệu.',
      },
      {
        type: 'p',
        text: 'Theo lịch hoạt động được công bố, không gian đón khách từ 08:00 đến 20:30 hằng ngày. Du khách nên xác nhận trước giờ mở cửa và các hoạt động trải nghiệm nếu có kế hoạch ghé thăm.',
      },
      { type: 'h2', text: 'Tìm hiểu nghề làm nem và cảm hứng tranh dân gian Đông Hồ' },
      {
        type: 'p',
        text: 'Một trong những nội dung được Bùi Vị giới thiệu tại không gian di sản là câu chuyện về nghề làm nem truyền thống ở Thuận Thành. Qua việc tìm hiểu nguyên liệu và các công đoạn chế biến, khách tham quan có thể hiểu thêm về cách một món đặc sản địa phương được tạo nên.',
      },
      {
        type: 'p',
        text: 'Bên cạnh ẩm thực, tranh dân gian Đông Hồ cũng là nguồn cảm hứng trong thiết kế hộp quà của Bùi Vị. Những hình tượng dân gian và cách phối màu đặc trưng được đưa vào các phiên bản quà biếu, tạo nên sự kết nối giữa đặc sản Kinh Bắc với nghệ thuật truyền thống.',
      },
      {
        type: 'p',
        text: 'Theo chương trình trải nghiệm được giới thiệu, khách tham quan có thể tìm hiểu quy trình làm nem, trải nghiệm cuốn nem cùng lá sung và khám phá các hình ảnh, bản khắc gỗ liên quan đến tranh Đông Hồ. Du khách nên liên hệ trước để xác nhận lịch tổ chức và nội dung trải nghiệm thực tế.',
      },
      { type: 'h2', text: 'Dịch vụ quà tặng cá nhân hóa tại Bùi Vị' },
      {
        type: 'p',
        text: 'Ngoài hoạt động tham quan, Bùi Vị cung cấp các lựa chọn quà biếu dành cho khách hàng có nhu cầu tặng quà trong những dịp đặc biệt. Khách hàng có thể tìm hiểu sản phẩm trực tiếp tại không gian trưng bày hoặc đặt hàng qua website của thương hiệu.',
      },
      {
        type: 'p',
        text: 'Một trong những lựa chọn được giới thiệu là thiệp viết tay kèm lời chúc riêng, giúp cá nhân hóa món quà theo người nhận và dịp tặng. Với khách hàng doanh nghiệp, việc chuẩn bị quà biếu có thể được trao đổi trực tiếp với Bùi Vị để lựa chọn sản phẩm, số lượng và phương án giao hàng phù hợp.',
      },
      {
        type: 'p',
        text: 'Đối với sản phẩm nem, khách hàng nên tham khảo hướng dẫn bảo quản trên bao bì và xác nhận phương thức vận chuyển áp dụng cho đơn hàng cụ thể để đảm bảo sản phẩm được bảo quản theo yêu cầu.',
      },
      { type: 'h2', text: 'Ghé thăm Không gian Di sản Bùi Vị' },
      {
        type: 'p',
        text: 'Nếu muốn tìm hiểu thêm về đặc sản và văn hóa Kinh Bắc, du khách có thể đưa Không gian Di sản Bùi Vị tại Thuận Thành vào lịch trình tham quan. Trước chuyến đi, hãy liên hệ thương hiệu để xác nhận địa chỉ, giờ đón khách và các hoạt động trải nghiệm đang được tổ chức.',
      },
      {
        type: 'p',
        text: 'Khách hàng quan tâm đến nem bùi và các set quà biếu Bùi Vị cũng có thể tìm hiểu sản phẩm tại không gian trưng bày hoặc qua website chính thức của thương hiệu.',
      },
    ],
  },
];

export const ARTICLES: Article[] = RAW_ARTICLES.map((seed) => {
  const readingTime = calculateReadingTime(seed.content);
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    metaDescription: seed.metaDescription,
    excerpt: seed.metaDescription,
    category: seed.category,
    categorySlug: seed.categorySlug,
    content: seed.content,
    thumbnail: seed.thumbnail,
    heroSlotId: seed.heroSlotId,
    author: 'Bùi Vị',
    date: seed.date,
    publishedAt: seed.date,
    relatedProductSlug: seed.relatedProductSlug,
    inlineProductSlug: seed.relatedProductSlug,
    readingTime,
    readTime: readingTime,
  };
});

interface CsvArticleRow {
  id?: string;
  slug?: string;
  title?: string;
  metaDescription?: string;
  excerpt?: string;
  category?: string;
  date?: string;
  author?: string;
  relatedProductSlug?: string;
}

/**
 * Tải danh sách bài viết qua getArticles() (giữ cơ chế CSV fallback).
 * Nếu có file /data/articles.csv hợp lệ khớp với các bài viết chính thức thì đồng bộ,
 * ngược lại trả về 6 bài viết chính thức trong ARTICLES.
 */
export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch('/data/articles.csv', { cache: 'no-store' });
    if (!response.ok) return ARTICLES;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) return ARTICLES;

    const csvText = await response.text();
    if (!csvText.trim()) return ARTICLES;

    const parsed = Papa.parse<CsvArticleRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (!parsed.data || parsed.data.length === 0) return ARTICLES;

    const validSlugs = new Set(ARTICLES.map((a) => a.slug));
    const matchedRows = parsed.data.filter((row) => row.slug && validSlugs.has(row.slug));
    if (matchedRows.length === 0) return ARTICLES;

    return ARTICLES.map((article) => {
      const row = matchedRows.find((r) => r.slug === article.slug);
      if (!row) return article;
      const metaDesc = row.metaDescription || row.excerpt || article.metaDescription;
      const dateVal = row.date || article.date;
      return {
        ...article,
        title: row.title || article.title,
        metaDescription: metaDesc,
        excerpt: metaDesc,
        date: dateVal,
        publishedAt: dateVal,
        author: row.author || article.author,
        relatedProductSlug: row.relatedProductSlug || article.relatedProductSlug,
        inlineProductSlug: row.relatedProductSlug || article.inlineProductSlug,
      };
    });
  } catch {
    return ARTICLES;
  }
}
