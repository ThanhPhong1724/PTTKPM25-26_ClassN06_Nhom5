import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getProductsByCategory, Product } from '../services/productApi';
import { getCategories, Category } from '../services/categoryApi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FiSearch, FiFilter, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { GiCakeSlice, GiSparkles } from 'react-icons/gi';
import './../assets/styles/HomePage.css';

// Thêm interfaces cho các options
interface SortOption {
  value: string;
  label: string;
}

// Thêm các options sắp xếp
const sortOptions: SortOption[] = [
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'newest', label: 'Mới nhất' }
];

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, state: cartState } = useCart();
  const { state: authState } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  // Thêm states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [categoriesData] = await Promise.all([
          getCategories()
        ]);
        setCategories(categoriesData);

        // Nếu có category được chọn, lấy sản phẩm theo category
        if (activeCategory && activeCategory !== 'all') {
          const productsData = await getProductsByCategory(activeCategory);
          setProducts(productsData);
        } else {
          // Nếu không, lấy tất cả sản phẩm
          const productsData = await getProducts();
          setProducts(productsData);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]); // Thêm activeCategory vào dependencies

  const handleAddToCart = async (productId: string) => {
    if (!authState.isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    try {
      await addToCart(productId, 1);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err: any) {
      alert(err.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  // Thêm hàm xử lý sắp xếp và lọc
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Lọc theo tên
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo khoảng giá
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const min = priceRange.min ? parseInt(priceRange.min) : 0;
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
        return product.price >= min && product.price <= max;
      });
    }

    // Sắp xếp
    switch (sortBy) {
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    return filtered;
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section - Thay đổi theme */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white py-8"> {/* Giảm py-16 xuống py-8 */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <GiCakeSlice className="w-12 h-12 mx-auto mb-3 text-pink-100" /> {/* Giảm kích thước icon */}
            <h1 className="text-3xl md:text-4xl font-serif italic font-bold mb-2"> {/* Giảm font size */}
              Bánh Ngọt Tuyệt Hảo
            </h1>
            <p className="text-lg text-pink-100"> {/* Giảm font size */}
              Khám phá bộ sưu tập bánh ngọt độc đáo của chúng tôi
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Categories Scroll - Làm mới thiết kế */}
        <div className="mb-12">
          <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchParams({})}
              className={`
                flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium
                ${activeCategory === 'all' 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border border-pink-200 hover:border-pink-400'}
                transition-all duration-200
              `}
            >
              Tất cả
            </motion.button>
            {categories.map(category => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchParams({ category: category.id })}
                className={`
                  flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium
                  ${activeCategory === category.id 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 border border-pink-200 hover:border-pink-400'}
                  transition-all duration-200
                `}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg py-4 mb-8 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm bánh ngọt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-full border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 w-5 h-5" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100"
            >
              <FiFilter className="w-5 h-5" />
              Bộ lọc
            </motion.button>
          </div>
        </div>

        {/* Filter Panel - Sửa overlay và thêm animation khi đóng */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/30 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-0 top-20 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-96"
              >
                <div className="bg-white p-6 md:p-8 rounded-t-3xl md:rounded-3xl shadow-xl mx-4 md:mx-0">
                  {/* Sort Options */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sắp xếp theo
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khoảng giá
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Đến"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Buttons with new gradient */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setPriceRange({ min: '', max: '' });
                        setSortBy('newest');
                        setSearchTerm('');
                        setShowFilters(false);
                      }}
                      className="flex-1 px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 transition-opacity"
                    >
                      Áp dụng
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 px-6 py-3 rounded-full text-sm font-medium border border-gray-200 hover:border-purple-400"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products Grid - Cập nhật thiết kế card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {getFilteredAndSortedProducts().map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden rounded-t-3xl">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-medium px-6 py-2 rounded-full bg-black/60 border border-white/20">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-serif italic font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-pink-600">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-pink-600">
                      {product.price.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Còn {product.stockQuantity} bánh
                  </p>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-pink-500 hover:text-white transition-colors"
                >
                  <FiHeart className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-6 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={cartState.isLoading || product.stockQuantity === 0}
                  className={`
                    w-full py-3 px-6 rounded-full font-medium
                    flex items-center justify-center gap-2
                    ${product.stockQuantity === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'}
                    transition-colors duration-200 shadow-lg hover:shadow-xl
                  `}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  {product.stockQuantity === 0 
                    ? 'Hết hàng'
                    : cartState.isLoading 
                      ? 'Đang thêm...' 
                      : 'Thêm vào giỏ'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredAndSortedProducts().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <GiCakeSlice className="w-16 h-16 text-pink-200 mx-auto mb-4" />
              <h3 className="text-xl font-serif italic font-medium text-gray-900 mb-2">
                Không tìm thấy bánh ngọt
              </h3>
              <p className="text-gray-500">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filter Panel giữ nguyên logic, chỉ cập nhật màu sắc... */}
    </div>
  );
};

export default ProductListPage;