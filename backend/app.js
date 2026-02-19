const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Sample products data
const products = [
  {
    id: 1,
    name: "Laptop Pro",
    description: "High-performance laptop for developers",
    price: 1299.99,
    emoji: "💻"
  },
  {
    id: 2,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 49.99,
    emoji: "🖱️"
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches",
    price: 149.99,
    emoji: "⌨️"
  },
  {
    id: 4,
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with 4K HDMI output",
    price: 79.99,
    emoji: "🔌"
  },
  {
    id: 5,
    name: "Noise-Canceling Headphones",
    description: "Premium wireless headphones with active noise cancellation",
    price: 299.99,
    emoji: "🎧"
  },
  {
    id: 6,
    name: "Web Camera 4K",
    description: "4K webcam with auto-focus and built-in microphone",
    price: 129.99,
    emoji: "📷"
  },
  {
    id: 7,
    name: "Standing Desk",
    description: "Electric height-adjustable standing desk",
    price: 499.99,
    emoji: "🪑"
  },
  {
    id: 8,
    name: "Monitor 27\"",
    description: "27-inch 4K monitor with HDR support",
    price: 449.99,
    emoji: "🖥️"
  }
];

// In-memory storage for orders (in production, use a database)
let orders = [];
let orderIdCounter = 1000;

// API Routes
app.get("/api", (req, res) => {
  res.json({ 
    message: "Hello from Backend 🚀",
    endpoints: {
      products: "/api/products",
      singleProduct: "/api/products/:id",
      orders: "/api/orders",
      health: "/api/health"
    }
  });
});

// Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Get single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Create order
app.post("/api/orders", (req, res) => {
  try {
    const { customer, items, totals } = req.body;
    
    // Validate request
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    
    // Create order
    const order = {
      orderId: `ORD-${orderIdCounter++}`,
      customer,
      items,
      totals,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    
    console.log(`\n========== New Order Received ==========`);
    console.log(`Order ID: ${order.orderId}`);
    console.log(`Customer: ${customer.firstName} ${customer.lastName}`);
    console.log(`Email: ${customer.email}`);
    console.log(`\nOrder Items:`);
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)} each`);
    });
    console.log(`\nOrder Summary:`);
    console.log(`  Subtotal: $${totals.subtotal.toFixed(2)}`);
    console.log(`  Tax: $${totals.tax.toFixed(2)}`);
    console.log(`  Shipping: $${totals.shipping.toFixed(2)}`);
    console.log(`  Total: $${totals.total.toFixed(2)}`);
    console.log(`========================================\n`);
    
    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.orderId,
      estimatedDelivery: "3-5 business days"
    });
  } catch (error) {
    console.error("Order processing error:", error);
    res.status(500).json({ message: "Failed to process order" });
  }
});

// Get all orders (admin endpoint)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Get single order
app.get("/api/orders/:orderId", (req, res) => {
  const order = orders.find(o => o.orderId === req.params.orderId);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    products: products.length,
    orders: orders.length
  });
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
  console.log("Available endpoints:");
  console.log("  GET  /api");
  console.log("  GET  /api/products");
  console.log("  GET  /api/products/:id");
  console.log("  POST /api/orders");
  console.log("  GET  /api/orders");
  console.log("  GET  /api/health");
});
