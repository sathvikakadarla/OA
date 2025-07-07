import express from "express";
import OrderModel from "../model/orderModel.js";

const router = express.Router();

// Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await OrderModel.find(); // Corrected `findof` to `find`
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update an order by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id, // The ID of the order to update
      updateData, // The new data to update with
      { new: true } // Return the updated document
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
