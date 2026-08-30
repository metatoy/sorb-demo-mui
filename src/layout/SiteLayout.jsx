import React, { useState } from 'react'
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { nav, copy } from '../data/catalog'
import { useCart } from '../data/cartStore'

export const SiteLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { itemCount } = useCart()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open navigation"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
          >
            Janes Jeans
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {nav.primary.map((item) => (
              <Button key={item.label} color="inherit" component={RouterLink} to={item.href}>
                {item.label}
              </Button>
            ))}
          </Box>
          <IconButton color="inherit" aria-label="account" onClick={() => navigate('/account')}>
            <PersonOutlineIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="cart" onClick={() => navigate('/cart')}>
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {nav.primary.map((item) => (
              <ListItemButton key={item.label} component={RouterLink} to={item.href}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Divider />
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 4 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: `repeat(${nav.footer.columns.length}, 1fr)` },
              gap: 4,
            }}
          >
            {nav.footer.columns.map((col) => (
              <Box key={col.heading}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  {col.heading}
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {col.links.map((link) => (
                    <Box component="li" key={link.label} sx={{ mb: 0.5 }}>
                      <Button
                        component={RouterLink}
                        to={link.href}
                        size="small"
                        color="inherit"
                        sx={{ px: 0, justifyContent: 'flex-start', fontWeight: 400 }}
                      >
                        {link.label}
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="caption" color="text.secondary">
            {copy.footer.newsletterHeading} — {copy.footer.newsletterCta} · Janes Jeans is a fictional
            demo brand for Sorb.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
