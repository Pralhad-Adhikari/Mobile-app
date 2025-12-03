const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Status endpoint
router.get('/status', (req, res) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  res.json({ status: 'running' });
});

module.exports = router;
