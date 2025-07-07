import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js'; // Import database connection
import userRoutes from './routes/userRoute.js'; // Import user routes
import orderRoutes from './routes/orderRoute.js'; 
import ongoingordersRoutes from "./routes/ongoingorderRoute.js";
import customeredit from "./routes/customeredit.js";
import profileRoutes from './routes/profileRoutes.js'; // Import profile routes
import { historyRoutes } from './routes/historyRoutes.js';
import cartRouter from './routes/cartRoute.js';
import foodRouter from './routes/foodRoute.js';
import shopRoutes from './routes/shopRoute.js'


const app = express(); // Initialize the Express app
const PORT = 2000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to the database
connectDB();

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use appropriate routes to interact with the server.');
});

// Use the userRoutes
app.use('/api', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', ongoingordersRoutes);
app.use('/api/orders', customeredit);
app.use('/api/history', historyRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/food', foodRouter);
app.use('/api/shop',shopRoutes);
// Use the new profileRoutes for the wallet functionality
app.use('/api/profile', profileRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
