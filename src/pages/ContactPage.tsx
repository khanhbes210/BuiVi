import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { SITE_CONFIG, isPlaceholder } from '../data/siteConfig';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import { useStore } from '../context/StoreContext';
import { MOTION_TOKENS, Reveal, Stagger, useMotionPreferences } from '../motion';

const CONTACT_TOPICS = [
  {
    value: 'Đặt hàng quà biếu doanh nghiệp / số lượng lớn',
    label: 'Đặt hàng quà biếu doanh nghiệp / số lượng lớn',
    desc: 'Chiết khấu ưu đãi, in thiệp & đóng hộp lục giác giấy Điệp theo yêu cầu',
  },
  {
    value: 'Hỏi đáp về sản phẩm & bảo quản Nem Kinh Bắc',
    label: 'Hỏi đáp về sản phẩm & bảo quản Nem Kinh Bắc',
    desc: 'Tư vấn độ chín, cách thưởng thức và bảo quản lạnh chuẩn vị Bùi Xá',
  },
  {
    value: 'Tham quan Không gian Di sản Bùi Vị',
    label: 'Tham quan Không gian Di sản Bùi Vị',
    desc: 'Đặt lịch trải nghiệm quy trình gói nem lá sung & tranh Đông Hồ',
  },
  {
    value: 'Khác',
    label: 'Nội dung khác (Góp ý dịch vụ / Hợp tác đại lý)',
    desc: 'Các yêu cầu hỗ trợ đơn hàng hoặc đề xuất hợp tác thương mại',
  },
] as const;

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const { reducedMotion } = useMotionPreferences();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string>(CONTACT_TOPICS[0].value);
  const [topicOpen, setTopicOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [shakeForm, setShakeForm] = useState(false);
  const topicDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = 'Liên Hệ & Hệ Thống Cửa Hàng | BÙI VỊ – Quà Biếu Di Sản';
  }, []);

  useEffect(() => {
    if (!topicOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicDropdownRef.current &&
        !topicDropdownRef.current.contains(event.target as Node)
      ) {
        setTopicOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTopicOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [topicOpen]);

  const selectedTopicObj =
    CONTACT_TOPICS.find((item) => item.value === topic) || CONTACT_TOPICS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setError('Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Nội dung lời nhắn.');
      setShakeForm(false);
      requestAnimationFrame(() => {
        setShakeForm(true);
        setTimeout(() => setShakeForm(false), 360);
      });
      return;
    }
    setError('');
    setSubmitted(true);
    showToast('Đã gửi liên hệ thành công! Bùi Vị sẽ phản hồi quý khách sớm nhất.');
  };

  return (
    <div>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Page Header */}
        <Reveal>
          <div className="bg-[#FFFBF2] double-border-heritage rounded-3xl p-6 md:p-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
              Kết nối cùng Bùi Vị
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-[#951722]">
              Liên Hệ & Hệ Thống Không Gian Di Sản Bùi Vị
            </h1>
            <p className="text-base text-[#171815]/80 max-w-3xl">
              Quý khách cần hỗ trợ đặt hàng nhanh, khắc thiệp quà tặng số lượng lớn hoặc tìm hiểu về
              các dòng sản phẩm Nem Kinh Bắc? Hãy để lại lời nhắn hoặc ghé thăm trực tiếp hệ thống
              cửa hàng Bùi Vị.
            </p>
          </div>
        </Reveal>

        {/* TOP GRID: Form Liên Hệ (#form-lien-he) + Kênh Kết Nối (#kenh-ket-noi) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form Liên hệ (submit button text exactly "Gửi liên hệ") */}
          <section
            id="form-lien-he"
            className={`lg:col-span-7 scroll-mt-24 bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 md:p-8 space-y-5 ${
              shakeForm ? 'anim-shake-x' : ''
            }`}
          >
            <h2 className="font-display text-2xl text-[#951722]">Gửi Lời Nhắn / Hỏi Đáp</h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#1F3D2A] text-[#FFF5E4] space-y-3">
                <div className="flex items-center gap-2 text-[#F3D27A] font-bold text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Đã tiếp nhận thông tin liên hệ của quý khách!</span>
                </div>
                <p className="text-sm text-[#FFF5E4]/90 leading-relaxed">
                  Cảm ơn <strong>{fullName}</strong> ({phone}) đã gửi yêu cầu về chủ đề{' '}
                  <strong className="text-[#F3D27A]">{selectedTopicObj.label}</strong>. Bộ phận Chăm
                  sóc Khách hàng Bùi Vị sẽ liên hệ lại với quý khách trong vòng 30 phút làm việc.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FFF5E4] text-[#1F3D2A] font-bold text-xs cursor-pointer"
                >
                  Gửi câu hỏi khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="p-3 rounded-xl bg-[#9B0514]/10 border border-[#9B0514]/30 text-xs font-bold text-[#9B0514]">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
                      Họ và tên của bạn *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
                      Số điện thoại *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                    />
                  </div>
                </div>

                {/* Balanced 5/7 column split so "Chủ đề quan tâm" fits long Vietnamese labels comfortably */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-5">
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
                      Địa chỉ Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full min-h-[50px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                    />
                  </div>

                  {/* Custom Bùi Vị Heritage Dropdown for "Chủ đề quan tâm" */}
                  <div className="sm:col-span-7 relative" ref={topicDropdownRef}>
                    <label
                      id="contact-topic-label"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
                      Chủ đề quan tâm
                    </label>
                    <button
                      type="button"
                      id="contact-topic"
                      data-testid="contact-topic-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={topicOpen}
                      aria-labelledby="contact-topic-label"
                      onClick={() => setTopicOpen((prev) => !prev)}
                      className={`w-full min-h-[50px] px-3.5 py-2.5 rounded-xl bg-[#FFF5E4] border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                        topicOpen
                          ? 'border-[#951722] ring-2 ring-[#951722]/25 bg-[#FFFBF2]'
                          : 'border-[#951722]/35 hover:border-[#951722]/70'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0 flex-1">
                        <Sparkles className="w-4 h-4 text-[#951722] shrink-0" />
                        <span className="text-sm font-semibold text-[#171815] leading-snug break-words">
                          {selectedTopicObj.label}
                        </span>
                      </span>
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          topicOpen
                            ? 'bg-[#951722] text-[#FFF5E4]'
                            : 'bg-[#951722]/10 text-[#951722]'
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            topicOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {topicOpen && (
                        <motion.div
                          key="contact-topic-menu"
                          role="listbox"
                          aria-labelledby="contact-topic-label"
                          data-testid="contact-topic-listbox"
                          initial={
                            reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }
                          }
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={
                            reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }
                          }
                          transition={{
                            duration: MOTION_TOKENS.durations.fast,
                            ease: MOTION_TOKENS.easings.standard,
                          }}
                          className="absolute left-0 right-0 mt-2 z-30 rounded-2xl bg-[#FFFBF2] border-2 border-[#951722]/45 shadow-xl overflow-hidden divide-y divide-[#951722]/10"
                        >
                          <div className="px-3.5 py-2 bg-[#1F3D2A] text-[#F3D27A] text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
                            <span>Chọn chủ đề cần Bùi Vị tư vấn</span>
                            <span>{CONTACT_TOPICS.length} lựa chọn</span>
                          </div>
                          {CONTACT_TOPICS.map((item) => {
                            const isSelected = item.value === topic;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setTopic(item.value);
                                  setTopicOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#951722]/10 text-[#951722]'
                                    : 'hover:bg-[#FFF5E4] text-[#171815]'
                                }`}
                              >
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <p
                                    className={`text-sm leading-snug ${
                                      isSelected
                                        ? 'font-bold text-[#951722]'
                                        : 'font-semibold text-[#171815]'
                                    }`}
                                  >
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-[#171815]/65 leading-relaxed">
                                    {item.desc}
                                  </p>
                                </div>
                                <span
                                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                    isSelected
                                      ? 'bg-[#1F3D2A] border-[#1F3D2A] text-[#F3D27A]'
                                      : 'border-[#951722]/30 bg-[#FFFBF2]'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                </span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-msg"
                    className="block text-sm font-bold text-[#171815] mb-1.5"
                  >
                    Nội dung lời nhắn / câu hỏi *
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập nội dung cần hỗ trợ..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-sheen font-body min-h-[54px] min-w-[180px] px-7 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] active:scale-[0.98] text-[#FFF5E4] text-[17px] leading-normal tracking-[0.2px] whitespace-nowrap shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-5 h-5" />
                  <span>Gửi liên hệ</span>
                </button>
              </form>
            )}
          </section>

          {/* Right: Kênh Kết Nối Trực Tiếp (#kenh-ket-noi) — hides any placeholder row per P0-2 */}
          <section
            id="kenh-ket-noi"
            className="lg:col-span-5 scroll-mt-24 bg-[#1F3D2A] text-[#FFF5E4] rounded-2xl p-6 md:p-8 space-y-6"
          >
            <h2 className="font-display text-2xl text-[#F3D27A]">
              Hotline, Zalo & Fanpage Chính Thức
            </h2>

            <Stagger className="space-y-4 text-sm">
              {!isPlaceholder(SITE_CONFIG.contact.hotline) && (
                <div className="p-4 rounded-xl bg-[#FFF5E4]/10 border border-[#F3D27A]/30 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#F3D27A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#FFF5E4]/75 block">Hotline Đặt Hàng Nhanh:</span>
                    <a
                      href={`tel:${SITE_CONFIG.contact.hotline.replace(/\s+/g, '')}`}
                      className="font-body text-xl text-[#F3D27A] hover:underline"
                    >
                      {SITE_CONFIG.contact.hotline}
                    </a>
                  </div>
                </div>
              )}

              {!isPlaceholder(SITE_CONFIG.contact.zaloDisplay) &&
                !isPlaceholder(SITE_CONFIG.contact.zalo) && (
                  <div className="p-4 rounded-xl bg-[#FFF5E4]/10 border border-[#F3D27A]/30 flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-[#F3D27A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-[#FFF5E4]/75 block">
                        Zalo Official Account:
                      </span>
                      <a
                        href={SITE_CONFIG.contact.zalo}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-base text-[#FFF5E4] hover:text-[#F3D27A]"
                      >
                        {SITE_CONFIG.contact.zaloDisplay}
                      </a>
                    </div>
                  </div>
                )}

              {!isPlaceholder(SITE_CONFIG.contact.email) && (
                <div className="p-4 rounded-xl bg-[#FFF5E4]/10 border border-[#F3D27A]/30 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#F3D27A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#FFF5E4]/75 block">Email Chăm Sóc & B2B:</span>
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="font-bold text-base text-[#FFF5E4] hover:text-[#F3D27A]"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>
              )}

              {!isPlaceholder(SITE_CONFIG.contact.openingHours) && (
                <div className="p-4 rounded-xl bg-[#FFF5E4]/10 border border-[#F3D27A]/30 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#F3D27A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#FFF5E4]/75 block">Khung Giờ Phục Vụ:</span>
                    <span className="font-semibold">{SITE_CONFIG.contact.openingHours}</span>
                  </div>
                </div>
              )}
            </Stagger>
          </section>
        </div>

        {/* SECTION: Hệ Thống Cửa Hàng (#he-thong-cua-hang) */}
        <section id="he-thong-cua-hang" className="scroll-mt-24 space-y-6">
          <Reveal>
            <div className="border-b-2 border-[#951722]/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                Địa chỉ trải nghiệm & Mua trực tiếp
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-[#951722] mt-1">
                Hệ Thống Không Gian Di Sản & Cửa Hàng Bùi Vị
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SITE_CONFIG.stores.map((store, idx) => (
              <div
                key={idx}
                className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 space-y-3 shadow-xs transition-all duration-300 md:hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1F3D2A] text-[#F3D27A]">
                  Cơ sở {idx + 1}
                </span>
                <h3 className="font-display text-xl text-[#951722]">{store.name}</h3>
                {!isPlaceholder(store.address) && (
                  <p className="text-sm text-[#171815]/85 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#951722] shrink-0 mt-1" />
                    <span>{store.address}</span>
                  </p>
                )}
                {!isPlaceholder(store.phone) && (
                  <p className="text-sm text-[#171815]/85 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#1F3D2A] shrink-0" />
                    <span className="font-price">{store.phone}</span>
                  </p>
                )}
                {!isPlaceholder(store.hours) && (
                  <p className="text-xs text-[#171815]/70 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1F3D2A] shrink-0" />
                    <span>Giờ mở cửa: {store.hours}</span>
                  </p>
                )}
              </div>
            ))}
          </Stagger>
        </section>

        {/* SECTION: Bản Đồ Chỉ Đường (#ban-do) */}
        <section id="ban-do" className="scroll-mt-24 space-y-4">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-[#951722]">
              Bản Đồ Chỉ Đường Đến Làng Nghề Bùi Xá & Showroom
            </h2>
          </Reveal>
          <div className="bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <p className="font-display text-xl text-[#1F3D2A]">
                Không gian Di sản Bùi Vị – Thị xã Thuận Thành, Tỉnh Bắc Ninh
              </p>
              <p className="text-sm text-[#171815]/80 leading-relaxed">
                Cách trung tâm Thủ đô Hà Nội 35 phút di chuyển theo hướng Quốc lộ 17. Quý khách đoàn
                tham quan hoặc đặt tiệc trải nghiệm gói nem lá sung vui lòng liên hệ trước qua
                Hotline để Bùi Vị chuẩn bị chu đáo nhất.
              </p>
            </div>
            <a
              href="#form-lien-he"
              className="btn-sheen px-6 py-3 rounded-xl bg-[#951722] text-[#FFF5E4] font-bold text-sm hover:bg-[#9B0514] whitespace-nowrap transition-colors"
            >
              Đặt lịch hẹn tham quan
            </a>
          </div>
        </section>
      </div>

      {/* Featured Products Block */}
      <FeaturedProductsBlock />
    </div>
  );
};
