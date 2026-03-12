import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { fetchMyOrders } from "../slices/orderSlice";

export const useOrders = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { orders, loading, error } = useSelector(
        (state: RootState) => state.orders,
    );

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const refetch = () => {
        dispatch(fetchMyOrders());
    };

    return {
        orders,
        loading,
        error,
        refetch,
    };
};