import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type CreateOrderRequest, orderApi } from "../api/order.api";

export interface OrderState {
    orders: any[];
    loading: boolean;
    creating: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    creating: false,
    error: null,
};

//
// ========================
// CREATE ORDER
// ========================
//
export const createOrder = createAsyncThunk(
    "orders/create",
    async (data: CreateOrderRequest, { rejectWithValue }) => {
        try {
            const response = await orderApi.createOrder(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Create failed");
        }
    },
);

//
// ========================
// FETCH MY ORDERS
// ========================
//
export const fetchMyOrders = createAsyncThunk(
    "orders/fetchMy",
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderApi.getMyOrders();
            // console.log("Fetch my orders response:", response);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    },
);

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            // CREATE
            .addCase(createOrder.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.creating = false;
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload as string;
            })

            // FETCH
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default orderSlice.reducer;