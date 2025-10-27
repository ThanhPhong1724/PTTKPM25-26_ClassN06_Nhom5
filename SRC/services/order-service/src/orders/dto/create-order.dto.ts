// src/orders/dto/create-order.dto.ts
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryTimeSlot } from '../entities/order.entity';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(20)       // Ví dụ giới hạn 20 ký tự
  phone?: string;      // ← Thêm trường phone

  // Thêm ngày giao hàng — định dạng ISO (YYYY-MM-DD)
  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  // Thêm khung giờ giao hàng — chọn từ enum cố định
  @IsEnum(DeliveryTimeSlot)
  @IsOptional()
  deliveryTimeSlot?: DeliveryTimeSlot;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliveryNotes?: string;
}
