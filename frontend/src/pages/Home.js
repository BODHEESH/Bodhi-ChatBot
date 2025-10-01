import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Bodhi Chatbot
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your AI-Powered Conversational Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Experience intelligent conversations, file processing, and code generation
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
