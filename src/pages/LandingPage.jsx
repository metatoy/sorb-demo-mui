import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { ProductCard } from '../components/ProductCard'
import { products, copy } from '../data/catalog'

export const LandingPage = () => {
  const featured = products.slice(0, 4)
  const newWashes = products.filter((p) => p.badge === 'new wash').slice(0, 4)

  return (
    <>
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 700 }}>
            {copy.hero.eyebrow}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700, mt: 1, maxWidth: 640 }}>
            {copy.hero.headline}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 520 }}>
            {copy.hero.subhead}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button component={RouterLink} to="/shop" variant="contained" size="large">
              {copy.hero.primaryCta}
            </Button>
            <Button component={RouterLink} to="/shop?view=fits" variant="outlined" size="large">
              {copy.hero.secondaryCta}
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          {copy.sections.featuredTitle}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 3 }}>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          {copy.sections.newWashesTitle}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 3 }}>
          {(newWashes.length ? newWashes : products.slice(4, 8)).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {copy.sections.aboutTeaserTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', mb: 2 }}>
            {copy.sections.aboutTeaserBody}
          </Typography>
          <Button component={RouterLink} to="/about" variant="text">
            Read about Jane
          </Button>
        </Container>
      </Box>
    </>
  )
}
