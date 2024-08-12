import { createSlice } from "@reduxjs/toolkit";

const initialState: Array<object> = [];

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
        existingProduct.quantity += 1; // Increment the quantity if the product is already in the cart
      } else {
        state.push({ ...product, quantity: 1 }); // Add the new product with a quantity of 1
      }
    },
    removeFromCart: (state, action) => {
      const asin = action.payload;
      return state.filter((item) => item.asin !== asin);
    },
    clearCart: (state) => {
      return [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
