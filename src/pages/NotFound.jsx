import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export const NotFound = () => (
  <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
      404
    </Typography>
    <Typography color="text.secondary">That page doesn't exist in this demo.</Typography>
  </Container>
)
