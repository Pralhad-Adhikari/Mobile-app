const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Welcome endpoint
router.get('/welcome', (req, res) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  res.json({ message: 'Welcome to the API!' });
});

module.exports = router;
