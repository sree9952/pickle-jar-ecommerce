import { z } from 'zod';

export const createRazorpayOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
      email: z.string().email('Invalid email address format').optional().or(z.literal('')),
    }),
    shippingAddress: z.object({
      addressLine1: z.string().min(5, 'Address line 1 is required'),
      addressLine2: z.string().optional(),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
      landmark: z.string().optional(),
    }),
    items: z
      .array(
        z.object({
          productId: z.string().uuid('Invalid Product ID'),
          quantity: z.number().int().positive('Quantity must be greater than 0'),
        })
      )
      .min(1, 'Cart must contain at least 1 item'),
    couponCode: z.string().optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
    razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
    razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
  }),
});

export const trackOrderSchema = z.object({
  query: z.object({
    orderNumber: z.string().min(1, 'Order Number is required'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  }),
});
