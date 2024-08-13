import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "@/store/services/cartProductSlice";

const store = () => {
  return configureStore({
    reducer: {
      cart: cartSlice,
    },
  });
};

export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export default store;
