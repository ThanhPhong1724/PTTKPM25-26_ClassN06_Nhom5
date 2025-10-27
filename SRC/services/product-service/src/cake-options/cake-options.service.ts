import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CakeOption } from './entities/cake-option.entity';
import { ValidateCustomizationDto } from './dto/validate-customization.dto';

@Injectable()
export class CakeOptionsService {
  constructor(
    @InjectRepository(CakeOption)
    private cakeOptionRepository: Repository<CakeOption>,
  ) {}

  /**
   * Get all active cake options grouped by category
   */
  async getAllOptions(): Promise<Record<string, CakeOption[]>> {
    const options = await this.cakeOptionRepository.find({
      where: { isActive: true },
      order: { category: 'ASC', displayOrder: 'ASC' },
    });

    // Group by category
    const grouped: Record<string, CakeOption[]> = {};
    options.forEach((option) => {
      if (!grouped[option.category]) {
        grouped[option.category] = [];
      }
      grouped[option.category].push(option);
    });

    return grouped;
  }

  /**
   * Get options for a specific category
   */
  async getOptionsByCategory(category: string): Promise<CakeOption[]> {
    return this.cakeOptionRepository.find({
      where: { category, isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  /**
   * Get default options for each category
   */
  async getDefaultOptions(): Promise<Record<string, CakeOption>> {
    const options = await this.cakeOptionRepository.find({
      where: { isDefault: true, isActive: true },
    });

    const defaults: Record<string, CakeOption> = {};
    options.forEach((option) => {
      defaults[option.category] = option;
    });

    return defaults;
  }

  /**
   * Validate customization and calculate total price
   */
  async validateCustomization(customization: ValidateCustomizationDto): Promise<{
    isValid: boolean;
    totalPrice: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let totalPrice = 0;

    // Required categories
    const requiredCategories = ['size', 'cake_base', 'frosting'];
    const providedCategories: string[] = [];

    // Validate each option
    for (const [category, option] of Object.entries(customization)) {
      if (category === 'specialInstructions') continue;
      if (!option) continue;

      // Convert camelCase to snake_case for category matching
      const dbCategory = this.camelToSnake(category);
      providedCategories.push(dbCategory);

      // Verify option exists and is active
      const dbOption = await this.cakeOptionRepository.findOne({
        where: { id: option.id, category: dbCategory, isActive: true },
      });

      if (!dbOption) {
        errors.push(`Invalid option ID "${option.id}" for category "${dbCategory}"`);
        continue;
      }

      // Verify option details match
      if (dbOption.name !== option.name) {
        errors.push(`Option name mismatch for ID "${option.id}"`);
      }

      if (Math.abs(Number(dbOption.price) - option.price) > 0.01) {
        errors.push(`Price mismatch for option "${option.name}"`);
      }

      totalPrice += Number(dbOption.price);
    }

    // Check required categories
    for (const reqCat of requiredCategories) {
      if (!providedCategories.includes(reqCat)) {
        errors.push(`Missing required category: ${reqCat}`);
      }
    }

    return {
      isValid: errors.length === 0,
      totalPrice,
      errors,
    };
  }

  /**
   * Calculate base price for a custom cake
   * Base price includes the base product price (if any) + all option prices
   */
  async calculateCustomCakePrice(customization: ValidateCustomizationDto): Promise<number> {
    const validation = await this.validateCustomization(customization);
    
    if (!validation.isValid) {
      throw new BadRequestException(`Invalid customization: ${validation.errors.join(', ')}`);
    }

    return validation.totalPrice;
  }

  /**
   * Helper: Convert camelCase to snake_case
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

