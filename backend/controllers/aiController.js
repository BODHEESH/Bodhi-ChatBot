const { 
  generateAIResponse, 
  analyzeDocumentWithAI, 
  generateCode, 
  formatResponse 
} = require('../helpers/aiHelper');

/**
 * Send message to AI and get response
 */
const chatWithAI = async (req, res) => {
  try {
    const { message, context, chatHistory } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required and cannot be empty' });
    }

    // Generate AI response
    const rawResponse = await generateAIResponse(message, context, chatHistory);
    const formattedResponse = formatResponse(rawResponse);

    res.json({
      message: 'AI response generated successfully',
      response: formattedResponse,
      metadata: {
        messageLength: message.length,
        responseLength: formattedResponse.length,
        hasContext: Boolean(context),
        historyLength: chatHistory ? chatHistory.length : 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      message: 'Error generating AI response',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Analyze document content with AI
 */
const analyzeDocument = async (req, res) => {
  try {
    const { content, documentType, fileId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Document content is required' });
    }

    // Analyze document with AI
    const analysis = await analyzeDocumentWithAI(content, documentType);

    res.json({
      message: 'Document analyzed successfully',
      analysis: {
        ...analysis,
        fileId: fileId || null,
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Document analysis error:', error);
    res.status(500).json({ 
      message: 'Error analyzing document',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Generate code based on prompt
 */
const generateCodeFromPrompt = async (req, res) => {
  try {
    const { prompt, language, complexity } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ message: 'Code prompt is required and cannot be empty' });
    }

    // Validate language
    const supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust'];
    const targetLanguage = language && supportedLanguages.includes(language.toLowerCase()) 
      ? language.toLowerCase() 
      : 'javascript';

    // Generate code
    const generatedCode = await generateCode(prompt, targetLanguage);

    res.json({
      message: 'Code generated successfully',
      code: generatedCode,
      metadata: {
        language: targetLanguage,
        promptLength: prompt.length,
        codeLength: generatedCode.length,
        complexity: complexity || 'medium',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ 
      message: 'Error generating code',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get AI capabilities and supported features
 */
const getCapabilities = async (req, res) => {
  try {
    const capabilities = {
      chat: {
        supported: true,
        features: ['context-aware', 'history-support', 'formatted-responses']
      },
      documentAnalysis: {
        supported: true,
        supportedTypes: ['pdf', 'text', 'word'],
        features: ['summary', 'key-points', 'sentiment', 'categorization']
      },
      codeGeneration: {
        supported: true,
        supportedLanguages: ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust'],
        features: ['syntax-highlighting', 'multiple-languages', 'complexity-levels']
      },
      fileComparison: {
        supported: true,
        features: ['similarity-analysis', 'content-comparison', 'metadata-analysis']
      },
      voiceSupport: {
        supported: false, // Will be implemented in frontend
        plannedFeatures: ['speech-to-text', 'text-to-speech']
      }
    };

    res.json({
      message: 'AI capabilities retrieved successfully',
      capabilities,
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Capabilities retrieval error:', error);
    res.status(500).json({ 
      message: 'Error retrieving AI capabilities',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Process multiple AI requests in batch
 */
const batchProcess = async (req, res) => {
  try {
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ 
        message: 'Requests array is required and cannot be empty' 
      });
    }

    if (requests.length > 10) {
      return res.status(400).json({ 
        message: 'Maximum 10 requests allowed per batch' 
      });
    }

    const results = [];

    for (const request of requests) {
      try {
        let result = {};
        
        switch (request.type) {
          case 'chat':
            result = {
              type: 'chat',
              response: await generateAIResponse(request.message, request.context),
              success: true
            };
            break;
            
          case 'analyze':
            result = {
              type: 'analyze',
              analysis: await analyzeDocumentWithAI(request.content, request.documentType),
              success: true
            };
            break;
            
          case 'code':
            result = {
              type: 'code',
              code: await generateCode(request.prompt, request.language),
              success: true
            };
            break;
            
          default:
            result = {
              type: request.type,
              error: 'Unsupported request type',
              success: false
            };
        }
        
        results.push({ ...result, requestId: request.id || results.length });
      } catch (requestError) {
        results.push({
          type: request.type,
          error: requestError.message,
          success: false,
          requestId: request.id || results.length
        });
      }
    }

    res.json({
      message: 'Batch processing completed',
      results,
      summary: {
        total: requests.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      },
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(500).json({ 
      message: 'Error processing batch requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  chatWithAI,
  analyzeDocument,
  generateCodeFromPrompt,
  getCapabilities,
  batchProcess
};
