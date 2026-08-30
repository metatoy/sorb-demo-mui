import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import { copy } from '../data/catalog'
import { useCart } from '../data/cartStore'

const REGIONS = ['Minnesota', 'California', 'New York', 'Texas', 'Washington']

export const CheckoutPage = () => {
  const { clear } = useCart()
  const [step, setStep] = useState(0)
  const [region, setRegion] = useState(REGIONS[0])
  const [shipMethod, setShipMethod] = useState('standard')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [touched, setTouched] = useState(false)
  const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '' })

  const addressValid = address.name && address.street && address.city && address.zip.length >= 5

  const next = () => setStep((s) => Math.min(2, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const placeOrder = () => {
    setConfirmOpen(false)
    setPlaced(true)
    clear()
  }

  if (placed) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {copy.checkout.orderConfirmedTitle}
        </Typography>
        <Typography color="text.secondary">{copy.checkout.orderConfirmedBody}</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {copy.checkout.title}
      </Typography>
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {copy.checkout.steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && (
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            {copy.checkout.shippingHeading}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Full name"
              value={address.name}
              error={touched && !address.name}
              onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Street address"
              value={address.street}
              error={touched && !address.street}
              onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                value={address.city}
                error={touched && !address.city}
                onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                fullWidth
              />
              <TextField
                label="ZIP"
                value={address.zip}
                error={touched && address.zip.length < 5}
                helperText={touched && address.zip.length < 5 ? 'Enter a valid ZIP' : ' '}
                onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))}
                fullWidth
              />
            </Stack>
            <FormControl fullWidth>
              <InputLabel id="region-label">{copy.checkout.regionLabel}</InputLabel>
              <Select
                labelId="region-label"
                label={copy.checkout.regionLabel}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {REGIONS.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {copy.checkout.shippingMethodLabel}
              </Typography>
              <RadioGroup value={shipMethod} onChange={(e) => setShipMethod(e.target.value)}>
                <FormControlLabel value="standard" control={<Radio />} label="Standard (5–7 days) — free" />
                <FormControlLabel value="express" control={<Radio />} label="Express (2 days) — $12.00" />
              </RadioGroup>
            </Box>
          </Stack>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={() => {
              setTouched(true)
              if (addressValid) next()
            }}
          >
            Continue to payment
          </Button>
        </Box>
      )}

      {step === 1 && (
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            {copy.checkout.paymentHeading}
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            {copy.checkout.paymentHeading}
          </Alert>
          <Stack spacing={2}>
            <TextField label="Card number (demo)" placeholder="4242 4242 4242 4242" fullWidth />
            <Stack direction="row" spacing={2}>
              <TextField label="Expiry" placeholder="MM/YY" fullWidth />
              <TextField label="CVC" placeholder="123" fullWidth />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button onClick={back}>Back</Button>
            <Button variant="contained" size="large" onClick={next}>
              Review order
            </Button>
          </Stack>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            {copy.checkout.reviewHeading}
          </Typography>
          <Typography color="text.secondary">
            {address.name}, {address.street}, {address.city}, {region} {address.zip}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Shipping: {shipMethod === 'express' ? 'Express (2 days)' : 'Standard (5–7 days)'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button onClick={back}>Back</Button>
            <Button variant="contained" size="large" onClick={() => setConfirmOpen(true)}>
              {copy.checkout.placeOrderCta}
            </Button>
          </Stack>
        </Box>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{copy.checkout.confirmDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{copy.checkout.confirmDialogBody}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={placeOrder} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
