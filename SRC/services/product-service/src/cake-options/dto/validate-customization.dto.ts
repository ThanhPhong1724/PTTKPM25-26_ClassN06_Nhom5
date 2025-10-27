import { IsObject, IsOptional, IsString, IsUUID, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomizationOptionDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class ValidateCustomizationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomizationOptionDto)
  size?: CustomizationOptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomizationOptionDto)
  cakeBase?: CustomizationOptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomizationOptionDto)
  frosting?: CustomizationOptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomizationOptionDto)
  flavor?: CustomizationOptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomizationOptionDto)
  decoration?: CustomizationOptionDto;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

