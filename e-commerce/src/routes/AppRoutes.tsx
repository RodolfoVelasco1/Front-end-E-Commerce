import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Home from "../components/screens/Home";
import Account from "../components/screens/Account";
import Admin from "../components/screens/Admin";
import Nosotros from "../components/screens/Nosotros";
import Quejas from "../components/screens/Quejas";
import Devoluciones from "../components/screens/Devoluciones";
import ProductsPage from "../components/screens/ProductsPage";
import CartPage from "../components/screens/CartPage";
import ProductDetailPage from "../components/screens/ProductDetailPage";
import AccountDashboard from "../components/screens/AccountDashboard";
import useStore from "../store/store";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => {
  const { initializeAuth } = useStore();

  // Inicializar autenticación al cargar la aplicación
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        
        {/* Rutas públicas */}
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/sobre-nosotros" element={<Nosotros />} />
        <Route path="/libro-quejas" element={<Quejas />} />
        <Route path="/devoluciones" element={<Devoluciones />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/indumentaria" element={<ProductsPage />} />
        <Route path="/calzado" element={<ProductsPage />} />
        <Route path="/hombre" element={<ProductsPage />} />
        <Route path="/mujer" element={<ProductsPage />} />
        <Route path="/unisex" element={<ProductsPage />} />
        <Route path="/ofertas" element={<ProductsPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />

        {/* Rutas protegidas - requieren autenticación */}
        <Route 
          path="/carrito" 
          element={
            <ProtectedRoute requireAuth>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuario" 
          element={
            <ProtectedRoute requireAuth>
              <AccountDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rutas de administrador - requieren rol admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};