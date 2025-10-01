import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import FloatingChatApp from './components/chat/FloatingChatApp';
import './App.css';

function App() {
  return (
    <div>
      {/* Main Application Content (Demo) */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 2
            }}
          >
            Welcome to Your Desktop
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            This represents your main application or desktop environment
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              p: 3,
              borderRadius: 2,
              border: '1px dashed #7c3aed'
            }}
          >
            👆 Click the floating chat bubble in the bottom-right corner to open Bodhi Assistant!
            <br />
            The chat will overlay on top of this content, just like a real AI assistant.
          </Typography>
        </Container>
      </Box>

      {/* Floating Chat System */}
      <FloatingChatApp />
    </div>
  );
}

export default App;
