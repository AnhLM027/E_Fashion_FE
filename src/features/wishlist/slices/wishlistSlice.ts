import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistApi } from "../api/wishlist.api";

export interface WishlistItem {
  productId: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async () => {
    return await wishlistApi.getMyWishlist();
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: string) => {
    await wishlistApi.addToWishlist(productId);
    return productId;
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId: string) => {
    await wishlistApi.removeFromWishlist(productId);
    return productId;
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push({ productId: action.payload });
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload,
        );
      });
  },
});

export default wishlistSlice.reducer;