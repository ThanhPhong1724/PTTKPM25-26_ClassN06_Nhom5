# 🍰 Cake Shop E-commerce - Hệ thống Thương mại Điện tử Phân tán

<div align="center">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)

**Nền tảng bán bánh trực tuyến với kiến trúc Microservices**

*Đồ án Phân tích Thiết kế Hệ thống - ClassN06 - Nhóm 5*

[Tính năng](#-tính-năng-chính) •
[Tech Stack](#-tech-stack) •
[Kiến trúc](#-kiến-trúc-hệ-thống) •
[Cài đặt](#-cài-đặt--chạy-dự-án) •
[Demo](#-demo--test-accounts)

</div>

---

## 📖 Giới thiệu

**Cake Shop E-commerce** là một hệ thống thương mại điện tử hoàn chỉnh chuyên về lĩnh vực kinh doanh bánh ngọt, được xây dựng theo kiến trúc **Microservices** hiện đại. Dự án minh họa việc áp dụng các công nghệ và patterns tiên tiến trong phát triển hệ thống phân tán, từ việc tách biệt services, quản lý database độc lập, đến xử lý thanh toán thực tế và giao tiếp bất đồng bộ.

### 🎯 Mục tiêu dự án

- **Học thuật:** Áp dụng kiến thức Phân tích & Thiết kế Hệ thống vào thực tế
- **Kỹ thuật:** Demonstrate kiến trúc Microservices, Container orchestration, Message Queue
- **Nghiệp vụ:** Xây dựng MVP e-commerce với đầy đủ chức năng từ đặt hàng đến thanh toán

### ✨ Điểm nổi bật

- 🏗️ **Kiến trúc Microservices thuần túy** với 6 services độc lập
- 🔐 **Bảo mật tốt** với JWT authentication, Bcrypt hashing, Role-based authorization
- 💳 **Thanh toán thực tế** tích hợp VNPay Payment Gateway
- 🎂 **Tính năng độc đáo:** Custom Cake Builder - Thiết kế bánh tùy chỉnh với 27 options
- 🚀 **Performance cao** với Redis Cache và Database Indexing
- 📧 **Notification tự động** qua RabbitMQ và Email
- 📱 **Responsive UI** với React + Tailwind CSS + Framer Motion
- 🐳 **Docker Compose** - Setup toàn bộ hệ thống với 1 lệnh

---

## 🎯 Tính năng chính

### 👤 Dành cho Khách hàng

- ✅ **Quản lý tài khoản:** Đăng ký, Đăng nhập JWT, Cập nhật profile
- 🛍️ **Mua sắm:** Duyệt sản phẩm, Lọc/Tìm kiếm/Sắp xếp, Xem chi tiết
- 🎂 **Custom Cake Builder:** Thiết kế bánh riêng với 27 tùy chọn (Size, Cốt, Kem, Hương vị, Trang trí)
- 🛒 **Giỏ hàng:** Redis-based cart với realtime updates
- 💳 **Thanh toán:** VNPay Gateway (ATM/Visa/MasterCard)
- 📅 **Lịch giao hàng:** Chọn ngày và khung giờ giao hàng cụ thể
- 📦 **Quản lý đơn hàng:** Xem lịch sử, Chi tiết đơn, Theo dõi trạng thái
- ⭐ **Đánh giá sản phẩm:** Rating 5 sao, Comment, Upload ảnh (chỉ cho user đã mua)
- 📧 **Email xác nhận:** Tự động gửi sau khi đặt hàng thành công

### 👨‍💼 Dành cho Quản trị viên

- 📊 **Dashboard Analytics:** Revenue chart, Order statistics, KPIs
- 👥 **Quản lý User:** Xem danh sách, Chi tiết, Block/Unblock
- 🍰 **Quản lý Sản phẩm:** CRUD products, Categories, Stock management
- 📦 **Quản lý Đơn hàng:** Xem tất cả orders, Cập nhật status, Xem chi tiết customization
- ⭐ **Kiểm duyệt Đánh giá:** Approve/Hide/Delete reviews, Bulk actions

---

## 🛠 Tech Stack

### Backend (Microservices)

```
NestJS 11.x        → Framework chính cho các services
Node.js 20 LTS     → Runtime environment
TypeScript 5.7     → Programming language
PostgreSQL 14      → Database chính (3 instances)
Redis 6            → Cache & Session storage
RabbitMQ 3.13      → Message broker cho async communication
TypeORM 0.3        → ORM framework
Passport + JWT     → Authentication & Authorization
Bcrypt             → Password hashing
NodeMailer         → Email service
```

### Frontend

```
React 19           → UI library
TypeScript         → Type safety
Vite 6             → Build tool & dev server
Tailwind CSS 4     → Utility-first CSS framework
Framer Motion 12   → Animation library
React Router 7     → Client-side routing
Axios              → HTTP client
Recharts 2         → Charts & data visualization
Context API        → State management
```

### Infrastructure

```
Docker             → Containerization
Docker Compose     → Multi-container orchestration
Nginx              → API Gateway & Reverse proxy
```

### External Services

```
VNPay              → Payment gateway (sandbox)
Gmail SMTP         → Email delivery
Ngrok              → Webhook tunneling (development)
```

---

## 🏗 Kiến trúc hệ thống

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                     http://localhost:5173                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Nginx)                          │
│                     http://localhost:80                         │
│  • Reverse Proxy  • CORS Handling  • Load Balancing Ready       │
└──┬────────┬────────┬────────┬────────┬────────┬─────────────────┘
   │        │        │        │        │        │
   │:3001   │:3002   │:3003   │:3004   │:3005   │
   ▼        ▼        ▼        ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ User  │ │Product│ │ Cart  │ │Order  │ │Payment│ │Notif  │
│Service│ │Service│ │Service│ │Service│ │Service│ │Service│
└──┬────┘ └──┬────┘ └──┬────┘ └──┬────┘ └──┬────┘ └──┬────┘
   │         │         │         │         │         │
   ▼         ▼         │         ▼         │         │
┌─────┐ ┌─────┐        │     ┌─────┐       │         │
│PG DB│ │PG DB│        │     │PG DB│       │         │
│:5434│ │:5434│        │     │:5435│       │         │
└─────┘ └─────┘        │     └─────┘       │         │
                       ▼                   │         │
                    ┌──────┐               │         │
                    │Redis │               │         │
                    │:6379 │               │         │
                    └──────┘               │         │
                                           ▼         ▼
                                     ┌───────────────────┐
                                     │   RabbitMQ Queue  │
                                     │      :5672        │
                                     └───────────────────┘
```

### Database-per-Service Pattern

- **DB1 (ecommerce_up_db - Port 5434):** User, Product, Category, Review, CakeOption
- **DB2 (ecommerce_oc_db - Port 5435):** Order, OrderItem
- **Redis (Port 6379):** Cart (key-value store)

### Communication Patterns

- **Synchronous:** HTTP/REST với Axios (timeout: 5s)
- **Asynchronous:** RabbitMQ Publisher-Consumer
  - Payment Service → Order Service (payment status)
  - Order Service → Notification Service (order confirmation)

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Docker Desktop 4.x+** (Bật WSL2 cho Windows)
- **RAM:** Tối thiểu 8GB (Khuyến nghị 16GB)
- **CPU:** 4 cores trở lên
- **Disk:** 20GB trống
- **OS:** Windows 10/11, macOS, Linux (Ubuntu 20.04+)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd SRC
```

### Bước 2: Cấu hình Environment Variables (Optional)

Tạo file `.env` trong thư mục gốc nếu muốn custom:

```env
# Database
DB_UP_USER=user_product_admin
DB_UP_PASSWORD=user_product_secret
DB_OC_USER=order_cart_admin
DB_OC_PASSWORD=order_cart_secret

# Redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_USER=rabbit_user
RABBITMQ_PASS=rabbit_pass

# JWT
JWT_SECRET=YourSuperSecretKeyChangeMeInProduction
JWT_EXPIRATION=3600s

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

> ⚠️ **Lưu ý:** Để gửi email, cần tạo [App Password](https://support.google.com/accounts/answer/185833) cho Gmail

### Bước 3: Build & Run toàn bộ hệ thống

```bash
docker-compose up --build --force-recreate
```

⏳ **Thời gian khởi động:** Khoảng 3-5 phút cho lần đầu (pull images + build + seed data)

### Bước 4: Verify hệ thống

Kiểm tra tất cả containers đang chạy:

```bash
docker ps
```

Bạn sẽ thấy 12 containers:

```
✓ cake_user_service_container
✓ cake_product_service_container
✓ cake_cart_service_container
✓ cake_order_service_container
✓ cake_payment_service_container
✓ cake_notification_service_container
✓ cake_postgres_db_up_container
✓ cake_postgres_db_oc_container
✓ cake_redis_cache_container
✓ cake_rabbitmq_queue_container
✓ cake_api_gateway_container
✓ (Frontend chạy riêng nếu không dùng Docker)
```

### Bước 5: Truy cập ứng dụng

🌐 **Frontend:** http://localhost:5173 (Vite dev server)  
🔧 **API Gateway:** http://localhost/api  
🐰 **RabbitMQ Management:** http://localhost:15672 (guest/guest)

---

## 🎮 Demo & Test Accounts

### 👤 Admin Account

```
Email:    admin@gmail.com
Password: 123456
```

**Quyền hạn:** Full access to admin dashboard, manage users/products/orders/reviews

### 💳 VNPay Test Card (Thanh toán)

Để test chức năng thanh toán VNPay trong sandbox:

```
Ngân hàng:       NCB (Ngân hàng Quốc Dân)
Số thẻ:          9704198526191432198
Tên chủ thẻ:     NGUYEN VAN A
Ngày phát hành:  07/15
Mật khẩu OTP:    123456
```

### 🔗 Setup Webhook (VNPay Callback)

VNPay cần callback về server để confirm thanh toán. Trong môi trường local, dùng **ngrok**:

```bash
# Terminal 1: Start ngrok tunnel
ngrok http 3005

# Terminal 2: Rebuild payment service với ngrok URL
# Update VNPAY_RETURN_URL trong payment service environment
docker-compose up --build --force-recreate payment_service
```

Hoặc dùng webhook URL đã configure sẵn trong code (nếu có).

---

## 📚 API Documentation

### Postman Collection

Import file `Shop-app.postman_collection.json` vào Postman để test APIs.

**Collection includes:**
- 🔐 Authentication (Register, Login, Refresh Token)
- 👤 User Management (Profile, Update)
- 🍰 Products (CRUD, Search, Filter)
- 🛒 Cart (Add, Update, Remove, Get)
- 📦 Orders (Create, List, Detail, Update Status)
- 💳 Payment (VNPay Initiate, Callback)
- ⭐ Reviews (Create, List, Admin Actions)
- 🎂 Cake Options (List, Validate, Calculate Price)

### Health Check Endpoints

```bash
# Check tất cả services
curl http://localhost/api/users/health
curl http://localhost/api/products/health
curl http://localhost/api/cart/health
curl http://localhost/api/orders/health
curl http://localhost/api/payment/health
```

---

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Test một service cụ thể
cd services/user-service
npm test

# Test với coverage
npm run test:cov
```

### Integration Tests

```bash
# Chạy Postman collection với Newman
npm install -g newman
newman run Shop-app.postman_collection.json
```

### E2E Testing

Manual testing theo flow:
1. Register user → Login
2. Browse products → Add to cart
3. Custom cake builder → Add custom cake
4. Checkout → VNPay payment
5. Check order history → Write review
6. Admin: Approve review → Update order status

---

## 📂 Project Structure

```
SRC/
├── api-gateway/              # Nginx reverse proxy
│   └── nginx.conf
├── services/                 # Microservices
│   ├── user-service/         # Authentication & User management
│   ├── product-service/      # Products, Categories, Reviews, CakeOptions
│   ├── cart-service/         # Redis-based shopping cart
│   ├── order-service/        # Order processing & management
│   ├── payment-service/      # VNPay integration
│   └── notification-service/ # Email notifications (RabbitMQ consumer)
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # Context API (Auth, Cart)
│   │   ├── pages/            # 14 pages (User + Admin)
│   │   ├── services/         # API clients
│   │   └── types/            # TypeScript types
│   └── public/
├── database/                 # SQL seed scripts
│   ├── 01-init.sql
│   ├── 03-custom-cake-options.sql
│   └── 04-custom-cake-product.sql
├── docker-compose.yml        # Orchestration config
└── README.md                 # This file
```

---

## 🔧 Debugging

### View logs của một service

```bash
# Real-time logs
docker logs -f cake_user_service_container

# Last 100 lines
docker logs --tail 100 cake_order_service_container
```

### Truy cập database

```bash
# PostgreSQL (User/Product DB)
docker exec -it cake_postgres_db_up_container psql -U user_product_admin -d ecommerce_up_db

# PostgreSQL (Order DB)
docker exec -it cake_postgres_db_oc_container psql -U order_cart_admin -d ecommerce_oc_db

# Redis
docker exec -it cake_redis_cache_container redis-cli
```

### Restart một service

```bash
docker-compose restart user_service
docker-compose restart order_service
```

### Rebuild một service sau khi sửa code

```bash
docker-compose up -d --build --no-deps user_service
```

### Xem network details

```bash
docker network inspect src_cake_shop_network
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Port đã được sử dụng

**Error:** `Bind for 0.0.0.0:5432 failed: port is already allocated`

**Solution:**
```bash
# Tìm process đang dùng port
netstat -ano | findstr :5432  # Windows
lsof -i :5432                 # macOS/Linux

# Kill process hoặc đổi port trong docker-compose.yml
```

### Issue 2: Docker out of memory

**Error:** Container bị crash, `docker ps` shows unhealthy

**Solution:**
- Tăng RAM cho Docker Desktop: Settings → Resources → Memory (8GB+)
- Giảm số lượng services chạy đồng thời

### Issue 3: Frontend không kết nối được backend

**Error:** `CORS error` hoặc `Network Error`

**Solution:**
- Check API Gateway đang chạy: `curl http://localhost/api/users/health`
- Verify CORS config trong `api-gateway/nginx.conf`
- Clear browser cache và reload

### Issue 4: Email không gửi được

**Error:** `Invalid login: 535 Authentication failed`

**Solution:**
- Tạo App Password cho Gmail (không dùng password thường)
- Update SMTP credentials trong docker-compose.yml
- Check Gmail security settings

---

## 📈 Performance Optimization

- ✅ **Database Indexing:** userId, productId, categoryId, orderId
- ✅ **Redis Cache:** Cart data với TTL 7 ngày
- ✅ **Query Optimization:** Pagination, SELECT specific fields
- ✅ **Connection Pooling:** TypeORM default pool size 10
- ✅ **Image Optimization:** WebP format, lazy loading (frontend)
- ✅ **Code Splitting:** React lazy loading cho routes

---

## 🔐 Security Features

- ✅ **JWT Authentication:** HS256 algorithm, 1 hour expiry
- ✅ **Bcrypt Hashing:** Salt rounds 10 cho passwords
- ✅ **Role-based Authorization:** User/Admin roles với Guards
- ✅ **Input Validation:** class-validator DTOs
- ✅ **SQL Injection Prevention:** TypeORM parameterized queries
- ✅ **XSS Protection:** React auto-escape, CSP headers
- ✅ **CORS Policy:** Whitelist frontend origin
- ✅ **HTTPS Ready:** SSL certificates support (production)

---

## 📝 License

Dự án này được phát triển cho mục đích học tập 
All rights reserved © 2025 

---

## 🙏 Acknowledgments

- **NestJS Documentation** - Framework documentation
- **Docker Documentation** - Containerization guides
- **VNPay Sandbox** - Payment gateway testing
- **Stack Overflow Community** - Debugging help
- **GitHub Copilot** - Code suggestions

---

## 📞 Support

Nếu gặp vấn đề khi setup hoặc chạy dự án:

1. Check [Common Issues](#-common-issues--solutions) section
2. View logs: `docker logs <container-name>`
3. Create issue trên GitHub repository
4. Liên hệ team qua email: *[email nhóm]*

---

<div align="center">

**⭐ Star this repo nếu bạn thấy hữu ích! ⭐**

</div>