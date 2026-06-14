/**
 * BACKEND SERVER (Node.js + Express + MongoDB)
 * -------------------------------------------
 * This file is the "kitchen" of our app. The React site (port 5173) asks this server
 * (port 5000) for product data. The server talks to MongoDB where rows are stored.
 */

// dotenv reads a hidden file named ".env" and puts each line into process.env
// Example line in .env:  MONGO_URI=mongodb://127.0.0.1:27017/SZABIST
// That way passwords and URLs are NOT hard-coded in source code you share on GitHub.
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MONGO_URI, PORT } from './loadEnv.js';

// Create the Express application object — think of it as our web server program.
const app = express();

// ---------------------------------------------------------------------------
// CORS — why we need it
// ---------------------------------------------------------------------------
// Your React app runs at http://localhost:5173 and the API runs at :5000.
// Browsers treat those as two different "origins" and block fetch() by default.
// cors() tells the browser: "It is OK for the React app to read responses from this server."
app.use(cors());

// express.json() lets the server understand JSON data if we POST later (good habit).
app.use(express.json());

// ---------------------------------------------------------------------------
// MONGOOSE SCHEMA + MODEL
// ---------------------------------------------------------------------------
// A Schema is a blueprint: it lists which fields each product document must have
// and what type each field is (Number, String, Array of Strings, etc.).
// MongoDB itself is flexible; the Schema helps our Node code stay consistent.
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  img: { type: String, required: true },
});

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// The Model is the tool we use to run queries (find, save, delete) on the "products" collection.
// Mongoose will store documents in a collection named "products" (lowercase plural of Product).
const Product = mongoose.model('Product', productSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema, 'cartitems');

// ---------------------------------------------------------------------------
// CONNECT TO MONGODB
// ---------------------------------------------------------------------------
async function startServer() {
  try {
    // mongoose.connect opens a live pipe to the database named in the URI (SZABIST).
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB database:', mongoose.connection.name);

    // Only start listening AFTER the database connection succeeds.
    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
      console.log('Try products list: http://localhost:5000/api/products');
    });
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// ROUTE: GET /api/products  — send every product to the React app
// ---------------------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    // Product.find({}) means "get all documents in the products collection".
    // The empty object {} means we are not filtering — we want the full list.
    const productsFromDb = await Product.find({}).sort({ id: 1 });

    if (productsFromDb.length === 0) {
      console.warn(
        'WARNING: products collection is empty. Run: npm run seed (from project root) or npm run seed in backend folder.',
      );
    }

    // res.json() converts JavaScript objects into JSON text and sends them over HTTP.
    // JSON is what browsers and fetch() understand (like a universal language for data).
    res.json(productsFromDb);
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ message: 'Could not load products from database.' });
  }
});

// ---------------------------------------------------------------------------
// ROUTE: GET /api/products/:id  — one product for the detail page
// ---------------------------------------------------------------------------
app.get('/api/products/:id', async (req, res) => {
  try {
    const numericId = parseInt(req.params.id, 10);
    const product = await Product.findOne({ id: numericId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error reading one product:', error);
    res.status(500).json({ message: 'Could not load product.' });
  }
});

// ---------------------------------------------------------------------------
// ROUTES: /api/cart  — store cart rows in MongoDB collection "cartitems"
// ---------------------------------------------------------------------------
app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await CartItem.find({}).sort({ createdAt: 1 });
    res.json(cartItems);
  } catch (error) {
    console.error('Error reading cart:', error);
    res.status(500).json({ message: 'Could not load cart items.' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const productId = Number(req.body.productId);

    if (!Number.isFinite(productId)) {
      return res.status(400).json({ message: 'productId is required.' });
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product does not exist.' });
    }

    const cartItem = await CartItem.findOneAndUpdate(
      { productId },
      {
        $inc: { quantity: 1 },
        $set: {
          name: product.name || 'Unnamed product',
          price: product.price || 'Price unavailable',
          image: product.img || '',
        },
        $setOnInsert: { productId, createdAt: new Date() },
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error saving cart item:', error);
    res.status(500).json({ message: 'Could not save cart item.' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const deleted = await CartItem.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    res.json({ message: 'Cart item removed.', deleted });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Could not remove cart item.' });
  }
});

app.delete('/api/cart', async (req, res) => {
  try {
    const result = await CartItem.deleteMany({});
    res.json({ message: 'Cart cleared.', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Could not clear cart.' });
  }
});

// Start the database connection and then the HTTP server.
startServer();
