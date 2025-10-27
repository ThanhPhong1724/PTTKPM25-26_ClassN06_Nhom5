import { IsNotEmpty, IsUUID, IsInt, Min, Max, IsString, IsArray, IsOptional, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product ID không được để trống' })
  @IsUUID('4', { message: 'Product ID phải là UUID hợp lệ' })
  productId: string;

  @IsNotEmpty({ message: 'Order ID không được để trống' })
  @IsUUID('4', { message: 'Order ID phải là UUID hợp lệ' })
  orderId: string;

  @IsNotEmpty({ message: 'Rating không được để trống' })
  @IsInt({ message: 'Rating phải là số nguyên' })
  @Min(1, { message: 'Rating phải từ 1 đến 5' })
  @Max(5, { message: 'Rating phải từ 1 đến 5' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Comment phải là chuỗi' })
  @MaxLength(1000, { message: 'Comment không được vượt quá 1000 ký tự' })
  comment?: string;

  @IsOptional()
  @IsArray({ message: 'Images phải là mảng' })
  @IsString({ each: true, message: 'Mỗi image phải là chuỗi URL' })
  images?: string[];
}

