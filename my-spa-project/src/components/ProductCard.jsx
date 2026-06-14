import { Link } from 'react-router-dom'; // NEW: client-side navigation without full page reload
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Button from '@mui/material/Button';

// NEW: "id" is used to build the detail link /product/1, /product/2, etc.
const ProductCard = ({ id, name, price, img, onAdd }) => {
  const handleAddToCart = () => {
    if (onAdd) {
      onAdd({ id, name, price, img });
    }
  };

  return (
    <div className="product-card">
      {/* Before: image was not clickable—no way to open the detail page */}
      {/* <img src={img} alt={name} /> */}
      <Link to={`/product/${id}`} aria-label={`Open details for ${name}`}>
        <img src={img} alt={name} />
      </Link>
      <h3>{name}</h3>
      <p>{price}</p>

      <Button
        variant="contained"
        startIcon={<ShoppingCartIcon />}
        onClick={handleAddToCart}
        sx={{
          backgroundColor: 'black',
          borderRadius: '20px',
          '&:hover': { backgroundColor: '#b46868' },
        }}
      >
        ADD TO CART
      </Button>
    </div>
  );
};

export default ProductCard;
