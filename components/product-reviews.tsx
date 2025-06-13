import { Star } from "lucide-react"
import type { Review } from "@/lib/products"

interface ProductReviewsProps {
  reviews: Review[]
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Reviews</h3>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white">{review.author}</p>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.date)}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 