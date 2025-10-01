import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Send,
  Folder,
  Mic,
  MicOff,
  Description,
  Image,
  PictureAsPdf
} from '@mui/icons-material';

const ChatInput = ({ 
  onSendMessage, 
  onFileUpload, 
  onVoiceToggle, 
  isRecording = false,
  disabled = false,
  isFloating = false
}) => {
  const [message, setMessage] = useState('');
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileMenuOpen = (event) => {
    setFileMenuAnchor(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
  };

  const handleFileSelect = (fileType) => {
    handleFileMenuClose();
    if (fileInputRef.current) {
      fileInputRef.current.accept = fileType === 'pdf' ? '.pdf' : 
                                   fileType === 'image' ? 'image/*' : 
                                   '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
    event.target.value = '';
  };

  return (
    <Box
      sx={{
        position: isFloating ? 'absolute' : 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e2e8f0',
        p: isFloating ? 1.5 : 2,
        zIndex: 1000
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        {/* File Upload Button */}
        <Tooltip title="Upload File">
          <Fab
            size="small"
            onClick={handleFileMenuOpen}
            disabled={disabled}
            sx={{
              backgroundColor: '#7c3aed',
              color: 'white',
              width: isFloating ? 36 : 40,
              height: isFloating ? 36 : 40,
              minHeight: isFloating ? 36 : 40,
              '&:hover': {
                backgroundColor: '#6d28d9'
              }
            }}
          >
            <Folder sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>

        {/* Message Input */}
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              backgroundColor: '#f8fafc',
              '& fieldset': {
                borderColor: '#e2e8f0'
              },
              '&:hover fieldset': {
                borderColor: '#7c3aed'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#7c3aed'
              }
            },
            '& .MuiOutlinedInput-input': {
              py: 1.5,
              px: 2
            }
          }}
        />

        {/* Voice Button */}
        <Tooltip title={isRecording ? "Stop Recording" : "Start Voice Recording"}>
          <Fab
            size="small"
            onClick={onVoiceToggle}
            disabled={disabled}
            sx={{
              backgroundColor: isRecording ? '#ef4444' : '#7c3aed',
              color: 'white',
              width: 40,
              height: 40,
              minHeight: 40,
              '&:hover': {
                backgroundColor: isRecording ? '#dc2626' : '#6d28d9'
              }
            }}
          >
            {isRecording ? <MicOff sx={{ fontSize: 20 }} /> : <Mic sx={{ fontSize: 20 }} />}
          </Fab>
        </Tooltip>

        {/* Send Button */}
        <Tooltip title="Send Message">
          <Fab
            size="small"
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            sx={{
              backgroundColor: '#7c3aed',
              color: 'white',
              width: 40,
              height: 40,
              minHeight: 40,
              '&:hover': {
                backgroundColor: '#6d28d9'
              },
              '&:disabled': {
                backgroundColor: '#cbd5e1',
                color: '#94a3b8'
              }
            }}
          >
            <Send sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>
      </Box>

      {/* File Upload Menu */}
      <Menu
        anchorEl={fileMenuAnchor}
        open={Boolean(fileMenuAnchor)}
        onClose={handleFileMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => handleFileSelect('pdf')}>
          <ListItemIcon>
            <PictureAsPdf sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText primary="PDF Document" />
        </MenuItem>
        <MenuItem onClick={() => handleFileSelect('image')}>
          <ListItemIcon>
            <Image sx={{ color: '#10b981' }} />
          </ListItemIcon>
          <ListItemText primary="Image" />
        </MenuItem>
        <MenuItem onClick={() => handleFileSelect('document')}>
          <ListItemIcon>
            <Description sx={{ color: '#3b82f6' }} />
          </ListItemIcon>
          <ListItemText primary="Document" />
        </MenuItem>
      </Menu>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default ChatInput;
