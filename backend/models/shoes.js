const mongoose = require('mongoose');

const ShoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shoe name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['men', 'women', 'kids', 'unisex'],
      message: 'Please select correct category'
    }
  },
  image: {
    type: String,
    required: [true, 'Image URL or base64 data is required'],
    validate: {
      validator: function(v) {
        if (!v || typeof v !== 'string') {
          return false;
        }
        // Very lenient validation - just check if it starts with http or data:image
        // Don't validate the entire string to avoid performance issues with large base64
        const lower = v.trim().toLowerCase();
        return lower.startsWith('http') || lower.startsWith('data:image');
      },
      message: props => `Invalid image format. Must be a URL (http/https) or base64 data (data:image...)`
    }
  },
  size: {
    type: [String], // Changed to array to support multiple sizes
    required: [true, 'At least one size is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one size is required'
    }
  },
  color: {
    type: [String], // Changed to array to support multiple colors
    required: [true, 'At least one color is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be at least 0']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search functionality
ShoeSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Shoe', ShoeSchema);