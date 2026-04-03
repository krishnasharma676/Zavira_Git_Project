import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import dashboardRoutes from './routes/dashboard.routes';
import reviewRoutes from './routes/review.routes';
import addressRoutes from './routes/address.routes';
import bannerRoutes from './routes/banner.routes';
import firebaseAuthRoutes from './routes/firebase.auth.routes';
import testimonialRoutes from './routes/testimonial.routes';
import contactRoutes from './routes/contact.routes';
import settingRoutes from './routes/setting.routes';
import inventoryRoutes from './routes/inventory.routes';
import reportRoutes from './routes/report.routes';
import shiprocketRoutes from './routes/shiprocket.routes';
import variantRoutes from './routes/variant.routes';
import colorRoutes from './routes/color.routes';
import webhookRoutes from './routes/payment.webhook.routes';
import seedRoutes from './routes/seed.routes';

const app = express();

// Security Middlewares
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true
}));

// Security Headers — must be after cors
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow Cloudinary images
  contentSecurityPolicy: false, // managed by frontend build
}));

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Strict rate limiter for auth routes — prevents brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // max 20 login attempts per 15 minutes per IP
  message: 'Too many login attempts. Please wait 15 minutes and try again.',
  skipSuccessfulRequests: true, // don't count successful logins
});
app.use('/api/v1/auth', authLimiter);

// Standard Middlewares
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(compression());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Register Routes
app.use('/api/v1/auth/firebase', firebaseAuthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/settings', settingRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/shiprocket', shiprocketRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/variants', variantRoutes);
app.use('/api/v1/colors', colorRoutes);
app.use('/api/v1/seed', seedRoutes);

// Error Handling
app.use(errorHandler);

export { app };
