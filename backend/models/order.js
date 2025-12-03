const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    shoeId: { type: String, required: true },
    name: { type: String, required: true },
    brand: String,
    price: { type: Number, required: true },
    image: String,
    quantity: { type: Number, required: true },
    size: { type: String, required: true }
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: { type: Date, default: Date.now },
  estimatedDelivery: { type: Date },
  trackingNumber: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
