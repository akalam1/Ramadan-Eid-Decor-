import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AdminPage from './pages/AdminPage';
import CountdownTimer from './components/CountdownTimer';
import FeaturedProducts from './components/FeaturedProducts';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import Footer from './components/Footer';
import SlideCart from './components/SlideCart';
import FloatingLanterns from './components/FloatingLanterns';

export const CartContext = React.createContext({
  openCart: () => {},
  closeCart: () => {},
});

function AppContent({ isCartOpen, closeCart }: { isCartOpen: boolean; closeCart: () => void }) {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-white dark:bg-dark islamic-pattern light-pattern texture-overlay transition-colors duration-300">
      <FloatingLanterns />
      {/* Navigation */}
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      {!isAdminPage && <Footer />}
      <SlideCart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ProductProvider>
          <CartProvider>
            <CartContext.Provider value={{ openCart, closeCart }}>
            <BrowserRouter>
              <AppContent isCartOpen={isCartOpen} closeCart={closeCart} />
            </BrowserRouter>
            </CartContext.Provider>
          </CartProvider>
        </ProductProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;