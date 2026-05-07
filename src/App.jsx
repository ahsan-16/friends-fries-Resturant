import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/ui/CartDrawer";
import AuthModal from "./components/ui/AuthModal";

import Home from "./pages/Home";
import { BurgersPage, PizzaPage, ShawarmaPage, FriesPage, DrinksPage } from "./pages/CategoryPages";
import DealsPage from "./pages/DealsPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContactPage from "./pages/ContactPage";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminUsers from "./pages/admin/AdminUsers";

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="noise">
      <Routes>
        {/* Admin Routes - no navbar/footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Public Routes - with navbar/footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar
                onCartOpen={() => setCartOpen(true)}
                onAuthOpen={() => setAuthOpen(true)}
              />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/burgers" element={<BurgersPage />} />
                <Route path="/pizza" element={<PizzaPage />} />
                <Route path="/shawarma" element={<ShawarmaPage />} />
                <Route path="/fries" element={<FriesPage />} />
                <Route path="/drinks" element={<DrinksPage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
              <Footer />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
              {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
            </>
          }
        />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}