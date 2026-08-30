import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { copy } from '../data/catalog'

export const AccountPage = () => {
  const [tab, setTab] = useState('orders')
  const [anchorEl, setAnchorEl] = useState(null)
  const [profile, setProfile] = useState({ name: 'Jordan Rivera', email: 'jordan@example.com' })
  const [saved, setSaved] = useState(false)

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {copy.account.title}
        </Typography>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="account menu">
          <Avatar sx={{ bgcolor: 'primary.main' }}>{profile.name[0]}</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>Sign out (demo)</MenuItem>
        </Menu>
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab value="orders" label={copy.account.tabs.orders} />
        <Tab value="profile" label={copy.account.tabs.profile} />
        <Tab value="addresses" label={copy.account.tabs.addresses} />
      </Tabs>

      {tab === 'orders' && (
        <TableContainer component={Card} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    {copy.account.ordersEmpty}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 'profile' && (
        <Card variant="outlined" sx={{ p: 3, maxWidth: 480 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            {copy.account.profileHeading}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              fullWidth
            />
            <Button
              variant="contained"
              sx={{ alignSelf: 'flex-start' }}
              onClick={() => setSaved(true)}
            >
              {copy.account.saveCta}
            </Button>
            {saved && (
              <Typography variant="caption" color="success.main">
                Saved (demo — not persisted server-side).
              </Typography>
            )}
          </Stack>
        </Card>
      )}

      {tab === 'addresses' && (
        <Card variant="outlined" sx={{ p: 3 }}>
          <Typography color="text.secondary">No saved addresses in this demo session yet.</Typography>
        </Card>
      )}
    </Container>
  )
}
