/**
 * Builds MERN_Integration_Teaching_Guide.docx for instructors and students.
 * Run: npm run doc:mern
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'word');
const OUT_FILE = path.join(OUT_DIR, 'MERN_Integration_Teaching_Guide.docx');

function title(text) {
  return new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, size: 32 })],
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, bold: true })] });
}

function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, bold: true })] });
}

function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, bold: true })] });
}

function p(text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function code(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: 'Consolas', size: 20 })],
  });
}

const children = [
  title('MERN Integration — Teaching & Change Log'),
  p('Course: Web Engineering (React + Node + MongoDB)'),
  p('Project: Quirky Fruity SPA — connecting frontend (port 5173) to backend API (port 5000) and MongoDB database SZABIST.'),
  p('Prepared for: Instructor classroom use and student lab discussion.'),

  h1('1. What We Built (Big Picture)'),
  p('Before this lab, product information lived inside JavaScript files in the React app (hard-coded arrays). After this lab, products live in MongoDB, the Express server reads them, and React fetches them when the page loads.'),
  p('Think of three layers working together:'),
  bullet('Presentation layer — React pages (Home, ProductDetail) the user sees.'),
  bullet('Application layer — Express routes such as GET /api/products.'),
  bullet('Data layer — MongoDB database named SZABIST, collection products.'),

  h1('2. Complete List of Changes (Files Added or Modified)'),

  h2('2.1 New backend folder'),
  bullet('backend/server.js — Express app, MongoDB connection, Product schema/model, GET /api/products and GET /api/products/:id, CORS, beginner comments on every major step.'),
  bullet('backend/package.json — Backend-only dependencies (express, mongoose, cors, dotenv) and scripts start + seed.'),
  bullet('backend/seedProducts.js — Inserts three sample juices into SZABIST (run once: npm run seed).'),
  bullet('backend/.env.example — Template for MONGO_URI and PORT (students copy to .env).'),
  bullet('backend/README.txt — Short run instructions for the API server.'),

  h2('2.2 Frontend (React) — modified files'),
  bullet('src/pages/Home.jsx — Replaced three hard-coded juice cards with useState([]), useEffect + fetch to http://localhost:5000/api/products, and products.map() to render cards from database rows.'),
  bullet('src/pages/ProductDetail.jsx — Now loads one product from GET /api/products/:id instead of a static import.'),
  bullet('src/data/products.js — Static PRODUCTS array removed; file kept as stub with note that API is the source of truth.'),
  bullet('src/Home.css — Added .products-loading and .products-error styles for fetch status messages.'),

  h2('2.3 Public assets & root config'),
  bullet('public/9.png, public/13.png, public/22.png — Copied mascot images so database img field (/9.png etc.) works in the browser.'),
  bullet('package.json (root) — Added scripts: npm run server and npm run seed.'),

  h1('3. Backend Explained (For Class Discussion)'),

  h3('3.1 dotenv and process.env.MONGO_URI'),
  p('Sensitive settings (database URL, port) should not be typed directly in code that students upload to GitHub. The dotenv package reads a hidden .env file and loads values into process.env. In class, emphasize: .env is for secrets; .env.example is the safe template you share.'),

  h3('3.2 Mongoose Schema vs Model'),
  p('A Schema is a blueprint: which fields exist (id, name, price, description, ingredients, img) and their types. The Model is the tool used to query the database (Product.find). MongoDB is flexible, but the Schema keeps our MERN stack predictable for grading and debugging.'),

  h3('3.3 GET /api/products and res.json()'),
  p('When the route runs Product.find({}), Mongoose returns JavaScript objects. res.json() converts them to JSON text and sends them over HTTP. JSON is the language fetch() on the React side understands. Students should trace one product object from MongoDB → Express → browser → React state.'),

  h3('3.4 CORS'),
  p('React runs on http://localhost:5173 and the API on http://localhost:5000. Browsers treat different ports as different origins and block cross-origin requests unless the server allows them. cors() middleware tells the browser: responses from this API may be read by the React app. Demo: temporarily remove cors() and show the red error in DevTools Network tab.'),

  h1('4. Frontend Explained (For Class Discussion)'),

  h3('4.1 useState with an empty array'),
  p('const [products, setProducts] = useState([]) means the UI starts with zero products. The page can render immediately (loading message) instead of crashing while waiting for the network.'),

  h3('4.2 useEffect with dependency array []'),
  p('useEffect(() => { ... loadProductsFromDatabase(); }, []) runs once after the component mounts. Without [], the effect would run after every re-render and could cause infinite fetch loops. Ask students: what would happen if we put [products] in the dependency array?'),

  h3('4.3 setProducts(data) and re-render'),
  p('When setProducts receives the array from the API, React schedules a re-render. The JSX that uses products.map() then runs again with real data. This is the core React data flow: event or fetch → setState → UI updates.'),

  h3('4.4 .map() on the products array'),
  p('Instead of writing three nearly identical <article> blocks, we map over the array. Each database row becomes one juice card. key={product.id} helps React track which card is which when the list changes.'),

  h3('4.5 Matching field names (critical)'),
  p('API fields must match what JSX expects: id (routes and keys), name (title), price (display), img (image src), description and ingredients (detail page). A typo like productName instead of name breaks the UI silently or shows undefined.'),

  h1('5. How to Run the Lab (Instructor Checklist)'),
  bullet('Terminal 1: Start MongoDB service on the lab machines.'),
  bullet('Terminal 1: cd backend → copy .env.example to .env → npm install → npm run seed → npm start (port 5000).'),
  bullet('Terminal 2: From project root → npm run dev (port 5173).'),
  bullet('Browser: Open Home page → confirm three juices appear → click a product → detail page loads from API.'),
  bullet('If products do not appear: check MongoDB running, seed completed, backend console shows Connected to MongoDB, and no CORS error in browser console.'),

  h1('6. Suggested Classroom Flow (45–60 minutes)'),

  h2('6.1 Warm-up (10 min)'),
  p('Draw the three-tier diagram on the board: Browser → Express → MongoDB. Ask: Where did product data live last week? (Answer: inside React files.) Where does it live now?'),

  h2('6.2 Live demo (15 min)'),
  p('Show Postman or browser tab hitting http://localhost:5000/api/products. Students see raw JSON. Then show the same data rendered on the Home page. Connect JSON keys to JSX curly braces.'),

  h2('6.3 Guided reading (15 min)'),
  p('Open backend/server.js and src/pages/Home.jsx side by side. Students follow comments: dotenv → connect → route → fetch → setState → map.'),

  h2('6.4 Small group activity (10 min)'),
  p('Groups answer: (1) Why CORS? (2) Why [] in useEffect? (3) What breaks if the backend is off? Each group reports one finding.'),

  h2('6.5 Wrap-up (5 min)'),
  p('Preview next steps: POST to add products, environment variables on deployment, or moving API URL to a config file.'),

  h1('7. Discussion Questions for Students'),
  bullet('Why do we use two terminals (backend + frontend) instead of one command?'),
  bullet('What is the difference between a Schema and a document in MongoDB?'),
  bullet('Why is storing the MongoDB password in .env better than writing it in server.js?'),
  bullet('What does the HTTP status code 500 mean when fetch fails?'),
  bullet('If we add a fourth product in MongoDB, does the React code need to change? Why or why not?'),
  bullet('Why do we use product.id for the React key prop instead of the array index?'),
  bullet('What is the single-page application (SPA) still doing client-side when we moved data to the server?'),

  h1('8. Common Student Mistakes (Troubleshooting Guide)'),
  bullet('Forgot to start MongoDB → ECONNREFUSED on port 27017.'),
  bullet('Forgot npm run seed → API returns empty array [].'),
  bullet('Backend not running → fetch failed / load error message on Home.'),
  bullet('Wrong API URL (typo in localhost:5000) → network error.'),
  bullet('Field name mismatch (e.g. title instead of name) → blank headings.'),
  bullet('Removed cors() → CORS policy error in browser console.'),
  bullet('useEffect missing [] → repeated fetch calls and flickering UI.'),

  h1('9. Short Viva / Quiz Prompts'),
  bullet('Define API endpoint in one sentence.'),
  bullet('Write the line of code that loads environment variables in Node.'),
  bullet('What package enables cross-origin requests from React to Express?'),
  bullet('What hook runs after the component first appears on screen?'),
  bullet('What method turns a fetch response body into a JavaScript object?'),

  h1('10. Extension Ideas (Optional Homework)'),
  bullet('Add POST /api/products so students can create a juice from a form.'),
  bullet('Show a loading spinner component instead of plain text.'),
  bullet('Move API_PRODUCTS_URL into a .env file for Vite (VITE_API_URL).'),
  bullet('Display cart count from App.jsx on the Navbar using props (revision).'),

  h1('11. Summary'),
  p('This integration turns the Quirky Fruity project from a static front-end demo into a small full-stack MERN application. Students practice environment variables, REST APIs, asynchronous JavaScript, React hooks, and database-backed UI — skills directly aligned with industry web development and your course learning outcomes.'),

  p('— End of document —'),
];

const doc = new Document({
  sections: [{ properties: {}, children }],
});

await fs.mkdir(OUT_DIR, { recursive: true });
const buffer = await Packer.toBuffer(doc);
await fs.writeFile(OUT_FILE, buffer);
console.log('Wrote', OUT_FILE);
