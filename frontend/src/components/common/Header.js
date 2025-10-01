import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

const Header = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useApp();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
          : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Bodhi
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 1, 
              opacity: 0.8,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Chatbot
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {isAuthenticated ? (
            <Typography variant="body2" sx={{ ml: 2 }}>
              Welcome, {user?.username || 'User'}
            </Typography>
          ) : (
            <Button color="inherit" variant="outlined" size="small">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
