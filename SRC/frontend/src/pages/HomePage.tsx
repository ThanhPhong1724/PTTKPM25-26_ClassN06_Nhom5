import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productApi';
import { getCategories } from '../services/categoryApi';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiCreditCard, FiGift } from 'react-icons/fi';
// import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "aos/dist/aos.css";

import './../assets/styles/HomePage.css';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  img: string;
  categoryId: string;
  discount?: number;
  createdAt: string;
  originalPrice?: number;
}

interface Category {
  id: string;
  name: string;
  img: string;
}

// Cập nhật COLORS
const COLORS = {
  primary: 'from-pink-300 to-rose-400',
  secondary: 'from-purple-300 to-pink-400',
  accent: 'from-yellow-300 to-orange-400',
};

// Cập nhật features
const features = [
  {
    icon: <FiTruck className="w-6 h-6" />,
    title: "Giao hàng nhanh",
    description: "Freeship trong 2h"
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: "Bánh tươi mỗi ngày",
    description: "Đảm bảo vệ sinh ATTP"
  },
  {
    icon: <FiCreditCard className="w-6 h-6" />,
    title: "Đặt hàng dễ dàng",
    description: "Nhiều phương thức thanh toán"
  },
  {
    icon: <FiGift className="w-6 h-6" />,
    title: "Ưu đãi hấp dẫn",
    description: "Giảm 20% đơn đầu tiên"
  }
];

// Cập nhật getCategoryColor
const getCategoryColor = (categoryName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Bánh kem truyền thống': COLORS.primary,
    'Bánh kem tình yêu': COLORS.secondary,
    'Bánh mousse': COLORS.accent
  };
  return colorMap[categoryName] || 'from-gray-500 to-gray-700';
};

const ProductSliderArrow = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`
      absolute top-1/2 z-10 -translate-y-1/2
      ${direction === 'prev' ? 'left-2 md:-left-5' : 'right-2 md:-right-5'}
      w-10 h-10 rounded-full
      bg-white shadow-lg hover:shadow-xl
      flex items-center justify-center
      text-gray-600 hover:text-brand-primary
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-brand-primary
      group
    `}
    aria-label={direction === 'prev' ? 'Previous' : 'Next'}
  >
    <FiArrowRight 
      className={`w-5 h-5 ${direction === 'prev' ? 'rotate-180' : ''} 
      transition-transform group-hover:scale-110`} 
    />
  </button>
);

const heroSlides = [
  {
    image: "https://product.hstatic.net/200000411281/product/mousse_chanh_leo_8_1_d4f37b82c29f41af9bfa3c4a1920f50b_master.png",
    title: "Bánh Kem Cao Cấp",
    description: "Những chiếc bánh nghệ thuật cho khoảnh khắc đặc biệt",
    buttonText: "Khám Phá Ngay",
    buttonLink: "/products?category=premium"
  },
  {
    image: "https://product.hstatic.net/200000411281/product/sweetlove_8_a43c559b16ed43b2ac43d4026692cdea_master.png",
    title: "Bánh Kem Tình Yêu",
    description: "Ngọt ngào cho những cặp đôi hạnh phúc",
    buttonText: "Xem Bộ Sưu Tập",
    buttonLink: "/products?category=love"
  },
  {
    image: "https://product.hstatic.net/200000411281/product/mousse_hawaii_8_1_e7ed3973bf7f40589f22bd302482261f_master.jpg",
    title: "Bánh Mousse Đặc Biệt",
    description: "Hương vị mới lạ, độc đáo",
    buttonText: "Đặt Hàng Ngay",
    buttonLink: "/products?category=mousse"
  }
];


const CustomArrow = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 z-10 -translate-y-1/2 ${
      direction === 'prev' ? 'left-4' : 'right-4'
    } w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 flex items-center justify-center text-white`}
  >
    <FiArrowRight className={`w-6 h-6 ${direction === 'prev' ? 'rotate-180' : ''}`} />
  </button>
);

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  fade: true,
  cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
  pauseOnHover: true,
  arrows: true,
  prevArrow: <CustomArrow direction="prev" />,
  nextArrow: <CustomArrow direction="next" />,
  appendDots: (dots: React.ReactNode) => (
    <div style={{ position: 'absolute', bottom: '2rem' }}>
      <ul className="flex justify-center gap-2">{dots}</ul>
    </div>
  ),
  customPaging: () => (
    <button className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-200" />
  ),
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false
      }
    }
  ]
};

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });

    const fetchData = async () => {
      try {
        const [products, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        // Transform products to match the component's Product interface
        const transformedProducts = products.map(product => ({
          ...product,
          imageUrl: product.img || '/default-image.jpg',
          createdAt: product.createdAt 
            ? (typeof product.createdAt === 'string' 
              ? product.createdAt 
              : product.createdAt.toISOString())
            : new Date().toISOString() // Provide default value for undefined createdAt
        }));
    
      setFeaturedProducts(transformedProducts.slice(0, 8));
      setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sectionTitleClasses = "text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12";

  const productSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <ProductSliderArrow direction="prev" />,
    nextArrow: <ProductSliderArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        <Slider {...sliderSettings}>
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative h-[calc(100vh-4rem)] min-h-[400px] max-h-[700px]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end items-center text-center p-6 sm:p-12">
                <div className="text-white max-w-2xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8"
                  >
                    {slide.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Link
                      to={slide.buttonLink}
                      className="bg-brand-primary text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-black/50 transition duration-300 inline-flex items-center group"
                    >
                      {slide.buttonText}
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex-shrink-0 p-3 bg-brand-primary/10 rounded-lg text-brand-primary">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl sm:text-5xl font-serif italic font-bold text-center text-gray-800 mb-12">
          Bánh Ngọt Nổi Bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={category.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3] group bg-gradient-to-br from-pink-200 to-purple-100"
            >
              {/* Thêm background fallback */}
              <div 
                className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${category.img || '/default-cake.jpg'})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }} 
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/70 via-pink-400/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                <span className="px-4 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-pink-500 mb-4">
                  <span className="font-sans">{category.name}</span>
                </span>
                <h3 className="text-2xl md:text-3xl font-serif italic font-bold text-white text-center mb-6 drop-shadow-lg">
                  <span className="font-sans">{category.name}</span>
                </h3>
                <Link
                  to={`/products?category=${category.id}`}
                  className="px-6 py-3 bg-white hover:bg-pink-50 text-pink-500 rounded-full text-sm font-medium
                  transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                  flex items-center space-x-2"
                >
                  <span>Khám phá</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Decorative dots */}
              <div className="absolute top-4 right-4 flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/80 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16 overflow-hidden">
        <h2 className={sectionTitleClasses}>Sản Phẩm Nổi Bật</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <Slider {...productSliderSettings} className="featured-products-slider -mx-2">
            {featuredProducts.map((product) => (
              <div key={product.id} className="px-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <Link 
                    to={`/products/${product.id}`} 
                    className="block relative aspect-w-1 aspect-h-1 w-full h-64" // Thêm h-64 để fix chiều cao
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        -{product.discount}%
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <Link to={`/products/${product.id}`} className="block">
                      <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-brand-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-brand-primary">
                            {product.price.toLocaleString('vi-VN')}₫
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {product.originalPrice.toLocaleString('vi-VN')}₫
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-brand-primary text-black rounded-full font-semibold hover:bg-brand-secondary transition-all duration-300 group"
          >
            Xem Tất Cả Sản Phẩm
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-24 overflow-hidden mt-16 mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl sm:text-5xl font-serif italic font-bold mb-6 text-gray-800"
              >
                Đặt Bánh Sinh Nhật
              </motion.h2>
              <motion.p className="text-xl text-gray-600 mb-8">
                Được thiết kế riêng cho dịp đặc biệt của bạn
              </motion.p>
            </div>
            
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8"
            >
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full pl-12 pr-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 outline-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                Đăng Ký Ngay
              </button>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-gray-600 text-sm space-y-2"
            >
              <p>Bằng cách đăng ký, bạn đồng ý với</p>
              <p>
                <Link to="/terms" className="text-pink-500 hover:text-pink-600 transition-colors underline">
                  Điều khoản dịch vụ
                </Link>
                {' '}và{' '}
                <Link to="/privacy" className="text-pink-500 hover:text-pink-600 transition-colors underline">
                  Chính sách bảo mật
                </Link>
                {' '}của chúng tôi
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

