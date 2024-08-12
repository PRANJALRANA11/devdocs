import {configureStore} from '@reduxjs/toolkit';
import cartSlice from '@/store/services/cartProductSlice';

const store = configureStore({
    reducer: {
        cart : cartSlice,
        //TODO: add more slices here for posts
    }
});


export default store;