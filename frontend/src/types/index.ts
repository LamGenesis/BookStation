// ===== AUTH TYPES =====
export interface User {
  id: number;
  email: string;
  fullName: string | null;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

// ===== CATEGORY TYPES =====
export interface Category {
  id: number;
  name: string;
  slug: string | null;
}

// ===== PRODUCT TYPES =====
export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  status: number;
  categoryName: string | null;
  categoryId: number | null;
  primaryImageUrl: string | null;
  createdAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  quantity: number;
  status: number;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string;
  images: ProductImage[];
}

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ===== CART TYPES =====
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  discountPrice: number | null;
  quantity: number;
  subtotal: number;
  primaryImageUrl: string | null;
  availableStock: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ===== ORDER TYPES =====
export interface ShippingInfo {
  receiverName: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  itemCount: number;
  createdAt: string;
}

export interface OrderDetail {
  id: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingInfo: ShippingInfo | null;
  createdAt: string;
  items: OrderItem[];
  userId: number | null;
  userEmail: string | null;
}

export interface CreateOrderRequest {
  shippingInfo: ShippingInfo;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

// ===== PAYMENT TYPES =====
export interface VnPayUrlRequest {
  orderId: number;
}

export interface VnPayUrlResponse {
  paymentUrl: string;
}

export interface VnPayReturnResponse {
  success: boolean;
  message: string;
  orderId: number;
  paymentId: number;
  transactionId: string;
  amount: number;
  responseCode: string;
}

// ===== POST TYPES =====
export interface Post {
  id: number;
  title: string;
  publishedAt: string;
  authorName: string | null;
  imageUrl: string | null;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  authorName: string | null;
  imageUrl: string | null;
}

// ===== API ERROR =====
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

