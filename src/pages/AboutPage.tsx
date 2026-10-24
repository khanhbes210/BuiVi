import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ABOUT_CONTENT, QualityCommitment } from '../data/aboutContent';
import { PRODUCTS } from '../data/products';
import { MediaSlot } from '../components/MediaSlot';
import { ProductCard } from '../components/ProductCard';
import { AnimationSlot, Reveal, Stagger, WordRevealQuote } from '../motion';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = ABOUT_CONTENT.pageTitle;
  }, []);

  const suggestedProducts = ABOUT_CONTENT.suggestedSection.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const renderCommitmentIcon = (iconType: QualityCommitment['iconType']) => {
    switch (iconType) {
      case 'flame':
        return <Flame className="w-6 h-6" />;
      case 'check':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'shield':
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  return (
    <div lang="vi">
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* MediaSlot 'about-banner' (21:9) at the top of /ve-bui-vi — renders nothing when empty so H1 is above the fold (P0-3) */}
        <MediaSlot slotId="about-banner" />

        {/* SECTION 1: CÂU CHUYỆN BÙI VỊ (#cau-chuyen) */}
        <section
          id="cau-chuyen"
          className="scroll-mt-24 bg-[#FFFBF2] double-border-heritage rounded-3xl p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-7 space-y-5" lang="vi">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                <Award className="w-4 h-4 text-[#951722]" />
                <span>{ABOUT_CONTENT.heroBadge}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#951722] leading-tight mt-2">
                {ABOUT_CONTENT.slogan}
              </h1>
            </Reveal>

            <div className="space-y-4 max-w-[760px] text-[16px] md:text-[18px] text-[#171815]/90 leading-[1.75]">
              {/* Paragraph 1: Italic + Curly Quotes + Justified (.quote-lead) with word-by-word reveal */}
              <WordRevealQuote
                text={`“${ABOUT_CONTENT.leadQuoteParagraph}”`}
                className="story-justify quote-lead text-[#1F3D2A] bg-[#FFF5E4] p-4 rounded-xl border-l-4 border-[#951722]"
              />

              {/* Paragraph 2: Regular weight + Justified */}
              <Reveal delay={80}>
                <p lang="vi" className="story-justify md:text-[18px]">
                  {ABOUT_CONTENT.introParagraph}
                </p>
              </Reveal>

              {/* 3 Product Lines: Regular weight + Justified */}
              <Stagger className="space-y-2.5 pt-1">
                {ABOUT_CONTENT.productLines.map((line) => (
                  <p key={line.name} lang="vi" className="story-justify md:text-[18px]">
                    <span className="font-display text-[#951722] underline underline-offset-4">
                      • {line.name}:
                    </span>{' '}
                    {line.description}
                  </p>
                ))}
              </Stagger>
            </div>

            <Reveal delay={140}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/san-pham/set-doc-ban"
                  className="btn-sheen min-h-[52px] px-6 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] active:scale-[0.98] text-[#FFF5E4] text-[17px] tracking-[0.2px] leading-normal whitespace-nowrap inline-flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>Khám phá hộp lục giác</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/san-pham"
                  className="btn-sheen min-h-[52px] px-6 py-3 rounded-xl border-2 border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4] active:scale-[0.98] text-[17px] tracking-[0.2px] leading-normal whitespace-nowrap inline-flex items-center gap-2 transition-all"
                >
                  <span>Xem toàn bộ sản phẩm</span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: MediaSlot 'about-video' (16:9) */}
          <div className="lg:col-span-5 space-y-4">
            <Reveal>
              <MediaSlot slotId="about-video" />
            </Reveal>
            <Reveal delay={100}>
              <div className="p-4 rounded-xl bg-[#1F3D2A] text-[#FFF5E4]">
                <p lang="vi" className="story-justify font-display text-base text-[#F3D27A]">
                  {ABOUT_CONTENT.videoQuote}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 2: CAM KẾT CHẤT LƯỢNG (#cam-ket) */}
        <section id="cam-ket" className="scroll-mt-24 space-y-8">
          <Reveal>
            <div className="max-w-3xl mx-auto space-y-2">
              <span className="block text-center text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                {ABOUT_CONTENT.commitmentsSection.subtitle}
              </span>
              <h2 className="text-center font-display text-3xl md:text-4xl text-[#951722]">
                {ABOUT_CONTENT.commitmentsSection.title}
              </h2>
              <p lang="vi" className="story-justify text-base text-[#171815]/80 leading-[1.7] pt-1">
                {ABOUT_CONTENT.commitmentsSection.introParagraph}
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {ABOUT_CONTENT.commitmentsSection.items.map((item, idx) => (
              <div
                key={item.id}
                className="h-full bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 flex flex-col justify-between space-y-3 transition-transform duration-300 md:hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      idx % 2 === 0
                        ? 'bg-[#951722]/10 text-[#951722]'
                        : 'bg-[#1F3D2A]/10 text-[#1F3D2A]'
                    }`}
                  >
                    {renderCommitmentIcon(item.iconType)}
                  </div>
                  <h3 className="font-display text-xl text-[#171815] min-h-[52px]">{item.title}</h3>
                </div>
                <p lang="vi" className="story-justify text-sm text-[#171815]/85 leading-[1.7]">
                  {item.description}
                </p>
              </div>
            ))}
          </Stagger>
        </section>

        {/* SECTION 3: HÀNH TRÌNH BÙI VỊ (#hanh-trinh) + Animation Slot #11: about-timeline-ornament */}
        <section
          id="hanh-trinh"
          className="scroll-mt-24 bg-[#1F3D2A] text-[#FFF5E4] rounded-3xl p-6 md:p-12 space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <Reveal className="lg:col-span-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F3D27A]">
                {ABOUT_CONTENT.timelineSection.subtitle}
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-[#FFF5E4]">
                {ABOUT_CONTENT.timelineSection.title}
              </h2>
              <p
                lang="vi"
                className="story-justify text-sm sm:text-base text-[#FFF5E4]/85 leading-[1.7]"
              >
                {ABOUT_CONTENT.timelineSection.introParagraph}
              </p>
            </Reveal>

            <Reveal delay={100} className="lg:col-span-4">
              {/* Animation Slot #11: about-timeline-ornament */}
              <AnimationSlot id="about-timeline-ornament" />
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {ABOUT_CONTENT.timelineSection.steps.map((item, idx) => (
              <div
                key={idx}
                className="h-full p-5 rounded-2xl bg-[#FFF5E4]/10 border border-[#F3D27A]/35 flex flex-col justify-between space-y-2"
              >
                <div className="space-y-2">
                  <span className="font-price text-sm font-bold text-[#F3D27A] block">{item.step}</span>
                  <h3 className="font-display text-xl text-[#FFF5E4] min-h-[52px]">{item.title}</h3>
                </div>
                <p lang="vi" className="story-justify text-sm text-[#FFF5E4]/85 leading-[1.7]">
                  {item.description}
                </p>
              </div>
            ))}
          </Stagger>
        </section>

        {/* SECTION 4 (D3): GỢI Ý THƯỞNG THỨC VÀ TRAO QUÀ using shared <ProductCard/> */}
        <section id="goi-y-thuong-thuc" className="space-y-8">
          <Reveal>
            <div className="max-w-3xl mx-auto space-y-2">
              <span className="block text-center text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                {ABOUT_CONTENT.suggestedSection.subtitle}
              </span>
              <h2 className="text-center font-display text-3xl md:text-4xl text-[#951722]">
                {ABOUT_CONTENT.suggestedSection.title}
              </h2>
              <p lang="vi" className="story-justify text-base text-[#171815]/80 leading-[1.7] pt-1">
                {ABOUT_CONTENT.suggestedSection.introParagraph}
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
            {suggestedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Stagger>
        </section>
      </div>
    </div>
  );
};
