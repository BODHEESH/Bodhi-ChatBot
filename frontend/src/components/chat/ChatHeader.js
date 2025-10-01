import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close,
  Brightness4,
  Brightness7,
  Settings
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const ChatHeader = ({ onMenuClick, onClose, showClose = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
        zIndex: 1200
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {/* Left side - Menu/Close button */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={showClose ? onClose : onMenuClick}
          sx={{ mr: 2 }}
        >
          {showClose ? <Close /> : <MenuIcon />}
        </IconButton>

        {/* Center - Branding with logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              background: 'linear-gradient(45deg, #ffffff20, #ffffff40)',
              fontSize: '14px',
              fontWeight: 700
            }}
          >
            B
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: 1.2
              }}
            >
              Bodhi Chatbot
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.8,
                fontSize: '11px',
                display: 'block',
                lineHeight: 1
              }}
            >
              AI Assistant
            </Typography>
          </Box>
        </Box>

        {/* Right side - Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton 
            color="inherit" 
            onClick={toggleTheme}
            size="small"
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          <IconButton 
            color="inherit"
            size="small"
          >
            <Settings />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;
