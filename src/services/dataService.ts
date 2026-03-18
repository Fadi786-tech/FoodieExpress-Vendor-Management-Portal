
// Initial dummy data
const initialData = {
  products: [
    { id: "PRD-001", name: "Classic Cheeseburger", category: "Burgers", price: 1299, stock: 45, status: "Active", images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop"] },
    { id: "PRD-002", name: "Double Bacon Burger", category: "Burgers", price: 1699, stock: 30, status: "Active", images: ["https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=500&auto=format&fit=crop"] },
    { id: "PRD-003", name: "Spicy Chicken Sandwich", category: "Sandwiches", price: 1450, stock: 15, status: "Low Stock", images: ["https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=500&auto=format&fit=crop"] },
    { id: "PRD-004", name: "Veggie Delight", category: "Vegetarian", price: 1199, stock: 50, status: "Active", images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop"] },
    { id: "PRD-005", name: "Large Fries", category: "Sides", price: 499, stock: 100, status: "Active", images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500&auto=format&fit=crop"] },
    { id: "PRD-006", name: "Onion Rings", category: "Sides", price: 599, stock: 0, status: "Out of Stock", images: ["https://images.unsplash.com/photo-1639024471283-03518883511d?q=80&w=500&auto=format&fit=crop"] },
    { id: "PRD-007", name: "Vanilla Milkshake", category: "Beverages", price: 650, stock: 20, status: "Active", images: ["https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=500&auto=format&fit=crop"] },
  ],
  orders: [
    { id: "ORD-1023", customer: "Ali Khan", date: "2023-10-25T10:30:00", total: 1450, status: "Pending", items: 3 },
    { id: "ORD-1024", customer: "Fatima Ahmed", date: "2023-10-25T11:15:00", total: 2120, status: "Confirmed", items: 5 },
    { id: "ORD-1025", customer: "Bilal Hussain", date: "2023-10-25T12:00:00", total: 850, status: "Preparing", items: 1 },
    { id: "ORD-1026", customer: "Zainab Raza", date: "2023-10-25T12:45:00", total: 3600, status: "Ready", items: 4 },
    { id: "ORD-1027", customer: "Usman Tariq", date: "2023-10-25T13:30:00", total: 1600, status: "Out for Delivery", items: 2 },
    { id: "ORD-1028", customer: "Ayesha Malik", date: "2023-10-25T14:00:00", total: 950, status: "Delivered", items: 2 },
    { id: "ORD-1029", customer: "Hamza Sheikh", date: "2023-10-25T14:30:00", total: 550, status: "Cancelled", items: 1 },
  ],
  staff: [
    { id: "STF-001", name: "Ahmed Raza", role: "Manager", phone: "0300-1234567", status: "Active" },
    { id: "STF-002", name: "Bilal Khan", role: "Delivery Boy", phone: "0311-7654321", status: "Active" },
    { id: "STF-003", name: "Usman Ali", role: "Chef", phone: "0322-9876543", status: "Active" },
    { id: "STF-004", name: "Zainab Tariq", role: "Cashier", phone: "0333-4567890", status: "On Leave" },
    { id: "STF-005", name: "Hamza Sheikh", role: "Delivery Boy", phone: "0344-1122334", status: "Inactive" },
  ],
  reviews: [
    { id: 1, customer: "Sarah Jenkins", rating: 5, date: "2 days ago", comment: "The classic cheeseburger was amazing! Best in town. Arrived hot and fresh.", status: "Replied" },
    { id: 2, customer: "Mike Ross", rating: 4, date: "1 week ago", comment: "Good food, but the delivery took a bit longer than expected. Fries were still crispy though.", status: "Pending" },
    { id: 3, customer: "Emily Clark", rating: 1, date: "2 weeks ago", comment: "Missing items in my order. Very disappointed.", status: "Pending" },
    { id: 4, customer: "David Lee", rating: 5, date: "1 month ago", comment: "Always my go-to place for late night cravings. 10/10 recommend.", status: "Replied" },
  ],
  transactions: [
    { id: "TRX-9876", date: "2023-10-25", amount: 12500, status: "Completed", type: "Payout" },
    { id: "TRX-9875", date: "2023-10-18", amount: 110050, status: "Completed", type: "Payout" },
    { id: "TRX-9874", date: "2023-10-11", amount: 95025, status: "Completed", type: "Payout" },
    { id: "TRX-9873", date: "2023-10-04", amount: 132000, status: "Completed", type: "Payout" },
    { id: "TRX-9872", date: "2023-09-27", amount: 105075, status: "Completed", type: "Payout" },
  ],
  settings: {
    storeName: "Burger Joint",
    ownerName: "John Doe",
    email: "contact@burgerjoint.com",
    phone: "+1 (555) 123-4567",
    description: "The best burgers in town, made with 100% grass-fed beef and fresh ingredients daily.",
    address: "123 Main St, Foodville, CA 90210"
  },
  operations: {
    isOpen: true,
    minOrderValue: 500,
    deliveryRadius: 5,
    codEnabled: true,
    cardEnabled: true,
    hours: {
      Monday: { open: "09:00", close: "22:00", active: true },
      Tuesday: { open: "09:00", close: "22:00", active: true },
      Wednesday: { open: "09:00", close: "22:00", active: true },
      Thursday: { open: "09:00", close: "22:00", active: true },
      Friday: { open: "09:00", close: "22:00", active: true },
      Saturday: { open: "09:00", close: "22:00", active: true },
      Sunday: { open: "09:00", close: "22:00", active: false }
    }
  }
};

const STORAGE_KEY = 'foodie_express_db';

const getDb = () => {
  if (typeof window === 'undefined') return initialData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || stored === 'undefined' || stored === 'null' || stored === '{}') {
      console.log('DataService: Initializing with default data');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    const parsed = JSON.parse(stored);
    // Ensure all keys exist by merging with initialData
    return { ...initialData, ...parsed };
  } catch (e) {
    console.error('DataService: Error loading from localStorage, falling back to initial data', e);
    return initialData;
  }
};

const saveDb = (data: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('DataService: Error saving to localStorage', e);
    }
  }
};

export const dataService = {
  // Reset
  resetData: async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return initialData;
  },
  // Products
  getProducts: async () => getDb().products,
  addProduct: async (product: any) => {
    const db = getDb();
    const newProduct = { ...product, id: `PRD-${String(db.products.length + 1).padStart(3, '0')}` };
    db.products.push(newProduct);
    saveDb(db);
    return newProduct;
  },
  updateProduct: async (id: string, product: any) => {
    const db = getDb();
    const index = db.products.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...product, id };
      saveDb(db);
      return db.products[index];
    }
    throw new Error('Product not found');
  },
  deleteProduct: async (id: string) => {
    const db = getDb();
    db.products = db.products.filter((p: any) => p.id !== id);
    saveDb(db);
  },

  // Orders
  getOrders: async () => getDb().orders,
  updateOrder: async (id: string, order: any) => {
    const db = getDb();
    const index = db.orders.findIndex((o: any) => o.id === id);
    if (index !== -1) {
      db.orders[index] = { ...db.orders[index], ...order, id };
      saveDb(db);
      return db.orders[index];
    }
    throw new Error('Order not found');
  },

  // Staff
  getStaff: async () => getDb().staff,
  addStaff: async (staff: any) => {
    const db = getDb();
    const newStaff = { ...staff, id: `STF-${String(db.staff.length + 1).padStart(3, '0')}` };
    db.staff.push(newStaff);
    saveDb(db);
    return newStaff;
  },
  updateStaff: async (id: string, staff: any) => {
    const db = getDb();
    const index = db.staff.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      db.staff[index] = { ...db.staff[index], ...staff, id };
      saveDb(db);
      return db.staff[index];
    }
    throw new Error('Staff not found');
  },
  deleteStaff: async (id: string) => {
    const db = getDb();
    db.staff = db.staff.filter((s: any) => s.id !== id);
    saveDb(db);
  },

  // Reviews
  getReviews: async () => getDb().reviews,
  updateReview: async (id: number, review: any) => {
    const db = getDb();
    const index = db.reviews.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      db.reviews[index] = { ...db.reviews[index], ...review, id };
      saveDb(db);
      return db.reviews[index];
    }
    throw new Error('Review not found');
  },
  deleteReview: async (id: number) => {
    const db = getDb();
    db.reviews = db.reviews.filter((r: any) => r.id !== id);
    saveDb(db);
  },

  // Settings
  getSettings: async () => getDb().settings,
  updateSettings: async (settings: any) => {
    const db = getDb();
    db.settings = { ...db.settings, ...settings };
    saveDb(db);
    return db.settings;
  },

  // Operations
  getOperations: async () => getDb().operations,
  updateOperations: async (operations: any) => {
    const db = getDb();
    db.operations = { ...db.operations, ...operations };
    saveDb(db);
    return db.operations;
  },

  // Payments
  getPayments: async () => getDb().transactions,

  // Dashboard
  getDashboard: async () => {
    const db = getDb();
    const recentOrders = db.orders.slice(0, 4).map((o: any) => ({
      id: o.id,
      customer: o.customer,
      amount: `Rs. ${o.total.toLocaleString()}`,
      status: o.status
    }));

    const lowStockItems = db.products
      .filter((p: any) => p.stock <= 20)
      .map((p: any) => ({
        name: p.name,
        stock: p.stock,
        threshold: 20
      }));

    return {
      recentOrders,
      lowStockItems
    };
  },

  // Analytics
  getAnalytics: async () => {
    return {
      salesData: [
        { name: "Mon", sales: 40000 },
        { name: "Tue", sales: 30000 },
        { name: "Wed", sales: 20000 },
        { name: "Thu", sales: 27800 },
        { name: "Fri", sales: 18900 },
        { name: "Sat", sales: 23900 },
        { name: "Sun", sales: 34900 },
      ],
      topProducts: [
        { name: "Classic Cheeseburger", sales: 1245, revenue: "Rs. 1,617,255" },
        { name: "Large Fries", sales: 980, revenue: "Rs. 489,020" },
        { name: "Vanilla Milkshake", sales: 850, revenue: "Rs. 552,500" },
        { name: "Spicy Chicken Sandwich", sales: 720, revenue: "Rs. 1,044,000" },
        { name: "Double Bacon Burger", sales: 650, revenue: "Rs. 1,104,350" },
      ],
      peakHoursData: [
        { time: "12 PM", orders: 45 },
        { time: "1 PM", orders: 80 },
        { time: "2 PM", orders: 65 },
        { time: "6 PM", orders: 55 },
        { time: "7 PM", orders: 110 },
        { time: "8 PM", orders: 130 },
        { time: "9 PM", orders: 90 },
      ]
    };
  }
};
