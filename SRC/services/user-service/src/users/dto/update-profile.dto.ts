import { IsOptional, IsString, Matches, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\+84|0)[1-9][0-9]{8}$/, {
    message: 'Số điện thoại không hợp lệ (Định dạng: +84... hoặc 0...)',
  })
  phone?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar phải là một URL hợp lệ' })
  avatar?: string | null;
}