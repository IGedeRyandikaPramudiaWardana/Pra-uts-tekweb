// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'


import React from "react"; 
import ReactDOM from "react-dom/client"; 
import { BrowserRouter } from "react-router-dom"; 
import App from "./App"; 
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ProductProvider } from "./utils/ProductContext";
import { AuthProvider } from "./context/AuthContext";
 

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render( 
  <React.StrictMode> 
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
              <App />
              <Toaster position="top-center" reverseOrder={false} />
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
    
  </React.StrictMode> 
);
