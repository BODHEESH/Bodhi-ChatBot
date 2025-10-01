import React from 'react';
import { Fab, Badge, Tooltip } from '@mui/material';
import { Chat, Close } from '@mui/icons-material';

const FloatingChatBubble = ({ 
  onClick, 
  isOpen = false, 
  unreadCount = 0,
  position = { bottom: 20, right: 20 }
}) => {
  return (
    <Tooltip title={isOpen ? "Close Chat" : "Open Bodhi Assistant"} placement="left">
      <Fab
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: position.bottom,
          right: position.right,
          width: 60,
          height: 60,
          background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
          zIndex: 9999,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(124, 58, 237, 0.4)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          }
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '10px',
              minWidth: '16px',
              height: '16px',
              top: -8,
              right: -8
            }
          }}
        >
          {isOpen ? (
            <Close sx={{ fontSize: 28 }} />
          ) : (
            <Chat sx={{ fontSize: 28 }} />
          )}
        </Badge>
      </Fab>
    </Tooltip>
  );
};

export default FloatingChatBubble;
