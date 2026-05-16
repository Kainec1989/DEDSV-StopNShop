## MY E-COMMERCE SHOP BACKEND PLAN

│
├── config/               # Configuration files
│   ├── db.js             # MongoDB connection
│   └── redis.js          # Redis connection
│
├── controllers/          # Route handlers
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
│
├── middleware/           # Custom middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── rateLimiter.js
│   └── uploadMiddleware.js
│
├── models/               # MongoDB models
│   ├── User.js
│   ├── Product.js
│   └── Order.js
│
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
│
├── services/             # Business logic
│   ├── authService.js
│   ├── productService.js
│   └── orderService.js
│
├── utils/                # Utility functions
│   ├── errorHandler.js
│   ├── logger.js
│   └── redisClient.js
│
├── validators/           # Input validation
│   ├── authValidator.js
│   └── productValidator.js
│
├── tests/                # Unit tests
│   └── auth.test.js
│
├── .env                  # Environment variables
├── server.js             # Entry point
└── package.json

## Stripe Webhook Development

Stripe Checkout uses the webhook as the source of truth for paid orders. Configure
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `CLIENT_URL` in `server/.env`.

For local testing, forward Stripe events to the raw webhook endpoint:

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

## Production Logging

The API uses Winston for structured application logs and Morgan for HTTP access
logs. Runtime log files are written under `server/logs/`:

- `combined.log` for application and request logs.
- `error.log` for error-level entries.
- `exceptions.log` and `rejections.log` for uncaught failures.

Set `LOG_LEVEL` in `server/.env` when you need more or less verbosity.