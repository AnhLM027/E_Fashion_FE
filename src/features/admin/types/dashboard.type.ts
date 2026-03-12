export interface RevenueByDayDTO {
  date: string; // LocalDate -> string
  revenue: number;
}

export interface RecentOrderDTO {
  id: string;
  receiverName: string;
  finalPrice: number;
  status: string;
  createdAt: string;
}

export interface TopProductDTO {
  productId: string;
  productName: string;
  totalSold: number;
}

export interface LowStockDTO {
  productName: string;
  colorName: string;
  sizeName: string;
  stock: number;
}

export interface DashboardResponseDTO {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;

  revenueByDay: RevenueByDayDTO[];
  recentOrders: RecentOrderDTO[];
  topProducts: TopProductDTO[];
  lowStockItems: LowStockDTO[];
}