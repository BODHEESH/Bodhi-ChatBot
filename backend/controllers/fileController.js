const File = require('../models/File');
const { 
  extractPDFContent, 
  extractTextContent, 
  analyzeDocument, 
  calculateSimilarity, 
  deleteFile 
} = require('../helpers/fileHelper');

/**
 * Upload and process file
 */
const uploadFile = async (req, res) => {
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
    let analysisResult = {};
    
    if (req.file.mimetype === 'application/pdf') {
      const pdfResult = await extractPDFContent(req.file.path);
      extractedContent = pdfResult.text;
      
      if (pdfResult.success) {
        analysisResult = {
          documentType: 'pdf',
          ...analyzeDocument(extractedContent, 'pdf'),
          metadata: {
            pages: pdfResult.pages,
            info: pdfResult.info
          }
        };
      } else {
        analysisResult = {
          documentType: 'pdf',
          summary: 'Error processing PDF content',
          error: pdfResult.error
        };
      }
    } else if (req.file.mimetype === 'text/plain') {
      const textResult = await extractTextContent(req.file.path);
      extractedContent = textResult.text;
      
      if (textResult.success) {
        analysisResult = {
          documentType: 'text',
          ...analyzeDocument(extractedContent, 'text')
        };
      } else {
        analysisResult = {
          documentType: 'text',
          summary: 'Error processing text file',
          error: textResult.error
        };
      }
    } else {
      // For other file types, just store basic info
      analysisResult = {
        documentType: 'other',
        summary: `File of type ${req.file.mimetype} uploaded successfully`,
        keyPoints: [`File size: ${req.file.size} bytes`]
      };
    }

    fileRecord.extractedContent = extractedContent;
    fileRecord.analysis = analysisResult;
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
        analysis: analysisResult,
        createdAt: fileRecord.createdAt
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error uploading file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get file details and content
 */
const getFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

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
        isProcessed: file.isProcessed,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt
      }
    });
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ 
      message: 'Error retrieving file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Compare two files
 */
const compareFiles = async (req, res) => {
  try {
    const { fileId1, fileId2 } = req.body;

    if (!fileId1 || !fileId2) {
      return res.status(400).json({ 
        message: 'Both file IDs are required for comparison' 
      });
    }

    const [file1, file2] = await Promise.all([
      File.findById(fileId1),
      File.findById(fileId2)
    ]);

    if (!file1 || !file2) {
      return res.status(404).json({ message: 'One or both files not found' });
    }

    // Calculate similarity
    const contentSimilarity = calculateSimilarity(
      file1.extractedContent, 
      file2.extractedContent
    );

    const comparison = {
      file1: {
        id: file1._id,
        name: file1.originalName,
        type: file1.mimetype,
        size: file1.size,
        summary: file1.analysis?.summary || 'No summary available'
      },
      file2: {
        id: file2._id,
        name: file2.originalName,
        type: file2.mimetype,
        size: file2.size,
        summary: file2.analysis?.summary || 'No summary available'
      },
      differences: {
        sizeRatio: file2.size > 0 ? (file1.size / file2.size).toFixed(2) : 'N/A',
        typeMatch: file1.mimetype === file2.mimetype,
        contentSimilarity: Math.round(contentSimilarity * 100) / 100
      },
      analysis: {
        recommendation: contentSimilarity > 70 ? 'Files are very similar' : 
                      contentSimilarity > 40 ? 'Files have some similarities' : 
                      'Files are quite different',
        similarityScore: Math.round(contentSimilarity)
      }
    };

    res.json({
      message: 'Files compared successfully',
      comparison
    });
  } catch (error) {
    console.error('File comparison error:', error);
    res.status(500).json({ 
      message: 'Error comparing files',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get all files for a user
 */
const getUserFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const files = await File.find({ user: userId })
      .select('originalName mimetype size analysis.summary isProcessed createdAt')
      .sort({ createdAt: -1 });

    const formattedFiles = files.map(file => ({
      id: file._id,
      originalName: file.originalName,
      type: file.mimetype,
      size: file.size,
      summary: file.analysis?.summary || 'No summary available',
      isProcessed: file.isProcessed,
      createdAt: file.createdAt
    }));

    res.json({
      files: formattedFiles,
      totalFiles: formattedFiles.length
    });
  } catch (error) {
    console.error('User files retrieval error:', error);
    res.status(500).json({ 
      message: 'Error retrieving user files',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Delete file
 */
const removeFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physical file
    const fileDeleted = deleteFile(file.path);
    
    // Delete database record
    await File.findByIdAndDelete(fileId);

    res.json({ 
      message: 'File deleted successfully',
      deletedFileId: fileId,
      physicalFileDeleted: fileDeleted
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  uploadFile,
  getFile,
  compareFiles,
  getUserFiles,
  removeFile
};
