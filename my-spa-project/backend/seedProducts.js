/**
 * Run once (after MongoDB is running):  npm run seed
 * Fills the SZABIST database with three sample juices.
 * Field names match what the React app expects: id, name, price, description, ingredients, img.
 */

import mongoose from 'mongoose';
import { MONGO_URI } from './loadEnv.js';

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  img: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    id: 1,
    name: 'Orange Juice',
    price: '$3.20',
    description: 'Zesty oranges—bright flavor, fresh-squeezed style.',
    ingredients: ['Oranges', 'Mint', 'Ice'],
    img: '/9.png',
  },
  {
    id: 2,
    name: 'Pineapple Juice',
    price: '$3.20',
    description: 'Tropical sweetness with a tangy finish.',
    ingredients: ['Pineapple', 'Lime', 'Natural Syrup'],
    img: '/13.png',
  },
  {
    id: 3,
    name: 'Papaya Juice',
    price: '$3.20',
    description: 'A smooth, vitamin-rich tropical treat.',
    ingredients: ['Papaya', 'Honey', 'Ice'],
    img: '/22.png',
  },
];

async function seed() {
  console.log('Connecting to:', MONGO_URI);
  await mongoose.connect(MONGO_URI);

  const dbName = mongoose.connection.name;
  const deleted = await Product.deleteMany({});
  console.log(`Cleared ${deleted.deletedCount} old document(s) from collection "products".`);

  const inserted = await Product.insertMany(sampleProducts);
  console.log(`Inserted ${inserted.length} products into database "${dbName}".`);

  const check = await Product.find({}).sort({ id: 1 });
  console.log('Current products in DB:');
  check.forEach((p) => console.log(`  - id ${p.id}: ${p.name} (${p.price})`));

  await mongoose.disconnect();
  console.log('Done. Start the API with: npm start  (in backend folder) or npm run server  (from root).');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
