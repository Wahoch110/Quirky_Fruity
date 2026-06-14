import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { Snackbar, Alert } from '@mui/material';

const API_CART_URL = 'http://localhost:5000/api/cart';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [cartError, setCartError] = useState('');

  const cartCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

  const loadCart = useCallback(async () => {
    try {
      const response = await fetch(API_CART_URL);

      if (!response.ok) {
        throw new Error(`Cart request failed with status ${response.status}`);
      }

      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
      setCartError('');
    } catch (err) {
      console.error(err);
      setCartError('Could not load cart from MongoDB.');
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product) => {
    if (!product) {
      setCartError('No product was selected.');
      return;
    }

    const productId = Number(product.id ?? product.productId);

    if (!Number.isFinite(productId)) {
      setCartError('Selected product is missing a valid id.');
      return;
    }

    try {
      const response = await fetch(API_CART_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Add to cart failed with status ${response.status}`);
      }

      await loadCart();
      setOpen(true);
    } catch (err) {
      console.error(err);
      setCartError('Could not save cart item in MongoDB.');
    }
  };

  const removeCartItem = async (id) => {
    try {
      const response = await fetch(`${API_CART_URL}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`Remove cart item failed with status ${response.status}`);
      }

      await loadCart();
    } catch (err) {
      console.error(err);
      setCartError('Could not remove cart item.');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(API_CART_URL, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`Clear cart failed with status ${response.status}`);
      }

      await loadCart();
    } catch (err) {
      console.error(err);
      setCartError('Could not clear cart.');
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <BrowserRouter>
      <Navbar count={cartCount} onClearCart={clearCart} />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled">
          Item added to cart successfully!
        </Alert>
      </Snackbar>
      {cartError && (
        <Alert severity="error" onClose={() => setCartError('')}>
          {cartError}
        </Alert>
      )}
      <Routes>
        <Route path="/" element={<Home onAdd={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail onAdd={addToCart} />} />
        <Route
          path="/cart"
          element={<Cart items={cartItems} onRemove={removeCartItem} onRefresh={loadCart} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
