import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { assetUrl, formatPrice } from '../data/catalog'

const badgeColor = (badge) => (badge === 'sale' ? 'error' : badge === 'new wash' ? 'secondary' : 'default')

export const ProductCard = ({ product }) => (
  <Card variant="outlined" sx={{ position: 'relative', height: '100%' }}>
    <CardActionArea component={RouterLink} to={`/product/${product.slug}`} sx={{ height: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={assetUrl(product.imageRef)}
          alt={product.name}
          sx={{ aspectRatio: '3 / 4', objectFit: 'cover', bgcolor: 'background.default' }}
        />
        {product.badge && (
          <Chip
            label={product.badge}
            size="small"
            color={badgeColor(product.badge)}
            sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 600, textTransform: 'capitalize' }}
          />
        )}
      </Box>
      <CardContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.fit} · {product.wash}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5, fontWeight: 700 }}>
          {formatPrice(product.priceCents)}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
)
