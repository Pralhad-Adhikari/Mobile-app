const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');

// Submit or Update Rating
router.post('/:shoeId', async (req, res) => {
  const { shoeId } = req.params;
  const { userId, rating } = req.body;

  if (!userId || rating == null) {
    return res.status(400).json({ success: false, message: 'userId and rating are required' });
  }

  try {
    const existingRating = await Rating.findOne({ userId, shoeId });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ success: true, message: 'Rating updated' });
    } else {
      const newRating = new Rating({ userId, shoeId, rating });
      await newRating.save();
      return res.status(201).json({ success: true, message: 'Rating submitted' });
    }
  } catch (err) {
    console.error('[Rating Error]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user rating
router.get('/user/:shoeId/:userId', async (req, res) => {
  const { shoeId, userId } = req.params;

  try {
    const rating = await Rating.findOne({ shoeId, userId });
    if (!rating) return res.json({ success: true, rating: null });
    return res.json({ success: true, rating: rating.rating });
  } catch (err) {
    console.error('[Get User Rating Error]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get average rating for shoe
router.get('/average/:shoeId', async (req, res) => {
  const { shoeId } = req.params;

  try {
    const ratings = await Rating.find({ shoeId });
    if (ratings.length === 0) return res.json({ success: true, averageRating: 0 });

    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    return res.json({ success: true, averageRating: avg });
  } catch (err) {
    console.error('[Get Average Rating Error]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
