// src/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',       // Chờ xử lý/thanh toán
  PROCESSING = 'processing', // Đang xử lý (sau khi thanh toán thành công)
  COMPLETED = 'completed',   // Hoàn thành
  CANCELLED = 'cancelled',   // Bị hủy
  FAILED = 'failed',         // Thanh toán thất bại
}

// Các khung giờ giao hàng cố định
export enum DeliveryTimeSlot {
  MORNING = '08:00–10:00',
  LATE_MORNING = '10:00–12:00',
  AFTERNOON = '13:00–15:00',
  EVENING = '16:00–18:00',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index() // Đánh index để tìm kiếm theo userId nhanh hơn
  @Column()
  userId: string; // Lưu ID của user đặt hàng

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING, // Trạng thái mặc định khi mới tạo
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 }) // Tổng tiền đơn hàng
  totalAmount: number;

  // Một Order có nhiều OrderItem
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true, // Tự động lưu/cập nhật/xóa OrderItems khi Order thay đổi
  })
  items: OrderItem[];

  // Có thể thêm các trường khác: địa chỉ giao hàng, ghi chú...
  @Column({ nullable: true })
  shippingAddress: string;

  // Thêm số điện thoại người nhận
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string | null; // nullable, cho phép null

  // Thêm ngày giao hàng (chỉ lưu ngày)
  @Column({ type: 'date', nullable: true })
  deliveryDate: Date | null;

  // Thêm khung giờ giao hàng
  @Column({
    type: 'enum',
    enum: DeliveryTimeSlot,
    nullable: true,
  })
  deliveryTimeSlot: DeliveryTimeSlot | null;

  @Column({ type: 'text', nullable: true })
  deliveryNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}