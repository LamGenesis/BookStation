import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')          // Email is required
    .email('Email không hợp lệ'),          // Invalid email format
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc'),       // Password is required
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')               // Password is required
    .min(6, 'Mật khẩu phải ≥ 6 ký tự, có chữ hoa, chữ thường và số')   // Password must be at least 6 characters
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')       // matches "[A-Z]"
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')    // matches "[a-z]"
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),       // matches "[0-9]"
  confirmPassword: z
    .string()
    .min(1, 'Xác nhận mật khẩu là bắt buộc'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

