import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { copy } from '../data/catalog'

export const AboutPage = () => (
  <Container maxWidth="sm" sx={{ py: 8 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
      {copy.about.title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {copy.about.body}
    </Typography>
  </Container>
)
