import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { categoryApi } from "../api/categoryApi";

export interface CategoryResponseDTO {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  slug?: string;
  isActive?: boolean;
  createdAt?: string;
  children?: CategoryResponseDTO[];
}

export interface CategoryTreeDTO {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  children: CategoryTreeDTO[];
}

interface CategoryState {
  categories: CategoryResponseDTO[];
  rootCategories: CategoryResponseDTO[];
  categoryTree: CategoryTreeDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  rootCategories: [],
  categoryTree: [],
  loading: false,
  error: null,
};

/* ============================= */
/* THUNK                         */
/* ============================= */

export const fetchCategories = createAsyncThunk<
  CategoryResponseDTO[],
  void,
  { rejectValue: string }
>("category/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await categoryApi.getAll();
    // console.log("Fetched Categories:", response); // Debug: xem dữ liệu categories
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.message || "Lỗi khi tải danh mục",
    );
  }
});

/* FETCH ROOT */
export const fetchRootCategories = createAsyncThunk<
  CategoryResponseDTO[],
  void,
  { rejectValue: string }
>("category/fetchRootCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await categoryApi.getRoot();
    // console.log("Root Categories:", response); // Debug: xem dữ liệu root categories
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.message || "Lỗi khi tải root categories"
    );
  }
});

/* FETCH TREE */
export const fetchCategoryTree = createAsyncThunk<
  CategoryTreeDTO[],
  void,
  { rejectValue: string }
>("category/fetchCategoryTree", async (_, { rejectWithValue }) => {
  try {
    const response = await categoryApi.getTree();
    // console.log(response)
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Lỗi khi tải cây danh mục"
    );
  }
});

/* ============================= */
/* SLICE                         */
/* ============================= */

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      /* FETCH ALL */
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.filter(
          (c) => c.isActive !== false,
        );
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
      })

      /* FETCH ROOT */
      .addCase(fetchRootCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRootCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.rootCategories = action.payload.filter(
          (c) => c.isActive !== false,
        );
      })
      .addCase(fetchRootCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
      })

      /* FETCH TREE */
      .addCase(fetchCategoryTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryTree = action.payload;
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
      });
  },
});

/* ============================= */
/* SELECTORS                     */
/* ============================= */

export const selectCategories = (state: RootState) =>
  state.category.categories;

export const selectCategoryLoading = (state: RootState) =>
  state.category.loading;

export const selectCategoryError = (state: RootState) =>
  state.category.error;

export default categorySlice.reducer;