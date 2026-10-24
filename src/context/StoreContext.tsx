import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, PRODUCTS } from '../data/products';
import {
  CartItemInput,
  PromotionCalculationResult,
  calculateCartPromotions,
  validateManualVoucherCode,
  getVoucherSelectToast,
} from '../utils/promotionEngine';

export interface UserAddress {
  id: string;
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addresses: UserAddress[];
}

export interface OrderTimelineStep {
  status: string;
  time: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  code: string;
  createdAt: string;
  estimatedDelivery: string;
  customerName: string;
  phone: string;
  email: string;
  fullAddress: string;
  note?: string;
  isGiftOrder?: boolean;
  giftMessage?: string;
  paymentMethod: 'qr' | 'cod';
  paymentStatus: 'paid' | 'cod_pending';
  items: {
    productId: string;
    productName: string;
    productSlug: string;
    packSpec: string;
    quantity: number;
    unitPrice: number;
    oldUnitPrice?: number;
  }[];
  gifts: {
    code: string;
    name: string;
    badgeText: string;
  }[];
  subtotal: number;
  voucherCode: string | null;
  voucherDiscount: number;
  shippingFee: number;
  totalAmount: number;
  totalSavings: number;
  timeline: OrderTimelineStep[];
}

export interface ToastItem {
  id: string;
  text: string;
}

export interface FlyingCartItem {
  id: number;
  product: Product;
  startX: number;
  startY: number;
}

interface StoreContextValue {
  cart: CartItemInput[];
  appliedVoucherCode: string | null;
  buyNowItem: CartItemInput | null;
  miniCartOpen: boolean;
  lastAddedItem: { product: Product; quantity: number; selectedPack: string } | null;
  searchOverlayOpen: boolean;
  user: UserProfile | null;
  orders: Order[];
  lastPlacedOrder: Order | null;
  simulatePaymentFailure: boolean;
  toastMessage: string | null;
  toasts: ToastItem[];
  flyingItem: FlyingCartItem | null;
  cartBadgeBump: boolean;
  pdpMobileBarVisible: boolean;
  cartPromotion: PromotionCalculationResult;
  buyNowPromotion: PromotionCalculationResult;
  totalCartItemsCount: number;
  quickViewProduct: Product | null;

  // Actions
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  addToCart: (
    productId: string,
    quantity?: number,
    selectedPack?: string,
    voucherCodeToCarry?: string | null
  ) => void;
  startBuyNow: (
    productId: string,
    quantity?: number,
    selectedPack?: string,
    voucherCodeToCarry?: string | null
  ) => void;
  updateCartQuantity: (productId: string, selectedPack: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedPack: string) => void;
  toggleSelectCartItem: (productId: string, selectedPack: string) => void;
  selectAllCartItems: (selected: boolean) => void;
  applyVoucherCode: (
    code: string,
    customPromotion?: PromotionCalculationResult
  ) => { ok: boolean; message: string };
  saveVoucherForLater: (code: string) => void;
  removeAppliedVoucher: () => void;
  setMiniCartOpen: (open: boolean) => void;
  setSearchOverlayOpen: (open: boolean) => void;
  setSimulatePaymentFailure: (val: boolean) => void;
  setPdpMobileBarVisible: (val: boolean) => void;
  showToast: (msg: string) => void;
  dismissToast: (id: string) => void;
  setToastsPaused: (paused: boolean) => void;
  triggerFlyToCart: (product: Product, sourceEl?: HTMLElement | null) => void;
  copyVoucherCode: (code: string) => void;

  // Auth & Profile Actions
  loginUser: (phoneOrEmail: string, password: string) => { ok: boolean; message: string };
  registerUser: (data: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => { ok: boolean; message: string };
  logoutUser: () => void;
  updateUserProfile: (data: { fullName: string; phone: string; email: string }) => void;
  addAddress: (addr: Omit<UserAddress, 'id'>) => void;
  updateAddress: (addr: UserAddress) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Checkout Action
  placeOrder: (params: {
    mode: 'cart' | 'buynow';
    customerName: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    note?: string;
    isGiftOrder?: boolean;
    giftMessage?: string;
    paymentMethod: 'qr' | 'cod';
  }) => { ok: boolean; order?: Order };
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const INITIAL_DEMO_ORDER: Order = {
  id: 'ord-demo-1',
  code: 'BV26101889',
  createdAt: '18/10/2026 14:30',
  estimatedDelivery: '19/10/2026 (Giao tiêu chuẩn bảo quản lạnh)',
  customerName: 'Nguyễn Minh Quân',
  phone: '0912345678',
  email: 'minhquan@example.com',
  fullAddress: 'Số 25 Phố Phan Đình Phùng, Phường Quán Thánh, Quận Ba Đình, TP. Hà Nội',
  isGiftOrder: true,
  giftMessage: 'Kính biếu Bố Mẹ thức quà di sản xứ Kinh Bắc nhân dịp cuối tuần!',
  paymentMethod: 'qr',
  paymentStatus: 'paid',
  items: [
    {
      productId: 'prod-set-vinh-hoa',
      productName: 'Set Vinh Hoa - Phú Quý',
      productSlug: 'set-vinh-hoa-phu-quy',
      packSpec: '1 hộp – 5 nem',
      quantity: 1,
      unitPrice: 290000,
      oldUnitPrice: 320000,
    },
    {
      productId: 'prod-nem-bui',
      productName: 'Nem bùi Kinh Bắc',
      productSlug: 'nem-bui-kinh-bac-500g',
      packSpec: 'Gói 500g tiêu chuẩn',
      quantity: 2,
      unitPrice: 95000,
    },
  ],
  gifts: [],
  subtotal: 480000,
  voucherCode: 'BUIVI10',
  voucherDiscount: 48000,
  shippingFee: 40000,
  totalAmount: 472000,
  totalSavings: 78000,
  timeline: [
    {
      status: 'Đã đặt hàng & Xác nhận',
      time: '18/10/2026 14:30',
      description: 'Đơn hàng BV26101889 đã được hệ thống Bùi Vị tiếp nhận.',
      completed: true,
    },
    {
      status: 'Đang chế tác & Đóng gói hộp quà giấy Điệp',
      time: '18/10/2026 16:00',
      description: 'Kiểm định mẻ nem mới trong ngày, đóng gói túi giữ nhiệt và viết thiệp tay.',
      completed: true,
    },
    {
      status: 'Đang vận chuyển bảo quản lạnh',
      time: '19/10/2026 08:30',
      description: 'Đơn vị vận chuyển chuyên biệt đang giao tới Quận Ba Đình, Hà Nội.',
      completed: true,
    },
    {
      status: 'Giao hàng thành công',
      time: '19/10/2026 10:15',
      description: 'Khách hàng đã nhận kiện hàng nguyên vẹn.',
      completed: true,
    },
  ],
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemInput[]>(() => {
    try {
      const saved = localStorage.getItem('buivi_cart_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        productId: 'prod-set-vinh-hoa',
        quantity: 1,
        selectedPack: '1 hộp – 5 nem (Tiêu chuẩn: 2 Nem bùi + 2 Nem chua + 1 Nem ngựa)',
        selected: true,
      },
    ];
  });

  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem('buivi_voucher') || null;
    } catch {
      return null;
    }
  });

  const [buyNowItem, setBuyNowItem] = useState<CartItemInput | null>(() => {
    try {
      const saved = localStorage.getItem('buivi_buynow');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('buivi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('buivi_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [INITIAL_DEMO_ORDER];
  });

  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('buivi_last_order_v2');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDER;
    } catch {
      return INITIAL_DEMO_ORDER;
    }
  });

  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<{
    product: Product;
    quantity: number;
    selectedPack: string;
  } | null>(null);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [simulatePaymentFailure, setSimulatePaymentFailure] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [toastsPaused, setToastsPaused] = useState(false);
  const [flyingItem, setFlyingItem] = useState<FlyingCartItem | null>(null);
  const [cartBadgeBump, setCartBadgeBump] = useState(false);
  const [pdpMobileBarVisible, setPdpMobileBarVisible] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  useEffect(() => {
    try {
      localStorage.setItem('buivi_cart_v2', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedVoucherCode) {
        localStorage.setItem('buivi_voucher', appliedVoucherCode);
      } else {
        localStorage.removeItem('buivi_voucher');
      }
    } catch {
      // ignore
    }
  }, [appliedVoucherCode]);

  useEffect(() => {
    try {
      if (buyNowItem) {
        localStorage.setItem('buivi_buynow', JSON.stringify(buyNowItem));
      } else {
        localStorage.removeItem('buivi_buynow');
      }
    } catch {
      // ignore
    }
  }, [buyNowItem]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('buivi_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('buivi_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('buivi_orders_v2', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (lastPlacedOrder) {
        localStorage.setItem('buivi_last_order_v2', JSON.stringify(lastPlacedOrder));
      }
    } catch {
      // ignore
    }
  }, [lastPlacedOrder]);

  const dismissToast = (id: string) => {
    setToasts((prev) => {
      const next = prev.filter((t) => t.id !== id);
      setToastMessage(next.length > 0 ? next[next.length - 1].text : null);
      return next;
    });
  };

  useEffect(() => {
    if (toastsPaused || toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => {
        const next = prev.slice(1);
        setToastMessage(next.length > 0 ? next[next.length - 1].text : null);
        return next;
      });
    }, 3400);
    return () => clearTimeout(timer);
  }, [toasts, toastsPaused]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, text: msg }]);
  };

  const triggerBadgeBump = () => {
    setCartBadgeBump(true);
    setTimeout(() => setCartBadgeBump(false), 450);
  };

  const triggerFlyToCart = (product: Product, sourceEl?: HTMLElement | null) => {
    if (typeof window === 'undefined') return;
    const rect = sourceEl?.getBoundingClientRect();
    const startX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const startY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const flyId = Date.now();
    setFlyingItem({ id: flyId, product, startX, startY });
    setTimeout(() => {
      setFlyingItem((prev) => (prev?.id === flyId ? null : prev));
    }, 480);
  };

  // Allow first-order member voucher THANHVIEN50 to be evaluated & selectable in cart/buynow
  const isMemberEligible = true;

  const cartPromotion = useMemo(() => {
    return calculateCartPromotions(
      cart,
      appliedVoucherCode,
      isMemberEligible,
      true,
      true // Auto-select best eligible voucher unless appliedVoucherCode === 'NONE'
    );
  }, [cart, appliedVoucherCode, isMemberEligible]);

  const buyNowPromotion = useMemo(() => {
    const items = buyNowItem
      ? [buyNowItem]
      : cart.length > 0
      ? [cart[0]]
      : [
          {
            productId: 'prod-set-vinh-hoa',
            quantity: 1,
            selectedPack: '1 hộp – 5 nem (Tiêu chuẩn: 2 Nem bùi + 2 Nem chua + 1 Nem ngựa)',
            selected: true,
          },
        ];
    return calculateCartPromotions(items, appliedVoucherCode, isMemberEligible, true, true);
  }, [buyNowItem, cart, appliedVoucherCode, isMemberEligible]);

  const totalCartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (
    productId: string,
    quantity: number = 1,
    selectedPack?: string,
    voucherCodeToCarry?: string | null
  ) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const pack = selectedPack || product.packOptions[0] || product.packSpec;

    if (voucherCodeToCarry !== undefined) {
      setAppliedVoucherCode(voucherCodeToCarry);
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === productId &&
          (item.selectedPack || product.packOptions[0]) === pack
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(product.stock, updated[existingIndex].quantity + quantity),
          selected: true,
        };
        return updated;
      }
      return [...prev, { productId, quantity, selectedPack: pack, selected: true }];
    });

    setLastAddedItem({ product, quantity, selectedPack: pack });
    triggerBadgeBump();
    showToast('Đã thêm vào giỏ hàng');
    setMiniCartOpen(true);
  };

  const startBuyNow = (
    productId: string,
    quantity: number = 1,
    selectedPack?: string,
    voucherCodeToCarry?: string | null
  ) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const pack = selectedPack || product.packOptions[0] || product.packSpec;
    if (voucherCodeToCarry !== undefined) {
      setAppliedVoucherCode(voucherCodeToCarry);
    }
    setBuyNowItem({
      productId,
      quantity,
      selectedPack: pack,
      selected: true,
    });
  };

  const updateCartQuantity = (productId: string, selectedPack: string, quantity: number) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const maxStock = product ? product.stock : 99;
    if (quantity <= 0) {
      removeFromCart(productId, selectedPack);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const itemPack = item.selectedPack || product?.packOptions[0] || '';
        if (item.productId === productId && itemPack === selectedPack) {
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedPack: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setCart((prev) =>
      prev.filter((item) => {
        const itemPack = item.selectedPack || product?.packOptions[0] || '';
        return !(item.productId === productId && itemPack === selectedPack);
      })
    );
    showToast('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const toggleSelectCartItem = (productId: string, selectedPack: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setCart((prev) =>
      prev.map((item) => {
        const itemPack = item.selectedPack || product?.packOptions[0] || '';
        if (item.productId === productId && itemPack === selectedPack) {
          return { ...item, selected: item.selected === false ? true : false };
        }
        return item;
      })
    );
  };

  const selectAllCartItems = (selected: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const applyVoucherCode = (
    code: string,
    customPromotion?: PromotionCalculationResult
  ) => {
    const targetPromotion = customPromotion || cartPromotion;
    const activeLines = targetPromotion.lines
      .filter((l) => l.selected)
      .map((l) => ({ product: l.product, quantity: l.quantity }));

    const normalized = code.trim().toUpperCase();
    const res = validateManualVoucherCode(normalized, activeLines, isMemberEligible, true);

    if (res.ok && res.status) {
      if (normalized === 'FREESHIP' || normalized === 'TANGHOP') {
        const msg =
          normalized === 'FREESHIP'
            ? `Đã áp dụng mã FREESHIP – miễn phí vận chuyển (${res.status.estimatedDiscount.toLocaleString('vi-VN')}đ) cho đơn này`
            : 'Đã áp dụng mã TANGHOP – tặng 1 hộp Nem chua (trị giá 85.000đ) cho đơn này';
        showToast(msg);
        return { ok: true, message: msg };
      }

      const prevCode = targetPromotion.appliedDiscountCode;
      const prevDiscount = targetPromotion.voucherDiscountAmount;
      const toastMsg = getVoucherSelectToast(
        prevCode,
        prevDiscount,
        normalized,
        res.status.estimatedDiscount
      );

      setAppliedVoucherCode(normalized);
      showToast(toastMsg);
      return { ok: true, message: toastMsg };
    }

    return res;
  };

  const saveVoucherForLater = (code: string) => {
    const normalized = code.trim().toUpperCase();
    setAppliedVoucherCode(normalized);
    showToast(`Đã lưu mã ${normalized} vào giỏ hàng của bạn!`);
  };

  const removeAppliedVoucher = () => {
    setAppliedVoucherCode('NONE');
    showToast('Đã bỏ mã ưu đãi và khôi phục giá niêm yết.');
  };

  const copyVoucherCode = (code: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    showToast(`Đã sao chép mã ưu đãi: ${code}`);
  };

  const loginUser = (phoneOrEmail: string, password: string) => {
    if (!phoneOrEmail.trim() || !password.trim()) {
      return { ok: false, message: 'Vui lòng nhập đầy đủ Số điện thoại/Email và Mật khẩu.' };
    }
    if (password.length < 6) {
      return { ok: false, message: 'Mật khẩu phải có từ 6 ký tự trở lên.' };
    }
    const demoUser: UserProfile = {
      id: 'usr-1',
      fullName: phoneOrEmail.includes('@')
        ? phoneOrEmail.split('@')[0].toUpperCase()
        : 'Nguyễn Minh Quân',
      phone: phoneOrEmail.match(/^[0-9]+$/) ? phoneOrEmail : '0912345678',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'khachhang@buivi.vn',
      addresses: [
        {
          id: 'addr-1',
          recipientName: 'Nguyễn Minh Quân',
          phone: '0912345678',
          province: 'TP. Hà Nội',
          district: 'Quận Ba Đình',
          ward: 'Phường Quán Thánh',
          streetAddress: 'Số 25 Phố Phan Đình Phùng',
          isDefault: true,
        },
      ],
    };
    setUser(demoUser);
    showToast(`Chào mừng ${demoUser.fullName} quay trở lại Bùi Vị!`);
    return { ok: true, message: 'Đăng nhập thành công!' };
  };

  const registerUser = (data: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      addresses: [
        {
          id: `addr-${Date.now()}`,
          recipientName: data.fullName.trim(),
          phone: data.phone.trim(),
          province: 'Tỉnh Bắc Ninh',
          district: 'Thị xã Thuận Thành',
          ward: 'Xã Ninh Xá',
          streetAddress: 'Làng nghề Bùi Xá',
          isDefault: true,
        },
      ],
    };
    setUser(newUser);
    showToast('Đăng ký tài khoản thành viên Bùi Vị thành công! Tặng bạn mã THANHVIEN50.');
    return { ok: true, message: 'Đăng ký thành công!' };
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Đã đăng xuất khỏi tài khoản.');
  };

  const updateUserProfile = (data: { fullName: string; phone: string; email: string }) => {
    if (!user) return;
    setUser({
      ...user,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
    });
    showToast('Đã cập nhật hồ sơ cá nhân.');
  };

  const addAddress = (addr: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddr: UserAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = addr.isDefault
      ? user.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
      : [...user.addresses, newAddr];
    setUser({ ...user, addresses: updatedAddresses });
    showToast('Đã thêm địa chỉ giao hàng mới.');
  };

  const updateAddress = (addr: UserAddress) => {
    if (!user) return;
    const updated = user.addresses.map((a) => {
      if (a.id === addr.id) return addr;
      return addr.isDefault ? { ...a, isDefault: false } : a;
    });
    setUser({ ...user, addresses: updated });
    showToast('Đã cập nhật địa chỉ giao hàng.');
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    setUser({ ...user, addresses: user.addresses.filter((a) => a.id !== id) });
    showToast('Đã xóa địa chỉ.');
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: user.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    });
    showToast('Đã đặt làm địa chỉ mặc định.');
  };

  const placeOrder: StoreContextValue['placeOrder'] = (params) => {
    if (simulatePaymentFailure) {
      return { ok: false };
    }

    const promo = params.mode === 'buynow' ? buyNowPromotion : cartPromotion;
    const activeLines = promo.lines.filter((l) => l.selected);

    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const orderCode = `BV${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: orderCode,
      createdAt: `${dateStr} ${timeStr}`,
      estimatedDelivery: 'Trong vòng 2 – 24 giờ (Đóng gói giữ nhiệt chuyên dụng)',
      customerName: params.customerName,
      phone: params.phone,
      email: params.email,
      fullAddress: `${params.streetAddress}, ${params.ward}, ${params.district}, ${params.province}`,
      note: params.note,
      isGiftOrder: params.isGiftOrder,
      giftMessage: params.giftMessage,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'qr' ? 'paid' : 'cod_pending',
      items: activeLines.map((l) => ({
        productId: l.product.id,
        productName: l.product.name,
        productSlug: l.product.slug,
        packSpec: l.selectedPack,
        quantity: l.quantity,
        unitPrice: l.product.price,
        oldUnitPrice: l.product.oldPrice,
      })),
      gifts: promo.gifts.map((g) => ({
        code: g.code,
        name: g.name,
        badgeText: g.badgeText,
      })),
      subtotal: promo.subtotal,
      voucherCode: promo.appliedDiscountCode,
      voucherDiscount: promo.voucherDiscountAmount,
      shippingFee: promo.finalShippingFee,
      totalAmount: promo.finalTotal,
      totalSavings: promo.totalSavings,
      timeline: [
        {
          status: 'Đã đặt hàng & Xác nhận',
          time: `${dateStr} ${timeStr}`,
          description: `Đơn hàng ${orderCode} đã được Bùi Vị tiếp nhận thành công.`,
          completed: true,
        },
        {
          status: 'Đang chuẩn bị nem tươi & Hộp quà giấy Điệp',
          time: 'Dự kiến trong 30 phút',
          description: 'Nghệ nhân kiểm tra quy cách hộp lục giác, đóng đá gel giữ lạnh và viết thiệp.',
          completed: false,
        },
        {
          status: 'Đang giao hàng bảo quản lạnh',
          time: 'Dự kiến hôm nay / ngày mai',
          description: 'Bàn giao cho đối tác vận chuyển chuyên biệt.',
          completed: false,
        },
        {
          status: 'Giao hàng thành công',
          time: 'Chờ hoàn tất',
          description: 'Khách hàng kiểm tra và nhận món quà di sản Kinh Bắc.',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);

    if (params.mode === 'cart') {
      setCart((prev) => prev.filter((item) => item.selected === false));
    } else {
      setBuyNowItem(null);
    }

    return { ok: true, order: newOrder };
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        appliedVoucherCode,
        buyNowItem,
        miniCartOpen,
        lastAddedItem,
        searchOverlayOpen,
        user,
        orders,
        lastPlacedOrder,
        simulatePaymentFailure,
        toastMessage,
        toasts,
        flyingItem,
        cartBadgeBump,
        pdpMobileBarVisible,
        cartPromotion,
        buyNowPromotion,
        totalCartItemsCount,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        addToCart,
        startBuyNow,
        updateCartQuantity,
        removeFromCart,
        toggleSelectCartItem,
        selectAllCartItems,
        applyVoucherCode,
        saveVoucherForLater,
        removeAppliedVoucher,
        setMiniCartOpen,
        setSearchOverlayOpen,
        setSimulatePaymentFailure,
        setPdpMobileBarVisible,
        showToast,
        dismissToast,
        setToastsPaused,
        triggerFlyToCart,
        copyVoucherCode,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        placeOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
