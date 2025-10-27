import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiShoppingCart, FiAlertCircle, FiPackage } from 'react-icons/fi';
import {
  getAllCakeOptions,
  CakeOption,
  CakeOptionsGrouped,
  CakeCustomization,
  calculatePriceClientSide,
} from '../services/cakeOptionsApi';
import { addItemToCart } from '../services/cartApi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const CUSTOM_CAKE_PRODUCT_ID = '35537564-76ef-47c0-83b0-1115a1c4505c'; // Real UUID v4

const categoryLabels: Record<string, string> = {
  size: '1. Kích Thước',
  cake_base: '2. Cốt Bánh',
  frosting: '3. Kem Phủ',
  flavor: '4. Hương Vị',
  decoration: '5. Trang Trí',
};

const CustomCakeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { fetchCart } = useCart(); // Add cart context to refresh after adding
  const [options, setOptions] = useState<CakeOptionsGrouped>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Selected options state
  const [customization, setCustomization] = useState<CakeCustomization>({});

  // Fetch all options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const data = await getAllCakeOptions();
        setOptions(data);

        // Set default options
        const defaults: CakeCustomization = {};
        Object.entries(data).forEach(([category, opts]) => {
          const defaultOpt = opts.find((o: CakeOption) => o.isDefault);
          if (defaultOpt) {
            const key = category === 'cake_base' ? 'cakeBase' : category;
            const customizationKey = key as keyof CakeCustomization;
            if (customizationKey !== 'specialInstructions') {
              (defaults as any)[customizationKey] = {
                id: defaultOpt.id,
                name: defaultOpt.name,
                price: Number(defaultOpt.price),
              };
            }
          }
        });
        setCustomization(defaults);
      } catch (err) {
        console.error('Error fetching cake options:', err);
        setError('Không thể tải tùy chọn bánh. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSelectOption = (category: string, option: CakeOption) => {
    const key = category === 'cake_base' ? 'cakeBase' : category;
    setCustomization({
      ...customization,
      [key]: {
        id: option.id,
        name: option.name,
        price: Number(option.price),
      },
    });
  };

  const handleAddToCart = async () => {
    if (!authState.isAuthenticated) {
      localStorage.setItem('redirectPath', '/custom-cake-builder');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!customization.size || !customization.cakeBase || !customization.frosting) {
      setError('Vui lòng chọn đầy đủ Kích thước, Cốt bánh và Kem phủ');
      return;
    }

    setAddingToCart(true);
    setError(null);

    try {
      await addItemToCart({
        productId: CUSTOM_CAKE_PRODUCT_ID,
        quantity: 1,
        customization: {
          ...customization,
          specialInstructions: specialInstructions || undefined,
        },
        isCustomCake: true,
      });

      // Refresh cart context to show new item immediately
      await fetchCart();

      // Success - navigate to cart
      navigate('/cart');
    } catch (err: any) {
      console.error('Error adding custom cake to cart:', err);
      setError(err.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
    } finally {
      setAddingToCart(false);
    }
  };

  const totalPrice = calculatePriceClientSide(customization);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải tùy chọn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎂 Tạo Bánh Của Bạn
          </h1>
          <p className="text-lg text-gray-600">
            Thiết kế chiếc bánh hoàn hảo theo ý thích của bạn
          </p>
        </motion.div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Options Selection */}
          <div className="lg:col-span-2 space-y-8">
            {['size', 'cake_base', 'frosting', 'flavor', 'decoration'].map((category, idx) => {
              const opts = options[category as keyof CakeOptionsGrouped] || [];
              if (opts.length === 0) return null;

              const selectedKey = category === 'cake_base' ? 'cakeBase' : category;
              const selected = customization[selectedKey as keyof CakeCustomization];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {categoryLabels[category]}
                    {['size', 'cake_base', 'frosting'].includes(category) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opts.map((option) => {
                      const isSelected = selected && typeof selected === 'object' && 'id' in selected && selected.id === option.id;

                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectOption(category, option)}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="bg-purple-500 rounded-full p-1">
                                <FiCheck className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}

                          <h3 className="font-medium text-gray-900 mb-1">
                            {option.name}
                          </h3>
                          {option.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {option.description}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-purple-600">
                            {option.price > 0
                              ? `+${option.price.toLocaleString('vi-VN')}đ`
                              : 'Cơ bản'}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}

            {/* Special Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📝 Ghi Chú Đặc Biệt (Tùy chọn)
              </h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Ví dụ: Viết chữ 'Happy Birthday', thêm nến số 25,..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                Tối đa 200 ký tự. Chúng tôi sẽ cố gắng đáp ứng yêu cầu của bạn.
              </p>
            </motion.div>
          </div>

          {/* Price Summary & Add to Cart */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <FiPackage className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tóm Tắt Đơn Hàng
                  </h2>
                </div>

                {/* Selected Options Summary */}
                <div className="space-y-3 mb-6">
                  {customization.size && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kích thước:</span>
                      <span className="font-medium">{customization.size.name}</span>
                    </div>
                  )}
                  {customization.cakeBase && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cốt bánh:</span>
                      <span className="font-medium">{customization.cakeBase.name}</span>
                    </div>
                  )}
                  {customization.frosting && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kem phủ:</span>
                      <span className="font-medium">{customization.frosting.name}</span>
                    </div>
                  )}
                  {customization.flavor && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hương vị:</span>
                      <span className="font-medium">{customization.flavor.name}</span>
                    </div>
                  )}
                  {customization.decoration && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trang trí:</span>
                      <span className="font-medium">{customization.decoration.name}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Tổng Giá:</span>
                    <span className="text-3xl font-bold text-purple-600">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                  >
                    <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={addingToCart || !customization.size || !customization.cakeBase || !customization.frosting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Đang thêm...</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      <span>Thêm Vào Giỏ Hàng</span>
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  * Kích thước, Cốt bánh và Kem phủ là bắt buộc
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakeBuilderPage;

