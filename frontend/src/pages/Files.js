import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Files = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          File Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          File upload and processing functionality will be implemented here
        </Typography>
      </Box>
    </Container>
  );
};

export default Files;
