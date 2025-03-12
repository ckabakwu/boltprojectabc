import { z } from 'zod';

// Form validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
});

export const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const bookingSchema = z.object({
  service: z.string(),
  date: z.string(),
  time: z.string(),
  address: z.string().min(5, 'Valid address is required'),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid zip code'),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  extras: z.array(z.string()),
  specialInstructions: z.string().optional()
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// Input validation functions
export const validateEmail = (email: string): boolean => {
  return loginSchema.shape.email.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return loginSchema.shape.password.safeParse(password).success;
};

export const validatePhone = (phone: string): boolean => {
  return registrationSchema.shape.phone.safeParse(phone).success;
};

export const validateZipCode = (zipCode: string): boolean => {
  return bookingSchema.shape.zipCode.safeParse(zipCode).success;
};

// Form validation functions
export const validateLoginForm = (data: unknown) => {
  return loginSchema.safeParse(data);
};

export const validateRegistrationForm = (data: unknown) => {
  return registrationSchema.safeParse(data);
};

export const validateBookingForm = (data: unknown) => {
  return bookingSchema.safeParse(data);
};

export const validateContactForm = (data: unknown) => {
  return contactSchema.safeParse(data);
};