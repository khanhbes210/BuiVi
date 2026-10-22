import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartPromotions,
  validateManualVoucherCode,
  countGiftSetsInCart,
  getVoucherSelectToast,
} from './promotionEngine';
import {
  PRODUCTS,
  formatPrice,
  getDiscountPercent,
  getSavingsAmount,
  removeVietnameseTones,
  findProductBySlug,
} from '../data/products';
import { ARTICLES, resolveArticleTokens } from '../data/articles';
import {
  SITE_CONFIG,
  SHOW_ANIMATION_PLACEHOLDERS,
  SHOW_MEDIA_PLACEHOLDERS,
  ENABLE_PAYMENT_FAIL_DEMO,
  isPlaceholder,
  shouldShowAnimationPlaceholders,
  shouldShowMediaPlaceholders,
  shouldShowPaymentFailDemo,
} from '../data/siteConfig';
import { CHECKOUT_STEPS } from '../constants/ui';
import { ANIMATION_SLOTS, REQUIRED_ANIMATION_SLOT_IDS } from '../data/animations';
import { MOTION_TOKENS, getStaggerDelay } from '../motion/tokens';
import { MOTION_SETTINGS } from '../motion/settings';

test('single products price ordering is Nem chua (85.000đ) < Nem bùi (95.000đ) < Nem ngựa (110.000đ)', () => {
  const nemChua = PRODUCTS.find((p) => p.id === 'prod-nem-chua')!;
  const nemBui = PRODUCTS.find((p) => p.id === 'prod-nem-bui')!;
  const nemNgua = PRODUCTS.find((p) => p.id === 'prod-nem-ngua')!;

  assert.equal(nemChua.price, 85000);
  assert.equal(nemBui.price, 95000);
  assert.equal(nemNgua.price, 110000);
  assert.equal(nemChua.price < nemBui.price && nemBui.price < nemNgua.price, true);
});

test('isBestSeller is true on the 3 main products: Set Vinh Hoa - Phú Quý, Nem chua, and Nem bùi', () => {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).map((p) => p.id);
  assert.deepEqual(
    bestSellers.sort(),
    ['prod-nem-bui', 'prod-nem-chua', 'prod-set-vinh-hoa'].sort()
  );
});

test('formatPrice formats Vietnamese dong with dot thousands separator and đ suffix', () => {
  assert.equal(formatPrice(85000), '85.000đ');
  assert.equal(formatPrice(290000), '290.000đ');
  assert.equal(formatPrice(1010000), '1.010.000đ');
});

test('removeVietnameseTones normalizes diacritics for accent-insensitive search', () => {
  assert.equal(removeVietnameseTones('Nem bùi Kinh Bắc'), 'nem bui kinh bac');
  assert.equal(removeVietnameseTones('Set Độc Bản'), 'set doc ban');
});

test('gift sets and combo prices, packSpec ("1 hộp – 5 nem") and auto-calculated -X% badges', () => {
  const setVinhHoa = PRODUCTS.find((p) => p.id === 'prod-set-vinh-hoa')!;
  assert.equal(setVinhHoa.price, 290000);
  assert.equal(setVinhHoa.oldPrice, 320000);
  assert.equal(setVinhHoa.packSpec, '1 hộp – 5 nem');
  assert.equal(setVinhHoa.bestSeller, true);
  assert.equal(getDiscountPercent(setVinhHoa.price, setVinhHoa.oldPrice), 9);

  const setBinhAn = PRODUCTS.find((p) => p.id === 'prod-set-binh-an')!;
  assert.equal(setBinhAn.price, 330000);
  assert.equal(setBinhAn.oldPrice, 360000);
  assert.equal(setBinhAn.packSpec, '1 hộp – 5 nem');
  assert.equal(getDiscountPercent(setBinhAn.price, setBinhAn.oldPrice), 8);

  const setDocBan = PRODUCTS.find((p) => p.id === 'prod-set-doc-ban')!;
  assert.equal(setDocBan.slug, 'set-doc-ban');
  assert.equal(setDocBan.price, 390000);
  assert.equal(setDocBan.oldPrice, undefined);
  assert.equal(setDocBan.packSpec, '1 hộp – 5 nem');
  assert.equal(getDiscountPercent(setDocBan.price, setDocBan.oldPrice), null);

  const combo3 = PRODUCTS.find((p) => p.id === 'prod-combo-3-set')!;
  assert.equal(combo3.slug, 'combo-3-hop-qua');
  assert.equal(combo3.price, 950000);
  assert.equal(combo3.oldPrice, 1010000);
  assert.equal(getDiscountPercent(combo3.price, combo3.oldPrice), 6);
  assert.equal(getSavingsAmount(combo3.price, combo3.oldPrice), 60000);
  assert.equal(combo3.includedSets?.length, 3);
});

test('BUIVI10 applies 10% up to 50.000đ for orders >= 300.000đ excluding Combo 3 hộp quà', () => {
  // 4 x Nem bùi (95.000đ * 4 = 380.000đ) -> 10% is 38.000đ
  const res = calculateCartPromotions(
    [{ productId: 'prod-nem-bui', quantity: 4 }],
    'BUIVI10',
    false
  );
  assert.equal(res.subtotal, 380000);
  assert.equal(res.appliedDiscountCode, 'BUIVI10');
  assert.equal(res.voucherDiscountAmount, 38000);

  // 2 x Set Bình An (330.000đ * 2 = 660.000đ) -> 10% is 66.000đ capped at 50.000đ
  const capped = calculateCartPromotions(
    [{ productId: 'prod-set-binh-an', quantity: 2 }],
    'BUIVI10',
    false
  );
  assert.equal(capped.voucherDiscountAmount, 50000);
});

test('QUATET15 applies 15% up to 60.000đ on Set Vinh Hoa - Phú Quý and Set Độc Bản', () => {
  // 1 x Set Vinh Hoa (290.000đ) -> 15% is 43.500đ
  const res = calculateCartPromotions(
    [{ productId: 'prod-set-vinh-hoa', quantity: 1 }],
    'QUATET15',
    false
  );
  assert.equal(res.appliedDiscountCode, 'QUATET15');
  assert.equal(res.voucherDiscountAmount, 43500);
  assert.equal(res.freeshipApplied, false); // < 500.000đ

  // 2 x Set Độc Bản (390.000đ * 2 = 780.000đ) -> 15% is 117.000đ capped at 60.000đ, FREESHIP applied (>= 500.000đ)
  const capped = calculateCartPromotions(
    [{ productId: 'prod-set-doc-ban', quantity: 2 }],
    'QUATET15',
    false
  );
  assert.equal(capped.voucherDiscountAmount, 60000);
  assert.equal(capped.freeshipApplied, true);
  assert.equal(capped.finalShippingFee, 0);
});

test('TANGHOP automatically adds 1 free Nem chua (85.000đ) when buying >= 2 sets', () => {
  const res = calculateCartPromotions(
    [
      { productId: 'prod-set-vinh-hoa', quantity: 1 },
      { productId: 'prod-set-binh-an', quantity: 1 },
    ],
    null,
    false,
    true,
    true
  );
  assert.equal(res.subtotal, 620000);
  assert.equal(res.tangHopGiftActive, true);
  assert.equal(res.freeshipApplied, true); // 620.000đ >= 500.000đ
  assert.equal(res.gifts.some((g) => g.code === 'TANGHOP' && g.normalPrice === 85000), true);
  // Best auto-applied voucher between BUIVI10 (10% of 620k = 62k capped at 50k) and QUATET15 (15% of 290k = 43.5k) is BUIVI10 (50.000đ)
  assert.equal(res.appliedDiscountCode, 'BUIVI10');
  assert.equal(res.voucherDiscountAmount, 50000);
});

test('COMBO3 automatically applies 50.000đ discount + gifts on Combo 3 hộp quà', () => {
  const res = calculateCartPromotions(
    [{ productId: 'prod-combo-3-set', quantity: 1 }],
    null,
    false
  );
  assert.equal(res.subtotal, 950000);
  assert.equal(res.appliedDiscountCode, 'COMBO3');
  assert.equal(res.voucherDiscountAmount, 50000);
  assert.equal(res.combo3BonusGiftActive, true);
  assert.equal(res.tangHopGiftActive, true);
  assert.equal(res.freeshipApplied, true);
  // Direct sale savings: 1.010.000 - 950.000 = 60.000
  // Voucher: 50.000, Freeship: 40.000, Gift Nem chua: 85.000 -> Total savings = 235.000
  assert.equal(res.directSaleSavings, 60000);
  assert.equal(res.totalSavings, 235000);
});

test('Explicit voucher removal ("NONE") disables auto-apply and sets voucherDiscountAmount to 0', () => {
  const res = calculateCartPromotions(
    [{ productId: 'prod-set-vinh-hoa', quantity: 1 }],
    'NONE',
    false
  );
  assert.equal(res.appliedDiscountCode, null);
  assert.equal(res.voucherDiscountAmount, 0);
  assert.equal(res.finalTotal, 290000 + 40000);
});

test('getVoucherSelectToast returns clear comparison message when switching vouchers', () => {
  const msg = getVoucherSelectToast('QUATET15', 43500, 'BUIVI10', 50000);
  assert.equal(
    msg,
    'Đã đổi từ mã QUATET15 sang BUIVI10 – bạn tiết kiệm thêm 6.500đ'
  );
});

test('THANHVIEN50 applies 30.000đ discount and requires authentication and >= 200.000đ', () => {
  const nemBui = PRODUCTS.find((p) => p.id === 'prod-nem-bui')!;
  const lines = [{ product: nemBui, quantity: 3 }]; // 3 * 95.000 = 285.000đ (>= 200.000đ)
  const unauth = validateManualVoucherCode('THANHVIEN50', lines, false);
  assert.equal(unauth.ok, false);

  const auth = validateManualVoucherCode('THANHVIEN50', lines, true);
  assert.equal(auth.ok, true);
  assert.equal(auth.status?.estimatedDiscount, 30000);
});

test('countGiftSetsInCart counts individual sets as 1 and Combo 3 hộp quà as 3', () => {
  const count = countGiftSetsInCart([
    { product: PRODUCTS.find((p) => p.id === 'prod-combo-3-set')!, quantity: 1 },
    { product: PRODUCTS.find((p) => p.id === 'prod-set-binh-an')!, quantity: 1 },
  ]);
  assert.equal(count, 4);
});

test('6 official articles match exact slugs, categories, dates, author, and relatedProductSlug in products.ts', () => {
  assert.equal(ARTICLES.length, 6);
  const expected = [
    {
      slug: 'nghe-thuat-lam-nem-bui-kinh-bac',
      categorySlug: 'van-hoa-am-thuc',
      date: '05/10/2026',
      relatedProductSlug: 'nem-bui',
    },
    {
      slug: 'giay-diep-dong-ho-hop-qua-bui-vi',
      categorySlug: 'van-hoa-am-thuc',
      date: '08/10/2026',
      relatedProductSlug: 'set-doc-ban',
    },
    {
      slug: 'bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac',
      categorySlug: 'meo-hay-bi-quyet',
      date: '12/10/2026',
      relatedProductSlug: 'nem-chua',
    },
    {
      slug: 'goi-y-chon-set-qua-bieu-di-san-bui-vi',
      categorySlug: 'meo-hay-bi-quyet',
      date: '15/10/2026',
      relatedProductSlug: 'set-binh-an-sung-tuc',
    },
    {
      slug: 'bui-vi-ra-mat-bo-suu-tap-qua-tet-2027',
      categorySlug: 'tin-tuc-su-kien',
      date: '20/10/2026',
      relatedProductSlug: 'combo-3-hop-qua',
    },
    {
      slug: 'khong-gian-di-san-bui-vi-thuan-thanh',
      categorySlug: 'tin-tuc-su-kien',
      date: '22/10/2026',
      relatedProductSlug: 'set-vinh-hoa-phu-quy',
    },
  ];

  expected.forEach((exp, idx) => {
    const art = ARTICLES[idx];
    assert.equal(art.slug, exp.slug);
    assert.equal(art.categorySlug, exp.categorySlug);
    assert.equal(art.date, exp.date);
    assert.equal(art.author, 'Bùi Vị');
    assert.equal(art.excerpt, art.metaDescription);
    assert.equal(art.relatedProductSlug, exp.relatedProductSlug);
    assert.equal(Boolean(findProductBySlug(art.relatedProductSlug)), true);
  });
});

test('resolveArticleTokens dynamically resolves prices, vouchers, and combo savings without leaving raw tokens', () => {
  assert.equal(resolveArticleTokens('{{PRICE:set-binh-an-sung-tuc}}'), '330.000 đồng');
  assert.equal(resolveArticleTokens('{{PRICE:set-vinh-hoa-phu-quy}}'), '290.000 đồng');
  assert.equal(resolveArticleTokens('{{PRICE:set-doc-ban}}'), '390.000 đồng');
  assert.equal(resolveArticleTokens('{{VOUCHER:QUATET15}}'), 'Giảm 15%, tối đa 60.000 đồng');
  assert.equal(resolveArticleTokens('{{VOUCHER:COMBO3}}'), 'Giảm thêm 50.000 đồng khi mua combo');
  assert.equal(resolveArticleTokens('{{COMBO_SAVING}}'), 'Tiết kiệm 60.000 đồng');
});

test('siteConfig.ts first store has official address and opening hours, and only Store 1 is visible (P0-2)', () => {
  assert.equal(
    SITE_CONFIG.stores[0].address,
    'Làng nghề Bùi Xá, xã Ninh Xá, Thuận Thành, Bắc Ninh'
  );
  assert.equal(SITE_CONFIG.stores[0].hours, '08:00 – 20:30 hằng ngày');
  assert.equal(SITE_CONFIG.stores[0].visible, true);
  assert.equal(SITE_CONFIG.stores[1].visible, false);
  assert.equal(SITE_CONFIG.stores[2].visible, false);
  assert.equal(SITE_CONFIG.stores.filter((s) => s.visible).length, 1);
  assert.equal(
    SITE_CONFIG.contact.headquarters,
    'Làng nghề Bùi Xá, xã Ninh Xá, Thuận Thành, Bắc Ninh'
  );
  assert.equal(SITE_CONFIG.contact.workingHours, '08:00 – 20:30 hằng ngày');
});

test('isPlaceholder detects bracketed or "có thể chỉnh sửa" strings (P0-2)', () => {
  assert.equal(isPlaceholder('0900 000 000 [Có thể chỉnh sửa]'), true);
  assert.equal(isPlaceholder('[Địa chỉ cơ sở 2 – có thể chỉnh sửa]'), true);
  assert.equal(isPlaceholder('[Tọa độ bản đồ – có thể chỉnh sửa]'), true);
  assert.equal(isPlaceholder(''), true);
  assert.equal(isPlaceholder('Làng nghề Bùi Xá, xã Ninh Xá, Thuận Thành, Bắc Ninh'), false);
  assert.equal(isPlaceholder('08:00 – 20:30 hằng ngày'), false);
});

test('MOTION_TOKENS defines exact durations, easings, distances, and stagger rules (max 8 items, <= 800ms)', () => {
  assert.equal(MOTION_TOKENS.durationsMs.instant, 120);
  assert.equal(MOTION_TOKENS.durationsMs.fast, 200);
  assert.equal(MOTION_TOKENS.durationsMs.base, 320);
  assert.equal(MOTION_TOKENS.durationsMs.slow, 520);
  assert.equal(MOTION_TOKENS.durationsMs.hero, 800);
  assert.equal(
    Object.values(MOTION_TOKENS.durationsMs).every((ms) => ms <= 800),
    true
  );

  assert.deepEqual(MOTION_TOKENS.easings.standard, [0.22, 1, 0.36, 1]);
  assert.deepEqual(MOTION_TOKENS.easings.emphasized, [0.16, 1, 0.3, 1]);
  assert.deepEqual(MOTION_TOKENS.easings.exit, [0.4, 0, 1, 1]);

  assert.equal(MOTION_TOKENS.distances.reveal, 24);
  assert.equal(MOTION_TOKENS.distances.drawer, '100%');
  assert.equal(MOTION_TOKENS.distances.hoverLift, 4);
  assert.equal(MOTION_TOKENS.stagger.stepMs, 60);
  assert.equal(MOTION_TOKENS.stagger.maxItems, 8);

  // Stagger delay caps at index 7 (8th item) so remaining items appear together
  assert.equal(getStaggerDelay(0), 0);
  assert.equal(Number(getStaggerDelay(2).toFixed(2)), 0.12);
  assert.equal(getStaggerDelay(7), getStaggerDelay(12));
});

test('MOTION_SETTINGS, placeholder flags, payment fail demo toggle, and CHECKOUT_STEPS (P0-1, P0-3, P1-2)', () => {
  assert.equal(SHOW_ANIMATION_PLACEHOLDERS, false);
  assert.equal(SHOW_MEDIA_PLACEHOLDERS, false);
  assert.equal(ENABLE_PAYMENT_FAIL_DEMO, false);
  assert.equal(SITE_CONFIG.showAnimationPlaceholders, false);
  assert.equal(SITE_CONFIG.showMediaPlaceholders, false);
  assert.equal(SITE_CONFIG.enablePaymentFailDemo, false);

  assert.equal(shouldShowAnimationPlaceholders(''), false);
  assert.equal(shouldShowAnimationPlaceholders('?slots=1'), true);
  assert.equal(shouldShowMediaPlaceholders(''), false);
  assert.equal(shouldShowMediaPlaceholders('?slots=1'), true);
  assert.equal(shouldShowPaymentFailDemo(''), false);
  assert.equal(shouldShowPaymentFailDemo('?demo=fail'), true);

  assert.deepEqual(CHECKOUT_STEPS, ['1. Giỏ hàng', '2. Thông tin giao hàng', '3. Thanh toán']);

  assert.equal(MOTION_SETTINGS.ENABLE_PAGE_TRANSITIONS, true);
  assert.equal(MOTION_SETTINGS.ENABLE_SCROLL_REVEAL, true);
  assert.equal(MOTION_SETTINGS.ENABLE_PARALLAX, true);
  assert.equal(MOTION_SETTINGS.ENABLE_FLY_TO_CART, true);
  assert.equal(MOTION_SETTINGS.ENABLE_MICRO_CONFETTI, true);
  assert.equal(MOTION_SETTINGS.ENABLE_HERO_KENBURNS, true);
  assert.equal(MOTION_SETTINGS.ENABLE_MARQUEE, true);
});

test('ANIMATION_SLOTS contains all 13 required animation holder IDs with valid metadata', () => {
  assert.equal(REQUIRED_ANIMATION_SLOT_IDS.length, 13);
  for (const id of REQUIRED_ANIMATION_SLOT_IDS) {
    const slot = ANIMATION_SLOTS[id];
    assert.equal(Boolean(slot), true, `Missing slot ${id}`);
    assert.equal(slot.id, id);
    assert.equal(Boolean(slot.title.trim()), true);
    assert.equal(Boolean(slot.dimensions.trim()), true);
  }
});



