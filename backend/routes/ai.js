const express = require('express');
const { 
  chatWithAI, 
  analyzeDocument, 
  generateCodeFromPrompt, 
  getCapabilities, 
  batchProcess 
} = require('../controllers/aiController');
const router = express.Router();

// @route   POST /api/ai/chat
// @desc    Send message to AI and get response
// @access  Public
router.post('/chat', chatWithAI);

// @route   POST /api/ai/analyze-document
// @desc    Analyze document content with AI
// @access  Public
router.post('/analyze-document', analyzeDocument);

// @route   POST /api/ai/generate-code
// @desc    Generate code based on prompt
// @access  Public
router.post('/generate-code', generateCodeFromPrompt);

// @route   GET /api/ai/capabilities
// @desc    Get AI capabilities and supported features
// @access  Public
router.get('/capabilities', getCapabilities);

// @route   POST /api/ai/batch
// @desc    Process multiple AI requests in batch
// @access  Public
router.post('/batch', batchProcess);

module.exports = router;
