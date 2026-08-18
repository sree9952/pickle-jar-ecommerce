import { Category } from './category.model';

export interface ProductImage {
  id: string;
  imageUrl: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  ingredients?: string;
  weightGram: number;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  category?: Category;
  images: ProductImage[];
}
