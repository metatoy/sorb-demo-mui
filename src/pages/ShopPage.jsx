import React, { useMemo, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Slider from '@mui/material/Slider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Pagination from '@mui/material/Pagination'
import Divider from '@mui/material/Divider'
import { ProductCard } from '../components/ProductCard'
import { products, copy } from '../data/catalog'

const PAGE_SIZE = 8
const fits = [...new Set(products.map((p) => p.fit))]

export const ShopPage = () => {
  const [fitFilter, setFitFilter] = useState([])
  const [priceRange, setPriceRange] = useState([0, 15000])
  const [sort, setSort] = useState(copy.shop.sortOptions[0])
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (fitFilter.length === 0 || fitFilter.includes(p.fit)) &&
        p.priceCents >= priceRange[0] &&
        p.priceCents <= priceRange[1],
    )
    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.priceCents - b.priceCents)
    if (sort === 'Price: High to Low') list = [...list].sort((a, b) => b.priceCents - a.priceCents)
    return list
  }, [fitFilter, priceRange, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleFit = (fit) =>
    setFitFilter((prev) => (prev.includes(fit) ? prev.filter((f) => f !== fit) : [...prev, fit]))

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {copy.shop.title}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px 1fr' }, gap: 4 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {copy.shop.filterHeading}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Fit
          </Typography>
          <FormGroup>
            {fits.map((fit) => (
              <FormControlLabel
                key={fit}
                control={<Checkbox checked={fitFilter.includes(fit)} onChange={() => toggleFit(fit)} />}
                label={fit}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Price
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, v) => setPriceRange(v)}
            valueLabelDisplay="auto"
            min={0}
            max={15000}
            step={500}
            valueLabelFormat={(v) => `$${(v / 100).toFixed(0)}`}
            sx={{ mt: 2 }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="sort-label">{copy.shop.sortLabel}</InputLabel>
              <Select
                labelId="sort-label"
                label={copy.shop.sortLabel}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {copy.shop.sortOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {pageItems.length === 0 ? (
            <Typography color="text.secondary">{copy.shop.emptyState}</Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
