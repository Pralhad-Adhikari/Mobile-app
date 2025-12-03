const express = require('express');
const router = express.Router();
const Shoe = require('../models/shoes');
const { check, validationResult } = require('express-validator');

// Validation middleware
const validateShoe = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('brand').not().isEmpty().withMessage('Brand is required'),
  check('category').isIn(['men', 'women', 'kids', 'unisex']).withMessage('Invalid category'),
  check('image')
    .custom((value) => {
      if (!value || typeof value !== 'string') {
        throw new Error('Image is required');
      }
      // Very lenient validation - just check if it starts with http or data:image
      // Don't validate the entire string to avoid performance issues with large base64
      const isUrl = value.trim().toLowerCase().startsWith('http');
      const isBase64 = value.trim().toLowerCase().startsWith('data:image');
      if (!isUrl && !isBase64) {
        throw new Error('Invalid image URL or base64 data');
      }
      return true;
    })
    .withMessage('Invalid image URL or base64 data'),
  check('size').isArray({ min: 1 }).withMessage('At least one size is required'),
  check('color').isArray({ min: 1 }).withMessage('At least one color is required'),
  check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  check('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive integer')
];

// Create new shoe
router.post('/add', validateShoe, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    console.error('Request body keys:', Object.keys(req.body));
    console.error('Image length:', req.body.image ? req.body.image.length : 'no image');
    console.error('Image preview:', req.body.image ? req.body.image.substring(0, 100) : 'no image');
    return res.status(400).json({ 
      success: false, 
      errors: errors.array(),
      message: 'Validation failed: ' + errors.array().map(e => `${e.param || 'field'}: ${e.msg}`).join(', ')
    });
  }

  try {
    // Additional validation for arrays
    if (!Array.isArray(req.body.size) || req.body.size.length === 0) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'size', msg: 'At least one size is required' }],
        message: 'Validation failed: At least one size is required'
      });
    }

    if (!Array.isArray(req.body.color) || req.body.color.length === 0) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'color', msg: 'At least one color is required' }],
        message: 'Validation failed: At least one color is required'
      });
    }

    const shoe = new Shoe(req.body);
    await shoe.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Shoe added successfully', 
      data: shoe 
    });
  } catch (error) {
    console.error('Add Shoe Error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const mongooseErrors = Object.values(error.errors).map(err => ({
        param: err.path,
        msg: err.message
      }));
      return res.status(400).json({
        success: false,
        errors: mongooseErrors,
        message: 'Validation failed: ' + mongooseErrors.map(e => `${e.param}: ${e.msg}`).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get all shoes with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Search functionality
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search };
    }

    let query = Shoe.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const shoes = await query;
    const total = await Shoe.countDocuments(queryObj);

    res.json({
      success: true,
      count: shoes.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: shoes
    });
  } catch (error) {
    console.error('Get Shoes Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get single shoe
router.get('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    
    if (!shoe) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shoe not found' 
      });
    }

    res.json({ 
      success: true, 
      data: shoe 
    });
  } catch (error) {
    console.error('Get Shoe Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update shoe
router.put('/:id', validateShoe, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ 
      success: false, 
      errors: errors.array(),
      message: 'Validation failed: ' + errors.array().map(e => `${e.param || 'field'}: ${e.msg}`).join(', ')
    });
  }

  try {
    // Additional validation for arrays
    if (!Array.isArray(req.body.size) || req.body.size.length === 0) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'size', msg: 'At least one size is required' }],
        message: 'Validation failed: At least one size is required'
      });
    }

    if (!Array.isArray(req.body.color) || req.body.color.length === 0) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'color', msg: 'At least one color is required' }],
        message: 'Validation failed: At least one color is required'
      });
    }

    const shoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!shoe) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shoe not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Shoe updated successfully', 
      data: shoe 
    });
  } catch (error) {
    console.error('Update Shoe Error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const mongooseErrors = Object.values(error.errors).map(err => ({
        param: err.path,
        msg: err.message
      }));
      return res.status(400).json({
        success: false,
        errors: mongooseErrors,
        message: 'Validation failed: ' + mongooseErrors.map(e => `${e.param}: ${e.msg}`).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete shoe
router.delete('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);

    if (!shoe) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shoe not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Shoe deleted successfully' 
    });
  } catch (error) {
    console.error('Delete Shoe Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;