import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "../types/product.type";
import type { HomeProduct } from "../types/homeProduct.type";
import { productsApi } from "../api/products.api";

export interface ProductFilterParams {
  keyword?: string;
  categorySlugs?: string[];
  brandSlugs?: string[];
  colorSlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
}

interface ProductsState {
  items: Product[];
  bestSellers: HomeProduct[];
  featured: HomeProduct[];
  newArrivals: HomeProduct[];
  loading: boolean;
  error?: string;
}

const initialState: ProductsState = {
  items: [],
  bestSellers: [],
  featured: [],
  newArrivals: [],
  loading: false,
};


// 📦 All Products (Filter dynamic)
export const fetchProducts = createAsyncThunk<
  Product[],
  ProductFilterParams | undefined
>("products/fetchProducts", async (params) => {
  // console.log(params)
  return await productsApi.getAll(params);
});


// 🏆 Best Sellers
export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async () => {
    return await productsApi.getBestSellers();
  }
);

// 🔥 Featured (sale)
export const fetchFeatured = createAsyncThunk(
  "products/fetchFeatured",
  async () => {
    return await productsApi.getSale();
  }
);

// 🆕 New Arrivals
export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async () => {
    return await productsApi.getNewArrivals();
  }
);


const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 📦 All products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🏆 Best Sellers
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload;
      })

      // 🔥 Featured
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = action.payload;
      })

      // 🆕 New Arrivals
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
      });
  },
});

export default productsSlice.reducer;