import { Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/adminPages/AdminDashboard"; 
import AdminLayout from "./layouts/AdminLayout";
import AboutPage from "./pages/adminPages/AboutPage";
import ProductForm from "./pages/adminPages/ProductForm";
import ProductEdit from "./pages/adminPages/ProductEdit";
import AdminRoute from "./components/AdminRoute";

import MainLayout from "./layouts/MainLayout"; 
import Dashboard from "./pages/frontpages/Dashboard"; 
import ProductDetail from "./pages/frontpages/ProductDetail"; 
import Cart from "./pages/frontpages/Cart"; 
import Checkout from "./pages/frontpages/Checkout"; 

import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/frontpages/LoginPage";
import RegisterPage from "./pages/frontpages/RegisterPage"; 


export default function App() { 
  return ( 
    <Routes>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>

      {/* rute customer */}
      <Route path="/" element={<MainLayout />}> 
        <Route index element={<Dashboard />} /> 
        <Route path="product/:id" element={<ProductDetail />} /> 

        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} /> 
          <Route path="checkout" element={<Checkout />} />
        </Route> 
      </Route> 
      {/* Admin Layout wrapper, pendekatan jika menggunakan Outlet pada JSX 
*/} 

        {/* rute admin */}
      <Route element={<AdminRoute />}> 
            {/* Default route di dalam AdminLayout */} 
            {/* mapping path ke component page, gunakan autocompletion */} 
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} /> 
          <Route path="about" element={<AboutPage />} /> 
          <Route path="add-product" element={<ProductForm />} />
          <Route path="edit-product/:id" element={<ProductEdit />} />
        </Route>
      </Route>

        {/* rute login & register */}
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
    </Routes> 
  ); 
} 