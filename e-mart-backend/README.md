# E-MART Backend API 🌾

Ghana's rice marketplace backend — Node.js + Express + MongoDB.

## Stack
- **Runtime**: Node.js + Express 5
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Realtime**: Socket.io
- **Storage**: Cloudinary
- **Payments**: Paystack + MTN MoMo
- **SMS**: Hubtel Ghana

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Start MongoDB locally
mongod

# 4. Run in development
npm run dev

# 5. Run in production
npm start
```

## API Base URL
```
http://localhost:5000/api
```

## Health Check
```
GET /health
```

## Auth Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register farmer or buyer |
| POST | `/api/auth/verify-otp` | Verify phone OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

## Farmer Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/farmer/dashboard` | Dashboard stats |
| GET/PUT | `/api/farmer/profile` | Get/update profile |
| GET | `/api/farmer/orders` | All orders |
| GET | `/api/farmer/orders/:id` | Single order |
| PUT | `/api/farmer/orders/:id/status` | Update order status |
| GET | `/api/farmer/sales` | Sales analytics |

## Buyer Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/buyer/dashboard` | Dashboard stats |
| GET/PUT | `/api/buyer/profile` | Get/update profile |

## Product Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Browse marketplace |
| GET | `/api/products/my` | Farmer's own listings |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create listing (farmer) |
| PUT | `/api/products/:id` | Update listing |
| DELETE | `/api/products/:id` | Delete listing |
| POST | `/api/products/:id/images` | Upload images |

## Order Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/orders` | Place order (buyer) |
| GET | `/api/orders/my` | My orders |
| GET | `/api/orders/:id` | Order details |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| POST | `/api/orders/:id/review` | Add review |

## Payment Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/payments/initialize` | Start payment |
| POST | `/api/payments/verify` | Verify Paystack payment |
| GET | `/api/payments/history` | Payment history |
| GET | `/api/payments/order/:orderId` | Payment by order |

## Admin Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/toggle-active` | Activate/deactivate user |
| GET | `/api/admin/products` | All products |
| GET | `/api/admin/orders` | All orders |
| GET | `/api/admin/transactions` | All transactions |
| GET | `/api/admin/verifications` | Pending verifications |
| PUT | `/api/admin/verifications/:id` | Approve/reject verification |
| GET | `/api/admin/disputes` | All disputes |
| PUT | `/api/admin/disputes/:id/resolve` | Resolve dispute |
| POST | `/api/admin/broadcast` | Send notification to all users |

## Project Structure
```
src/
├── config/        # DB, Cloudinary, Socket, SMS, Payment
├── controllers/   # Route handlers
├── middlewares/   # Auth, roles, validation, upload, rate limit
├── models/        # Mongoose schemas
├── routes/        # Express routers
├── services/      # Business logic (OTP, payment, escrow, notifications)
├── utils/         # Helpers (token, OTP, logger, email, SMS)
└── validators/    # express-validator rules
```

## Environment Variables
See `.env.example` for all required variables.

## Notes
- Platform fee: **5%** on all orders
- OTP valid for **10 minutes**
- Escrow released after order marked **completed**
- SMS and email are **mocked in development** (logged to console)