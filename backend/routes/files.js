const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const File = require('../models/File');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// @route   POST /api/files/upload
// @desc    Upload and process file
// @access  Public
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { userId } = req.body;

    // Create file record
    const fileRecord = new File({
      user: userId || null,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Process file content based on type
    let extractedContent = '';
    
    if (req.file.mimetype === 'application/pdf') {
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        extractedContent = pdfData.text;
        
        // Basic document analysis
        fileRecord.analysis = {
          documentType: 'pdf',
          summary: extractedContent.substring(0, 500) + '...',
          keyPoints: extractedContent.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
          metadata: {
            pages: pdfData.numpages,
            info: pdfData.info
          }
        };
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        extractedContent = 'Error processing PDF content';
      }
    } else if (req.file.mimetype === 'text/plain') {
      extractedContent = fs.readFileSync(req.file.path, 'utf8');
      fileRecord.analysis = {
        documentType: 'text',
        summary: extractedContent.substring(0, 500) + '...',
        keyPoints: extractedContent.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
      };
    }

    fileRecord.extractedContent = extractedContent;
    fileRecord.isProcessed = true;

    await fileRecord.save();

    res.status(201).json({
      message: 'File uploaded and processed successfully',
      file: {
        id: fileRecord._id,
        originalName: fileRecord.originalName,
        size: fileRecord.size,
        type: fileRecord.mimetype,
        extractedContent: extractedContent.substring(0, 1000), // Limit response size
        analysis: fileRecord.analysis
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error uploading file',
      error: error.message 
    });
  }
});

// @route   GET /api/files/:fileId
// @desc    Get file details and content
// @access  Public
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      file: {
        id: file._id,
        originalName: file.originalName,
        size: file.size,
        type: file.mimetype,
        extractedContent: file.extractedContent,
        analysis: file.analysis,
        createdAt: file.createdAt
      }
    });
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

// @route   POST /api/files/compare
// @desc    Compare two files
// @access  Public
router.post('/compare', async (req, res) => {
  try {
    const { fileId1, fileId2 } = req.body;

    const [file1, file2] = await Promise.all([
      File.findById(fileId1),
      File.findById(fileId2)
    ]);

    if (!file1 || !file2) {
      return res.status(404).json({ message: 'One or both files not found' });
    }

    // Basic comparison logic
    const comparison = {
      file1: {
        name: file1.originalName,
        type: file1.mimetype,
        size: file1.size,
        summary: file1.analysis?.summary || 'No summary available'
      },
      file2: {
        name: file2.originalName,
        type: file2.mimetype,
        size: file2.size,
        summary: file2.analysis?.summary || 'No summary available'
      },
      differences: {
        sizeRatio: file1.size / file2.size,
        typeMatch: file1.mimetype === file2.mimetype,
        contentSimilarity: calculateSimilarity(file1.extractedContent, file2.extractedContent)
      }
    };

    res.json({
      message: 'Files compared successfully',
      comparison
    });
  } catch (error) {
    console.error('File comparison error:', error);
    res.status(500).json({ message: 'Error comparing files' });
  }
});

// Helper function to calculate basic text similarity
function calculateSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;
  
  return totalWords > 0 ? (commonWords.length / totalWords) * 100 : 0;
}

// @route   DELETE /api/files/:fileId
// @desc    Delete file
// @access  Public
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete database record
    await File.findByIdAndDelete(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router;
