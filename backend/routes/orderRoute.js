import express from "express";
import OrderModel from "../model/orderModel.js"; // Ensure this path is correct
const router = express.Router();
import { listRecentOrders } from "../controllers/orderController.js";

router.get("/delivered", async (req, res) => {
    try {
        // Log to verify the route is being called
        console.log("Fetching delivered orders...");

        // Use regex to match the status field
        const deliveredOrders = await OrderModel.find({
            status: { $regex: /^Delivered$/i } // Case-insensitive exact match
        });

        // Log the fetched orders
        console.log("Delivered Orders Fetched:", deliveredOrders);

        if (deliveredOrders.length === 0) {
            console.log("No delivered orders found. Check database values.");
            return res.json({ success: true, data: [], message: "No delivered orders found." });
        }

        // Send response if orders are found
        res.json({ success: true, data: deliveredOrders });
    } catch (error) {
        console.error("Error fetching delivered orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get("/recent", listRecentOrders);

export default router;
