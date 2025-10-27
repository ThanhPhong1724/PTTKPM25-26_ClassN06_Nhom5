import apiClient from './apiClient';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  images: string[];
  isApproved: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userAvatar?: string;
}

export interface CreateReviewDto {
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  images?: string[];
  isApproved?: boolean;
  isVisible?: boolean;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

/**
 * Lấy reviews của một sản phẩm (public)
 */
export const getProductReviews = async (
  productId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ReviewsResponse> => {
  const response = await apiClient.get(
    `/reviews/products/${productId}?page=${page}&limit=${limit}`,
  );
  return response.data;
};

/**
 * Lấy thống kê rating của sản phẩm (public)
 */
export const getProductRatingStats = async (
  productId: string,
): Promise<RatingStats> => {
  const response = await apiClient.get(`/reviews/products/${productId}/stats`);
  return response.data;
};

/**
 * Tạo review mới (require auth)
 */
export const createReview = async (
  reviewData: CreateReviewDto,
): Promise<Review> => {
  const response = await apiClient.post('/reviews', reviewData);
  return response.data;
};

/**
 * Lấy reviews của user hiện tại (require auth)
 */
export const getMyReviews = async (
  page: number = 1,
  limit: number = 10,
): Promise<ReviewsResponse> => {
  const response = await apiClient.get(
    `/reviews/my-reviews?page=${page}&limit=${limit}`,
  );
  return response.data;
};

/**
 * Kiểm tra user đã review sản phẩm trong order chưa (require auth)
 */
export const checkUserReviewed = async (
  productId: string,
  orderId: string,
): Promise<{ hasReviewed: boolean }> => {
  const response = await apiClient.get(
    `/reviews/check/${productId}/${orderId}`,
  );
  return response.data;
};

/**
 * Cập nhật review của user (require auth)
 */
export const updateReview = async (
  reviewId: string,
  updateData: UpdateReviewDto,
): Promise<Review> => {
  const response = await apiClient.put(`/reviews/${reviewId}`, updateData);
  return response.data;
};

/**
 * Xóa review của user (require auth)
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};

// ============================================================================
// ADMIN APIs
// ============================================================================

/**
 * Admin - Lấy tất cả reviews (require admin)
 */
export const adminGetAllReviews = async (
  params?: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
    isVisible?: boolean;
    rating?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  },
): Promise<ReviewsResponse> => {
  // Filter out undefined values
  const filteredParams: any = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filteredParams[key] = value;
      }
    });
  }
  
  const queryString = new URLSearchParams(filteredParams).toString();
  const response = await apiClient.get(`/reviews/admin/all?${queryString}`);
  return response.data;
};

/**
 * Admin - Lấy một review theo ID (require admin)
 */
export const adminGetReview = async (reviewId: string): Promise<Review> => {
  const response = await apiClient.get(`/reviews/admin/${reviewId}`);
  return response.data;
};

/**
 * Admin - Cập nhật review (require admin)
 */
export const adminUpdateReview = async (
  reviewId: string,
  updateData: UpdateReviewDto,
): Promise<Review> => {
  const response = await apiClient.put(
    `/reviews/admin/${reviewId}`,
    updateData,
  );
  return response.data;
};

/**
 * Admin - Xóa review (require admin)
 */
export const adminDeleteReview = async (reviewId: string): Promise<void> => {
  await apiClient.delete(`/reviews/admin/${reviewId}`);
};

/**
 * Admin - Duyệt nhiều reviews (require admin)
 */
export const adminBulkApprove = async (
  reviewIds: string[],
): Promise<{ message: string }> => {
  const response = await apiClient.post('/reviews/admin/bulk-approve', {
    reviewIds,
  });
  return response.data;
};

/**
 * Admin - Ẩn nhiều reviews (require admin)
 */
export const adminBulkHide = async (
  reviewIds: string[],
): Promise<{ message: string }> => {
  const response = await apiClient.post('/reviews/admin/bulk-hide', {
    reviewIds,
  });
  return response.data;
};

/**
 * Admin - Xóa nhiều reviews (require admin)
 */
export const adminBulkDelete = async (
  reviewIds: string[],
): Promise<{ message: string }> => {
  const response = await apiClient.post('/reviews/admin/bulk-delete', {
    reviewIds,
  });
  return response.data;
};

