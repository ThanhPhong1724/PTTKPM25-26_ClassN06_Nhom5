import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-pink-50 to-purple-50 pt-16 pb-8 text-gray-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-serif italic font-bold text-gray-800 mb-6">Cake Shop</h3>
            <p className="text-gray-600 leading-relaxed">
              Chuyên cung cấp các loại bánh ngọt cao cấp, với công thức độc quyền và nguyên liệu tươi ngon nhất.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-serif italic font-bold text-gray-800 mb-6">Chính Sách</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/policy/shipping" className="hover:text-pink-500 transition-colors">Chính sách giao hàng</Link></li>
              <li><Link to="/policy/returns" className="hover:text-pink-500 transition-colors">Chính sách đổi trả</Link></li>
              <li><Link to="/policy/privacy" className="hover:text-pink-500 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-pink-500 transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-serif italic font-bold text-gray-800 mb-6">Liên Hệ</h3>
            <ul className="space-y-3 text-sm">
              <li>Email: hello@cakeshop.com</li>
              <li>Hotline: 1900 1234</li>
              <li>Địa chỉ: 123 Pastry Street, Quận 1, TP HCM</li>
              <li>Giờ mở cửa: 8:00 - 21:00 (Tất cả các ngày)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-serif italic font-bold text-gray-800 mb-6">Theo Dõi Chúng Tôi</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center text-pink-500 transition-colors">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center text-pink-500 transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 flex items-center justify-center text-pink-500 transition-colors">
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Cake Shop. Sweetness in every bite 🧁
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;