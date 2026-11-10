const express = require('express');
const router = express.Router();
const SmartStore = require('../config/smartStore');

// GET administration dashboard metrics
router.get('/', async (req, res) => {
  try {
    const stats = await SmartStore.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
