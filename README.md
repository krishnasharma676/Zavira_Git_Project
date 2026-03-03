# Verve Fine Jewelry - Luxury E-commerce Platform

Verve is a production-ready, scalable, and secure e-commerce solution designed for ultra-premium jewelry brands. Inspired by editorial aesthetics, it combines a minimal luxury feel with robust security and modern performance.

## 💎 Design Philosophy
- **Premium Aesthetics**: Monochromatic palette with gold accents (#C5A059), serif typography (Playfair Display), and generous whitespace.
- **Editorial Presentation**: High-fidelity product cards, smooth Framer Motion transitions, and glassmorphism UI elements.
- **Performant UX**: Code-splitting, lazy-loading images, and optimized state management with Zustand.

## 🚀 Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Redis, JWT (Access/Refresh Tokens).
- **Security**: Helmet, CORS, Rate Limiting, Winston Logging, Centralized Error Handling.
- **Payment**: Razorpay, Paytm, PhonePe, COD.

## 🛠️ Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL
- Redis (optional for caching)

### Backend Setup
1. `cd server`
2. `npm install`
3. Configure `.env` (use `.env.example` as template)
4. `npx prisma generate`
5. `npx prisma migrate dev`
6. `npm run dev`

### Frontend Setup
1. `cd client`
2. `npm install`
3. Configure `.env` (VITE_API_URL)
4. `npm run dev`

### Docker Deployment
1. `docker-compose up --build`

## 🔒 Security Features
- **JWT Authentication**: Secure token-based auth with refresh token rotation.
- **RBAC**: Role-based access control for Admin/User endpoints.
- **Sanitization**: Input validation using Zod schemas.
- **Protection**: Helmet for security headers and rate limiting for API abuse.

## 📦 Production Deployment (VPS + Nginx)
1. Set up a VPS (Ubuntu recommended).
2. Install Docker and Docker Compose.
3. Clone the repository.
4. Set up Nginx as a reverse proxy for the Docker containers.
5. Use Certbot for SSL termination.

---
*Created by Antigravity AI for Luxury Brands.*
