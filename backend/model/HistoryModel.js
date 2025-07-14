import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    creditedAmount: {
      type: Number,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userMobile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ✅ This adds createdAt and updatedAt fields automatically
  }
);

const History = mongoose.models.History || mongoose.model("History", historySchema);
export default History;
