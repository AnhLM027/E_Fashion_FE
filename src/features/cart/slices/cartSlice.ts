import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartApi } from "../api/cart.api";
import type { CartState } from "../types/cart.type";
import { logout } from "@/features/auth/slices/authSlice";
import { createOrder } from "@/features/orders/slices/orderSlice";

const initialState: CartState = {
  cartId: null,
  userId: null,
  items: [],
  totalPrice: 0,
  loading: false,
  updating: false,
  error: undefined,
};

/* =========================
   FETCH CART
========================= */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.getCart();
    } catch (err: any) {
      return rejectWithValue(err?.message || "Fetch cart failed");
    }
  }
);

/* =========================
   ADD ITEM
========================= */
export const addCartItem = createAsyncThunk(
  "cart/addItem",
  async (
    {
      productVariantSizeId,
      quantity,
    }: { productVariantSizeId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await cartApi.addItem(productVariantSizeId, quantity);
    } catch (err: any) {
      return rejectWithValue(err?.message || "Add item failed");
    }
  }
);

/* =========================
   UPDATE ITEM
========================= */
export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    {
      productVariantSizeId,
      quantity,
    }: { productVariantSizeId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      await cartApi.updateQuantity(productVariantSizeId, quantity);
      return await cartApi.getCart();
    } catch (err: any) {
      return rejectWithValue(err?.message || "Update cart failed");
    }
  }
);

/* =========================
   REMOVE ITEM
========================= */
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (productVariantSizeId: string, { rejectWithValue }) => {
    try {
      await cartApi.removeItem(productVariantSizeId);
      return await cartApi.getCart();
    } catch (err: any) {
      return rejectWithValue(err?.message || "Remove item failed");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: () => initialState,
  },
  extraReducers: builder => {
    builder

      /* RESET CART WHEN LOGOUT */
      .addCase(logout, () => initialState)

      /* FETCH CART */
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        if (!action.payload) return;

        state.cartId = action.payload.cartId ?? null;
        state.userId = action.payload.userId ?? null;
        state.items = action.payload.items ?? [];
        state.totalPrice = action.payload.totalPrice ?? 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ADD ITEM */
      .addCase(addCartItem.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.cartId = action.payload.cartId ?? null;
        state.userId = action.payload.userId ?? null;
        state.items = action.payload.items ?? [];
        state.totalPrice = action.payload.totalPrice ?? 0;
      })

      /* UPDATE ITEM */
      .addCase(updateCartItem.pending, state => {
        state.updating = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updating = false;

        if (!action.payload) return;

        state.items = action.payload.items ?? [];
        state.totalPrice = action.payload.totalPrice ?? 0;
      })
      .addCase(updateCartItem.rejected, state => {
        state.updating = false;
      })

      /* REMOVE ITEM */
      .addCase(removeCartItem.pending, state => {
        state.updating = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.updating = false;

        if (!action.payload) return;

        state.items = action.payload.items ?? [];
        state.totalPrice = action.payload.totalPrice ?? 0;
      })
      .addCase(removeCartItem.rejected, state => {
        state.updating = false;
      })
      
      .addCase(createOrder.fulfilled, () => initialState);
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;