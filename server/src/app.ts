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
import brandRoutes from './routes/brand.routes';
import firebaseAuthRoutes from './routes/firebase.auth.routes';

const app = express();

// Security Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Standard Middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(compression());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Register Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin/dashboard', dashboardRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/auth/firebase', firebaseAuthRoutes);

// Error Handling
app.use(errorHandler);

export { app };
