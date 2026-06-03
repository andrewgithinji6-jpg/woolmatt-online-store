'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiThumbsUp, FiUser } from 'react-icons/fi';

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  avatar: string;
}

interface ProductReviewsProps {
  rating: number;
  totalReviews: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'John Kipchoge',
    rating: 5,
    title: 'Excellent Quality!',
    comment: 'Very fresh and good quality. Delivered on time. Will definitely order again!',
    date: '2025-05-20',
    helpful: 24,
    avatar: '👨',
  },
  {
    id: '2',
    author: 'Sarah Mwangi',
    rating: 4,
    title: 'Good but packaging could be better',
    comment: 'Product is great but the packaging was a bit damaged. Still in good condition though.',
    date: '2025-05-18',
    helpful: 12,
    avatar: '👩',
  },
  {
    id: '3',
    author: 'Peter Ochieng',
    rating: 5,
    title: 'Highly Recommended',
    comment: 'Best supermarket shopping experience. Fast delivery and excellent customer service.',
    date: '2025-05-15',
    helpful: 18,
    avatar: '👨‍🔬',
  },
];

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  rating,
  totalReviews,
}) => {
  const [showReviews, setShowReviews] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, count: Math.round(totalReviews * 0.6) },
    { stars: 4, count: Math.round(totalReviews * 0.2) },
    { stars: 3, count: Math.round(totalReviews * 0.1) },
    { stars: 2, count: Math.round(totalReviews * 0.05) },
    { stars: 1, count: Math.round(totalReviews * 0.05) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Rating Summary */}
      <div className="bg-woolmatt-light rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-woolmatt-dark mb-2">
              Customer Reviews
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400 text-2xl">
                {'⭐'.repeat(Math.floor(rating))}
              </div>
              <span className="text-lg font-bold text-woolmatt-dark">
                {rating.toFixed(1)}
              </span>
              <span className="text-gray-600">
                ({totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm font-semibold w-12">{item.stars}★</span>
              <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all"
                  style={{
                    width: `${(item.count / totalReviews) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {showReviews && (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-woolmatt-dark">
            Recent Reviews
          </h4>
          {mockReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{review.avatar}</div>
                  <div>
                    <p className="font-bold text-woolmatt-dark">
                      {review.author}
                    </p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(review.rating)}
                </div>
              </div>

              {/* Review Content */}
              <p className="font-semibold text-woolmatt-dark mb-2">
                {review.title}
              </p>
              <p className="text-gray-700 text-sm mb-4">{review.comment}</p>

              {/* Helpful */}
              <button className="flex items-center gap-2 text-gray-600 hover:text-woolmatt-primary transition text-sm">
                <FiThumbsUp size={16} />
                Helpful ({review.helpful})
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Toggle Reviews Button */}
      <button
        onClick={() => setShowReviews(!showReviews)}
        className="text-woolmatt-primary font-semibold hover:underline"
      >
        {showReviews ? '− Hide Reviews' : '+ Show All Reviews'}
      </button>
    </motion.div>
  );
};