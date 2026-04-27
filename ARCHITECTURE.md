# Cartify Architecture Guide

## System Overview

Cartify is a full-stack e-commerce platform built with Next.js, React, and localStorage-based data persistence. It features a complete product catalog, shopping cart, order management, and admin dashboard.

## Core Components

### 1. Authentication System (`/lib/auth-context.tsx`)
Manages user authentication and role-based access control.

**Key Functions:**
- `login(email, password)` - Authenticates user and assigns role
- `signup(email, password, name)` - Creates new customer account
- `logout()` - Clears user session

**Auto-Initialized Accounts:**
- Admin: admin@cartify.com / admin123
- Customer: demo@example.com / demo123

**Data Storage:**
```javascript
cartify_users = {
  "email@example.com": {
    id: "user_id",
    password: "hashed",
    name: "User Name",
    role: "customer", // or "admin"
    createdAt: "ISO-8601-date"
  }
}
```

### 2. Product System (`/lib/products.ts`)
Contains 240 products across 8 categories.

**Structure:**
```typescript
{
  id: "prod_1",
  name: "Product Name",
  description: "Description",
  price: 29.99,
  category: "Electronics",
  image: "/products/image.jpg",
  stock: 50,
  rating: 4.5,
  reviewCount: 250
}
```

**Categories (30 items each):**
- Electronics
- Clothing
- Books
- Home & Garden
- Sports & Outdoors
- Toys & Games
- Beauty & Personal Care
- Kitchen & Dining

### 3. Cart System (`/lib/cart-context.tsx`)
Manages shopping cart state and persistence.

**Key Functions:**
- `addToCart(productId, quantity, price)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `getItems()` - Get all cart items
- `getItemCount()` - Get total item count
- `clearCart()` - Empty cart
- `getTotal()` - Calculate cart total

**Data Storage:**
```javascript
cartify_cart = [
  {
    productId: "prod_1",
    quantity: 2,
    price: 29.99
  }
]
```

### 4. Orders System (`/lib/orders-context.tsx`)
Handles order creation and management.

**Key Functions:**
- `createOrder(userId, items, total)` - Place new order
- `getOrdersByUser(userId)` - Get user's orders
- `getOrderById(orderId)` - Get specific order
- `updateOrderStatus(orderId, status)` - Admin function to update status

**Order Structure:**
```typescript
{
  id: "order_1234567890",
  userId: "user_id",
  items: [
    {
      productId: "prod_1",
      name: "Product Name",
      price: 29.99,
      quantity: 2
    }
  ],
  total: 59.98,
  status: "Processing" | "Shipped" | "Delivered",
  createdAt: "ISO-8601-date",
  updatedAt: "ISO-8601-date"
}
```

**Data Storage:**
```javascript
cartify_orders = [
  { /* order objects */ }
]
```

## Page Architecture

### Public Pages
- `/` - Home with category showcase
- `/login` - User login
- `/signup` - User registration

### Customer Pages (Authenticated)
- `/cart` - Shopping cart
- `/checkout` - Purchase checkout
- `/orders` - Order list
- `/orders/[orderId]` - Order details with timeline

### Admin Pages (Role: Admin Only)
- `/admin` - Dashboard with statistics and orders table
- `/admin/orders/[orderId]` - Order management with status updates

## Component Hierarchy

```
Layout
├── Navbar
│   ├── Logo (Cartify)
│   ├── Navigation
│   │   ├── Shop (customer)
│   │   ├── Orders (customer)
│   │   ├── Admin (admin only)
│   │   └── Cart Badge
│   └── Auth
│       ├── User Menu
│       └── Login/Signup

Home Page
├── Hero Banner
├── Category Grid
├── Product Grid
│   ├── ProductCard
│   │   ├── Image
│   │   ├── Title
│   │   ├── Price
│   │   ├── Rating
│   │   └── Add to Cart Button
│   └── [More ProductCards]

Cart Page
├── Cart Items
│   ├── CartItem
│   │   ├── Image
│   │   ├── Name
│   │   ├── Price
│   │   ├── Quantity Controls
│   │   └── Remove Button
│   └── [More CartItems]
└── Cart Summary

Checkout Page
├── Form
│   ├── Shipping Details
│   ├── Payment Details
│   └── Order Review
└── Place Order Button

Orders Page
├── Order List
│   ├── Order Card
│   │   ├── Order ID
│   │   ├── Total
│   │   ├── Status Badge
│   │   └── View Button
│   └── [More Order Cards]

Order Detail Page
├── Order Header
├── OrderTimeline
│   ├── Processing Step
│   ├── Shipped Step
│   └── Delivered Step
├── Order Items
└── Order Summary

Admin Dashboard
├── Statistics
│   ├── Processing Count Card
│   ├── Shipped Count Card
│   └── Delivered Count Card
└── Orders Table
    └── Each Row: ID | Customer | Total | Status | Manage Button

Admin Order Management
├── Order Header with Status Badge
├── Status Update Buttons
│   ├── Processing Button
│   ├── Shipped Button
│   └── Delivered Button
├── Order Items List
└── Order Summary
```

## Data Flow

### Shopping Flow
```
Home → ProductCard (Browse) → AddToCart 
  → Cart Context Updates 
    → CartPage (View) 
      → Checkout (Form) 
        → Orders Context (Create) 
          → Success Page
```

### Order Tracking Flow
```
Customer Places Order 
  → Order Created (Status: Processing)
    → Appears in /orders page
      → Click to view details
        → See timeline with 3 states
```

### Admin Update Flow
```
Admin Dashboard → Click Manage Order
  → See Current Status
    → Click New Status Button
      → updateOrderStatus() called
        → Orders Context Updates
          → Success Notification
            → Customer Timeline Updates (Real-time)
```

## State Management

### Global State (Contexts)
- **AuthContext** - User authentication and role
- **CartContext** - Shopping cart items
- **OrdersContext** - All orders and order operations

### Local State
- Form inputs
- UI toggles (mobile menu, etc.)
- Loading states
- Error messages

## Database (localStorage)

**Keys Used:**
```javascript
localStorage.cartify_users       // User accounts
localStorage.cartify_user        // Current logged-in user
localStorage.cartify_products    // Product catalog (static)
localStorage.cartify_cart        // Current user's cart
localStorage.cartify_orders      // All orders
```

## Access Control

### Role-Based Routes

**Admin-Only:**
```typescript
// Protected via role check in page component
if (!user || user.role !== 'admin') {
  router.push('/');
}
```

**Customer-Only:**
```typescript
// Auto-redirects to login if not authenticated
if (!user) {
  router.push('/login');
}
```

**Public:**
- Login page
- Signup page

## Styling

**Framework:** Tailwind CSS v4  
**Components:** shadcn/ui  
**Color Scheme:**
- Primary: Blue (#2563eb)
- Secondary: Gray (#f3f4f6)
- Accent: Purple (for admin)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

## API-like Functions

The app simulates backend APIs through context providers:

```typescript
// Authentication
await login(email, password)
await signup(email, password, name)
logout()

// Products
products.filter(p => p.category === 'Electronics')
products.find(p => p.id === 'prod_1')

// Cart
cart.addToCart(productId, quantity, price)
cart.removeFromCart(productId)
cart.getTotal()

// Orders
orders.createOrder(userId, items, total)
orders.getOrdersByUser(userId)
orders.updateOrderStatus(orderId, status)
```

## Key Features Implementation

### 1. Category Filtering
- Home page shows category cards
- Click to filter products
- Quick filter buttons for all categories
- Product count shown per category

### 2. Product Display
- Grid layout (responsive: 1→2→3→4 columns)
- Star rating with review count
- Price and stock display
- "Add to Cart" with quantity selector

### 3. Order Timeline
- 3-step progress indicator
- Visual status progression
- Current step highlighted
- Completed steps checked
- Timestamps for each state

### 4. Admin Order Updates
- Click buttons to update status
- Immediate context updates
- Success notification
- Can be changed multiple times

### 5. Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Touch-friendly buttons
- Readable on all screen sizes

## Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading for product images
- Context memoization to prevent re-renders
- Efficient localStorage usage
- No external API calls (all local)

## Security Considerations

- Passwords stored in localStorage (demo only - not production-safe)
- Role-based access control on protected pages
- User can only see their own orders
- Admin access requires admin role
- No sensitive data in URLs

## Error Handling

- Try-catch blocks for authentication
- Route guards for unauthorized access
- Form validation on input
- Clear error messages to users
- Fallback UI for missing data

## Future Enhancement Opportunities

1. Backend API integration
2. Real payment processing
3. Email notifications
4. Inventory management
5. User profiles and addresses
6. Product reviews and ratings
7. Wishlist functionality
8. Search functionality
9. Filtering by price/rating
10. Order cancellation

---

This architecture provides a scalable foundation for a full e-commerce platform while keeping implementation simple for demo purposes.
