import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CakeOptionsService } from './cake-options.service';
import { ValidateCustomizationDto } from './dto/validate-customization.dto';

@Controller('cake-options')
export class CakeOptionsController {
  constructor(private readonly cakeOptionsService: CakeOptionsService) {}

  /**
   * Get all available cake options grouped by category
   * Public endpoint - no auth required
   */
  @Get()
  async getAllOptions() {
    return this.cakeOptionsService.getAllOptions();
  }

  /**
   * Get options for a specific category
   * Public endpoint - no auth required
   */
  @Get('category/:category')
  async getOptionsByCategory(@Param('category') category: string) {
    return this.cakeOptionsService.getOptionsByCategory(category);
  }

  /**
   * Get default options for all categories
   * Public endpoint - no auth required
   */
  @Get('defaults')
  async getDefaultOptions() {
    return this.cakeOptionsService.getDefaultOptions();
  }

  /**
   * Validate customization and calculate price
   * Public endpoint - can be called before adding to cart
   */
  @Post('validate')
  async validateCustomization(@Body() customization: ValidateCustomizationDto) {
    return this.cakeOptionsService.validateCustomization(customization);
  }

  /**
   * Calculate total price for a custom cake
   * Public endpoint
   */
  @Post('calculate-price')
  async calculatePrice(@Body() customization: ValidateCustomizationDto) {
    const price = await this.cakeOptionsService.calculateCustomCakePrice(customization);
    return { price };
  }
}

