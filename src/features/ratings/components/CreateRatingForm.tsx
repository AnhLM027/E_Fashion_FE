import { useState } from "react";
import { useDispatch } from "react-redux";
import { createRating } from "../slices/ratingSlice";
import type { AppDispatch } from "@/store/store";
import { Star } from "lucide-react";

interface Props {
  orderItemId: string;
  onSuccess?: () => void;
}

export function CreateRatingForm({ orderItemId, onSuccess }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async () => {
    await dispatch(
      createRating({
        orderItemId,
        rating,
        reviewText,
      }),
    );

    setReviewText("");

    onSuccess?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={22}
            onClick={() => setRating(star)}
            className={`cursor-pointer ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-300"
            }`}
          />
        ))}
      </div>

      <textarea
        className="w-full border rounded-lg p-2"
        placeholder="Chia sẻ cảm nhận của bạn..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Gửi đánh giá
      </button>
    </div>
  );
}
