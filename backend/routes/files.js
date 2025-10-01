const express = require('express');
const multer = require('multer');
const path = require('path');
const { ensureUploadDir } = require('../helpers/fileHelper');
const { 
  uploadFile, 
  getFile, 
  compareFiles, 
  getUserFiles, 
  removeFile 
} = require('../controllers/fileController');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    ensureUploadDir(uploadPath);
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
router.post('/upload', upload.single('file'), uploadFile);

// @route   GET /api/files/:fileId
// @desc    Get file details and content
// @access  Public
router.get('/:fileId', getFile);

// @route   GET /api/files/user/:userId
// @desc    Get all files for a user
// @access  Public
router.get('/user/:userId', getUserFiles);

// @route   POST /api/files/compare
// @desc    Compare two files
// @access  Public
router.post('/compare', compareFiles);

// @route   DELETE /api/files/:fileId
// @desc    Delete file
// @access  Public
router.delete('/:fileId', removeFile);

module.exports = router;
