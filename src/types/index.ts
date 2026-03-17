export interface Vendor {
  id: string;
  storeName: string;
  email: string;
  phone: string;
  description: string;
  logo?: string;
  coverImage?: string;
  timings: {
    open: string;
    close: string;
  };
  isOpen: boolean;
  minOrderAmount: number;
  deliveryRadius: number;
  taxConfig: number;
  deliveryCharges: {
    base: number;
    perKm: number;
  };
  freeDeliveryThreshold: number;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stockQuantity: number;
  variants?: {
    name: string;
    price: number;
  }[];
  isAvailable: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  vendorId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  vendorId: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  reply?: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  vendorId: string;
  name: string;
  phone: string;
  cnic: string;
  status: 'Active' | 'Inactive';
}

export interface Payout {
  id: string;
  vendorId: string;
  amount: number;
  status: 'Pending' | 'Completed';
  date: string;
}
