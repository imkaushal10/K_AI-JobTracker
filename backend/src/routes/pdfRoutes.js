const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { extractPdfText } = require('../controllers/pdfController');

// Configure multer for memory storage (don't save to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// PDF upload route (protected)
router.post('/extract', authenticateToken, upload.single('pdf'), extractPdfText);

module.exports = router;