import { IsOptional, IsInt, Min, IsUUID, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryReviewDto {
  @IsOptional()
  @IsUUID('4', { message: 'Product ID phải là UUID hợp lệ' })
  productId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'User ID phải là UUID hợp lệ' })
  userId?: string;

  @IsOptional()
  @IsInt({ message: 'Rating phải là số nguyên' })
  @Min(1, { message: 'Rating phải từ 1 đến 5' })
  rating?: number;

  @IsOptional()
  @IsBoolean({ message: 'isApproved phải là boolean' })
  @Type(() => Boolean)
  isApproved?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isVisible phải là boolean' })
  @Type(() => Boolean)
  isVisible?: boolean;

  @IsOptional()
  @IsInt({ message: 'Page phải là số nguyên' })
  @Min(1, { message: 'Page phải lớn hơn 0' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn 0' })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsIn(['createdAt', 'rating'], { message: 'Sort by phải là createdAt hoặc rating' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Order phải là ASC hoặc DESC' })
  order?: 'ASC' | 'DESC' = 'DESC';
}

