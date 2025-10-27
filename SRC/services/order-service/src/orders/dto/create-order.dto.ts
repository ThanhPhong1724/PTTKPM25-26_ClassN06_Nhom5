// src/orders/dto/create-order.dto.ts
import { IsOptional, IsString, MaxLength, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsDateString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

// Define available time slots
export const TIME_SLOTS = [
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
] as const;

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
  orderItems: OrderItemDto[]; // Changed from 'items' to 'orderItems'

  // Delivery scheduling
  @IsOptional()
  @IsDateString()
  deliveryDate?: string; // ISO date string (YYYY-MM-DD)

  @IsOptional()
  @IsString()
  @IsIn(TIME_SLOTS, { message: `deliveryTimeSlot must be one of: ${TIME_SLOTS.join(', ')}` })
  deliveryTimeSlot?: string;
}