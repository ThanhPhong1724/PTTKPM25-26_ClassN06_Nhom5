import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiEye, FiEyeOff, FiCheck, FiTrash2, FiFilter } from 'react-icons/fi';
import {
  adminGetAllReviews,
  adminUpdateReview,
  adminDeleteReview,
  adminBulkApprove,
  adminBulkHide,
  adminBulkDelete,
  Review,
} from '../../services/reviewApi';

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  
  // Filters
  const [filterApproved, setFilterApproved] = useState<boolean | undefined>(undefined);
  const [filterVisible, setFilterVisible] = useState<boolean | undefined>(undefined);
  const [filterRating, setFilterRating] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchReviews();
  }, [page, filterApproved, filterVisible, filterRating]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminGetAllReviews({
        page,
        limit: 20,
        isApproved: filterApproved,
        isVisible: filterVisible,
        rating: filterRating,
        sortBy: 'createdAt',
        order: 'DESC',
      });
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map(r => r.id));
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await adminUpdateReview(reviewId, { isApproved: true });
      fetchReviews();
    } catch (error) {
      alert('Có lỗi xảy ra khi duyệt đánh giá');
    }
  };

  const handleToggleVisibility = async (reviewId: string, currentVisibility: boolean) => {
    try {
      await adminUpdateReview(reviewId, { isVisible: !currentVisibility });
      fetchReviews();
    } catch (error) {
      alert('Có lỗi xảy ra khi thay đổi trạng thái');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    
    try {
      await adminDeleteReview(reviewId);
      fetchReviews();
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa đánh giá');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) return;
    
    try {
      await adminBulkApprove(selectedReviews);
      setSelectedReviews([]);
      fetchReviews();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleBulkHide = async () => {
    if (selectedReviews.length === 0) return;
    
    try {
      await adminBulkHide(selectedReviews);
      setSelectedReviews([]);
      fetchReviews();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedReviews.length} đánh giá?`)) return;
    
    try {
      await adminBulkDelete(selectedReviews);
      setSelectedReviews([]);
      fetchReviews();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Đánh giá</h1>
        <p className="text-gray-600">Tổng cộng {total} đánh giá</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Bộ lọc</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái duyệt
            </label>
            <select
              value={filterApproved === undefined ? '' : filterApproved.toString()}
              onChange={(e) => setFilterApproved(e.target.value === '' ? undefined : e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tất cả</option>
              <option value="true">Đã duyệt</option>
              <option value="false">Chưa duyệt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiển thị
            </label>
            <select
              value={filterVisible === undefined ? '' : filterVisible.toString()}
              onChange={(e) => setFilterVisible(e.target.value === '' ? undefined : e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tất cả</option>
              <option value="true">Hiển thị</option>
              <option value="false">Đã ẩn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số sao
            </label>
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tất cả</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-purple-50 rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-purple-900 font-medium">
            Đã chọn {selectedReviews.length} đánh giá
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                transition-colors flex items-center gap-2"
            >
              <FiCheck className="w-4 h-4" />
              Duyệt
            </button>
            <button
              onClick={handleBulkHide}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                transition-colors flex items-center gap-2"
            >
              <FiEyeOff className="w-4 h-4" />
              Ẩn
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                transition-colors flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhận xét
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không có đánh giá nào
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => handleSelectReview(review.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {review.userName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {review.userName || 'Người dùng'}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">
                            {review.userId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          ({review.rating})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                        {review.comment || <span className="text-gray-400">Không có nhận xét</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                            review.isApproved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {review.isApproved ? 'Đã duyệt' : 'Chưa duyệt'}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                            review.isVisible
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {review.isVisible ? 'Hiển thị' : 'Đã ẩn'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!review.isApproved && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Duyệt"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleVisibility(review.id, review.isVisible)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={review.isVisible ? 'Ẩn' : 'Hiển thị'}
                        >
                          {review.isVisible ? (
                            <FiEyeOff className="w-5 h-5" />
                          ) : (
                            <FiEye className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Trang {page} / {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium
                  text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium
                  text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;

