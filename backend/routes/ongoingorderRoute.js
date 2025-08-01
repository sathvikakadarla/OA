import express from "express";
import OrderModel from "../model/orderModel.js";

const router = express.Router();

// Fetch all orders
router.get("/", async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Fetch only delivered (completed) orders
router.get("/delivered", async (req, res) => {
    try {
        const deliveredOrders = await OrderModel.find({ status: "Delivered" }); // or whatever your status field is
        res.json({ success: true, data: deliveredOrders });
    } catch (error) {
        console.error("Error fetching delivered orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


export default router;
