import { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../Home.css';

import CharacterOne from '../assets/img/9.png';

function getCartImage(item) {
  if (item?.image && (item.image.startsWith('http') || item.image.startsWith('/'))) {
    return item.image;
  }

  return CharacterOne;
}

function getLineTotal(price, quantity) {
  const amount = Number(String(price || '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(amount)) return '';

  return `$${(amount * (Number(quantity) || 1)).toFixed(2)}`;
}

const Cart = ({ items = [], onRemove, onRefresh }) => {
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Baloo 2', 'Trebuchet MS', sans-serif",
          fontWeight: 800,
          color: '#d5522f',
          mb: 3,
        }}
      >
        Cart
      </Typography>

      {items.length === 0 ? (
        <Typography sx={{ fontFamily: "'Baloo 2', 'Trebuchet MS', sans-serif", fontSize: '1.2rem' }}>
          Your cart is empty.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {items.map((item) => (
            <Box
              key={item._id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '72px 1fr', sm: '88px 1fr auto' },
                gap: 2,
                alignItems: 'center',
                p: 2,
                border: '2px solid #111',
                borderRadius: 2,
                backgroundColor: '#fff8ea',
                boxShadow: '4px 4px 0 #111',
              }}
            >
              <Box
                component="img"
                src={getCartImage(item)}
                alt={item.name || 'Cart item'}
                sx={{ width: 72, height: 72, objectFit: 'contain' }}
              />
              <Box>
                <Typography sx={{ fontFamily: "'Baloo 2', 'Trebuchet MS', sans-serif", fontWeight: 800 }}>
                  {item.name || 'Unnamed product'}
                </Typography>
                <Typography sx={{ color: '#333' }}>
                  {item.price || 'Price unavailable'} x {item.quantity || 1}
                  {getLineTotal(item.price, item.quantity) && ` = ${getLineTotal(item.price, item.quantity)}`}
                </Typography>
              </Box>
              <Button
                type="button"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onRemove(item._id)}
                sx={{ justifySelf: { xs: 'start', sm: 'end' }, gridColumn: { xs: '2', sm: 'auto' } }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Cart;
