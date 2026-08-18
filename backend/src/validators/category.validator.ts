import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    description: z.string().optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Category ID'),
  }),
  body: createCategorySchema.shape.body.partial(),
});
