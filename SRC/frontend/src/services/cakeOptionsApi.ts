import apiClient from './apiClient';

export interface CakeOption {
  id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  isDefault: boolean;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CakeOptionsGrouped {
  size?: CakeOption[];
  cake_base?: CakeOption[];
  frosting?: CakeOption[];
  flavor?: CakeOption[];
  decoration?: CakeOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CakeCustomization {
  size?: CustomizationOption;
  cakeBase?: CustomizationOption;
  frosting?: CustomizationOption;
  flavor?: CustomizationOption;
  decoration?: CustomizationOption;
  specialInstructions?: string;
}

export interface ValidationResult {
  isValid: boolean;
  totalPrice: number;
  errors: string[];
}

/**
 * Get all cake options grouped by category
 */
export const getAllCakeOptions = async (): Promise<CakeOptionsGrouped> => {
  const response = await apiClient.get<CakeOptionsGrouped>('/cake-options');
  return response.data;
};

/**
 * Get cake options for a specific category
 */
export const getCakeOptionsByCategory = async (category: string): Promise<CakeOption[]> => {
  const response = await apiClient.get<CakeOption[]>(`/cake-options/category/${category}`);
  return response.data;
};

/**
 * Get default options for all categories
 */
export const getDefaultCakeOptions = async (): Promise<Record<string, CakeOption>> => {
  const response = await apiClient.get<Record<string, CakeOption>>('/cake-options/defaults');
  return response.data;
};

/**
 * Validate customization and get price calculation
 */
export const validateCustomization = async (customization: CakeCustomization): Promise<ValidationResult> => {
  const response = await apiClient.post<ValidationResult>('/cake-options/validate', customization);
  return response.data;
};

/**
 * Calculate price for a custom cake
 */
export const calculateCustomCakePrice = async (customization: CakeCustomization): Promise<{ price: number }> => {
  const response = await apiClient.post<{ price: number }>('/cake-options/calculate-price', customization);
  return response.data;
};

/**
 * Helper: Calculate total price client-side (for real-time updates)
 */
export const calculatePriceClientSide = (customization: CakeCustomization): number => {
  let total = 0;
  
  if (customization.size) total += customization.size.price;
  if (customization.cakeBase) total += customization.cakeBase.price;
  if (customization.frosting) total += customization.frosting.price;
  if (customization.flavor) total += customization.flavor.price;
  if (customization.decoration) total += customization.decoration.price;
  
  return total;
};

/**
 * Helper: Format customization for display
 */
export const formatCustomizationDisplay = (customization?: CakeCustomization): string[] => {
  if (!customization) return [];
  
  const display: string[] = [];
  
  if (customization.size) display.push(`Kích thước: ${customization.size.name}`);
  if (customization.cakeBase) display.push(`Cốt bánh: ${customization.cakeBase.name}`);
  if (customization.frosting) display.push(`Kem phủ: ${customization.frosting.name}`);
  if (customization.flavor) display.push(`Hương vị: ${customization.flavor.name}`);
  if (customization.decoration) display.push(`Trang trí: ${customization.decoration.name}`);
  if (customization.specialInstructions) {
    display.push(`Ghi chú: ${customization.specialInstructions}`);
  }
  
  return display;
};

