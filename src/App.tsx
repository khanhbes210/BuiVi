/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { AboutPage } from './pages/AboutPage';
import { ArticleListPage, ArticleDetailPage } from './pages/ArticlesPages';
import { ContactPage } from './pages/ContactPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage, PaymentFailedPage } from './pages/OrderStatusPages';
import { AccountPage } from './pages/AccountPage';
import { SitemapPage, NotFoundPage } from './pages/SitemapAndNotFoundPages';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/san-pham" element={<ProductListPage />} />
            <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
            <Route path="/khuyen-mai" element={<PromotionsPage />} />
            <Route path="/ve-bui-vi" element={<AboutPage />} />
            <Route path="/bai-viet" element={<ArticleListPage />} />
            <Route path="/bai-viet/:slug" element={<ArticleDetailPage />} />
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="/tim-kiem" element={<SearchPage />} />
            <Route path="/gio-hang" element={<CartPage />} />
            <Route path="/thanh-toan" element={<CheckoutPage />} />
            <Route path="/dat-hang-thanh-cong" element={<OrderSuccessPage />} />
            <Route path="/thanh-toan-that-bai" element={<PaymentFailedPage />} />
            <Route path="/tai-khoan" element={<AccountPage />} />
            <Route path="/tai-khoan/:subpage" element={<AccountPage />} />
            <Route path="/so-do-trang" element={<SitemapPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
