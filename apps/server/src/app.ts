import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import routes from './routes/index.js';

const app = express();

// Trust proxy for accurate IP addresses (important for rate limiting and IP hashing)
app.set('trust proxy', 1);

// Build allowed origin list (primary + optional comma-separated list)
const allowedOrigins: string[] = [env.WEB_ORIGIN];
if (env.WEB_ORIGINS) {
  for (const o of env.WEB_ORIGINS.split(',')
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (!allowedOrigins.includes(o)) allowedOrigins.push(o);
  }
}

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", ...allowedOrigins],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate limiting: 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Please slow down and try again later',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks in development
    return env.NODE_ENV === 'development' && req.path === '/api/health';
  },
});

app.use(limiter);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'How Is The World Feeling API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(
  (err: Error | unknown, _req: express.Request, res: express.Response) => {
    console.error('Unhandled error:', err);

    // Don't leak error details in production
    const message =
      env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err instanceof Error
          ? err.message
          : 'Unknown error';

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message,
    });
  }
);

export default app;
