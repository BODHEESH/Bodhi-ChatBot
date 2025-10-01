import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { VolumeUp, Description } from '@mui/icons-material';

const ChatBubble = ({ 
  message, 
  isUser = false, 
  hasVoice = false, 
  hasFile = false, 
  fileName = '',
  onPlayVoice,
  timestamp 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: '70%',
          minWidth: '120px',
          p: 2,
          borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
          backgroundColor: isUser ? '#7c3aed' : '#f1f5f9',
          color: isUser ? 'white' : '#1e293b',
          position: 'relative'
        }}
      >
        {/* File indicator */}
        {hasFile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              p: 1,
              backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
              borderRadius: '8px',
              gap: 1
            }}
          >
            <Description sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {fileName}
            </Typography>
          </Box>
        )}

        {/* Message content */}
        <Box
          sx={{ 
            lineHeight: 1.4,
            fontSize: '14px',
            fontWeight: isUser ? 500 : 400,
            '& strong': {
              fontWeight: 700,
              color: isUser ? 'rgba(255,255,255,0.95)' : '#1e293b'
            }
          }}
          dangerouslySetInnerHTML={{
            __html: message
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br />')
          }}
        />

        {/* Voice and timestamp row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
            gap: 1
          }}
        >
          {/* Voice button */}
          {hasVoice && (
            <IconButton
              size="small"
              onClick={onPlayVoice}
              sx={{
                color: isUser ? 'rgba(255,255,255,0.8)' : '#64748b',
                p: 0.5,
                '&:hover': {
                  backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              <VolumeUp sx={{ fontSize: 16 }} />
            </IconButton>
          )}

          {/* Timestamp */}
          {timestamp && (
            <Typography
              variant="caption"
              sx={{
                color: isUser ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                fontSize: '11px',
                ml: 'auto'
              }}
            >
              {timestamp}
            </Typography>
          )}
        </Box>

        {/* Triangle pointer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            [isUser ? 'right' : 'left']: -8,
            width: 0,
            height: 0,
            borderLeft: isUser ? '8px solid #7c3aed' : 'none',
            borderRight: isUser ? 'none' : '8px solid #f1f5f9',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent'
          }}
        />
      </Paper>
    </Box>
  );
};

export default ChatBubble;
