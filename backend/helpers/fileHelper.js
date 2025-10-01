const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Extract content from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<Object>} - Extracted content and metadata
 */
const extractPDFContent = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    return {
      text: pdfData.text,
      pages: pdfData.numpages,
      info: pdfData.info,
      success: true
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      text: 'Error processing PDF content',
      pages: 0,
      info: {},
      success: false,
      error: error.message
    };
  }
};

/**
 * Extract content from text file
 * @param {string} filePath - Path to text file
 * @returns {Promise<Object>} - Extracted content
 */
const extractTextContent = async (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      text: content,
      success: true
    };
  } catch (error) {
    console.error('Text extraction error:', error);
    return {
      text: 'Error processing text file',
      success: false,
      error: error.message
    };
  }
};

/**
 * Analyze document content
 * @param {string} content - Document content
 * @param {string} documentType - Type of document
 * @returns {Object} - Analysis results
 */
const analyzeDocument = (content, documentType) => {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  return {
    documentType: documentType || 'unknown',
    summary: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
    keyPoints: lines.slice(0, 5),
    wordCount: words.length,
    lineCount: lines.length,
    readingTime: Math.ceil(words.length / 200) + ' minutes'
  };
};

/**
 * Calculate text similarity between two strings
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} - Similarity percentage
 */
const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;
  
  return totalWords > 0 ? (commonWords.length / totalWords) * 100 : 0;
};

/**
 * Delete file from filesystem
 * @param {string} filePath - Path to file
 * @returns {boolean} - Success status
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
};

/**
 * Ensure upload directory exists
 * @param {string} uploadPath - Upload directory path
 */
const ensureUploadDir = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

module.exports = {
  extractPDFContent,
  extractTextContent,
  analyzeDocument,
  calculateSimilarity,
  deleteFile,
  ensureUploadDir
};
