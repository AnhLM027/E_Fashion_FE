import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductRatings, resetRatings } from "../slices/ratingSlice";
import type { RootState, AppDispatch } from "@/store/store";

export const useRatings = (productId: string) => {
    const dispatch = useDispatch<AppDispatch>();

    const { ratings, loading, page, hasMore } = useSelector(
        (state: RootState) => state.ratings
    );

    useEffect(() => {
        if (!productId) return;

        dispatch(resetRatings());
        dispatch(fetchProductRatings({ productId, page: 0 }));
    }, [productId, dispatch]);

    const loadMore = () => {
        if (!hasMore || loading) return;

        dispatch(fetchProductRatings({ productId, page: page + 1 }));
    };

    return {
        ratings,
        loading,
        hasMore,
        loadMore,
    };
};