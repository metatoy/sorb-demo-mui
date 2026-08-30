import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { findProduct, assetUrl, formatPrice, copy } from '../data/catalog'
import { useCart } from '../data/cartStore'
import { NotFound } from './NotFound'

export const ProductDetailPage = () => {
  const { slug } = useParams()
  const product = findProduct(slug)
  const { addItem } = useCart()
  const [size, setSize] = useState(product?.sizes?.[Math.floor((product?.sizes?.length ?? 1) / 2)])
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('details')
  const [toastOpen, setToastOpen] = useState(false)

  if (!product) return <NotFound />

  const handleAdd = () => {
    addItem(product.id, size, qty)
    setToastOpen(true)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 5 }}>
        <Box
          component="img"
          src={assetUrl(product.imageRef)}
          alt={product.name}
          sx={{ width: '100%', borderRadius: 2, aspectRatio: '3 / 4', objectFit: 'cover', bgcolor: 'background.paper' }}
        />

        <Box>
          {product.badge && (
            <Chip label={product.badge} size="small" color="secondary" sx={{ mb: 1, textTransform: 'capitalize' }} />
          )}
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.fit} fit · {product.wash} wash
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            {formatPrice(product.priceCents)}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {copy.product.sizeLabel}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            {product.sizes.map((s) => (
              <Chip
                key={s}
                label={s}
                clickable
                color={size === s ? 'primary' : 'default'}
                variant={size === s ? 'filled' : 'outlined'}
                onClick={() => setSize(s)}
              />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
            {copy.product.sizeHelp}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {copy.product.quantityLabel}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <IconButton
              size="small"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="decrease quantity"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{qty}</Typography>
            <IconButton size="small" onClick={() => setQty((q) => q + 1)} aria-label="increase quantity">
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button variant="contained" size="large" onClick={handleAdd}>
              {copy.product.addToCart}
            </Button>
            <Button variant="outlined" size="large">
              {copy.product.buyNow}
            </Button>
          </Stack>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab value="details" label={copy.product.tabs.details} />
            <Tab value="care" label={copy.product.tabs.care} />
            <Tab value="reviews" label={copy.product.tabs.reviews} />
          </Tabs>
          {tab === 'details' && (
            <Typography variant="body2" color="text.secondary">
              {product.fit} fit, {product.wash} wash. True to size — see the size guide for between-size
              guidance.
            </Typography>
          )}
          {tab === 'care' && (
            <Typography variant="body2" color="text.secondary">
              {copy.product.careBody}
            </Typography>
          )}
          {tab === 'reviews' && (
            <Typography variant="body2" color="text.secondary">
              No reviews yet in this demo.
            </Typography>
          )}

          <Accordion sx={{ mt: 3 }} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Shipping &amp; returns</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {copy.cart.shippingNote} (demo copy — no real fulfillment).
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled">
          {copy.product.toastAdded}
        </Alert>
      </Snackbar>
    </Container>
  )
}
