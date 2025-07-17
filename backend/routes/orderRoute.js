import express from "express";
import OrderModel from "../model/orderModel.js"; // Ensure this path is correct
const router = express.Router();
import { listRecentOrders, getCompletedOrders } from "../controllers/orderController.js";

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

router.get("/completed", getCompletedOrders);

// PUT route to update order by orderId
router.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { address, ...otherFields } = req.body;

    const updateFields = {
      ...otherFields,
      ...(address && {
        "address.firstName": address.firstName,
        "address.lastName": address.lastName,
        "address.phone": address.phone,
        "address.street": address.street,
        "address.city": address.city,
        "address.state": address.state,
        "address.zipcode": address.zipcode,
        "address.country": address.country,
      }),
    };

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId: orderId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



export default router;
