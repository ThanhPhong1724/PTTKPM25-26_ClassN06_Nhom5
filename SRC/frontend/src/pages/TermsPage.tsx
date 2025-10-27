import React from 'react';
import { motion } from 'framer-motion';
import { GiCakeSlice, GiCupcake } from 'react-icons/gi';
import { FiShield, FiLock, FiUserCheck, FiCreditCard } from 'react-icons/fi';

const TermsPage: React.FC = () => {
  const sections = [
    {
      icon: <FiUserCheck />,
      title: "1. Điều khoản sử dụng",
      content: `Bằng việc truy cập và sử dụng website của Cake Shop, bạn đồng ý tuân thủ các điều khoản được quy định. Chúng tôi cam kết mang đến trải nghiệm đặt bánh trực tuyến tuyệt vời nhất cho bạn.`
    },
    {
      icon: <FiShield />,
      title: "2. Chính sách bảo mật", 
      content: `Cake Shop cam kết bảo vệ thông tin của khách hàng. Mọi thông tin cá nhân của bạn được mã hóa và bảo mật theo tiêu chuẩn quốc tế. Chúng tôi không chia sẻ thông tin của bạn cho bất kỳ bên thứ ba nào.`
    },
    {
      icon: <FiCreditCard />,
      title: "3. Chính sách thanh toán",
      content: `Chúng tôi hỗ trợ đa dạng phương thức thanh toán: tiền mặt khi nhận bánh, chuyển khoản ngân hàng, và thanh toán trực tuyến. Đảm bảo an toàn tuyệt đối cho mọi giao dịch.`
    },
    {
      icon: <FiLock />, 
      title: "4. Quyền sở hữu trí tuệ",
      content: `Mọi hình ảnh bánh, công thức, và thiết kế trên website đều là tài sản độc quyền của Cake Shop. Nghiêm cấm sao chép dưới mọi hình thức khi chưa có sự đồng ý bằng văn bản.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 text-pink-200 opacity-50">
            <GiCupcake className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-sans font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-4 relative z-10">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-gray-600">
            Cập nhật lần cuối: 12/10/2025
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300
                border border-pink-100/50 backdrop-blur-sm"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 
                    flex items-center justify-center text-white text-xl shadow-lg">
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-sans font-semibold mb-4 text-gray-800">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-pink-50 to-rose-50 
            rounded-3xl border border-pink-100/50 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 text-pink-100 opacity-30 transform rotate-12">
            <GiCakeSlice className="w-32 h-32" />
          </div>
          <h3 className="text-2xl font-sans font-semibold mb-4 text-gray-800">
            Bạn Cần Hỗ Trợ?
          </h3>
          <p className="text-gray-600 mb-6">
            Đội ngũ Cake Shop luôn sẵn sàng giải đáp mọi thắc mắc của bạn
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 
              rounded-full hover:shadow-lg transition-all duration-300 font-medium"
          >
            Liên Hệ Ngay
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;