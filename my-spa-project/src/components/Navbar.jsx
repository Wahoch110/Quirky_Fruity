import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@mui/material/Badge';
// Original imports stopped at Badge + ShoppingCartIcon (no Button — added for Gemini Clear-cart lab).
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Navbar.css';
import Title from '../assets/img/Title.png';

// const Navbar = ({ count = 0 }) => {
const Navbar = ({ count = 0, onClearCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="logo-wrap">
        <Link to="/" onClick={closeMenu} className="logo-link">
          <img src={Title} alt="Quirky Fruity" className="nav-logo" />
        </Link>
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        {/*<li><a href="#home" onClick={closeMenu} className="active">Home</a></li>
        <li><a href="#menu" onClick={closeMenu}>Beverages</a></li>
        <li><a href="#gallery" onClick={closeMenu}>Stores</a></li>
        <li><a href="/about" onClick={closeMenu}>About</a></li>*/}
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/" onClick={closeMenu}>Beverages</Link></li>
        <li><Link to="/" onClick={closeMenu}>Stores</Link></li>
        <li><Link to="/About" onClick={closeMenu}>About</Link></li>
        
      </ul>

      {/*
        Previous cart area (badge only, no Clear cart):
        <div className="nav-cart-wrap" aria-label={`Shopping cart, ${count} items`}>
          <Badge badgeContent={count} color="warning" showZero max={99}>
            <ShoppingCartIcon sx={{ color: '#111', fontSize: 28 }} aria-hidden />
          </Badge>
        </div>
      */}
      <div className="nav-cart-wrap" aria-label={`Shopping cart, ${count} items`}>
        <Link to="/cart" onClick={closeMenu} className="nav-cart-link" aria-label={`Open cart, ${count} items`}>
          <Badge badgeContent={count} color="warning" showZero max={99}>
            <ShoppingCartIcon sx={{ color: '#111', fontSize: 28 }} aria-hidden />
          </Badge>
        </Link>
        {onClearCart && (
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={onClearCart}
            className="nav-clear-cart"
            sx={{
              ml: 1,
              textTransform: 'none',
              fontFamily: "'Baloo 2', 'Trebuchet MS', sans-serif",
              fontWeight: 700,
              borderColor: '#d5522f',
              color: '#d5522f',
              '&:hover': { borderColor: '#b03d22', backgroundColor: 'rgba(213, 82, 47, 0.06)' },
            }}
          >
            Clear cart
          </Button>
        )}
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
