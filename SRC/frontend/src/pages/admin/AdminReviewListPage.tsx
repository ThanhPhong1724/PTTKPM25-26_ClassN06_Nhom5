import React, { useState, useEffect, useCallback, JSX } from 'react';
import { motion } from 'framer-motion';
import {
  FiEye,
  FiFilter,
  FiSearch,
  FiMessageSquare,
  FiDownload,
  FiThumbsUp,
  FiStar,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiEyeOff,
} from 'react-icons/fi';
import { getAllReviews, approveReview, toggleVisibility, deleteReview, Review } from '../../services/reviewApi';
import { useAuth } from '../../contexts/AuthContext'; // cần để lấy token

// Helper: màu & icon trạng thái
const getStatusColor = (isApproved: boolean, isVisible: boolean) => {
  if (!isApproved) return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Chờ duyệt
  if (!isVisible) return 'bg-gray-100 text-gray-800 border-gray-200'; // Bị ẩn
  return 'bg-green-100 text-green-800 border-green-200'; // Đã duyệt & hiện
};

const getStatusIcon = (isApproved: boolean, isVisible: boolean) => {
  if (!isApproved) return <FiClock className="w-3 h-3" />;
  if (!isVisible) return <FiEyeOff className="w-3 h-3" />;
  return <FiCheckCircle className="w-3 h-3" />;
};

// Component chính
const AdminReviewListPage: React.FC = () => {
  const { state } = useAuth();
  const { user, token } = state; // token lấy từ AuthContext
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc / tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Gọi API
  const fetchAdminReviews = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReviews(token, { page: 1, limit: 50 });
      setReviews(data.items || []);
    } catch (err: any) {
      console.error(' Lỗi khi tải review:', err);
      setError(err.message || 'Không thể tải danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAdminReviews();
  }, [fetchAdminReviews]);

  // Lọc + tìm kiếm cục bộ
  const filteredReviews = reviews.filter((r) => {
    const matchSearch =
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      !statusFilter ||
      (statusFilter === 'pending' && !r.isApproved) ||
      (statusFilter === 'approved' && r.isApproved && r.isVisible) ||
      (statusFilter === 'hidden' && r.isApproved && !r.isVisible);
    return matchSearch && matchStatus;
  });

  // Các hành động admin
  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      await approveReview(id, token);
      fetchAdminReviews();
    } catch (err) {
      console.error(' Lỗi duyệt review:', err);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    if (!token) return;
    try {
      await toggleVisibility(id, token);
      fetchAdminReviews();
    } catch (err) {
      console.error(' Lỗi ẩn/hiện review:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Bạn có chắc muốn xóa review này không?')) return;
    try {
      await deleteReview(id, token);
      fetchAdminReviews();
    } catch (err) {
      console.error(' Lỗi khi xóa review:', err);
    }
  };

  // Thống kê
  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => !r.isApproved).length,
    approved: reviews.filter((r) => r.isApproved).length,
    hidden: reviews.filter((r) => !r.isVisible).length,
    averageRating:
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0,
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
          <p className="mt-1 text-sm text-gray-600">
            Duyệt, ẩn, và quản lý tất cả đánh giá của khách hàng.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </motion.button>
      </div>

      {/* Stats với hiệu ứng động */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
            icon={<FiMessageSquare className="h-8 w-8 text-indigo-600" />}
            label="Tổng đánh giá"
            value={stats.total}
            delay={0.1}
        />
        <StatCard
            icon={<FiClock className="h-8 w-8 text-yellow-600" />}
            label="Chờ duyệt"
            value={stats.pending}
            delay={0.2}
        />
        <StatCard
            icon={<FiThumbsUp className="h-8 w-8 text-green-600" />}
            label="Đã duyệt"
            value={stats.approved}
            delay={0.3}
        />
        <StatCard
            icon={<FiStar className="h-8 w-8 text-purple-600" />}
            label="Đánh giá TB"
            value={stats.averageRating.toFixed(1)}
            delay={0.4}
        />
        </div>


      {/* Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo ID sản phẩm, ID người dùng, nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Bộ lọc
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Table */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đánh giá</h3>
          <p className="mt-1 text-sm text-gray-500">Chưa có đánh giá nào được gửi.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th label="User ID" />
                  <Th label="Product ID" />
                  <Th label="Rating" />
                  <Th label="Ngày gửi" />
                  <Th label="Trạng thái" />
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviews.map((r, index) => (
                <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                >
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <FiUser className="h-4 w-4 text-indigo-600" />
                            </div>
                            </div>
                            <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                                {`User-${r.userId?.substring(0, 8)}`}
                            </div>
                            <div className="text-xs text-gray-500">{r.userId?.substring(0, 8)}...</div>
                            </div>
                        </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{r.productId.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500">{r.productId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                    {[...Array(5)].map((_, i) => (
                        <FiStar
                        key={i}
                        className={`inline h-4 w-4 ${
                            i < r.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        />
                    ))}
                    <p className="text-xs text-gray-600 mt-1">{r.comment}</p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(r.createdAt || '').toLocaleDateString('vi-VN')}
                    </td>

                    <td className="px-6 py-4">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        r.isApproved || false,
                        r.isVisible || false
                        )}`}
                    >
                        {getStatusIcon(r.isApproved || false, r.isVisible || false)}
                        <span className="ml-1">
                        {!r.isApproved ? 'Chờ duyệt' : r.isVisible ? 'Hiển thị' : 'Đã ẩn'}
                        </span>
                    </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium">
                    {!r.isApproved && (
                        <button
                        onClick={() => handleApprove(r.id!)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                        Duyệt
                        </button>
                    )}
                    <button
                        onClick={() => handleToggleVisibility(r.id!)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                        {r.isVisible ? 'Ẩn' : 'Hiện'}
                    </button>
                    <button
                        onClick={() => handleDelete(r.id!)}
                        className="text-red-600 hover:text-red-900"
                    >
                        Xóa
                    </button>
                    </td>
                </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredReviews.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-700 bg-white px-6 py-3 rounded-lg">
          <div>Hiển thị {filteredReviews.length} / {reviews.length} đánh giá</div>
        </div>
      )}
    </motion.div>
  );
};


// Sub-components (cho gọn)
const StatCard = ({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: JSX.Element;
  label: string;
  value: any;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
  >
    <div className="flex items-center">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

const Th = ({ label }: { label: string }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</th>
);

export default AdminReviewListPage;
