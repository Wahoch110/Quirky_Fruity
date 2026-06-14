import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always load backend/.env even when you run "npm run seed" from the project root.
dotenv.config({ path: path.join(__dirname, '.env') });

export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SZABIST';
export const PORT = process.env.PORT || 5000;
