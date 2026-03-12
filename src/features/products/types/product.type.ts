export interface Product {
  id: string
  name: string
  slug: string
  thumbnail: string
  brandId: string
  brandName: string
  brandSlug: string
  categoryId: string
  categoryName: string
  categorySlug: string
  colors: {
    id: string
    name: string
    slug: string
    code: string | null
    isActive: boolean | null
  }[]

  originalPrice: number
  salePrice: number
  
  description: string
  isActive: boolean
  deletedAt: string | null
}