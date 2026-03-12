export interface MockProduct {
  id: string;
  name: string;
  price: number;
  categoryName: string;
  brandName: string;
  thumbnail: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: "p1",
    name: "Classic Blazer",
    price: 2500000,
    categoryName: "Outerwear",
    brandName: "Luxury Fashion",
    thumbnail:
      "https://cdn.hstatic.net/products/200000690725/_o_web__1__6b24a02277304b6aa1e230dede7b4296_master.png",
  },
  {
    id: "p2",
    name: "Oversized Cotton Shirt",
    price: 1490000,
    categoryName: "Tops",
    brandName: "MONO Atelier",
    thumbnail:
      "https://cdn.hstatic.net/products/200000690725/15_8d7cdddca25a4685bfec1e98f742f800_master.jpg",
  },
  {
    id: "p3",
    name: "Slim Fit Jeans",
    price: 1800000,
    categoryName: "Bottoms",
    brandName: "Denim Co.",
    thumbnail:
      "https://cdn.hstatic.net/products/200000690725/_o_web_2445f8912b174c8fa4a87f99a36f16dc_master.png",
  },
  {
    id: "p4",
    name: "Structured Leather Bag",
    price: 3490000,
    categoryName: "Accessories",
    brandName: "LUMIÈRE",
    thumbnail:
      "https://cdn.hstatic.net/products/200000690725/11_a673d0e28e8f41c392663d4bad517439_master.jpg",
  },
  {
    id: "p5",
    name: "Silk Slip Dress",
    price: 2590000,
    categoryName: "Dresses",
    brandName: "AURA Collective",
    thumbnail:
      "https://cdn.hstatic.net/products/200000690725/20_9a7ae5f006f14e27bbe46f4b23722d36_master.jpg",
  },
  {
    id: "p6",
    name: "Minimal Leather Sneakers",
    price: 2790000,
    categoryName: "Footwear",
    brandName: "NØIR Studio",
    thumbnail:
      "https://cdn.hstatic.net/products/200000690725/15_8d7cdddca25a4685bfec1e98f742f800_master.jpg",
  },
];