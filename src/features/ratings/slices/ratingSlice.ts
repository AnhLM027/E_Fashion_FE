import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Rating } from "../types/rating.types";
import { ratingApi } from "../api/ratingApi";

interface RatingState {
  ratings: Rating[];
  loading: boolean;
  page: number;
  hasMore: boolean;
}

const initialState: RatingState = {
  ratings: [],
  loading: false,
  page: 0,
  hasMore: true,
};

export const fetchProductRatings = createAsyncThunk(
  "ratings/fetchProductRatings",
  async ({
    productId,
    page,
  }: {
    productId: string;
    page?: number;
  }) => {
    const res = await ratingApi.getProductRatings(productId, page ?? 0, 5);
    return res;
  }
);

export const createRating = createAsyncThunk(
  "ratings/createRating",
  async (data: any) => {
    return await ratingApi.createRating(data);
  }
);

const ratingSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {
    resetRatings: (state) => {
      state.ratings = [];
      state.page = 0;
      state.hasMore = true;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchProductRatings.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchProductRatings.fulfilled, (state, action) => {
      state.loading = false;

      const { content, totalPages, number } = action.payload;

      if (number === 0) {
        state.ratings = content;
      } else {
        state.ratings.push(...content);
      }

      state.page = number;
      state.hasMore = number + 1 < totalPages;
    });

    builder.addCase(createRating.fulfilled, (state, action) => {
      state.ratings.unshift(action.payload);
    });
  },
});

export const { resetRatings } = ratingSlice.actions;

export default ratingSlice.reducer;