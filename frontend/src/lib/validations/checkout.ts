import { z } from 'zod';

export const shippingSchema = z.object({
  receiverName: z
    .string()
    .min(1, 'Họ tên người nhận là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  address: z
    .string()
    .min(1, 'Địa chỉ là bắt buộc')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

