import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingState from './components/LoadingState';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingState label="Loading experience" />}>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/products/:productId" element={<Layout><ProductDetailsPage /></Layout>} />
          <Route path="/cart" element={<Layout><CartPage /></Layout>} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Layout><CheckoutPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </Suspense>
    </>
  );
}