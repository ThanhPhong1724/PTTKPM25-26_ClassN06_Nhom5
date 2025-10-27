# 🖼️ PRODUCT IMAGE IN ORDER DETAIL - FIXED

## 🐛 **VẤN ĐỀ:**

Trong trang chi tiết đơn hàng (`http://localhost:5173/orders/{orderId}`), không hiển thị ảnh sản phẩm.

**Screenshot:** Đơn hàng chỉ hiện icon placeholder thay vì ảnh bánh.

---

## 🔍 **NGUYÊN NHÂN:**

Backend **KHÔNG LƯU** ảnh sản phẩm khi tạo đơn hàng.

### **Backend đã làm gì?**
1. ✅ Fetch full product info từ `product-service` (bao gồm `img`)
2. ✅ Lưu `productName`, `price`, `quantity`
3. ❌ **KHÔNG LƯU** `product.img`

### **Tại sao cần lưu ảnh?**
- Ảnh sản phẩm có thể **thay đổi sau này**
- Order là **snapshot** tại thời điểm mua → cần lưu tất cả info
- Giống như `productName` - cũng phải lưu để tránh thay đổi

---

## ✅ **GIẢI PHÁP:**

### **1. Thêm column `productImg` vào OrderItem entity**

```typescript
// services/order-service/src/orders/entities/order-item.entity.ts
@Column({ nullable: true })
productImg: string; // Ảnh sản phẩm tại thời điểm đặt hàng
```

### **2. Lưu ảnh khi tạo đơn hàng**

```typescript
// services/order-service/src/orders.service.ts (line 167)
orderItemsData.push({
  productId: item.productId,
  quantity: item.quantity,
  price: itemPrice,
  productName: product.name || 'Unknown Product',
  productImg: product.img || null, // <<< ĐÃ THÊM
  ...
});
```

### **3. Expose trong OrderItemDto**

```typescript
// services/order-service/src/orders/dto/order-item.dto.ts
@Expose()
productImg: string; // Ảnh sản phẩm
```

### **4. Update frontend interface**

```typescript
// frontend/src/services/orderApi.ts
export interface OrderItem {
  // ...
  productImg?: string | null; // ĐÃ THÊM
}
```

### **5. Frontend hiển thị ảnh**

```tsx
// frontend/src/pages/OrderDetailPage.tsx (line 290)
{item.productImg ? (
  <img 
    src={item.productImg} 
    alt={item.productName}
    className="w-full h-full object-cover"
  />
) : (
  <FiShoppingBag className="w-6 h-6 text-gray-400" />
)}
```

---

## 🔄 **DATABASE MIGRATION:**

TypeORM **tự động thêm column** `product_img` khi order service restart (nếu `synchronize: true`).

**⚠️ LƯU Ý:**
- **Đơn hàng cũ:** Không có ảnh (column `product_img` = NULL) → Hiện icon placeholder
- **Đơn hàng mới:** Sẽ có ảnh đầy đủ ✅

---

## 🧪 **CÁCH TEST:**

### **Test 1: Đơn hàng mới** (Recommended)

1. **Thêm sản phẩm vào giỏ:**
   ```
   http://localhost:5173/products
   ```

2. **Thanh toán:**
   ```
   http://localhost:5173/cart
   → Tiến hành thanh toán
   ```

3. **Xem lịch sử đơn hàng:**
   ```
   http://localhost:5173/orders
   ```

4. **Click vào đơn hàng mới:**
   - ✅ **Phải hiển thị ảnh sản phẩm**
   - Ảnh nên match với product page

---

### **Test 2: Đơn hàng cũ** (Expected behavior)

1. **Vào đơn hàng cũ:**
   ```
   http://localhost:5173/orders/45bf9f4f-a4d3-40f9-bf1c-ecf9393fd42f
   ```

2. **Kết quả mong đợi:**
   - ❌ Không có ảnh (do chưa lưu trước đây)
   - ✅ Hiển thị icon placeholder 📦
   - ✅ Vẫn hiển thị tên sản phẩm đúng

**→ Đây là bình thường, không phải lỗi!**

---

## 📋 **CHANGES SUMMARY:**

| File | Change | Type |
|------|--------|------|
| `services/order-service/src/orders/entities/order-item.entity.ts` | Added `productImg` column | Backend Entity |
| `services/order-service/src/orders.service.ts` | Save `product.img` when creating order | Backend Logic |
| `services/order-service/src/orders/dto/order-item.dto.ts` | Expose `productImg` in DTO | Backend DTO |
| `frontend/src/services/orderApi.ts` | Updated `OrderItem` interface | Frontend Type |
| `frontend/src/pages/OrderDetailPage.tsx` | Changed `productImage` → `productImg` | Frontend UI |

---

## 🔄 **SERVICES REBUILT:**
- ✅ **order_service** - Rebuilt with new column
- ✅ **TypeORM** - Auto-sync schema
- ✅ **frontend** - Vite HMR auto-reloaded

---

## ✅ **STATUS:**

- [x] Backend: Added `productImg` column
- [x] Backend: Save image when creating order
- [x] Frontend: Updated interface and UI
- [x] Service: Rebuilt and running
- [ ] **USER TO TEST:** Create new order and verify image displays

---

## 📌 **NOTES:**

### **Tại sao đơn hàng cũ không có ảnh?**

Vì trước đây backend không lưu ảnh. Đơn hàng là **historical data** → không thể thay đổi quá khứ.

### **Có cần update đơn hàng cũ không?**

**Không khuyến khích** vì:
1. Ảnh sản phẩm có thể đã đổi → không chính xác
2. Performance: Phải query product-service cho tất cả old orders
3. Database integrity: Order là snapshot, không nên modify

---

**READY TO TEST! 🚀**

Tạo đơn hàng mới và verify ảnh hiển thị đúng!

