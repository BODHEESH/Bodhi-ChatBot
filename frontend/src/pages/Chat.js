import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Chat = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Chat Interface
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chat functionality will be implemented here
        </Typography>
      </Box>
    </Container>
  );
};

export default Chat;
