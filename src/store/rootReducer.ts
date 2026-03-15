import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/slices/authSlice";
import productReducer from "@/features/products/slices/productSlice";
import categoryReducer from "@/features/categories/slices/categorySlice";
import cartReducer from "@/features/cart/slices/cartSlice";
import orderReducer from "@/features/orders/slices/orderSlice";
import wishlistReducer from "@/features/wishlist/slices/wishlistSlice";
import ratingReducer from "@/features/ratings/slices/ratingSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  category: categoryReducer,
  cart: cartReducer,
  orders: orderReducer,
  wishlist: wishlistReducer,
  ratings: ratingReducer,
});

export default rootReducer;
