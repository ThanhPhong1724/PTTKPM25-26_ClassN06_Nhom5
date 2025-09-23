import React from 'react';
import { motion } from 'framer-motion';
import { GiCakeSlice, GiCupcake, GiStairsCake } from 'react-icons/gi';
import { FiHeart, FiAward, FiUsers, FiThumbsUp } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  const stats = [
    {
      icon: <GiCakeSlice className="w-7 h-7" />,
      value: "20K+",
      label: "Bánh đã làm"
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      value: "15K+",
      label: "Khách hàng tin yêu"
    },
    {
      icon: <FiAward className="w-7 h-7" />,
      value: "10+",
      label: "Năm kinh nghiệm"
    },
    {
      icon: <FiHeart className="w-7 h-7" />,
      value: "99%",
      label: "Đánh giá 5 sao"
    }
  ];

  const values = [
    {
      icon: <GiCupcake />,
      title: "Nguyên liệu tươi ngon",
      description: "Chúng tôi chỉ sử dụng những nguyên liệu tươi ngon nhất, được tuyển chọn kỹ lưỡng để tạo nên những chiếc bánh hoàn hảo."
    },
    {
      icon: <GiCakeSlice />,
      title: "Sáng tạo không ngừng",
      description: "Đội ngũ đầu bếp của chúng tôi luôn nghiên cứu và phát triển những công thức bánh độc đáo, mới lạ."
    },
    {
      icon: <GiStairsCake />,
      title: "Dịch vụ tận tâm",
      description: "Chúng tôi luôn lắng nghe và thấu hiểu nhu cầu của khách hàng để tạo ra những chiếc bánh đúng ý nhất."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative"
        >
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-100 rounded-full blur-xl"></div>
              <GiCakeSlice className="w-16 h-16 mx-auto text-pink-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Cake Shop Story
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              Từ năm 2015, Cake Shop đã và đang mang đến những chiếc bánh ngọt tuyệt hảo, 
              được làm thủ công với tình yêu và sự tận tâm. Mỗi chiếc bánh của chúng tôi 
              không chỉ là món ăn ngon, mà còn là một tác phẩm nghệ thuật.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white mb-4 shadow-lg">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-sans text-center font-bold mb-16 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300
                  group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 
                  rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500">
                </div>
                <div className="relative">
                  <div className="text-3xl text-pink-400 mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-gradient-to-r from-pink-50 to-rose-50 
              p-12 rounded-3xl shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5"></div>
            <h3 className="text-2xl font-serif italic font-bold mb-6 relative">
              Hãy để chúng tôi làm ngọt ngào ngày của bạn
            </h3>
            <p className="text-gray-600 mb-8 relative">
              Đặt bánh ngay hôm nay để trải nghiệm hương vị tuyệt vời của Cake Shop
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 
                rounded-full hover:shadow-lg transition-all duration-300 font-medium relative"
            >
              Đặt Bánh Ngay
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;