import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Search,
  X,
  Link2,
  Check,
  List,
  ExternalLink,
} from 'lucide-react';
import {
  ARTICLES,
  ARTICLE_CATEGORY_MAP,
  Article,
  ArticleContentBlock,
  getArticles,
  resolveArticleTokens,
} from '../data/articles';
import {
  PRODUCTS,
  findProductBySlug,
  removeVietnameseTones,
} from '../data/products';
import { MediaSlot } from '../components/MediaSlot';
import { ProductCard } from '../components/ProductCard';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import { AddToCartButton } from '../components/AddToCartButton';
import { BuyNowButton } from '../components/BuyNowButton';
import { useStore } from '../context/StoreContext';
import {
  AnimationSlot,
  Reveal,
  Stagger,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

function normalizeCategoryParam(param: string | null): string {
  if (!param || param === 'all' || param === 'Tất cả') return 'all';
  const found = ARTICLE_CATEGORY_MAP.find(
    (c) =>
      c.slug === param ||
      c.label === param ||
      removeVietnameseTones(c.label) === removeVietnameseTones(param)
  );
  return found ? found.slug : 'all';
}

function setDocumentMeta(title: string, description: string) {
  document.title = title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);
}

/**
 * Chỉ áp dụng trong Bài viết 5 (bui-vi-ra-mat-bo-suu-tap-qua-tet-2027):
 * - Cụm từ "Combo 3 Set Quà Di Sản" dẫn tới /san-pham/combo-3-hop-qua
 * - Cụm từ "Mã QUATET15" dẫn tới /khuyen-mai#ma-voucher-QUATET15
 * - Cụm từ "Mã COMBO3" dẫn tới /khuyen-mai#ma-voucher-COMBO3
 * Giữ nguyên tuyệt đối từng ký tự văn bản.
 */
function renderArticle5LinkedText(text: string): React.ReactNode {
  const tokenRegex = /(Combo 3 Set Quà Di Sản|Mã QUATET15|Mã COMBO3)/g;
  const parts = text.split(tokenRegex);
  return parts.map((part, idx) => {
    if (part === 'Combo 3 Set Quà Di Sản') {
      return (
        <Link
          key={idx}
          to="/san-pham/combo-3-hop-qua"
          className="text-[#951722] underline underline-offset-4 hover:text-[#9B0514]"
        >
          {part}
        </Link>
      );
    }
    if (part === 'Mã QUATET15') {
      return (
        <Link
          key={idx}
          to="/khuyen-mai#ma-voucher-QUATET15"
          className="text-[#951722] underline underline-offset-4 hover:text-[#9B0514]"
        >
          {part}
        </Link>
      );
    }
    if (part === 'Mã COMBO3') {
      return (
        <Link
          key={idx}
          to="/khuyen-mai#ma-voucher-COMBO3"
          className="text-[#951722] underline underline-offset-4 hover:text-[#9B0514]"
        >
          {part}
        </Link>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const ArticleListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { reducedMotion } = useMotionPreferences();
  const rawCatParam = searchParams.get('chuyen-muc');
  const activeCatSlug = normalizeCategoryParam(rawCatParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  useEffect(() => {
    let mounted = true;
    getArticles().then((loaded) => {
      if (mounted) setArticles(loaded);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const activeCatObj =
      ARTICLE_CATEGORY_MAP.find((c) => c.slug === activeCatSlug) || ARTICLE_CATEGORY_MAP[0];
    const pageTitle =
      activeCatObj.slug === 'all'
        ? 'Bài viết văn hóa ẩm thực & bí quyết | Bùi Vị'
        : `${activeCatObj.label} | Bùi Vị`;
    setDocumentMeta(
      pageTitle,
      'Khám phá các bài viết về văn hóa ẩm thực Kinh Bắc, nghệ thuật giấy Điệp Đông Hồ, bí quyết bảo quản nem và bộ sưu tập quà biếu Bùi Vị.'
    );
  }, [activeCatSlug]);

  const handleSelectCat = (catSlug: string) => {
    if (catSlug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ 'chuyen-muc': catSlug });
    }
  };

  const filteredArticles = useMemo(() => {
    const byCat =
      activeCatSlug === 'all'
        ? articles
        : articles.filter((a) => a.categorySlug === activeCatSlug);

    const q = removeVietnameseTones(searchQuery.trim());
    if (!q) return byCat;

    return byCat.filter((a) => {
      const haystack = removeVietnameseTones(
        `${a.title} ${a.excerpt} ${a.category}`
      );
      return haystack.includes(q);
    });
  }, [articles, activeCatSlug, searchQuery]);

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner MediaSlot at top of /bai-viet — renders nothing when empty so H1 is above the fold (P0-3) */}
        <MediaSlot slotId="blog-banner" />

        {/* Header, Category Tabs & Accent-Insensitive Search Bar */}
        <Reveal>
          <div className="bg-[#FFFBF2] double-border-heritage rounded-2xl p-6 md:p-8 space-y-5">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#1F3D2A]">
                Chuyên mục Bài viết Bùi Vị
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-[#951722]">
                Bài Viết Văn Hóa Ẩm Thực & Bí Quyết Kinh Bắc
              </h1>
            </div>

            {/* Category Filter Chips with shared layoutId sliding pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              {ARTICLE_CATEGORY_MAP.map((cat) => {
                const isActive = activeCatSlug === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleSelectCat(cat.slug)}
                    className={`relative min-h-[44px] px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#FFF5E4]'
                        : 'bg-[#FFF5E4] border border-[#951722]/25 text-[#171815] hover:border-[#951722]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="article-cat-pill"
                        transition={{
                          duration: reducedMotion ? 0.1 : 0.26,
                          ease: MOTION_TOKENS.easings.standard,
                        }}
                        className="absolute inset-0 rounded-xl bg-[#951722]"
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Accent-Insensitive Search Bar above the grid */}
            <div className="relative">
              <Search className="w-5 h-5 text-[#951722] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết: nem bùi, giấy điệp, bảo quản nem, quà tết…"
                aria-label="Tìm kiếm bài viết"
                className="w-full h-[52px] pl-12 pr-12 rounded-xl bg-[#FFF5E4] border-2 border-[#951722]/30 text-base text-[#171815] placeholder:text-[#171815]/50 focus:outline-none focus:border-[#951722]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-[#171815]/70 hover:text-[#951722] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {filteredArticles.length === 0 ? (
          <div className="bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl p-8 text-center space-y-4">
            <AnimationSlot id="search-empty" className="max-w-[220px] mx-auto" />
            <p className="font-display text-2xl text-[#951722]">
              Không tìm thấy bài viết phù hợp
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                handleSelectCat('all');
              }}
              className="btn-sheen min-h-[48px] px-6 py-2.5 rounded-xl bg-[#951722] text-[#FFF5E4] text-base cursor-pointer"
            >
              Xem tất cả 6 bài viết
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* First Article Large (Featured) */}
            {featuredArticle && (
              <Reveal>
                <article
                  data-testid="featured-article-card"
                  className="bg-[#FFFBF2] double-border-heritage rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 md:p-6 items-center transition-transform duration-300 md:hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="lg:col-span-7">
                    <MediaSlot
                      slotId={featuredArticle.thumbnail}
                      type="banner"
                      aspectRatio="16/10"
                      link={`/bai-viet/${featuredArticle.slug}`}
                    />
                  </div>
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#1F3D2A]">
                        <span className="px-2.5 py-1 rounded-md bg-[#1F3D2A] text-[#FFF5E4]">
                          {featuredArticle.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredArticle.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{featuredArticle.readingTime}</span>
                      </div>

                      <Link
                        to={`/bai-viet/${featuredArticle.slug}`}
                        className="font-display text-2xl md:text-3xl text-[#171815] hover:text-[#951722] transition-colors block leading-snug"
                      >
                        {featuredArticle.title}
                      </Link>

                      <p
                        lang="vi"
                        className="story-justify text-base text-[#171815]/85 leading-relaxed"
                      >
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/bai-viet/${featuredArticle.slug}`}
                        className="btn-sheen inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] text-base transition-colors group"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            )}

            {/* Remaining Articles in a 2–3 Column Grid */}
            {gridArticles.length > 0 && (
              <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {gridArticles.map((article) => (
                  <article
                    key={article.id}
                    data-testid="grid-article-card"
                    className="bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 md:hover:-translate-y-1 hover:shadow-md"
                  >
                    <div>
                      <div className="p-3 pb-0">
                        <MediaSlot
                          slotId={article.thumbnail}
                          type="banner"
                          aspectRatio="16/10"
                          link={`/bai-viet/${article.slug}`}
                        />
                      </div>
                      <div className="p-5 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#1F3D2A]">
                          <span className="px-2 py-0.5 rounded bg-[#1F3D2A]/10 text-[#1F3D2A]">
                            {article.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{article.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{article.readingTime}</span>
                        </div>
                        <Link
                          to={`/bai-viet/${article.slug}`}
                          className="font-display text-[20px] text-[#171815] hover:text-[#951722] block leading-[1.35]"
                        >
                          {article.title}
                        </Link>
                        <p
                          lang="vi"
                          className="story-justify text-base text-[#171815]/80 line-clamp-3 leading-[1.75]"
                        >
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2">
                      <Link
                        to={`/bai-viet/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-base text-[#951722] hover:text-[#9B0514] underline underline-offset-4 group"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </Stagger>
            )}
          </div>
        )}
      </div>

      {/* FeaturedProductsBlock at the bottom */}
      <FeaturedProductsBlock />
    </div>
  );
};

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useStore();
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeTocId, setActiveTocId] = useState<string>('muc-1');

  useEffect(() => {
    let mounted = true;
    getArticles().then((loaded) => {
      if (mounted) setArticles(loaded);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const currentIndex = useMemo(() => {
    const idx = articles.findIndex((a) => a.slug === slug);
    return idx >= 0 ? idx : 0;
  }, [articles, slug]);

  const article = articles[currentIndex] || articles[0];
  const relatedProduct =
    findProductBySlug(article.relatedProductSlug) || PRODUCTS[0];

  const prevArticle =
    currentIndex > 0 ? articles[currentIndex - 1] : articles[articles.length - 1];
  const nextArticle =
    currentIndex < articles.length - 1 ? articles[currentIndex + 1] : articles[0];

  // Set <title> = article title + " | Bùi Vị" and metaDescription ONLY in <meta> / og:description
  useEffect(() => {
    setDocumentMeta(`${article.title} | Bùi Vị`, article.metaDescription);
  }, [article]);

  // Top reading progress bar (3px heritage red) & active TOC section tracking
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setReadingProgress(ratio);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [article.slug]);

  // Build Table of Contents from H2 blocks
  const tocItems = useMemo(() => {
    let h2Counter = 0;
    return article.content
      .filter((b): b is { type: 'h2'; text: string } => b.type === 'h2')
      .map((b) => {
        h2Counter += 1;
        return {
          id: `muc-${h2Counter}`,
          text: resolveArticleTokens(b.text),
          index: h2Counter,
        };
      });
  }, [article]);

  // Observe H2 headings to highlight current section in Sticky TOC
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveTocId(entry.target.id);
          }
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  // Determine the exact block index where the 2nd H2 section ends (right before the 3rd H2 block)
  const inlineCardInsertIndex = useMemo(() => {
    let h2Seen = 0;
    for (let i = 0; i < article.content.length; i += 1) {
      if (article.content[i].type === 'h2') {
        h2Seen += 1;
        if (h2Seen === 3) {
          return i;
        }
      }
    }
    return article.content.length;
  }, [article]);

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    showToast('Đã sao chép liên kết bài viết!');
    setTimeout(() => setCopied(false), 2500);
  };

  const isArticle5 = article.slug === 'bui-vi-ra-mat-bo-suu-tap-qua-tet-2027';
  const isArticle6 = article.slug === 'khong-gian-di-san-bui-vi-thuan-thanh';

  let h2RenderCounter = 0;

  const renderBlock = (block: ArticleContentBlock, idx: number) => {
    if (block.type === 'h2') {
      h2RenderCounter += 1;
      const anchorId = `muc-${h2RenderCounter}`;
      const resolvedHeading = resolveArticleTokens(block.text);
      return (
        <h2
          key={idx}
          id={anchorId}
          className="scroll-mt-28 font-display text-[28px] leading-[1.35] text-[#951722] pt-4"
        >
          {resolvedHeading}
        </h2>
      );
    }

    if (block.type === 'p') {
      const resolvedParagraph = resolveArticleTokens(block.text);
      return (
        <p
          key={idx}
          lang="vi"
          className="story-justify text-[16px] md:text-[18px] leading-[1.75] text-[#171815]"
        >
          {isArticle5
            ? renderArticle5LinkedText(resolvedParagraph)
            : resolvedParagraph}
        </p>
      );
    }

    if (block.type === 'ul') {
      return (
        <ul
          key={idx}
          lang="vi"
          className="list-disc pl-6 space-y-3 text-[16px] md:text-[18px] leading-[1.75] text-[#171815]"
        >
          {block.items.map((rawItem, itemIdx) => {
            const resolvedItem = resolveArticleTokens(rawItem);
            const colonIndex = resolvedItem.indexOf(':');
            if (colonIndex !== -1) {
              const labelPart = resolvedItem.slice(0, colonIndex + 1);
              const restPart = resolvedItem.slice(colonIndex + 1);
              return (
                <li key={itemIdx} className="story-justify">
                  <span className="text-[#951722]">
                    {isArticle5 ? renderArticle5LinkedText(labelPart) : labelPart}
                  </span>
                  <span>
                    {isArticle5 ? renderArticle5LinkedText(restPart) : restPart}
                  </span>
                </li>
              );
            }
            return (
              <li key={itemIdx} className="story-justify">
                {isArticle5 ? renderArticle5LinkedText(resolvedItem) : resolvedItem}
              </li>
            );
          })}
        </ul>
      );
    }

    return null;
  };

  const inlineProductCardNode = (
    <aside
      key="inline-product-card"
      data-testid="article-inline-product-card"
      aria-label="Sản phẩm gợi ý trong bài viết"
      className="my-8 p-4 sm:p-5 rounded-2xl bg-[#FFFBF2] double-border-heritage space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-widest text-[#1F3D2A]">
          Sản phẩm di sản liên quan
        </span>
        <Link
          to={`/san-pham/${relatedProduct.slug}`}
          className="inline-flex items-center gap-1 text-sm text-[#951722] hover:text-[#9B0514] underline underline-offset-4"
        >
          <span>Xem sản phẩm</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
      <ProductCard product={relatedProduct} />
    </aside>
  );

  return (
    <div>
      {/* Top 3px Heritage Red Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none"
      >
        <div
          className="h-full bg-[#951722] origin-left transition-transform duration-150"
          style={{ transform: `scaleX(${readingProgress})` }}
        />
      </div>

      <article className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Article Header: Category chip, single H1, "Bùi Vị · DD/MM/YYYY · X phút đọc" */}
        <header className="max-w-[760px] mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to={`/bai-viet?chuyen-muc=${article.categorySlug}`}
              className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-[#951722] text-[#FFF5E4] text-xs uppercase tracking-wider hover:bg-[#9B0514] transition-colors"
            >
              {article.category}
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-xs text-[#171815] hover:border-[#951722] hover:text-[#951722] cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1F3D2A]" />
                  <span>Xong</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-[#951722]" />
                  <span>Sao chép liên kết</span>
                </>
              )}
            </button>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-[#951722] leading-snug">
            {article.title}
          </h1>

          <p className="text-sm text-[#1F3D2A]">
            {article.author} · {article.date} · {article.readingTime}
          </p>
        </header>

        {/* Hero MediaSlot (16:9) under the title */}
        <div className="max-w-4xl mx-auto">
          <MediaSlot
            slotId={article.heroSlotId}
            type="banner"
            aspectRatio="16/9"
            alt={article.title}
          />
        </div>

        {/* Main Content Grid: Sticky TOC on Desktop + Collapsed TOC on Mobile + 760px Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Desktop Sticky Table of Contents with active section indicator */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28">
            <div className="bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm text-[#951722] border-b border-[#951722]/15 pb-2.5">
                <List className="w-4 h-4 shrink-0" />
                <span>Mục lục bài viết</span>
              </div>
              <nav aria-label="Mục lục bài viết">
                <ol className="space-y-2.5 text-sm text-[#171815]">
                  {tocItems.map((item) => {
                    const isCurrent = activeTocId === item.id;
                    return (
                      <li key={item.id} className="relative pl-3">
                        {isCurrent && (
                          <motion.span
                            layoutId="toc-active-bar"
                            className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[#951722]"
                          />
                        )}
                        <a
                          href={`#${item.id}`}
                          onClick={() => setActiveTocId(item.id)}
                          className={`block transition-colors leading-snug ${
                            isCurrent
                              ? 'text-[#951722]'
                              : 'text-[#171815] hover:text-[#951722]'
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <div className="pt-3 border-t border-[#951722]/15">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-xs text-[#171815] hover:border-[#951722] hover:text-[#951722] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#1F3D2A]" />
                      <span className="font-semibold text-[#1F3D2A]">Xong</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 text-[#951722]" />
                      <span>Chia sẻ (Sao chép liên kết)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>

          {/* Article Body Column (max-w-[760px]) */}
          <div className="lg:col-span-8 w-full max-w-[760px] mx-auto space-y-6">
            {/* Mobile Collapsible Table of Contents (collapsed by default) */}
            <details className="lg:hidden bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl p-4">
              <summary className="text-base text-[#951722] cursor-pointer flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>Mục lục bài viết ({tocItems.length} phần)</span>
                </span>
              </summary>
              <nav
                aria-label="Mục lục bài viết di động"
                className="pt-3 mt-3 border-t border-[#951722]/15"
              >
                <ol className="space-y-2.5 text-sm text-[#171815]">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block hover:text-[#951722] leading-snug"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>

            {/* Body Blocks with Inline Product Card inserted automatically after the 2nd H2 section */}
            <div
              data-testid="article-body-content"
              lang="vi"
              className="bg-[#FFFBF2] border border-[#951722]/20 rounded-2xl p-6 md:p-10 space-y-5"
            >
              {article.content.slice(0, inlineCardInsertIndex).map((block, idx) =>
                renderBlock(block, idx)
              )}

              {inlineProductCardNode}

              {article.content.slice(inlineCardInsertIndex).map((block, idx) =>
                renderBlock(block, inlineCardInsertIndex + idx)
              )}
            </div>

            {/* End-of-article CTA row: two large buttons "Mua ngay" and "Thêm vào giỏ" for the related product + small "Xem sản phẩm" link (+ "Liên hệ Bùi Vị" in Article 6) */}
            <section
              data-testid="article-end-cta"
              className="bg-[#FFFBF2] double-border-heritage rounded-2xl p-6 md:p-8 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#1F3D2A] block">
                    Trải nghiệm đặc sản & quà biếu di sản Bùi Vị
                  </span>
                  <h3 className="font-display text-2xl text-[#951722] mt-1">
                    {relatedProduct.name}
                  </h3>
                </div>
                <Link
                  to={`/san-pham/${relatedProduct.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-[#951722] hover:text-[#9B0514] underline underline-offset-4"
                >
                  <span>Xem sản phẩm</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <BuyNowButton
                  product={relatedProduct}
                  size="lg"
                  className="flex-1 sm:flex-initial min-w-[180px]"
                />
                <AddToCartButton
                  product={relatedProduct}
                  size="lg"
                  className="flex-1 sm:flex-initial min-w-[180px]"
                />
              </div>

              {isArticle6 && (
                <div className="pt-2 border-t border-[#951722]/15">
                  <Link
                    to="/lien-he"
                    className="inline-flex items-center gap-1.5 text-base text-[#951722] hover:text-[#9B0514] underline underline-offset-4"
                  >
                    <span>Liên hệ Bùi Vị</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </section>

            {/* Share row (copy link only) */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-[#951722]/20">
              <span className="text-sm text-[#171815]/80">
                Tác giả: {article.author} · Ngày đăng: {article.date}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-sm text-[#951722] hover:bg-[#951722] hover:text-[#FFF5E4] inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#1F3D2A]" />
                    <span className="font-semibold text-[#1F3D2A]">Xong</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>Sao chép liên kết bài viết</span>
                  </>
                )}
              </button>
            </div>

            {/* Prev / Next Article Navigation */}
            <nav
              aria-label="Điều hướng bài viết trước và tiếp theo"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
            >
              {prevArticle && (
                <Link
                  to={`/bai-viet/${prevArticle.slug}`}
                  className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#951722]/25 hover:border-[#951722] transition-colors flex flex-col justify-between space-y-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#1F3D2A]">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Bài viết trước</span>
                  </span>
                  <span className="font-display text-base text-[#171815] hover:text-[#951722] line-clamp-2">
                    {prevArticle.title}
                  </span>
                </Link>
              )}

              {nextArticle && (
                <Link
                  to={`/bai-viet/${nextArticle.slug}`}
                  className="p-4 rounded-2xl bg-[#FFFBF2] border border-[#951722]/25 hover:border-[#951722] transition-colors flex flex-col justify-between space-y-2 sm:text-right"
                >
                  <span className="inline-flex items-center sm:justify-end gap-1.5 text-xs text-[#1F3D2A]">
                    <span>Bài viết tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-display text-base text-[#171815] hover:text-[#951722] line-clamp-2">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </article>

      {/* FeaturedProductsBlock at the bottom */}
      <FeaturedProductsBlock />
    </div>
  );
};
