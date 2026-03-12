import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchRootCategories,
  fetchCategoryTree,
} from "../slices/categorySlice";
import type { RootState, AppDispatch } from "@/store/store";

interface UseCategoriesOptions {
  loadRoot?: boolean;
  loadTree?: boolean;
  force?: boolean; // nếu true sẽ gọi lại API dù đã có data
}

export const useCategories = (options?: UseCategoriesOptions) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    categories,
    rootCategories,
    categoryTree,
    loading,
    error,
  } = useSelector((state: RootState) => state.category);

  const { loadRoot = false, loadTree = false, force = false } = options || {};

  useEffect(() => {
    // Load categories thường
    if (force || categories.length === 0) {
      dispatch(fetchCategories());
    }

    // Load root nếu yêu cầu
    if (loadRoot && (force || rootCategories.length === 0)) {
      dispatch(fetchRootCategories());
    }

    // Load tree nếu yêu cầu
    if (loadTree && (force || categoryTree.length === 0)) {
      dispatch(fetchCategoryTree());
    }
  }, [dispatch, loadRoot, loadTree, force]);

  return {
    categories,
    rootCategories,
    categoryTree,
    loading,
    error,
  };
};