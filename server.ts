import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const DB_FILE = path.join(process.cwd(), "db.json");

// Default mock data
const defaultData = {
  products: [
    { id: "PRD-001", name: "Classic Cheeseburger", category: "Burgers", price: 1299, stock: 45, status: "Active" },
    { id: "PRD-002", name: "Double Bacon Burger", category: "Burgers", price: 1699, stock: 30, status: "Active" },
    { id: "PRD-003", name: "Spicy Chicken Sandwich", category: "Sandwiches", price: 1450, stock: 15, status: "Low Stock" },
    { id: "PRD-004", name: "Veggie Delight", category: "Vegetarian", price: 1199, stock: 50, status: "Active" },
    { id: "PRD-005", name: "Large Fries", category: "Sides", price: 499, stock: 100, status: "Active" },
    { id: "PRD-006", name: "Onion Rings", category: "Sides", price: 599, stock: 0, status: "Out of Stock" },
    { id: "PRD-007", name: "Vanilla Milkshake", category: "Beverages", price: 650, stock: 20, status: "Active" },
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

// Load data from file or use default
let db = { ...defaultData };
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (e) {
    console.error("Error reading db.json", e);
  }
}

const saveDb = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Operations API
  app.get("/api/operations", (req, res) => {
    res.json(db.operations);
  });

  app.put("/api/operations", (req, res) => {
    db.operations = { ...db.operations, ...req.body };
    saveDb();
    res.json(db.operations);
  });

  // Analytics API
  app.get("/api/analytics", (req, res) => {
    res.json({
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
    });
  });

  // Settings API
  app.get("/api/settings", (req, res) => {
    res.json(db.settings);
  });

  app.put("/api/settings", (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDb();
    res.json(db.settings);
  });

  // Payments API
  app.get("/api/payments", (req, res) => {
    res.json(db.transactions);
  });

  // Reviews API
  app.get("/api/reviews", (req, res) => {
    res.json(db.reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const newReview = { ...req.body, id: db.reviews.length + 1 };
    db.reviews.push(newReview);
    saveDb();
    res.status(201).json(newReview);
  });

  app.put("/api/reviews/:id", (req, res) => {
    const index = db.reviews.findIndex(r => r.id === parseInt(req.params.id));
    if (index !== -1) {
      db.reviews[index] = { ...db.reviews[index], ...req.body };
      saveDb();
      res.json(db.reviews[index]);
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  });

  app.delete("/api/reviews/:id", (req, res) => {
    db.reviews = db.reviews.filter(r => r.id !== parseInt(req.params.id));
    saveDb();
    res.status(204).send();
  });

  // Staff API
  app.get("/api/staff", (req, res) => {
    res.json(db.staff);
  });

  app.post("/api/staff", (req, res) => {
    const newStaff = { ...req.body, id: `STF-${String(db.staff.length + 1).padStart(3, '0')}` };
    db.staff.push(newStaff);
    saveDb();
    res.status(201).json(newStaff);
  });

  app.put("/api/staff/:id", (req, res) => {
    const index = db.staff.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      db.staff[index] = { ...db.staff[index], ...req.body };
      saveDb();
      res.json(db.staff[index]);
    } else {
      res.status(404).json({ error: "Staff not found" });
    }
  });

  app.delete("/api/staff/:id", (req, res) => {
    db.staff = db.staff.filter(s => s.id !== req.params.id);
    saveDb();
    res.status(204).send();
  });

  // Products API
  app.get("/api/products", (req, res) => {
    res.json(db.products);
  });

  app.post("/api/products", (req, res) => {
    const newProduct = { ...req.body, id: `PRD-${String(db.products.length + 1).padStart(3, '0')}` };
    db.products.push(newProduct);
    saveDb();
    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...req.body };
      saveDb();
      res.json(db.products[index]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    db.products = db.products.filter(p => p.id !== req.params.id);
    saveDb();
    res.status(204).send();
  });

  // Orders API
  app.get("/api/orders", (req, res) => {
    res.json(db.orders);
  });

  // Dashboard API
  app.get("/api/dashboard", (req, res) => {
    const recentOrders = db.orders.slice(0, 4).map(o => ({
      id: o.id,
      customer: o.customer,
      amount: `Rs. ${o.total.toLocaleString()}`,
      status: o.status
    }));

    const lowStockItems = db.products
      .filter(p => p.stock <= 20)
      .map(p => ({
        name: p.name,
        stock: p.stock,
        threshold: 20
      }));

    res.json({
      recentOrders,
      lowStockItems
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
