import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid Category ID'),
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    ingredients: z.string().optional(),
    weightGram: z.number().int().positive('Weight must be a positive integer in grams'),
    price: z.number().positive('Price must be greater than 0'),
    comparePrice: z.number().positive().optional(),
    stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
    isFeatured: z.boolean().optional().default(false),
    isBestSeller: z.boolean().optional().default(false),
    images: z.array(
      z.object({
        imageUrl: z.string().url('Invalid image URL'),
        publicId: z.string().optional(),
        isPrimary: z.boolean().optional().default(false),
      })
    ).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Product ID'),
  }),
  body: createProductSchema.shape.body.partial(),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    category: z.string().optional(),
    isFeatured: z.string().optional().transform((val) => (val === undefined ? undefined : val === 'true')),
    isBestSeller: z.string().optional().transform((val) => (val === undefined ? undefined : val === 'true')),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'name']).optional().default('newest'),
  }),
});
