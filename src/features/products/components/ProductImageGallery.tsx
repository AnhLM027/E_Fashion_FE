import { useState } from "react";
import type { ProductImage } from "../types/productImage.type";

interface Props {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: Props) {
  const [active, setActive] = useState(images[0]?.imageUrl);

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-3">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setActive(img.imageUrl)}
            className={`w-20 aspect-square border rounded-lg overflow-hidden ${
              active === img.imageUrl ? "border-black" : "border-gray-200"
            }`}
          >
            <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 aspect-square bg-gray-50 rounded-xl overflow-hidden">
        <img src={active} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
