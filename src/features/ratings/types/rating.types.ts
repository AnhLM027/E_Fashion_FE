export interface RatingOrderItem {
  productName: string
  imageUrl: string
  colorName: string
  sizeName: string
}

export interface Rating {
  id: string
  userId: string
  userName: string | null
  productId: string
  orderItemId: string
  rating: number
  reviewText: string
  createdAt: string

  orderItem?: RatingOrderItem
}

export interface CreateRatingRequest {
  orderItemId: string
  rating: number
  reviewText: string
}