import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/screens/Home";
import Account from "../components/screens/Account";
import Admin from "../components/screens/Admin";
import Nosotros from "../components/screens/Nosotros";
import Quejas from "../components/screens/Quejas";
import Devoluciones from "../components/screens/Devoluciones";


export const AppRoutes = () => {
    return (
      <BrowserRouter>
          <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sobre-nosotros" element={<Nosotros />} />
          <Route path="/libro-quejas" element={<Quejas />} />
          <Route path="/devoluciones" element={<Devoluciones />} />

          {/* <Route path="/product/:id" element={<ProductPage />} /> */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
          {/* <Route path="/indumentaria" element={<CategoryPage category="indumentaria" />} /> */}
          {/* <Route path="/calzado" element={<CategoryPage category="calzado" />} /> */}

          </Routes>
      </BrowserRouter>
  
    );
  }