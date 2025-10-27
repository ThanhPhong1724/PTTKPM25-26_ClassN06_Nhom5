# Tổng quan Dự án E-commerce Bánh ngọt & Hướng dẫn Triển khai

## 📋 Tổng quan Dự án

### Kiến trúc Hệ thống
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: NestJS Microservices Architecture
- **Database**: PostgreSQL (3 databases riêng biệt)
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **API Gateway**: Nginx
- **Monitoring**: Grafana + Loki + Promtail

### Các Service hiện tại
1. **User Service** (Port 3001): Quản lý người dùng, xác thực
2. **Product Service** (Port 3002): Quản lý sản phẩm, danh mục
3. **Cart Service** (Port 3003): Quản lý giỏ hàng
4. **Order Service** (Port 3004): Quản lý đơn hàng
5. **Payment Service** (Port 3005): Xử lý thanh toán VNPay
6. **Notification Service** (Port 3006): Gửi email thông báo

---

## 🎯 Issue #1: Hệ thống Đánh giá Sản phẩm

### Yêu cầu Chi tiết

#### User Stories
- **Khách hàng**: Muốn đánh giá sản phẩm đã mua để chia sẻ trải nghiệm
- **Khách hàng**: Muốn xem đánh giá của người khác trước khi mua
- **Admin**: Muốn quản lý và kiểm duyệt đánh giá

#### Acceptance Criteria
- [ ] Chỉ khách hàng đã mua sản phẩm mới được đánh giá
- [ ] Đánh giá chỉ được phép khi đơn hàng ở trạng thái "completed"
- [ ] Hiển thị điểm trung bình và tổng số đánh giá
- [ ] Admin có thể duyệt/ẩn/xóa đánh giá
- [ ] Phân trang cho danh sách đánh giá

### Hướng dẫn Triển khai

#### 1. Database Schema

**Tạo bảng `reviews` trong database `ecommerce_up_db`:**

```sql
-- Thêm vào file SRC/database/init.sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    order_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[], -- Array of image URLs
    is_approved BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
```

#### 2. Backend Implementation

**Tạo Review Entity:**
```typescript
// SRC/services/product-service/src/reviews/entities/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @Column()
  orderId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Tạo Review Service:**
```typescript
// SRC/services/product-service/src/reviews/reviews.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createReview(createReviewDto: any): Promise<Review> {
    // Validate user has completed order for this product
    // Implementation here...
    
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { productId, isVisible: true, isApproved: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductRatingStats(productId: string) {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.productId = :productId', { productId })
      .andWhere('review.isVisible = :isVisible', { isVisible: true })
      .andWhere('review.isApproved = :isApproved', { isApproved: true })
      .getRawOne();

    return {
      averageRating: parseFloat(result.averageRating) || 0,
      totalReviews: parseInt(result.totalReviews) || 0,
    };
  }
}
```

#### 3. Frontend Implementation

**Cập nhật ProductDetailPage:**
```typescript
// SRC/frontend/src/pages/ProductDetailPage.tsx
// Thêm vào component ProductDetailPage

const [reviews, setReviews] = useState([]);
const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });

// Thêm section hiển thị đánh giá
<div className="mt-16">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>
  
  {/* Rating Summary */}
  <div className="bg-gray-50 rounded-xl p-6 mb-8">
    <div className="flex items-center gap-4">
      <div className="text-4xl font-bold text-purple-600">
        {ratingStats.averageRating.toFixed(1)}
      </div>
      <div>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(star => (
            <FiStar 
              key={star}
              className={`w-6 h-6 ${
                star <= Math.round(ratingStats.averageRating) 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600">
          {ratingStats.totalReviews} đánh giá
        </p>
      </div>
    </div>
  </div>

  {/* Reviews List */}
  <div className="space-y-6">
    {reviews.map(review => (
      <div key={review.id} className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium">
                {review.userName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{review.userName}</p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                  <FiStar 
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {format(new Date(review.createdAt), 'dd/MM/yyyy')}
          </span>
        </div>
        {review.comment && (
          <p className="text-gray-700">{review.comment}</p>
        )}
      </div>
    ))}
  </div>
</div>
```

---

## 🎯 Issue #2: Chọn Ngày & Giờ Giao Hàng

### Yêu cầu Chi tiết

#### User Stories
- **Khách hàng**: Muốn chọn ngày và khung giờ giao hàng phù hợp
- **Admin**: Muốn xem thông tin giao hàng để sắp xếp logistics

#### Acceptance Criteria
- [ ] Date picker không cho phép chọn ngày quá khứ
- [ ] Time slot dropdown với các tùy chọn cố định
- [ ] Hiển thị thông tin giao hàng trong order summary
- [ ] Email xác nhận bao gồm thông tin giao hàng

### Hướng dẫn Triển khai

#### 1. Database Schema

**Cập nhật bảng `orders`:**
```sql
-- Thêm vào file SRC/database/init.sql
ALTER TABLE orders 
ADD COLUMN delivery_date DATE,
ADD COLUMN delivery_time_slot VARCHAR(50),
ADD COLUMN delivery_notes TEXT;
```

#### 2. Backend Implementation

**Cập nhật Order Entity:**
```typescript
// SRC/services/order-service/src/orders/entities/order.entity.ts
// Thêm các trường mới
@Column({ type: 'date', nullable: true })
deliveryDate: Date;

@Column({ nullable: true })
deliveryTimeSlot: string;

@Column({ type: 'text', nullable: true })
deliveryNotes: string;
```

**Cập nhật Order Service:**
```typescript
// SRC/services/order-service/src/orders/orders.service.ts
// Thêm validation cho delivery date
private validateDeliveryDate(deliveryDate: Date): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (deliveryDate < today) {
    throw new BadRequestException('Ngày giao hàng không được là ngày quá khứ');
  }
  
  // Check if delivery date is not more than 7 days in future
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  
  if (deliveryDate > maxDate) {
    throw new BadRequestException('Ngày giao hàng không được quá 7 ngày');
  }
}
```

#### 3. Frontend Implementation

**Cập nhật CheckoutPage:**
```typescript
// SRC/frontend/src/pages/CheckoutPage.tsx
// Thêm state cho delivery options
const [deliveryDate, setDeliveryDate] = useState('');
const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('');

// Time slots configuration
const timeSlots = [
  { value: 'morning', label: 'Sáng (8:00 - 12:00)' },
  { value: 'afternoon', label: 'Chiều (13:00 - 17:00)' },
  { value: 'evening', label: 'Tối (18:00 - 20:00)' },
];

// Thêm vào form checkout
<div className="bg-white rounded-2xl shadow-sm p-6">
  <div className="flex items-center gap-4 mb-6">
    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
      <FiTruck className="w-5 h-5 text-purple-600" />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Thời gian giao hàng
      </h2>
      <p className="text-sm text-gray-600">
        Chọn ngày và khung giờ nhận hàng
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ngày giao hàng
      </label>
      <input
        type="date"
        value={deliveryDate}
        onChange={(e) => setDeliveryDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Khung giờ giao hàng
      </label>
      <select
        value={deliveryTimeSlot}
        onChange={(e) => setDeliveryTimeSlot(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      >
        <option value="">Chọn khung giờ</option>
        {timeSlots.map(slot => (
          <option key={slot.value} value={slot.value}>
            {slot.label}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>
```

---

## 🎯 Issue #3: Ghi chú đặc biệt cho sản phẩm

### Yêu cầu Chi tiết

#### User Stories
- **Khách hàng**: Muốn thêm ghi chú đặc biệt cho từng sản phẩm
- **Admin**: Muốn xem ghi chú để thực hiện yêu cầu khách hàng

#### Acceptance Criteria
- [ ] Textarea cho ghi chú trên trang chi tiết sản phẩm
- [ ] Hiển thị ghi chú trong giỏ hàng
- [ ] Cho phép chỉnh sửa ghi chú trong giỏ hàng
- [ ] Lưu ghi chú cùng với đơn hàng

### Hướng dẫn Triển khai

#### 1. Database Schema

**Cập nhật bảng `order_items`:**
```sql
-- Thêm vào file SRC/database/init.sql
ALTER TABLE order_items 
ADD COLUMN special_note TEXT;
```

#### 2. Backend Implementation

**Cập nhật OrderItem Entity:**
```typescript
// SRC/services/order-service/src/orders/entities/order-item.entity.ts
@Column({ type: 'text', nullable: true })
specialNote: string;
```

**Cập nhật Cart Service:**
```typescript
// SRC/services/cart-service/src/cart/cart.service.ts
// Thêm specialNote vào CartItem interface
interface CartItem {
  productId: string;
  quantity: number;
  specialNote?: string;
}
```

#### 3. Frontend Implementation

**Cập nhật ProductDetailPage:**
```typescript
// SRC/frontend/src/pages/ProductDetailPage.tsx
// Thêm state cho special note
const [specialNote, setSpecialNote] = useState('');

// Thêm vào form thêm vào giỏ hàng
<div className="mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Ghi chú cho cửa hàng
  </label>
  <textarea
    value={specialNote}
    onChange={(e) => setSpecialNote(e.target.value)}
    placeholder="Ví dụ: Ghi trên bánh 'Chúc mừng sinh nhật Bố', ít ngọt, không trang trí dâu tây..."
    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    rows={3}
  />
</div>
```

**Cập nhật CartPage:**
```typescript
// SRC/frontend/src/pages/CartPage.tsx
// Thêm hiển thị special note
<div className="flex-grow">
  <h3 className="text-lg font-medium text-gray-900 mb-1">
    {item.name || item.productId}
  </h3>
  
  {/* Special Note Display */}
  {item.specialNote && (
    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800">
        <span className="font-medium">Ghi chú:</span> {item.specialNote}
      </p>
    </div>
  )}
  
  <div className="text-sm text-gray-500 mb-4">
    SKU: {item.productId}
  </div>
  {/* ... rest of the component */}
</div>
```

---

## 🚀 Hướng dẫn Triển khai Tổng thể

### Bước 1: Cập nhật Database
1. Chạy các script SQL để tạo bảng và cột mới
2. Restart các service để áp dụng thay đổi

### Bước 2: Cập nhật Backend Services
1. Thêm entities mới
2. Cập nhật services và controllers
3. Thêm validation logic
4. Test API endpoints

### Bước 3: Cập nhật Frontend
1. Cập nhật components hiện có
2. Thêm UI components mới
3. Cập nhật API calls
4. Test user flows

### Bước 4: Testing & Deployment
1. Unit tests cho backend
2. Integration tests
3. E2E tests cho frontend
4. Deploy lên staging environment

---

## 📝 Lưu ý Quan trọng

1. **Backup Database**: Luôn backup trước khi thay đổi schema
2. **Migration**: Sử dụng TypeORM migrations thay vì synchronize: true
3. **Validation**: Thêm validation đầy đủ cho tất cả inputs
4. **Error Handling**: Xử lý lỗi một cách graceful
5. **Performance**: Thêm indexes cho các queries thường xuyên
6. **Security**: Validate permissions và sanitize inputs

---

## 🔧 Cấu hình Môi trường

### Environment Variables cần thêm:
```env
# Review System
REVIEW_APPROVAL_REQUIRED=true
MAX_REVIEW_IMAGES=5

# Delivery System  
DELIVERY_TIME_SLOTS=morning,afternoon,evening
MAX_DELIVERY_DAYS_AHEAD=7

# Special Notes
MAX_SPECIAL_NOTE_LENGTH=500
```

### Dependencies cần cài thêm:
```json
// Frontend
"react-datepicker": "^4.25.0"
"@types/react-datepicker": "^4.19.4"

// Backend
"class-validator": "^0.14.0"
"class-transformer": "^0.5.1"
```

---

*Tài liệu này cung cấp hướng dẫn chi tiết để triển khai 3 issues chính vào dự án e-commerce bánh ngọt hiện tại. Mỗi issue đều được thiết kế để tích hợp mượt mà với kiến trúc microservices hiện có.*
