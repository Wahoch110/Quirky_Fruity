import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';

// Same backend base URL as Home.jsx — one product by id from MongoDB.
const API_BASE = 'http://localhost:5000/api/products';

const ProductDetail = ({ onAdd }) => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // When the URL id changes (e.g. user opens /product/2), fetch that row from the API.
  useEffect(() => {
    async function loadOneProduct() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE}/${id}`);

        if (!response.ok) {
          throw new Error(`Product not found (status ${response.status})`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Could not load this product from the server.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadOneProduct();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading product…</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5">{error || 'Product not found!'}</Typography>
      </Container>
    );
  }

  const productName = product.name || 'Unnamed Juice';
  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : [];

  return (
    <Container sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#E15A44' }}>
            {productName}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {product.price || 'Price unavailable'}
          </Typography>
          <Typography variant="body1" sx={{ my: 3 }}>
            {product.description || 'No description available.'}
          </Typography>

          <Typography variant="h6">Ingredients:</Typography>
          <ul>
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <Button
            variant="contained"
            onClick={() => onAdd(product)}
            sx={{ mt: 3, bgcolor: 'black', borderRadius: '50px' }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;
