import { Star } from "lucide-react";
import { useRatings } from "../hooks/useRatings";

interface Props {
  productId: string;
}

const DEFAULT_AVATAR =
  "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/637216310_893488796743758_6656880761301265229_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeFT2sIkHQLA56dxN15snSosOCqPeRT0WCA4Ko95FPRYIOaNJP30Pmtgbt4aAHti6G0VIrg96lhfSCzunzI0UZFs&_nc_ohc=OhpBNj_OhVMQ7kNvwEqk8a9&_nc_oc=Adly1N7KsUzdUF8oE9j9gVgNf9yD8MqWBJYwmpz6a9lB35KkVTmfqQy-CmroXgxJ1i0&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=LxQXKWC4Lg_rhV-ZzzYNaw&_nc_ss=8&oh=00_AfzZ2QiSAM0Bt9y3bG4PXHBMWGjZdUiPcMcHGIX-Lwxx_Q&oe=69BC4719";

export function ProductRatings({ productId }: Props) {
  const { ratings, loading, hasMore, loadMore } = useRatings(productId);

  const average =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
        ).toFixed(1)
      : null;

  return (
    <div className="mt-12 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Đánh giá sản phẩm
            <span className="text-zinc-500 ml-2 text-base">
              ({ratings.length})
            </span>
          </h3>
        </div>

        {ratings.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold">{average}</span>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.round(Number(average))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-zinc-300"
                  }
                />
              ))}
            </div>

            <span className="text-sm text-zinc-500">
              Dựa trên {ratings.length} đánh giá
            </span>
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && ratings.length === 0 && (
        <p className="text-sm text-zinc-500">Đang tải đánh giá...</p>
      )}

      {/* EMPTY */}
      {!loading && ratings.length === 0 && (
        <div className="border rounded-xl p-8 text-center text-zinc-500 text-sm">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
      )}

      {/* LIST */}
      <div className="space-y-8">
        {ratings.map((r) => {
          const name = r.userName ?? "Ẩn danh";

          return (
            <div key={r.id} className="border-b pb-8 last:border-none">
              <div className="flex gap-4">
                {/* AVATAR */}
                <img
                  src={DEFAULT_AVATAR}
                  alt="avatar"
                  className="w-11 h-11 rounded-full object-cover"
                />

                <div className="flex-1">
                  {/* NAME + DATE */}
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-zinc-900">{name}</p>

                    <span className="text-xs text-zinc-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* PRODUCT INFO */}
                  {r.orderItem && (
                    <div className="flex items-center gap-3 mt-2">
                      <img
                        src={r.orderItem.imageUrl}
                        className="w-10 h-10 rounded object-cover border"
                      />

                      <div className="text-xs text-zinc-500">
                        <p>{r.orderItem.productName}</p>
                        <p>
                          Màu: {r.orderItem.colorName} | Size:{" "}
                          {r.orderItem.sizeName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* RATING */}
                  <div className="flex items-center gap-1 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < (r.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-zinc-300"
                        }
                      />
                    ))}

                    <span className="text-xs text-zinc-500 ml-1">
                      {r.rating}/5
                    </span>
                  </div>

                  {/* REVIEW */}
                  {r.reviewText && (
                    <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                      {r.reviewText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 text-sm font-medium border rounded-lg hover:bg-zinc-50 transition disabled:opacity-50"
          >
            {loading ? "Đang tải..." : "Xem thêm đánh giá"}
          </button>
        </div>
      )}
    </div>
  );
}
