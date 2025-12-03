// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Shoes = require('../models/shoes');

// Add product to cart
router.post('/add', async (req, res) => {
  const { userId, productId, quantity = 1, size } = req.body;

  // Validate required fields
  if (!userId || !productId || !size) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  try {
    // Get shoe details
    const shoe = await Shoes.findById(productId);
    if (!shoe) {
      return res.status(404).json({
        success: false,
        message: 'Shoe not found',
      });
    }

    // Check if item already exists in cart with same size
    let cartItem = await Cart.findOne({ userId, shoeId: productId, size });

    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += quantity;
      cartItem.stock = shoe.stock;
    } else {
      // Create new cart item
      cartItem = new Cart({
        userId,
        shoeId: productId,
        name: shoe.name,
        brand: shoe.brand,
        price: shoe.price,
        image: shoe.image,
        quantity,
        size,
        stock: shoe.stock
      });
    }

    await cartItem.save();

    res.json({ 
      success: true, 
      message: 'Added to cart',
      cartItem 
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's cart items
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: cartItems
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity',
      });
    }

    const cartItem = await Cart.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    res.json({
      success: true,
      message: 'Quantity updated',
      data: cartItem
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const cartItem = await Cart.findByIdAndDelete(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear user's cart
router.delete('/user/:userId/clear', async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
