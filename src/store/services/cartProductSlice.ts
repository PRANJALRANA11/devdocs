import { createSlice } from "@reduxjs/toolkit";
import { parse } from "path";

// Initialize state with localStorage if available
let initialState: Array<object> = [];

if (typeof window !== "undefined" && localStorage.getItem("cart")) {
  initialState = JSON.parse(localStorage.getItem("cart") ?? "[]");
} 

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.find(
        (item) => item.product_title === product.product_title
      );

      if (existingProduct) {
        let unitPrice = existingProduct.product_price 
        if(existingProduct.quantity > 1)    unitPrice = existingProduct.product_price / (existingProduct.quantity);
        existingProduct.quantity += 1; // Increment the quantity if the product is already in the cart
  
        existingProduct.product_price =parseFloat((existingProduct.product_price + unitPrice).toFixed(2));// Increment the price
      } else {
        state.push({ ...product, quantity: 1 }); // Add the new product with a quantity of 1
      }

      // Update localStorage after state is modified
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const { asin, remove } = action.payload;
    
      const existingProduct = state.find((item) => item.asin === asin);
    
      if (existingProduct) {
        if (existingProduct.quantity > 1 && !remove) {
          // Decrement the quantity if there's more than one item
          existingProduct.quantity -= 1;
          
          // Adjust the price by recalculating based on the unit price
          const unitPrice = existingProduct.product_price / (existingProduct.quantity + 1);
          // console.log(unitPrice)
          // console.log(existingProduct.product_price)
          existingProduct.product_price = parseFloat((existingProduct.product_price -  unitPrice ).toFixed(2));
          // console.log(existingProduct.product_price)  
    
          // Update localStorage after state is modified
          localStorage.setItem("cart", JSON.stringify(state));
        } else {
          // Remove the product from the cart if the quantity is 1 or if remove is true
          const updatedState = state.filter((item) => item.asin !== asin);
    
          // Update the state immutably
          state.length = 0;
          state.push(...updatedState);
    
          // Update localStorage
          localStorage.setItem("cart", JSON.stringify(updatedState));
        }
      }
    },
    
    clearCart: (state) => {
      // Clear the state
      state.length = 0;

      // Clear localStorage
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
