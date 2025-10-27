// src/cart/dto/add-item.dto.ts
import { IsInt, IsNotEmpty, IsPositive, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class AddItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  customization?: any; // Allow any structure for customization (validated by product service)

  @IsOptional()
  @IsBoolean()
  isCustomCake?: boolean;
}