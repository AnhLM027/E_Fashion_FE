/**
 * Định dạng số tiền sang chuẩn VNĐ (vi-VN)
 * @param price - Số tiền cần định dạng
 * @returns Chuỗi định dạng ví dụ: "100.000 ₫"
 */
export const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
