import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
export type LoginInput = z.infer<typeof loginSchema>;

export const checkoutSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const mylarRequestSchema = z.object({
  size: z.enum(["3.5g","7g","14g","28g"]),
  quantity: z.number().int().min(50),
  notes: z.string().max(500).optional(),
});
export type MylarRequestInput = z.infer<typeof mylarRequestSchema>;

// Product validation schema
export const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  image: z.string().url('Image must be a valid URL').or(z.string().startsWith('/', 'Image must be a valid path')),
  category: z.string().min(1, 'Category is required'),
  active: z.boolean().optional().default(true),
});

// Cart item validation schema
export const cartItemSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  size: z.string().optional(),
  image: z.string(),
  category: z.string(),
});

// Checkout form validation schema
export const checkoutSchema = z.object({
  customerInfo: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number'),
  }),

  shippingAddress: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
    country: z.string().min(2, 'Country is required'),
  }),

  paymentMethod: z.enum(['card', 'paypal', 'cashapp'], {
    required_error: 'Please select a payment method',
  }),

  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),

  total: z.number().positive('Total must be positive'),
});

// User registration/profile schema
export const userProfileSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['customer', 'brand', 'admin']).default('customer'),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
  preferences: z.object({
    notifications: z.boolean().default(true),
    newsletter: z.boolean().default(false),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
  }).optional(),
});

// Admin product management schema
export const adminProductSchema = productSchema.extend({
  inventory: z.number().min(0, 'Inventory cannot be negative').optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
});

// Search and filter schema
export const searchFilterSchema = z.object({
  query: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0, 'Minimum price cannot be negative').optional(),
  maxPrice: z.number().positive('Maximum price must be positive').optional(),
  sortBy: z.enum(['name', 'price', 'category', 'date']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
});

// Type exports for use in components
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type MylarOrderData = z.infer<typeof mylarOrderSchema>;
export type ProductData = z.infer<typeof productSchema>;
export type CartItemData = z.infer<typeof cartItemSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type AdminProductData = z.infer<typeof adminProductSchema>;
export type SearchFilterData = z.infer<typeof searchFilterSchema>;