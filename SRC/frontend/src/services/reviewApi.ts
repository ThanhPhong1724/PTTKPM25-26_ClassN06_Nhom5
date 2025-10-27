// src/services/reviewApi.ts
import apiClient from './apiClient';

// =======================
// Review Interface
// =======================
export interface Review {
  id?: string;
  userId?: string;
  productId: string;
  orderId?: string;
  rating: number;
  comment?: string;
  images?: string[];
  isApproved?: boolean;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// =======================
// USER-SIDE APIs
// =======================

// Kiểm tra health của service
export const checkReviewHealth = async () => {
  try {
    const response = await apiClient.get('/reviews/health');
    return response.data;
  } catch (error) {
    console.error(' Lỗi khi kiểm tra health reviews-service:', error);
    throw error;
  }
};

// Lấy tất cả review đã duyệt của 1 sản phẩm
export const getApprovedReviewsByProduct = async (productId: string): Promise<Review[]> => {
  try {
    const response = await apiClient.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error(' Lỗi khi lấy danh sách review đã duyệt:', error);
    throw error;
  }
};

// Gửi review mới
export const createReview = async (reviewData: Review, token: string): Promise<Review> => {
  try {
    const response = await apiClient.post('/reviews', reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi gửi review:', error);
    throw error;
  }
};

// Người dùng cập nhật review của mình (chưa duyệt)
export const updateReview = async (
  reviewId: string,
  updateData: Partial<Review>,
  token: string
): Promise<Review> => {
  try {
    const response = await apiClient.patch(`/reviews/${reviewId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(' Lỗi khi cập nhật review:', error);
    throw error;
  }
};

// =======================
// ADMIN-SIDE APIs
// =======================

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  isApproved?: boolean;
  isVisible?: boolean;
  productId?: string;
  userId?: string;
}

export interface PagedReviewsResponse {
  items: Review[];
  total: number;
  page: number;
  limit: number;
}

// Lấy tất cả review (phân trang + filter)
export const getAllReviews = async (
  token: string,
  params?: ReviewQueryParams
): Promise<PagedReviewsResponse> => {
  try {
    const response = await apiClient.get('/reviews/admin/all', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    console.error(' Lỗi khi lấy danh sách review (admin):', error);
    throw error;
  }
};

// Admin xem chi tiết 1 review
export const getReviewByIdAdmin = async (reviewId: string, token: string): Promise<Review> => {
  try {
    const response = await apiClient.get(`/reviews/admin/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(' Lỗi khi lấy chi tiết review (admin):', error);
    throw error;
  }
};

// Admin duyệt review
export const approveReview = async (reviewId: string, token: string): Promise<Review> => {
  try {
    const response = await apiClient.patch(
      `/reviews/admin/${reviewId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(' Lỗi khi duyệt review:', error);
    throw error;
  }
};

// Admin toggle hiển thị
export const toggleVisibility = async (reviewId: string, token: string): Promise<Review> => {
  try {
    const response = await apiClient.patch(
      `/reviews/admin/${reviewId}/toggle-visibility`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(' Lỗi khi thay đổi trạng thái hiển thị review:', error);
    throw error;
  }
};

// Admin xóa review
export const deleteReview = async (reviewId: string, token: string): Promise<void> => {
  try {
    await apiClient.delete(`/reviews/admin/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(' Lỗi khi xóa review:', error);
    throw error;
  }
};
