import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  KeyRound,
  Ticket,
} from 'lucide-react';
import { useStore, UserAddress } from '../context/StoreContext';
import { formatCurrency } from '../data/products';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import { HeritageDropdown, PROVINCE_OPTIONS } from '../components/HeritageDropdown';

export const AccountPage: React.FC = () => {
  const { subpage } = useParams<{ subpage?: string }>();
  const navigate = useNavigate();
  const {
    user,
    orders,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    saveVoucherForLater,
  } = useStore();

  const activeTab =
    subpage || (user ? 'ho-so' : 'dang-nhap');

  useEffect(() => {
    document.title = 'Tài Khoản Thành Viên | BÙI VỊ – Quà Biếu Di Sản';
  }, [activeTab]);

  // Login State
  const [loginIdentity, setLoginIdentity] = useState('0912345678');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');

  // Register State (3 steps: info -> otp -> result)
  const [regStep, setRegStep] = useState<'info' | 'otp' | 'done'>('info');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regOtp, setRegOtp] = useState('123456');
  const [regError, setRegError] = useState('');

  // Profile Edit State
  const [profName, setProfName] = useState(user?.fullName || '');
  const [profPhone, setProfPhone] = useState(user?.phone || '');
  const [profEmail, setProfEmail] = useState(user?.email || '');

  // Address CRUD State
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrProvince, setAddrProvince] = useState('TP. Hà Nội');
  const [addrDistrict, setAddrDistrict] = useState('');
  const [addrWard, setAddrWard] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  useEffect(() => {
    if (user) {
      setProfName(user.fullName);
      setProfPhone(user.phone);
      setProfEmail(user.email);
    }
  }, [user]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === '000000') {
      setLoginError('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      return;
    }
    const res = loginUser(loginIdentity, loginPassword);
    if (!res.ok) {
      setLoginError(res.message);
    } else {
      setLoginError('');
      navigate('/tai-khoan/ho-so');
    }
  };

  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPass.trim()) {
      setRegError('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Mật khẩu.');
      return;
    }
    if (regPass.length < 6) {
      setRegError('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }
    setRegError('');
    setRegStep('otp');
  };

  const handleRegisterVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (regOtp.trim() !== '123456') {
      setRegError('Mã xác thực OTP không đúng (Mã thử nghiệm mặc định: 123456).');
      return;
    }
    setRegError('');
    registerUser({
      fullName: regName,
      phone: regPhone,
      email: regEmail || 'thanhvien@buivi.vn',
      password: regPass,
    });
    saveVoucherForLater('THANHVIEN50');
    setRegStep('done');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim() || !addrPhone.trim() || !addrStreet.trim()) return;
    if (editingAddress) {
      updateAddress({
        id: editingAddress.id,
        recipientName: addrName,
        phone: addrPhone,
        province: addrProvince,
        district: addrDistrict || 'Quận Hoàn Kiếm',
        ward: addrWard || 'Phường Hàng Trống',
        streetAddress: addrStreet,
        isDefault: addrDefault,
      });
    } else {
      addAddress({
        recipientName: addrName,
        phone: addrPhone,
        province: addrProvince,
        district: addrDistrict || 'Quận Hoàn Kiếm',
        ward: addrWard || 'Phường Hàng Trống',
        streetAddress: addrStreet,
        isDefault: addrDefault,
      });
    }
    setShowAddrForm(false);
    setEditingAddress(null);
  };

  return (
    <div>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-4 bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-5 space-y-4">
            <div className="pb-4 border-b border-[#951722]/15">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
                Không gian thành viên Bùi Vị
              </p>
              <h1 className="font-display text-2xl text-[#951722] mt-1">
                {user ? user.fullName : 'Tài Khoản Của Bạn'}
              </h1>
              {user && <p className="text-xs text-[#171815]/70 mt-0.5">{user.phone} · {user.email}</p>}
            </div>

            <nav className="space-y-1.5">
              {!user ? (
                <>
                  <Link
                    to="/tai-khoan/dang-nhap"
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                      activeTab === 'dang-nhap'
                        ? 'bg-[#951722] text-[#FFF5E4]'
                        : 'hover:bg-[#FFF5E4] text-[#171815]'
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Đăng nhập</span>
                  </Link>
                  <Link
                    to="/tai-khoan/dang-ky"
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                      activeTab === 'dang-ky'
                        ? 'bg-[#951722] text-[#FFF5E4]'
                        : 'hover:bg-[#FFF5E4] text-[#171815]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Đăng ký thành viên mới</span>
                  </Link>
                </>
              ) : null}

              <Link
                to="/tai-khoan/ho-so"
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'ho-so'
                    ? 'bg-[#951722] text-[#FFF5E4]'
                    : 'hover:bg-[#FFF5E4] text-[#171815]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Hồ sơ cá nhân</span>
              </Link>

              <Link
                to="/tai-khoan/don-hang"
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'don-hang'
                    ? 'bg-[#951722] text-[#FFF5E4]'
                    : 'hover:bg-[#FFF5E4] text-[#171815]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Đơn hàng của tôi ({orders.length})</span>
              </Link>

              <Link
                to="/tai-khoan/so-dia-chi"
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                  activeTab === 'so-dia-chi'
                    ? 'bg-[#951722] text-[#FFF5E4]'
                    : 'hover:bg-[#FFF5E4] text-[#171815]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Sổ địa chỉ nhận hàng</span>
              </Link>

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    navigate('/tai-khoan/dang-nhap');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm text-[#9B0514] hover:bg-[#9B0514]/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              )}
            </nav>

            {/* Member Voucher Highlight */}
            <div className="p-4 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-[#F3D27A]">
                <Ticket className="w-4 h-4" />
                <span>
                  Đặc quyền mã <span className="font-display">THANHVIEN50</span>
                </span>
              </div>
              <p className="text-[#FFF5E4]/85">
                Thành viên mới được giảm ngay <span className="font-price">50.000đ</span> cho đơn hàng đầu tiên từ <span className="font-price">400.000đ</span>.
              </p>
            </div>
          </aside>

          {/* RIGHT MAIN PANEL */}
          <div className="lg:col-span-8 bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-6 md:p-8">
            {/* 1. ĐĂNG NHẬP */}
            {activeTab === 'dang-nhap' && (
              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-[#951722]">
                    Đăng Nhập Tài Khoản
                  </h2>
                  <p className="text-sm text-[#171815]/75 mt-1">
                    Đăng nhập để sử dụng mã ưu đãi <strong className="font-display">THANHVIEN50</strong> và theo dõi tiến
                    trình giao hàng.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-[#9B0514]/10 border border-[#9B0514]/30 text-xs font-bold text-[#9B0514] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-id"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
                      Số điện thoại hoặc Email *
                    </label>
                    <input
                      id="login-id"
                      type="text"
                      value={loginIdentity}
                      onChange={(e) => setLoginIdentity(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="login-pass"
                      className="block text-sm font-bold text-[#171815] mb-1.5"
                    >
                      Mật khẩu * (Nhập 000000 để thử trạng thái lỗi)
                    </label>
                    <input
                      id="login-pass"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[54px] px-6 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] font-bold text-[17px] cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </form>

                <p className="text-center text-sm text-[#171815]/80">
                  Chưa có tài khoản?{' '}
                  <Link to="/tai-khoan/dang-ky" className="font-bold text-[#951722] underline">
                    Đăng ký thành viên mới
                  </Link>
                </p>
              </div>
            )}

            {/* 2. ĐĂNG KÝ (3 bước: Nhập thông tin -> OTP -> Hoàn tất) */}
            {activeTab === 'dang-ky' && (
              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-[#951722]">
                    Đăng Ký Thành Viên Bùi Vị
                  </h2>
                  <p className="text-sm text-[#171815]/75 mt-1">
                    Quy trình 3 bước: Nhập thông tin cá nhân → Xác thực OTP → Kích hoạt mã{' '}
                    <span className="font-display">THANHVIEN50</span>.
                  </p>
                </div>

                {regError && (
                  <div className="p-3.5 rounded-xl bg-[#9B0514]/10 border border-[#9B0514]/30 text-xs font-bold text-[#9B0514] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {regStep === 'info' && (
                  <form onSubmit={handleRegisterStep1} className="space-y-4">
                    <div>
                      <label
                        htmlFor="reg-name"
                        className="block text-sm font-bold text-[#171815] mb-1.5"
                      >
                        Họ và tên *
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-phone"
                        className="block text-sm font-bold text-[#171815] mb-1.5"
                      >
                        Số điện thoại nhận mã OTP *
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0988 123 456"
                        className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-email"
                        className="block text-sm font-bold text-[#171815] mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-pass"
                        className="block text-sm font-bold text-[#171815] mb-1.5"
                      >
                        Mật khẩu (tối thiểu 6 ký tự) *
                      </label>
                      <input
                        id="reg-pass"
                        type="password"
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        placeholder="******"
                        className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full min-h-[54px] px-6 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] font-bold text-[17px] cursor-pointer"
                    >
                      Tiếp tục nhận mã xác thực OTP
                    </button>
                  </form>
                )}

                {regStep === 'otp' && (
                  <form onSubmit={handleRegisterVerifyOtp} className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#1F3D2A]/10 border border-[#1F3D2A]/30 text-xs text-[#1F3D2A]">
                      Mã OTP xác thực đã được gửi tới số điện thoại <strong>{regPhone}</strong>. (Mã
                      kiểm thử mặc định: <strong>123456</strong>).
                    </div>
                    <div>
                      <label
                        htmlFor="reg-otp"
                        className="block text-sm font-bold text-[#171815] mb-1.5"
                      >
                        Nhập mã OTP 6 chữ số *
                      </label>
                      <input
                        id="reg-otp"
                        type="text"
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value)}
                        className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-center font-body text-lg tracking-widest"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRegStep('info')}
                        className="px-4 py-3 rounded-xl border border-[#171815]/30 text-sm cursor-pointer"
                      >
                        Quay lại
                      </button>
                      <button
                        type="submit"
                        className="flex-1 min-h-[52px] px-6 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] text-base cursor-pointer"
                      >
                        Xác thực & Tạo tài khoản
                      </button>
                    </div>
                  </form>
                )}

                {regStep === 'done' && (
                  <div className="p-6 rounded-2xl bg-[#1F3D2A] text-[#FFF5E4] text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-[#F3D27A] mx-auto" />
                    <h3 className="font-display text-2xl text-[#F3D27A]">
                      Tạo Tài Khoản Thành Công!
                    </h3>
                    <p className="text-sm text-[#FFF5E4]/90">
                      Mã ưu đãi <strong className="font-display">THANHVIEN50 (Giảm 50.000đ)</strong> đã được tự động lưu vào
                      giỏ hàng của bạn.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <Link
                        to="/san-pham"
                        className="px-5 py-2.5 rounded-xl bg-[#951722] text-[#FFF5E4] font-bold text-sm"
                      >
                        Mua sắm ngay
                      </Link>
                      <Link
                        to="/tai-khoan/ho-so"
                        className="px-5 py-2.5 rounded-xl bg-[#FFF5E4] text-[#1F3D2A] font-bold text-sm"
                      >
                        Xem hồ sơ
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. HỒ SƠ CÁ NHÂN */}
            {activeTab === 'ho-so' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl md:text-3xl text-[#951722]">
                  Hồ Sơ Cá Nhân
                </h2>
                {!user ? (
                  <div className="p-5 rounded-xl bg-[#FFF5E4] border border-[#951722]/25 space-y-3">
                    <p className="text-sm">Bạn chưa đăng nhập. Hãy đăng nhập để quản lý hồ sơ.</p>
                    <Link
                      to="/tai-khoan/dang-nhap"
                      className="inline-block px-5 py-2.5 rounded-xl bg-[#951722] text-[#FFF5E4] font-bold text-sm"
                    >
                      Đi tới Đăng nhập
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateUserProfile({
                        fullName: profName,
                        phone: profPhone,
                        email: profEmail,
                      });
                    }}
                    className="space-y-4 max-w-lg"
                  >
                    <div>
                      <label className="block text-sm font-bold mb-1">Họ và tên</label>
                      <input
                        type="text"
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="w-full min-h-[48px] px-4 py-2 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        value={profPhone}
                        onChange={(e) => setProfPhone(e.target.value)}
                        className="w-full min-h-[48px] px-4 py-2 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Email</label>
                      <input
                        type="email"
                        value={profEmail}
                        onChange={(e) => setProfEmail(e.target.value)}
                        className="w-full min-h-[48px] px-4 py-2 rounded-xl bg-[#FFF5E4] border border-[#951722]/30 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="min-h-[50px] px-6 py-2.5 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-bold text-sm cursor-pointer"
                    >
                      Lưu thay đổi hồ sơ
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 4. ĐƠN HÀNG CỦA TÔI (With Status Timeline) */}
            {activeTab === 'don-hang' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl md:text-3xl text-[#951722]">
                  Đơn Hàng Của Tôi ({orders.length})
                </h2>

                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-[#FFF5E4] border-2 border-[#951722]/25 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#951722]/15">
                        <div>
                          <span className="font-body text-base text-[#951722]">
                            Mã đơn: #{ord.code}
                          </span>
                          <span className="text-xs text-[#171815]/65 ml-3">{ord.createdAt}</span>
                        </div>
                        <span className="font-price text-[20px] text-[#9B0514]">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span>
                              <strong className="font-display">{item.productName}</strong> x{item.quantity} ({item.packSpec})
                            </span>
                            <span className="font-price">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Status Timeline */}
                      <div className="pt-3 border-t border-[#951722]/15">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A] mb-3">
                          Tiến trình đơn hàng:
                        </p>
                        <div className="space-y-3">
                          {ord.timeline.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-3 text-xs">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                                  step.completed
                                    ? 'bg-[#1F3D2A] text-[#FFF5E4]'
                                    : 'bg-[#171815]/15 text-[#171815]/60'
                                }`}
                              >
                                {step.completed ? '✓' : sIdx + 1}
                              </span>
                              <div>
                                <p className="font-bold text-[#171815]">
                                  {step.status}{' '}
                                  <span className="font-normal text-[#171815]/60">
                                    ({step.time})
                                  </span>
                                </p>
                                <p className="text-[#171815]/75">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SỔ ĐỊA CHỈ (CRUD) */}
            {activeTab === 'so-dia-chi' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl md:text-3xl text-[#951722]">
                    Sổ Địa Chỉ Nhận Hàng
                  </h2>
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(null);
                        setAddrName(user.fullName);
                        setAddrPhone(user.phone);
                        setAddrStreet('');
                        setShowAddrForm(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#951722] text-[#FFF5E4] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm địa chỉ mới</span>
                    </button>
                  )}
                </div>

                {!user ? (
                  <p className="text-sm">
                    Vui lòng{' '}
                    <Link to="/tai-khoan/dang-nhap" className="font-bold text-[#951722] underline">
                      Đăng nhập
                    </Link>{' '}
                    để quản lý sổ địa chỉ.
                  </p>
                ) : (
                  <>
                    {showAddrForm && (
                      <form
                        onSubmit={handleSaveAddress}
                        className="p-5 rounded-2xl bg-[#FFF5E4] border border-[#951722]/30 space-y-3"
                      >
                        <h3 className="font-bold text-sm text-[#1F3D2A]">
                          {editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ nhận hàng mới'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Họ tên người nhận *"
                            value={addrName}
                            onChange={(e) => setAddrName(e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Số điện thoại *"
                            value={addrPhone}
                            onChange={(e) => setAddrPhone(e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <HeritageDropdown
                            value={addrProvince}
                            onChange={(val) => setAddrProvince(val)}
                            options={PROVINCE_OPTIONS}
                            placeholder="Chọn Tỉnh/Thành phố"
                            headerTitle="Chọn Tỉnh / Thành phố"
                            triggerTestId="account-province-trigger"
                            listboxTestId="account-province-listbox"
                            optionTestIdPrefix="account-province-option"
                            size="sm"
                          />
                          <input
                            type="text"
                            placeholder="Quận/Huyện"
                            value={addrDistrict}
                            onChange={(e) => setAddrDistrict(e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Phường/Xã"
                            value={addrWard}
                            onChange={(e) => setAddrWard(e.target.value)}
                            className="px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-sm"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Số nhà, tên đường cụ thể *"
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#FFFBF2] border border-[#951722]/30 text-sm"
                        />
                        <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addrDefault}
                            onChange={(e) => setAddrDefault(e.target.checked)}
                            className="accent-[#951722]"
                          />
                          <span>Đặt làm địa chỉ mặc định</span>
                        </label>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] font-bold text-xs cursor-pointer"
                          >
                            Lưu địa chỉ
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddrForm(false)}
                            className="px-4 py-2 rounded-xl border border-[#171815]/30 text-xs font-bold cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-3">
                      {user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="p-4 rounded-2xl bg-[#FFF5E4] border border-[#951722]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span>{addr.recipientName}</span>
                              <span>·</span>
                              <span className="font-body">{addr.phone}</span>
                              {addr.isDefault && (
                                <span className="text-[11px] font-bold bg-[#1F3D2A] text-[#FFF5E4] px-2 py-0.5 rounded">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#171815]/80">
                              {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 text-xs">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => setDefaultAddress(addr.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-[#1F3D2A] text-[#1F3D2A] font-bold cursor-pointer"
                              >
                                Đặt mặc định
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAddress(addr);
                                setAddrName(addr.recipientName);
                                setAddrPhone(addr.phone);
                                setAddrProvince(addr.province);
                                setAddrDistrict(addr.district);
                                setAddrWard(addr.ward);
                                setAddrStreet(addr.streetAddress);
                                setAddrDefault(addr.isDefault);
                                setShowAddrForm(true);
                              }}
                              aria-label="Sửa địa chỉ"
                              className="p-2 rounded-lg hover:bg-[#951722]/10 text-[#171815] cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAddress(addr.id)}
                              aria-label="Xóa địa chỉ"
                              className="p-2 rounded-lg hover:bg-[#9B0514]/10 text-[#9B0514] cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <FeaturedProductsBlock />
    </div>
  );
};
