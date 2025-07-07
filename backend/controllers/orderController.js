import OrderModel from '../model/orderModel.js';

// Get all orders (Admin functionality)
export const listOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Place an order
export const placeOrder = async (req, res) => {
    try {
        const { address, items, amount, orderId } = req.body;

        const newOrder = new OrderModel({
            address,
            items,
            amount,
            orderId,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update order status
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const updatedOrder = await OrderModel.findOneAndUpdate(
            { orderId },
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get user-specific orders
export const userOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await OrderModel.find({ 'address.email': req.user.email });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Place order using COD
export const placeOrderCod = async (req, res) => {
    try {
        const { address, items, amount } = req.body;

        const newOrder = new OrderModel({
            address,
            items,
            amount,
            paymentMethod: 'COD',
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
        console.error('Error placing COD order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Place order using Razorpay
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { address, items, amount, orderId } = req.body;

        const newOrder = new OrderModel({
            address,
            items,
            amount,
            orderId,
            paymentMethod: 'Razorpay',
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
        console.error('Error placing Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all completed orders
export const getCompletedOrders = async (req, res) => {
    try {
        const completedOrders = await OrderModel.find({ status: 'Completed' });
        res.status(200).json({ success: true, data: completedOrders });
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};