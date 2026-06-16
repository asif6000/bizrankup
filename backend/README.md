# BizRankUp Backend API

Node.js + Express + MySQL REST API for the SHAJGOJ e-commerce platform.

## Setup

### 1. Install MySQL
Make sure MySQL is running on your machine (default: `localhost:3306`).

### 2. Configure Environment
Edit `backend/.env` if needed:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bizrankup
DB_PORT=3306
JWT_SECRET=bizrankup_jwt_secret_key_2026
PORT=5000
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Initialize Database
Creates the database and all tables:
```bash
npm run db:init
```

### 5. Seed Data (Optional)
Populates the database with sample data:
```bash
node config/seed.js
```

### 6. Start Server
```bash
npm run dev    # development with auto-reload
# or
npm start      # production
```

Server runs on `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user (auth) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (query: category, brand, search, featured, page, limit) |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Categories & Brands
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST/PUT/DELETE | `/api/categories/:id` | CRUD (admin) |
| GET | `/api/brands` | List brands |
| POST/PUT/DELETE | `/api/brands/:id` | CRUD (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders (auth) |
| GET | `/api/orders/:id` | Get order (auth) |
| POST | `/api/orders` | Create order (auth) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Admin CRUD
All following endpoints support GET (list), POST (create), PUT/:id (update), DELETE/:id (delete):

- `/api/users`, `/api/expenses`, `/api/blog`, `/api/offers`
- `/api/slides`, `/api/notifications`, `/api/faq`
- `/api/order-statuses`, `/api/shipping-rates`
- `/api/addresses`, `/api/reviews`

### Configurations (admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/payment-gateways/:provider` | Payment gateway settings |
| GET/PUT | `/api/social-login/:provider` | Social login settings |
| GET/PUT | `/api/couriers/:provider` | Courier integration settings |
| GET/PUT | `/api/tracking/:provider` | Tracking platform settings |

### Health
| GET | `/api/health` | Server status |

## Test Credentials
- **Admin**: admin@bizrankup.com / admin123
- **User**: user@bizrankup.com / user123
