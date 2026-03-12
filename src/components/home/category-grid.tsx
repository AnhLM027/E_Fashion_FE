import { Link } from "react-router-dom";
import { useCategories } from "@/features/categories/hooks/useCategories";

export function CategoryGrid() {
  // ⚡ loadTree để lấy tree từ API
  const { rootCategories, loading } = useCategories({ loadRoot: true });
  // console.log("root: ", rootCategories)

  const getLeafCategories = (nodes: any[]): any[] => {
    return nodes.flatMap((node) => {
      if (node.children && node.children.length > 0) {
        return getLeafCategories(node.children);
      }
      return [node];
    });
  };

  const leafCategories = getLeafCategories(rootCategories);
  // console.log("leaf: ", leafCategories)
  
  if (loading) {
    return (
      <section className="py-20 text-center">Đang tải danh mục...</section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="flex justify-start text-2xl font-semibold tracking-tight md:text-5xl">
            Khám phá danh mục
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {leafCategories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug ?? category.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl"
            >
              <div className="relative h-[420px]">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-500 group-hover:from-black/80" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-semibold">{category.name}</h3>

                  {category.description && (
                    <p className="mt-1 text-sm text-white/80">
                      {category.description}
                    </p>
                  )}

                  <span className="mt-4 inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black opacity-0 transition-all duration-500 group-hover:opacity-100">
                    Mua ngay →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
