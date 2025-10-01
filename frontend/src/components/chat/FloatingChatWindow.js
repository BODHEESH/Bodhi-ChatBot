import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Box,
  IconButton,
  Typography,
  Slide,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close,
  Minimize,
  Fullscreen,
  FullscreenExit,
  DragIndicator
} from '@mui/icons-material';
import ChatContainer from './ChatContainer';

const FloatingChatWindow = ({ 
  open, 
  onClose, 
  onMinimize,
  position = { bottom: 100, right: 20 }
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState(position);
  const windowRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Auto fullscreen on mobile
  useEffect(() => {
    if (isMobile && open) {
      setIsFullscreen(true);
    }
  }, [isMobile, open]);

  const handleMouseDown = (e) => {
    if (isFullscreen) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isFullscreen) return;

    const newX = window.innerWidth - (e.clientX - dragOffset.x + 400);
    const newY = window.innerHeight - (e.clientY - dragOffset.y + 600);

    setWindowPosition({
      right: Math.max(20, Math.min(newX, window.innerWidth - 420)),
      bottom: Math.max(20, Math.min(newY, window.innerHeight - 620))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsFullscreen(false);
    setIsMinimized(false);
    onClose();
  };

  if (!open) return null;

  const windowStyle = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    width: '100vw',
    height: '100vh',
    borderRadius: 0
  } : {
    position: 'fixed',
    bottom: windowPosition.bottom,
    right: windowPosition.right,
    width: 400,
    height: isMinimized ? 60 : 600,
    zIndex: 9998,
    borderRadius: '16px 16px 0 0',
    overflow: 'hidden'
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        ref={windowRef}
        elevation={24}
        sx={{
          ...windowStyle,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            color: 'white',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 48,
            cursor: !isFullscreen ? 'grab' : 'default'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Left side - Logo and title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              B
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px' }}>
              Bodhi Chatbot
            </Typography>
            {!isFullscreen && (
              <DragIndicator sx={{ fontSize: 16, opacity: 0.7, ml: 1 }} />
            )}
          </Box>

          {/* Right side - Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <IconButton
                size="small"
                onClick={toggleMinimize}
                sx={{ color: 'white', p: 0.5 }}
              >
                <Minimize sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            
            <IconButton
              size="small"
              onClick={toggleFullscreen}
              sx={{ color: 'white', p: 0.5, ml: 0.5 }}
            >
              {isFullscreen ? (
                <FullscreenExit sx={{ fontSize: 16 }} />
              ) : (
                <Fullscreen sx={{ fontSize: 16 }} />
              )}
            </IconButton>

            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: 'white', p: 0.5, ml: 0.5 }}
            >
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Content */}
        {!isMinimized && (
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <ChatContainer isFloating={true} />
          </Box>
        )}
      </Paper>
    </Slide>
  );
};

export default FloatingChatWindow;
