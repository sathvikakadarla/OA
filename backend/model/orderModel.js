// models/orderModel.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    address: {
      firstName: String,
      lastName: String,
      email: String,
      street: String,
      landmark: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
      phone: String,
    },

    items: [
      {
        _id: String,
        name: String,
        description: String,
        price: Number,
        image: String,
        category: String,
        quantity: Number,
        quantityOrdered: Number,
        quantityInGrams: Number,
        totalWeightInGrams: Number,
        shopName: String,
      },
    ],

    shopName: { type: String, default: "" },
    amount: { type: Number, required: true },
    orderId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      required: true,
    },
    payment: { type: Boolean, default: false },
    discountApplied: { type: Boolean, default: false },
    promoCode: { type: String, default: "" },
    paidUsingCredits: { type: Boolean, default: false },
    creditsUsed: { type: Number, default: 0 },
    creditsWorth: { type: Number, default: 0 },
    status: { type: String, default: "Order Placed" },
    statusTimestamps: {
      type: Map,
      of: Date,
      default: {},
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default OrderModel;
