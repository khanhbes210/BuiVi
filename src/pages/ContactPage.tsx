import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { SITE_CONFIG, isPlaceholder } from '../data/siteConfig';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import { useStore } from '../context/StoreContext';
import { Reveal, Stagger } from '../motion';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Đặt hàng quà biếu doanh nghiệp / số lượng lớn');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [shakeForm, setShakeForm] = useState(false);

  useEffect(() => {
    document.title = 'Liên Hệ & Hệ Thống Cửa Hàng | BÙI VỊ – Quà Biếu Di Sản';
  }, []);

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
                  Cảm ơn <strong>{fullName}</strong> ({phone}). Bộ phận Chăm sóc Khách hàng Bùi Vị
                  sẽ liên hệ lại với quý khách trong vòng 30 phút làm việc.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
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
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#951722]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
                      Chủ đề quan tâm
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full min-h-[48px] px-3 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#951722]"
                    >
                      <option value="Đặt hàng quà biếu doanh nghiệp / số lượng lớn">
                        Đặt hàng quà biếu doanh nghiệp / số lượng lớn
                      </option>
                      <option value="Hỏi đáp về sản phẩm & bảo quản Nem Kinh Bắc">
                        Hỏi đáp về sản phẩm & bảo quản Nem Kinh Bắc
                      </option>
                      <option value="Tham quan Không gian Di sản Bùi Vị">
                        Tham quan Không gian Di sản Bùi Vị
                      </option>
                      <option value="Khác">Nội dung khác</option>
                    </select>
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

              {(!isPlaceholder(SITE_CONFIG.contact.email) ||
                !isPlaceholder(SITE_CONFIG.contact.fanpageDisplay)) && (
                <div className="p-4 rounded-xl bg-[#FFF5E4]/10 border border-[#F3D27A]/30 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#F3D27A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#FFF5E4]/75 block">Email & Fanpage:</span>
                    {!isPlaceholder(SITE_CONFIG.contact.email) && (
                      <p className="font-bold">{SITE_CONFIG.contact.email}</p>
                    )}
                    {!isPlaceholder(SITE_CONFIG.contact.fanpageDisplay) && (
                      <p className="text-xs text-[#F3D27A] mt-0.5">
                        Fanpage: {SITE_CONFIG.contact.fanpageDisplay}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!isPlaceholder(SITE_CONFIG.contact.workingHours) && (
                <div className="p-4 rounded-xl bg-[#FFF5E4]/10 border border-[#F3D27A]/30 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#F3D27A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#FFF5E4]/75 block">Khung giờ phục vụ:</span>
                    <p className="font-semibold">{SITE_CONFIG.contact.workingHours}</p>
                  </div>
                </div>
              )}
            </Stagger>
          </section>
        </div>

        {/* HỆ THỐNG CỬA HÀNG (#he-thong-cua-hang) — renders only store.visible === true and hides placeholder fields (P0-2) */}
        <section id="he-thong-cua-hang" className="scroll-mt-24 space-y-6">
          <Reveal>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                Địa chỉ trải nghiệm & Mua trực tiếp
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-[#951722] mt-1">
                Hệ Thống Cửa Hàng & Xưởng Chế Tác Bùi Vị
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-6">
            {SITE_CONFIG.stores
              .filter((store) => store.visible)
              .map((store) => {
                const hasRealMap =
                  !isPlaceholder(store.mapQuery) &&
                  (store.mapQuery.startsWith('http') || /^[0-9.,\s+-]+$/.test(store.mapQuery));

                return (
                  <div
                    key={store.id}
                    className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-4 transition-transform duration-300 md:hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <h3 className="font-display text-2xl text-[#951722]">{store.name}</h3>

                      {!isPlaceholder(store.address) && (
                        <p className="text-base text-[#171815] flex items-start gap-2.5">
                          <MapPin className="w-5 h-5 text-[#1F3D2A] shrink-0 mt-0.5" />
                          <span>{store.address}</span>
                        </p>
                      )}

                      {!isPlaceholder(store.phone) && (
                        <p className="text-sm text-[#171815] flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-[#951722] shrink-0" />
                          <span className="font-body">{store.phone}</span>
                        </p>
                      )}

                      {!isPlaceholder(store.hours) && (
                        <p className="text-sm text-[#171815]/80 flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-[#1F3D2A] shrink-0" />
                          <span>{store.hours}</span>
                        </p>
                      )}

                      {!isPlaceholder(store.note) && (
                        <p className="text-sm text-[#1F3D2A] bg-[#FFF5E4] p-3.5 rounded-xl border border-[#1F3D2A]/20">
                          {store.note}
                        </p>
                      )}
                    </div>

                    {hasRealMap && (
                      <div className="h-44 rounded-xl bg-[#F5E6CC] border border-[#951722]/25 relative overflow-hidden flex items-center justify-center p-4 text-center">
                        <p className="text-xs font-bold text-[#171815]">{store.mapQuery}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </Stagger>
        </section>
      </div>

      <FeaturedProductsBlock />
    </div>
  );
};
