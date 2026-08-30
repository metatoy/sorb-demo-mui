import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { formatPrice, copy, assetUrl } from '../data/catalog'
import { useCart } from '../data/cartStore'

export const CartPage = () => {
  const { lines, setQty, removeItem, subtotalCents } = useCart()
  const navigate = useNavigate()

  if (lines.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {copy.cart.emptyTitle}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {copy.cart.emptyBody}
        </Typography>
        <Button component={RouterLink} to="/shop" variant="contained">
          {copy.cart.emptyCta}
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {copy.cart.title}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: 4 }}>
        <TableContainer component={Card} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Size</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={`${line.productId}-${line.size}`}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={assetUrl(line.product.imageRef)}
                        alt={line.product.name}
                        sx={{ width: 56, height: 72, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Typography variant="body2">{line.product.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{line.size}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                      <IconButton
                        size="small"
                        aria-label="decrease quantity"
                        onClick={() => setQty(line.productId, line.size, line.qty - 1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: 20, textAlign: 'center' }}>{line.qty}</Typography>
                      <IconButton
                        size="small"
                        aria-label="increase quantity"
                        onClick={() => setQty(line.productId, line.size, line.qty + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{formatPrice(line.product.priceCents * line.qty)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label={copy.cart.removeLabel}
                      onClick={() => removeItem(line.productId, line.size)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Order summary
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography color="text.secondary">{copy.cart.subtotalLabel}</Typography>
              <Typography sx={{ fontWeight: 700 }}>{formatPrice(subtotalCents)}</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              {copy.cart.shippingNote}
            </Typography>
            <Button fullWidth variant="contained" size="large" onClick={() => navigate('/checkout')}>
              {copy.cart.checkoutCta}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
