import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoute.js';
import orderRoutes from './routes/orderRoute.js';
import ongoingordersRoutes from "./routes/ongoingorderRoute.js";
import customeredit from "./routes/customeredit.js";
import profileRoutes from './routes/profileRoutes.js';
import { historyRoutes } from './routes/historyRoutes.js';
import cartRouter from './routes/cartRoute.js';
import foodRouter from './routes/foodRoute.js';
import shopRoutes from './routes/shopRoute.js';

const app = express();
const PORT = process.env.PORT || 2000;

// ✅ Allowed frontend domains
const allowedOrigins = [
  'https://oa-frontend.onrender.com',
  'http://localhost:3000' // Optional: allow localhost for development
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware
app.use(bodyParser.json());

// Connect to DB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use appropriate routes to interact with the server.');
});

// Routes
app.use('/api', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/orders', ongoingordersRoutes);
app.use('/api/orders', customeredit);
app.use('/api/history', historyRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/food', foodRouter);
app.use('/api/shop', shopRoutes);
app.use('/api/profile', profileRoutes); // Wallet-related

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
