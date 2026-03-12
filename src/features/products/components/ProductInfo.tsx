import type { Product } from "../types/product.type";

interface Props {
  product: Product;
}

export function ProductInfo({ product }: Props) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {product.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {product.brandName}
        </p>
      </div>

      {/* Price */}
      <div className="text-2xl font-medium">
        {product.price}₫
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {/* {product?.description} */}\
        Description
      </p>

      {/* Options (ví dụ size) */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Kích thước</p>
        <div className="flex gap-2">
          {["S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              className="border rounded-md px-4 py-2 text-sm hover:border-black"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 pt-4">
        <button className="flex-1 bg-black text-white py-3 rounded-md hover:opacity-90">
          Thêm vào giỏ
        </button>
        <button className="w-12 border rounded-md hover:bg-gray-100">
          ♥
        </button>
      </div>

      {/* Extra info */}
      <div className="text-sm text-gray-500 border-t pt-4 space-y-1">
        <p>✔ Giao hàng toàn quốc</p>
        <p>✔ Đổi trả trong 7 ngày</p>
        <p>✔ Sản phẩm chính hãng</p>
      </div>
    </div>
  );
}
