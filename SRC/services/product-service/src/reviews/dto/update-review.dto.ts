import { IsInt, Min, Max, IsString, IsArray, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsInt({ message: 'Rating phải là số nguyên' })
  @Min(1, { message: 'Rating phải từ 1 đến 5' })
  @Max(5, { message: 'Rating phải từ 1 đến 5' })
  rating?: number;

  @IsOptional()
  @IsString({ message: 'Comment phải là chuỗi' })
  @MaxLength(1000, { message: 'Comment không được vượt quá 1000 ký tự' })
  comment?: string;

  @IsOptional()
  @IsArray({ message: 'Images phải là mảng' })
  @IsString({ each: true, message: 'Mỗi image phải là chuỗi URL' })
  images?: string[];

  @IsOptional()
  @IsBoolean({ message: 'isApproved phải là boolean' })
  isApproved?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isVisible phải là boolean' })
  isVisible?: boolean;
}

