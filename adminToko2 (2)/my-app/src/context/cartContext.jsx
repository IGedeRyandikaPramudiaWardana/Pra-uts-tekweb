import { createContext, useContext, useState } from "react";
// import { products } from "../data.js"; // misalnya kamu punya file data.js

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Tambah produk ke cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };


  const updateQty = (id, qty) => { 
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item 
      ) 
    ); 
  }; 

  const removeFromCart = (id) => { 
    setCart((prev) => prev.filter((item) => item.id !== id)); 
  }; 

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const clearCart = () => {
  setCart([]);
};



  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, totalQty, clearCart}}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
      

{/* //    Tambah jumlah item (+) */}
{/* const increaseQuantity = (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   }; */}

{/* //   // Kurangi jumlah item (-) → kalau 0, hapus dari cart
//   const decreaseQuantity = (id) => {
//     setCartItems((prev) =>
//       prev.flatMap((item) =>
//         item.id === id
//           ? item.quantity > 1
//             ? [{ ...item, quantity: item.quantity - 1 }]
//             : [] // kalau quantity jadi 0 → hapus
//           : [item]
//       )
//     );
//   }; */}

{/* //   // Kosongkan cart
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   // 🔥 Fungsi khusus untuk mengurangi stok di data.js setelah checkout
//   const reduceStock = (products) => {
//     cartItems.forEach((cartItem) => {
//       const product = products.find((p) => p.id === cartItem.id);
//       if (product && product.stock >= cartItem.quantity) {
//         product.stock -= cartItem.quantity; // kurangi stok asli di data.js
//       }
//     });
//     clearCart(); // kosongkan keranjang setelah checkout
//   }; */}



{/* //   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         increaseQuantity,
//         decreaseQuantity,
//         removeFromCart,
//         clearCart,
//         reduceStock,
//         totalQty,
//          // dipakai di halaman Checkout
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// } */}
