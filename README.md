# 🍔 Delice - Food Delivery Platform

A comprehensive full-stack food delivery application built with modern web technologies, featuring real-time order tracking, geospatial delivery assignment, and multi-role user management.

## 🌟 Key Highlights

### ⚡ Real-Time Communication with Socket.io
- **Live Order Notifications**: Shop owners receive instant notifications when new orders arrive
- **Order Status Updates**: Customers get real-time updates on their order status (pending, preparing, out for delivery, delivered)
- **Delivery Assignment Broadcasting**: Available delivery personnel are instantly notified of new delivery opportunities
- **Online Status Tracking**: Real-time tracking of user availability and connection status

### 🗺️ Real-Time Map Tracking
- **Live Location Updates**: Delivery personnel's location is tracked and broadcasted in real-time
- **Interactive Maps**: Built with Leaflet and React-Leaflet for smooth map visualization
- **Geospatial Queries**: MongoDB 2dsphere indexes for efficient location-based searches
- **Distance Calculation**: Automatic assignment of delivery personnel based on proximity (5km radius)
- **Customer Tracking**: Users can track their delivery in real-time on an interactive map

### 🔄 Redux Toolkit State Management
- **Global Authentication State**: Centralized user authentication and authorization
- **Cart Management**: Persistent shopping cart state across the application
- **Shop & Item Caching**: Efficient data caching with Redux Query integration
- **Map State Coordination**: Synchronized map state for tracking features
- **Real-Time Updates Integration**: Redux slices updated via Socket.io events

## ✨ Features

### 👤 User Features
- Browse shops and food items by city
- Filter items by category (Pizza, Burgers, South Indian, North Indian, etc.)
- Add items to cart from multiple shops
- Place orders with Cash on Delivery or Online Payment (Razorpay)
- Real-time order tracking with live map
- View order history
- Location-based delivery address selection

### 🏪 Shop Owner Features
- Create and manage shop profile
- Add, edit, and delete food items
- Upload images via Cloudinary integration
- Receive real-time order notifications
- Update order status (pending → preparing → out for delivery)
- View all shop orders and order details
- Assign orders to delivery personnel

### 🛵 Delivery Personnel Features
- Receive real-time delivery assignment notifications
- Accept delivery assignments
- View current active delivery details
- Real-time location sharing
- OTP-based delivery verification
- Analytics dashboard with delivery statistics
- Hourly delivery tracking and performance metrics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-Time**: Socket.io for WebSocket communication
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Payment Gateway**: Razorpay Integration
- **File Upload**: Multer + Cloudinary
- **Email Service**: Nodemailer
- **Geospatial**: MongoDB 2dsphere indexes

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: TanStack React Query (React Query v5)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet + React-Leaflet
- **Real-Time**: Socket.io Client
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Charts**: Recharts
- **Loading States**: React Spinners
- **Authentication**: Firebase (optional integration)

### Services & Tools
- **Cloud Storage**: Cloudinary
- **Payment**: Razorpay
- **Email**: Nodemailer
- **Version Control**: Git

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Running locally or MongoDB Atlas
- **npm** or **pnpm** or **yarn**
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/HeatBlastee/Delice.git
cd Delice
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
# or
pnpm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/delice
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/delice

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# CORS Origin
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
# or
pnpm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_SERVER_URI=http://localhost:5000

# Firebase Configuration (if using Firebase authentication)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🎮 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

### Production Mode

#### Build Backend
```bash
cd backend
npm run build
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
Delice/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── item.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── shop.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── models/             # MongoDB schemas
│   │   │   ├── deliveryAssignment.model.ts
│   │   │   ├── item.model.ts
│   │   │   ├── order.model.ts
│   │   │   ├── shop.model.ts
│   │   │   └── user.model.ts
│   │   ├── routes/             # API routes
│   │   │   ├── auth.route.ts
│   │   │   ├── item.route.ts
│   │   │   ├── order.route.ts
│   │   │   ├── shop.route.ts
│   │   │   └── user.route.ts
│   │   ├── middlewares/        # Custom middleware
│   │   │   ├── isAuth.ts       # JWT authentication
│   │   │   └── multer.ts       # File upload
│   │   ├── utils/              # Utility functions
│   │   │   ├── cloudinary.ts   # Image upload
│   │   │   ├── db.ts           # Database connection
│   │   │   ├── mail.ts         # Email service
│   │   │   ├── socket.ts       # Socket.io handlers
│   │   │   └── token.ts        # JWT utilities
│   │   └── server.ts           # Express app entry
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images and static files
│   │   ├── components/         # Reusable components
│   │   │   ├── CardItemCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── DeliveryBoyTracking.tsx
│   │   │   ├── FoodCart.tsx
│   │   │   ├── Nav.tsx
│   │   │   ├── OwnerItemCard.tsx
│   │   │   ├── OwnerOrderCard.tsx
│   │   │   └── UserOrderCard.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useGetCity.tsx
│   │   │   ├── useGetCurrentUser.tsx
│   │   │   ├── useGetItemsByCity.tsx
│   │   │   ├── useGetMyOrders.tsx
│   │   │   ├── useGetMyShop.tsx
│   │   │   ├── useGetShopByCity.tsx
│   │   │   └── useUpdateLocation.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── checkout/       # Cart and checkout
│   │   │   ├── dashboard/      # Role-based dashboards
│   │   │   ├── item/           # Item management
│   │   │   ├── order/          # Order tracking
│   │   │   └── shop/           # Shop management
│   │   ├── redux/              # Redux store
│   │   │   ├── mapSlice.ts
│   │   │   ├── ownerSlice.ts
│   │   │   ├── store.ts
│   │   │   └── userSlice.ts
│   │   ├── utils/              # Utility functions
│   │   │   ├── categories.ts
│   │   │   └── firebase.ts
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /signin` - User login
- `POST /logout` - User logout
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Reset password with OTP
- `GET /check` - Check authentication status

### User Routes (`/api/user`)
- `GET /current` - Get current user details
- `PUT /update-location` - Update user location (delivery personnel)
- `GET /city` - Get user's current city

### Shop Routes (`/api/shop`)
- `POST /create` - Create new shop (Owner only)
- `PUT /update/:id` - Update shop details
- `GET /my-shop` - Get owner's shop
- `GET /shops/:city` - Get all shops in a city
- `GET /shop/:id` - Get shop by ID

### Item Routes (`/api/item`)
- `POST /create` - Add new item (Owner only)
- `PUT /update/:id` - Update item
- `DELETE /delete/:id` - Delete item
- `GET /items/:city` - Get all items in a city
- `GET /shop/:shopId/items` - Get items by shop

### Order Routes (`/api/order`)
- `POST /place` - Place new order
- `POST /verify-payment` - Verify Razorpay payment
- `GET /my-orders` - Get user's orders (role-based)
- `GET /order/:orderId` - Get order by ID
- `PUT /update-status/:orderId/:shopId` - Update order status
- `GET /delivery-assignments` - Get delivery assignments (Delivery personnel)
- `POST /accept-assignment/:assignmentId` - Accept delivery assignment
- `GET /current-order` - Get current active delivery
- `POST /send-delivery-otp` - Send OTP for delivery verification
- `POST /verify-delivery-otp` - Verify delivery OTP
- `GET /today-deliveries` - Get today's delivery statistics

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication with role-based access control:

### Roles
1. **user** - Regular customers who order food
2. **owner** - Shop owners who manage shops and items
3. **deliveryBoy** - Delivery personnel who deliver orders

### Protected Routes
Routes are protected using the `isAuth` middleware which:
- Verifies JWT token from cookies
- Extracts user ID and attaches to request
- Validates token expiration

## 🌐 Real-Time Architecture

### Socket.io Events

#### Client → Server
- `identity` - Map userId to socketId on connection
- `updateLocation` - Send real-time location updates (delivery personnel)

#### Server → Client
- `newOrder` - Notify shop owner of new order
- `newAssignment` - Broadcast delivery assignment to available delivery personnel
- `assignmentTaken` - Notify other delivery personnel when assignment is accepted
- `update-status` - Notify customer of order status change
- `updateDeliveryLocation` - Broadcast delivery person's location to tracking screens

### Location Update Flow
1. Delivery personnel's app sends location every few seconds
2. Backend updates MongoDB with new coordinates
3. Server broadcasts location to all connected tracking clients
4. Customer's tracking page updates marker position in real-time

### Order Assignment Flow
1. Shop owner marks order as "out for delivery"
2. Backend finds delivery personnel within 5km radius
3. Creates DeliveryAssignment document
4. Broadcasts assignment to all available delivery personnel via Socket.io
5. First to accept gets the assignment
6. Others receive "assignment taken" notification

## 💳 Payment Integration

### Razorpay Integration
- Create order on backend
- Frontend initiates Razorpay checkout
- Payment verification on backend
- Order confirmation after successful payment

### Cash on Delivery
- Direct order placement
- No payment gateway involved
- OTP verification on delivery

## 📧 Email Notifications

Nodemailer is used for sending emails:
- Password reset OTP
- Delivery verification OTP
- Order confirmation emails

## 🗺️ Geospatial Features

### MongoDB Geospatial Indexes
```javascript
userSchema.index({ location: '2dsphere' });
```

### Location-Based Queries
- Find delivery personnel within radius
- Distance calculation
- Nearest available delivery person
- Route optimization (future enhancement)

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: React Spinners for better user experience
- **Toast Notifications**: Real-time feedback with React Hot Toast
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Graceful error messages and fallbacks
- **Dark/Light Mode**: Support for theme preferences (Tailwind CSS)

## 🔧 Development Tools

### Backend
- **TypeScript**: Type-safe code
- **Nodemon**: Auto-restart on file changes
- **ESLint**: Code linting
- **ts-node**: TypeScript execution

### Frontend
- **Vite**: Lightning-fast build tool
- **ESLint**: Code quality
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Example: Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Example: Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy `dist` folder
3. Set environment variables
4. Configure redirects for SPA

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update `MONGO_URI` in backend `.env`
3. Whitelist deployment server IP

## 📱 Future Enhancements

- [ ] Push notifications for mobile apps
- [ ] Advanced analytics dashboard
- [ ] Rating and review system
- [ ] Promo codes and discounts
- [ ] Multiple language support
- [ ] Admin panel for platform management
- [ ] AI-based delivery time prediction
- [ ] Route optimization for delivery personnel
- [ ] In-app chat between users and delivery personnel
- [ ] Payment wallet integration
- [ ] Subscription plans for free delivery

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Write clean, readable code
- Test your changes before submitting

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **HeatBlastee** - [GitHub Profile](https://github.com/HeatBlastee)

## 🙏 Acknowledgments

- React and Node.js communities
- Socket.io documentation
- Leaflet mapping library
- All open-source contributors

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with:
- Bug description
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

---

**Made with ❤️ using React, Node.js, and Socket.io**
