import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vendor, Product, Order, Review, Staff, Payout } from '../types';
import { demoVendors, demoProducts, demoOrders, demoReviews, demoStaff, demoPayouts } from './demoData';

interface StoreState {
  vendors: Vendor[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  staff: Staff[];
  payouts: Payout[];
  currentVendorId: string | null;
  
  // Actions
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  registerVendor: (vendor: Partial<Vendor>) => void;
  updateVendor: (vendor: Partial<Vendor>) => void;
  
  addProduct: (product: Omit<Product, 'id' | 'vendorId'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  addStaff: (staff: Omit<Staff, 'id' | 'vendorId'>) => void;
  
  resetToDemoData: () => void;
  clearAllData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      vendors: demoVendors,
      products: demoProducts,
      orders: demoOrders,
      reviews: demoReviews,
      staff: demoStaff,
      payouts: demoPayouts,
      currentVendorId: null,

      login: (email, password) => {
        const vendor = get().vendors.find((v) => v.email === email);
        if (vendor) {
          set({ currentVendorId: vendor.id });
          return true;
        }
        return false;
      },

      logout: () => set({ currentVendorId: null }),

      registerVendor: (vendorData) => {
        const newVendor: Vendor = {
          id: `v${Date.now()}`,
          storeName: vendorData.storeName || '',
          email: vendorData.email || '',
          phone: vendorData.phone || '',
          description: vendorData.description || '',
          timings: { open: '09:00', close: '22:00' },
          isOpen: true,
          minOrderAmount: 0,
          deliveryRadius: 5,
          taxConfig: 0,
          deliveryCharges: { base: 0, perKm: 0 },
          freeDeliveryThreshold: 0,
          ...vendorData,
        };
        set((state) => ({
          vendors: [...state.vendors, newVendor],
          currentVendorId: newVendor.id,
        }));
      },

      updateVendor: (vendorData) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === state.currentVendorId ? { ...v, ...vendorData } : v
          ),
        }));
      },

      addProduct: (productData) => {
        const vendorId = get().currentVendorId;
        if (!vendorId) return;
        const newProduct: Product = {
          ...productData,
          id: `p${Date.now()}`,
          vendorId,
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },

      addStaff: (staffData) => {
        const vendorId = get().currentVendorId;
        if (!vendorId) return;
        const newStaff: Staff = {
          ...staffData,
          id: `s${Date.now()}`,
          vendorId,
        };
        set((state) => ({ staff: [...state.staff, newStaff] }));
      },

      resetToDemoData: () => {
        set({
          vendors: demoVendors,
          products: demoProducts,
          orders: demoOrders,
          reviews: demoReviews,
          staff: demoStaff,
          payouts: demoPayouts,
          currentVendorId: null,
        });
      },

      clearAllData: () => {
        set({
          vendors: [],
          products: [],
          orders: [],
          reviews: [],
          staff: [],
          payouts: [],
          currentVendorId: null,
        });
      },
    }),
    {
      name: 'foodie-express-storage',
    }
  )
);
