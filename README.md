# LuxeMart — Production Full-Stack MERN E-Commerce Website

A modern, full-stack **E-Commerce Web Application** built using MongoDB, Express.js, React (Vite), and Node.js with Tailwind CSS, Axios, and JWT authentication.

🚀 **Live Deployment**: [https://vercel.com/azmath-alis-projects-804509f9/mern-ecommerce](https://vercel.com/azmath-alis-projects-804509f9/mern-ecommerce)

---

## 🌟 Key Highlights

- **Pure JavaScript**: Strictly built without TypeScript as requested.
- **Modern ES Modules**: Modern `import` / `export` syntax on both backend and frontend.
- **Production UI/UX**: Clean off-white aesthetics, soft borders, modern typography, responsive layout across desktop, tablet, and mobile.
- **Real End-to-End Integration**: Live database operations with MongoDB, real authentication tokens, real order fulfillment, and live telemetry statistics.
- **Seed Data Included**: Over 20 realistic products with high-resolution imagery across 7 departments, plus pre-configured Admin and Customer test accounts.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (v19) with **Vite**
- **Tailwind CSS** (v4) with `@tailwindcss/vite`
- **React Router DOM** (v7) for client-side routing & route guards
- **Axios** with centralized interceptors for automatic JWT Bearer token attachment
- **React Icons** for modern iconography
- **Context API**: `AuthContext` (session restoration), `CartContext` (with `localStorage` persistence & stock enforcement), and `ToastContext` (lightweight notifications)

### Backend
- **Node.js** & **Express.js** (ES Modules)
- **MongoDB** & **Mongoose** (ODM with schemas, indexes, hooks)
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for secure password hashing
- **cors** & **dotenv** for security and configuration

---

## 📁 Project Structure

```text
ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js                 # Reusable Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Signup, login, me
│   │   ├── productController.js  # CRUD, search, filter, sort, pagination
│   │   ├── orderController.js    # Order creation, myorders, admin status, dashboard stats
│   │   └── userController.js     # Profile update, admin users list
│   ├── middleware/
│   │   ├── authMiddleware.js     # protect (JWT verification) & adminOnly guards
│   │   └── errorMiddleware.js    # Centralized 404 & error handlers
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt pre-save & toJSON hiding
│   │   ├── Product.js            # Product schema with stock and price validation
│   │   └── Order.js              # Order schema with shipping, items, and status lifecycle
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── productRoutes.js      # /api/products
│   │   ├── orderRoutes.js        # /api/orders
│   │   └── userRoutes.js         # /api/users
│   ├── utils/
│   │   ├── generateToken.js      # JWT signer
│   │   └── seed.js               # Database seeder with 20+ realistic products
│   ├── test_api_flows.js         # 34-point end-to-end automated test suite
│   ├── server.js                 # Express application entrypoint
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProductCard, Rating, Skeletons, Loaders, EmptyState, Pagination, ProtectedRoute, AdminRoute
│   │   ├── context/              # AuthContext, CartContext, ToastContext
│   │   ├── layouts/              # MainLayout, AdminLayout
│   │   ├── pages/                # Home, Shop, ProductDetails, Cart, Checkout, OrderSuccess, Orders, OrderDetails, Profile, Login, Signup
│   │   │   └── admin/            # AdminDashboard, AdminProducts, AdminProductAdd, AdminProductEdit, AdminOrders, AdminUsers
│   │   ├── services/             # Centralized Axios instance (api.js)
│   │   ├── App.jsx               # React Router route tree
│   │   ├── index.css             # Tailwind setup
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 👥 Pre-Configured Test Credentials

The database comes pre-seeded with test accounts. Quick-fill buttons are also available on the Login page:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `admin123` | Full access to Admin Console, Products, Orders, Users, Telemetry |
| **Customer** | `user@example.com` | `user123` | Browsing, Cart, Checkout, My Orders, Profile settings |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=super_secret_ecomerce_jwt_token_key_2026
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🚀 Getting Started & Installation

### Prerequisites
1. **Node.js**: v18 or higher (v20+ recommended)
2. **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install

# Seed the database with 22 realistic products & test accounts
npm run seed

# Start development server
npm run dev
# Server will listen on http://localhost:8080
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
# Frontend will be live on http://localhost:5174
```

---

## 🔌 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register customer (validates email, hashes password, returns JWT).
- `POST /api/auth/login` — Authenticate and receive JWT.
- `GET /api/auth/me` — Verify session and fetch current profile `[Private]`.

### Products (`/api/products`)
- `GET /api/products` — List products with search (`?search=`), category (`?category=`), price filtering (`?minPrice=&maxPrice=`), sorting (`?sort=price-low|price-high|top-rated|newest`), and pagination (`?page=&limit=`).
- `GET /api/products/categories` — Distinct list of product categories.
- `GET /api/products/:id` — Fetch single product details.
- `POST /api/products` — Create new product `[Admin Only]`.
- `PUT /api/products/:id` — Update product details and stock `[Admin Only]`.
- `DELETE /api/products/:id` — Delete product `[Admin Only]`.

### Orders (`/api/orders`)
- `POST /api/orders` — Place new customer order (verifies stock, decrements stock, records shipping & payment) `[Private]`.
- `GET /api/orders/myorders` — Fetch orders placed by logged-in user `[Private]`.
- `GET /api/orders/:id` — Get single order details `[Private: Owner or Admin]`.
- `GET /api/orders` — Fetch all customer orders `[Admin Only]`.
- `PUT /api/orders/:id/status` — Update fulfillment status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) `[Admin Only]`.
- `GET /api/orders/stats/overview` — Dashboard statistics (Revenue, Total Orders, Active Products, Total Users, Fulfillment Breakdown, Recent Activity) `[Admin Only]`.

### Users (`/api/users`)
- `GET /api/users/profile` — Fetch logged-in user profile `[Private]`.
- `PUT /api/users/profile` — Update username, phone, shipping address, or password `[Private]`.
- `GET /api/users` — List registered customers and staff `[Admin Only]`.

---

## 🧪 Automated Testing

A 34-point end-to-end automated test suite is included in `backend/test_api_flows.js`:

```bash
cd backend
node test_api_flows.js
```

### Verified Test Cases:
1. Server health check
2. Product catalog listing & pagination
3. Category extraction
4. Case-insensitive search
5. Strict category filtering
6. Numerical price-range filtering
7. Sorting ascending / descending
8. Single product details
9. Customer signup with password hashing
10. Password exclusion in JSON responses
11. Duplicate email prevention (HTTP 400)
12. Invalid password rejection (HTTP 401)
13. Customer authentication & role assignment
14. Admin authentication & role assignment
15. Route gate: Non-admin denied access to admin routes (HTTP 403)
16. Route gate: Unauthenticated visitor rejected from protected routes (HTTP 401)
17. Admin access to administrative data
18. Customer profile modification (phone, address)
19. Prevention of role tampering/escalation
20. Admin product creation with validation
21. Admin product editing & stock synchronization
22. Customer checkout & order creation
23. Dynamic stock decrement upon order creation
24. Customer viewing order history
25. Customer viewing individual order breakdown
26. Admin order status advancement (`Shipped`, `Delivered`)
27. Automatic marking of COD payments upon delivery
28. Real-time telemetry calculations in admin dashboard
29. Admin deletion of product items

---

## 💻 Pages & Features Overview

### Customer Experience:
- **Home**: Dynamic hero spotlight, category navigation, featured products carousel, promotional deals, and newsletter signup.
- **Shop**: Real-time search, price range filter sliders, multi-category selector, sorting selector, active filter pills, pagination, and stock badges.
- **Product Details**: Multi-image gallery with zoom/select, detailed reviews and star ratings, live stock indicator, quantity counter, Add-to-Cart, and Buy-Now instant checkout.
- **Cart**: Quantity stepper, stock limit notifications, remove items, shipping calculation (free over $100), estimated taxes, and persistence across refreshes via `localStorage`.
- **Checkout**: Shipping address form prefilled from user profile, Cash on Delivery support with extensible architecture, and price breakdown.
- **Order Success**: Animated confirmation checkmark, unique order ID, and shortcuts to tracking.
- **My Orders**: Complete order history table with status badges and deep links.
- **Order Details**: Full shipment breakdown with timestamps, itemized pricing, delivery address, and payment status.
- **Profile**: Edit username, telephone, delivery address, and update password with validation.

### Admin Experience:
- **Dashboard**: Live financial and operational metrics (Total Revenue, Total Orders, Active Catalog, Registered Users), fulfillment status distributions, recent orders, and recent products.
- **Product Inventory**: Sortable table with thumbnails, titles, categories, pricing, stock levels, and actions (Edit / Delete).
- **Add Product**: Comprehensive form with live image preview, specification inputs, stock levels, and featured flags.
- **Edit Product**: Pre-populated form to update prices, descriptions, images, or adjust stock.
- **Order Management**: Status changer dropdown (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) with instant database updates and modal quick-inspector.
- **User Directory**: View all registered users, emails, assigned roles, and join dates.

---


