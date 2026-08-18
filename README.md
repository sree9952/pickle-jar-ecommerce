# 🫙 Grandma's Pickle & Jar E-Commerce Platform

A production-ready, highly scalable, full-stack E-Commerce application designed for selling homemade pickles, food products, glass jars, and gift packs.

Built with **Angular 18+**, **Node.js Express (Clean Architecture)**, **MySQL 8**, **Prisma ORM**, **Razorpay**, **Cloudinary**, and **JWT Admin Auth**.

---

## 🏛️ System Architecture

```
                                +-------------------------------+
                                |         CLIENT TIER           |
                                | Angular 18 (Standalone, RxJS) |
                                | - Guest Checkout & Cart       |
                                | - Admin Dashboard (JWT Auth)  |
                                +---------------+---------------+
                                                |
                                                v  HTTPS / REST APIs
                                +---------------+---------------+
                                |         BACKEND API           |
                                | Node.js + Express + TS        |
                                | Helmet, CORS, Rate Limit      |
                                | Controller -> Service -> Repo |
                                +---------------+---------------+
                                                |
                                                v  Prisma ORM
                                +---------------+---------------+
                                |       PERSISTENCE & CLOUD     |
                                | - MySQL 8 Database            |
                                | - Cloudinary Image Storage    |
                                | - Razorpay Payments API       |
                                +-------------------------------+
```

---

## 🛠️ Technology Stack & Free Tools

| Layer | Technology | Free / Open-Source Tier |
| :--- | :--- | :--- |
| **Frontend Framework** | Angular 18+, RxJS | Open Source (MIT) |
| **UI Components & Theme** | Angular Material, Custom SCSS | Open Source (MIT) |
| **Backend Framework** | Node.js, Express.js, TypeScript | Open Source (MIT) |
| **Database & ORM** | MySQL 8 Community Edition, Prisma ORM | Open Source (GPL/Apache) |
| **Payment Gateway** | Razorpay Integration | Standard Free Merchant Tier |
| **Image Hosting** | Cloudinary | Free Tier (25k transformations/mo) |
| **Frontend Hosting** | Vercel | Free Tier |
| **Backend Hosting** | Render | Free Tier |
| **Database Cloud** | Aiven / PlanetScale / Render MySQL | Free Tier MySQL Instance |

---

## 🔑 Key Features

### Customer Experience (No Login Required)
- **Guest Checkout**: Zero friction checkout. Customers provide only Name, Mobile Phone, Email (optional), and Shipping Address.
- **LocalStorage Cart**: Instant offline responsiveness managed reactively via RxJS `BehaviorSubject`.
- **Razorpay Payments**: Integrated online checkout supporting UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
- **HMAC Signature Security**: Server-side verification using SHA256 HMAC digest to ensure payment authenticity before order confirmation.
- **Guest Order Tracking**: Track real-time order status using **Order Number + Mobile Phone** without creating an account.
- **Printable Invoices**: One-click printable PDF invoice generation on order completion.

### Admin Dashboard (JWT Guarded)
- **KPI Metrics Dashboard**: Real-time Total Revenue, Order Counts, Pending Orders, and Low Stock Product Alerts.
- **Product & Inventory Management**: CRUD operations, weight tags, stock quantity limits, and automatic inventory transaction logs (`SALE`, `RESTOCK`, `ADJUSTMENT`).
- **Order Fulfillment Console**: Order status updates (*PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED*).

---

## 📁 Repository Structure

```
pickle-jar-ecommerce/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database ORM models
│   │   ├── schema.sql          # MySQL 8 DDL Script
│   │   └── seed.ts             # Initial Category, Product, Admin seed data
│   ├── src/
│   │   ├── config/             # Typed env validation, Prisma Client, Cloudinary
│   │   ├── controllers/        # Express HTTP controllers
│   │   ├── middlewares/        # JWT auth, Zod validation, error handler, rate limit
│   │   ├── repositories/       # Prisma data access layer
│   │   ├── services/           # Business logic & Razorpay signature verifier
│   │   ├── validators/         # Zod schemas
│   │   ├── routes/             # REST route definitions
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # HTTP server startup
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Cart RxJS service, API services, JWT interceptor, Auth guard
│   │   │   ├── shared/         # Header with cart badge, Footer, Product Card component
│   │   │   └── features/       # Home, Product Catalog, Product Detail, Cart, Checkout, Tracking, Admin
│   │   └── styles/             # SCSS design tokens & glassmorphic utilities
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- **Node.js**: v18 or v20+
- **MySQL**: 8.0 installed locally or via Docker
- **Git**

### 1. Database Setup & Seeding
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env with your MySQL database connection string:
# DATABASE_URL="mysql://root:password@localhost:3306/pickle_jar_db"

# Run database migrations & seed initial product catalog
npx prisma generate
npx prisma db seed
```

### 2. Start Backend API Server
```bash
npm run dev
# Backend API will run on http://localhost:5000
# Health check: http://localhost:5000/health
```

### 3. Start Angular Frontend Storefront
```bash
# Open a new terminal in frontend directory
cd frontend

# Install dependencies
npm install

# Start Angular development server
npm start
# Storefront will open on http://localhost:4200
```

---

## 🐳 Running with Docker Compose

Run the entire application (MySQL 8 + Express Backend) with a single command:
```bash
docker-compose up --build
```
- **Backend API**: `http://localhost:5000`
- **MySQL Container**: `localhost:3306`

---

## 🌐 Free Tier Cloud Deployment Guide

### 1. Deploy Frontend on Vercel
1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com) and import the repository.
3. Set **Root Directory** to `frontend`.
4. Build Command: `npm run build`
5. Output Directory: `dist/pickle-jar-frontend/browser`

### 2. Deploy Backend on Render (Free Tier)
1. Sign in to [Render](https://render.com).
2. Create a new **Web Service** connected to your GitHub repo.
3. Set **Root Directory** to `backend`.
4. Environment: `Node`.
5. Build Command: `npm install && npx prisma generate && npm run build`
6. Start Command: `node dist/server.js`
7. Add Environment Variables:
   - `DATABASE_URL`: *(Your Aiven / Render MySQL connection URI)*
   - `JWT_SECRET`: *(Secure random key)*
   - `RAZORPAY_KEY_ID`: *(Your Razorpay Test Key)*
   - `RAZORPAY_KEY_SECRET`: *(Your Razorpay Test Secret)*
   - `CLIENT_URL`: *(Your Vercel deployment URL)*

---

## 🔐 Demo Admin Credentials

To access the Admin Portal (`http://localhost:4200/admin/login`):
- **Email**: `admin@picklejar.com`
- **Password**: `AdminPassword123!`

---

## 📝 License
This project is open-source software licensed under the [MIT License](LICENSE).
