import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // NEW: same idea as ProductCard—image goes to /product/:id
import '../Home.css';

import Title from '../assets/img/Title.png';
import HeroLeft from '../assets/img/2.png';
import HeroRight from '../assets/img/4.png';
import TrioGroup from '../assets/img/16.png';
import BurstOutline from '../assets/img/3.png';
import BurstCream from '../assets/img/14.png';
import BurstSolid from '../assets/img/8.png';
import BurstSolidLarge from '../assets/img/17.png';
import PineappleFeature from '../assets/img/7.png';
import PapayaFeature from '../assets/img/15.png';
import CharacterGroup from '../assets/img/19.png';
import RatingStars from '../assets/img/21.png';
import CharacterOne from '../assets/img/9.png';
import CharacterTwo from '../assets/img/13.png';
import CharacterThree from '../assets/img/22.png';

// Where our Express API lives (backend on port 5000, React on 5173).
const API_PRODUCTS_URL = 'http://localhost:5000/api/products';

// If the database stores a path like "/9.png", the browser loads it from the Vite public folder.
// We still keep bundled imports as a backup so the page looks good during local demos.
const MASCOT_BY_ID = {
  1: CharacterOne,
  2: CharacterTwo,
  3: CharacterThree,
};

function getProductImage(product) {
  if (product?.img && (product.img.startsWith('http') || product.img.startsWith('/'))) {
    return product.img;
  }
  return MASCOT_BY_ID[product?.id] || CharacterOne;
}

function splitJuiceTitle(fullName) {
  const safeName = typeof fullName === 'string' && fullName.trim()
    ? fullName.trim()
    : 'Unnamed Juice';
  const parts = safeName.split(' ');
  return { line1: parts[0] || safeName, line2: parts.slice(1).join(' ') };
}

const Home = ({ onAdd }) => {
  // useState([]) means "products starts as an empty list until the database responds."
  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState('');

  // useEffect runs after the component appears on screen.
  // The empty array [] means: "only run this once when the page first opens" (not on every re-render).
  useEffect(() => {
    async function loadProductsFromDatabase() {
      try {
        setLoadingProducts(true);
        setLoadError('');

        // fetch() asks our backend for JSON data (the same idea as opening a URL in the browser).
        const response = await fetch(API_PRODUCTS_URL);

        if (!response.ok) {
          throw new Error(`Server replied with status ${response.status}`);
        }

        // .json() turns the response body into a normal JavaScript array we can use in React.
        const data = await response.json();

        // setProducts(data) saves the list into React state.
        // React sees state change and automatically re-renders — the .map() below then paints the cards.
        setProducts(data);
      } catch (err) {
        console.error(err);
        setLoadError('Could not load products. Is the backend running on port 5000?');
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProductsFromDatabase();
  }, []);

  return (
    <div className="quirky-page">
      <section className="hero-section" id="home">
        <div className="hero-grid">
          <div className="hero-left">
            <img src={BurstOutline} alt="" className="hero-burst hero-burst-left" aria-hidden="true" />
            <img src={HeroLeft} alt="Blue fruity character" className="hero-character hero-character-left" />
            <p className="hero-hours">
              open from
              <br />
              <span>8 am - 10 pm</span>
            </p>
          </div>

          <div className="hero-center">
            <h1>
              Treat yourself
              <br />
              with something
              <br />
              <span>fresh</span> &amp; <span>tasty!</span>
            </h1>
            <a href="#menu" className="pill-btn">learn more</a>
          </div>

          <div className="hero-right">
            <img src={BurstOutline} alt="" className="hero-burst hero-burst-right" aria-hidden="true" />
            <img src={HeroRight} alt="Orange fruity character" className="hero-character hero-character-right" />
            <p className="hero-tagline">
              treat yourself
              <br />
              with something fresh
              <br />
              and tasty!
            </p>
          </div>
        </div>
      </section>

      <section className="promo-strip" id="menu">
        <div className="promo-copy">
          <p>
            <strong>Lorem ipsum dolor sit amet</strong> consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
            Risus commodo viverra maecenas.
          </p>
          <button className="pill-btn dark">see menu</button>
        </div>

        <div className="promo-burst-wrap">
          <div className="promo-burst-shape" aria-hidden="true" />
          <p className="promo-text">
            Deliciously
            <br />
            Fresh!
          </p>
        </div>
        <img src={PapayaFeature} alt="Smiling character" className="promo-character" />
      </section>

      <section className="favorites-section">
        <h2 className="section-title">All time Favorites</h2>

        <div className="favorites-grid">
          <div className="favorites-mascot-wrap">
            <img src={PineappleFeature} alt="Pineapple character" className="favorites-mascot" />
            <div className="favorites-shadow" aria-hidden="true" />
          </div>

          <div className="favorites-menus">
            <div className="menu-board">
              <h3>smoothies</h3>
              <ul>
                <li><span>Papaya Smoothie</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Apple Smoothie</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Pineapple Smoothie</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Cherry Smoothie</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Avocado Smoothie</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Kiwi Smoothie</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Bango Smoothie</span><em>•••••</em><strong>$2.30</strong></li>
              </ul>
            </div>

            <div className="menu-board">
              <h3>fresh juice</h3>
              <ul>
                <li><span>Papaya Fresh Juice</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Apple Fresh Juice</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Pineapple Fresh Juice</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Cherry Fresh Juice</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Avocado Fresh Juice</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Kiwi Fresh Juice</span><em>•••••</em><strong>$2.30</strong></li>
                <li><span>Bango Fresh Juice</span><em>•••••</em><strong>$2.30</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="energy-section">
        <div className="energy-content">
          <h2>
            Beat summer
            <br />
            heat with
            <br />
            <span>quirky fruity!</span>
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas.
          </p>
          <button className="pill-btn dark mini">see more</button>
        </div>
        <div className="energy-visual-wrap">
          <img src={BurstSolid} alt="" className="burst-solid" aria-hidden="true" />
          <img src={CharacterOne} alt="Blue character" className="energy-visual" />
        </div>
      </section>

      <section className="products-row" id="gallery">
        {loadingProducts && <p className="products-loading">Loading juices from database…</p>}
        {loadError && <p className="products-error">{loadError}</p>}

        {/* .map() walks over the products array and returns one <article> per database row.
            When setProducts(data) ran, React re-rendered and this block appeared automatically. */}
        {!loadingProducts &&
          !loadError &&
          products.map((product) => {
            const { line1, line2 } = splitJuiceTitle(product.name);
            const productName = product.name || 'Unnamed Juice';

            return (
              <article className="juice-card" key={product.id}>
                <div className="juice-visual">
                  <img src={BurstCream} alt="" className="juice-burst" aria-hidden="true" />
                  <Link
                    to={`/product/${product.id}`}
                    className="juice-detail-link"
                    aria-label={`View ${productName} details`}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={`${productName} mascot`}
                      className="juice-image"
                    />
                  </Link>
                </div>
                <h4>
                  <span>{line1}</span>
                  <span>{line2}</span>
                </h4>
                <p>{product.price}</p>
                <div className="juice-cart-row">
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={() => onAdd(product)}
                  >
                    add to cart
                  </button>
                </div>
              </article>
            );
          })}
      </section>

      <section className="mini-hero">
        <img src={TrioGroup} alt="Quirky fruity characters" className="mini-hero-trio" />
        <div className="mini-hero-copy">
          <h2>
            Try something
            <br />
            that feels <span>new</span>
            <br />
            and <span>you</span>!
          </h2>
          <button className="pill-btn dark mini">see more</button>
        </div>
      </section>

      <section className="refresh-banner">
        <img src={BurstSolid} alt="" className="refresh-burst refresh-burst-left" aria-hidden="true" />
        <img src={BurstSolidLarge} alt="" className="refresh-burst refresh-burst-right" aria-hidden="true" />
        <div className="refresh-copy">
          <h2>
            Feel refreshed and energize
            <br />
            with these <span>fresh fruit</span> drinks!
          </h2>
          <button className="pill-btn">learn more</button>
        </div>
        <div className="lineup-wrap">
          <img src={CharacterGroup} alt="Quirky fruity lineup" className="refresh-group" />
          <div className="lineup-shadows" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <img src={CharacterThree} alt="Reviewer avatar" className="testimonial-avatar" />
        <h3 className="testimonial-name">Christian <span>Amon</span></h3>
        <p className="testimonial-text">
          <strong>Lorem ipsum dolor sit amet</strong> consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
        </p>
        <img src={RatingStars} alt="Five stars" className="rating-stars" />
      </section>

      <section className="newsletter-section" id="contact">
        <h2>Newsletter <span>Registration</span></h2>
        <form className="newsletter-form">
          <input type="text" placeholder="your name" />
          <input type="email" placeholder="your email" />
          <textarea placeholder="message" rows="4" />
          <button type="submit" className="pill-btn dark">Submit Email</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left-block">
            <img src={Title} alt="Quirky Fruity" className="footer-logo" />
            <div className="footer-columns">
              <div className="footer-col">
                <a href="#home">Home</a>
                <a href="/about">About</a>
                <a href="#menu">Menu</a>
              </div>
              <div className="footer-col">
                <a href="#gallery">Smoothies</a>
                <a href="#gallery">Juices</a>
                <a href="#gallery">Fruits</a>
              </div>
              <div className="footer-col">
                <a href="#contact">Imports</a>
                <a href="#contact">Branches</a>
                <a href="#contact">Social Media</a>
              </div>
              <div className="footer-col">
                <a href="#contact">History</a>
                <a href="#contact">Job Vacancies</a>
              </div>
            </div>
          </div>
          <img src={CharacterThree} alt="" className="footer-mascot" aria-hidden="true" />
        </div>
      </footer>

      <img src={BurstOutline} alt="" className="decor decor-one" aria-hidden="true" />
      <img src={BurstSolid} alt="" className="decor decor-two" aria-hidden="true" />
    </div>
  );
};

export default Home;
