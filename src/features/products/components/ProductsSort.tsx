import { type SortKey } from "@/utils/sortProducts";

type Props = {
  value: SortKey;
  onChange: (value: SortKey) => void;
};

export function ProductsSort({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sắp xếp:</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="name-asc">Tên A → Z</option>
        <option value="name-desc">Tên Z → A</option>
        <option value="category-asc">Danh mục A → Z</option>
        <option value="brand-asc">Nhãn hiệu A → Z</option>
      </select>
    </div>
  );
}
