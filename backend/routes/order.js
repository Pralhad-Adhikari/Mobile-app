const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Cart = require('../models/cart');
const Shoes = require('../models/shoes');

// Create new order
router.post('/create', async (req, res) => {
  const { 
    userId, 
    items, 
    shippingAddress, 
    paymentMethod = 'Cash on Delivery',
    subtotal,
    shippingCost = 0,
    totalAmount 
  } = req.body;

  // Validate required fields
  if (!userId || !items || !shippingAddress || !subtotal || !totalAmount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  try {
    // Create new order
    const order = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      totalAmount,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.save();

    // Clear cart after successful order
    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
      order
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ orderDate: -1 })
      .populate('items.shoeId');

    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .populate('items.shoeId');

    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status (for admin)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, trackingNumber, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        orderStatus, 
        trackingNumber, 
        notes,
        ...(orderStatus === 'shipped' && { estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) })
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Cancel order
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow cancellation of pending orders
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is not pending',
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
