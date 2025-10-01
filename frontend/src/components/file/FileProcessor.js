import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Description,
  CheckCircle,
  Error,
  Analytics
} from '@mui/icons-material';

const FileProcessor = ({ 
  open, 
  onClose, 
  file, 
  onProcessComplete 
}) => {
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const processFile = async () => {
    setProcessing(true);
    setProgress(0);

    // Simulate file processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call to backend
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Mock processing result
      const result = {
        success: true,
        fileName: file.name,
        fileType: file.type,
        size: file.size,
        extractedContent: "This document contains detailed information about interior design quotations, including kitchen units, wardrobes, and various furniture specifications. The document outlines costs, materials, and design elements for residential projects.",
        summary: "Interior design quotation document with comprehensive cost breakdown and material specifications.",
        keyPoints: [
          "Kitchen cabinet specifications and costs",
          "Wardrobe design elements and pricing",
          "Material specifications (IS 303 grade plywood, laminate types)",
          "GST calculations and payment terms",
          "Contact information for IndoInteriors"
        ],
        documentType: "Business Quotation",
        confidence: 0.95,
        wordCount: 1247,
        pages: file.type === 'application/pdf' ? 3 : 1
      };

      setProcessResult(result);
      setProcessing(false);
      
      // Auto-close after showing results
      setTimeout(() => {
        onProcessComplete(result);
        onClose();
      }, 3000);
    }, 2000);
  };

  const handleClose = () => {
    if (!processing) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: 400
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description sx={{ color: '#7c3aed' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Processing File
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* File Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            File Information
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip 
              label={file.name} 
              size="small" 
              sx={{ backgroundColor: '#f1f5f9' }}
            />
            <Chip 
              label={`${(file.size / 1024).toFixed(1)} KB`} 
              size="small" 
              sx={{ backgroundColor: '#f1f5f9' }}
            />
            <Chip 
              label={file.type || 'Unknown type'} 
              size="small" 
              sx={{ backgroundColor: '#f1f5f9' }}
            />
          </Box>
        </Box>

        {/* Processing Progress */}
        {processing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Processing Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#f1f5f9',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#7c3aed'
                }
              }} 
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {progress < 30 ? 'Reading file content...' :
               progress < 60 ? 'Extracting text and data...' :
               progress < 90 ? 'Analyzing document structure...' :
               'Finalizing analysis...'}
            </Typography>
          </Box>
        )}

        {/* Processing Result */}
        {processResult && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckCircle sx={{ color: '#10b981' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Processing Complete
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Summary:</strong> {processResult.summary}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Key Points Extracted:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              {processResult.keyPoints.map((point, index) => (
                <Typography 
                  key={index} 
                  component="li" 
                  variant="body2" 
                  sx={{ mb: 0.5 }}
                >
                  {point}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Document Type
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {processResult.documentType}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Word Count
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {processResult.wordCount}
                </Typography>
              </Box>
              {processResult.pages > 1 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pages
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {processResult.pages}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Initial state */}
        {!processing && !processResult && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Analytics sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" paragraph>
              Ready to analyze your file. Click "Start Processing" to begin extracting content and generating insights.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!processing && !processResult && (
          <>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={processFile} 
              variant="contained"
              sx={{ 
                backgroundColor: '#7c3aed',
                '&:hover': { backgroundColor: '#6d28d9' }
              }}
            >
              Start Processing
            </Button>
          </>
        )}
        
        {processing && (
          <Button disabled variant="contained">
            Processing... {progress}%
          </Button>
        )}

        {processResult && (
          <Button 
            onClick={handleClose} 
            variant="contained"
            sx={{ 
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' }
            }}
          >
            Continue Chat
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FileProcessor;
