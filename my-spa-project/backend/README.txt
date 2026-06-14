BACKEND SETUP — 
=============================================

You need THREE things running:

  [1] MongoDB on port 27017
  [2] API server on port 5000  (npm run server)
  [3] React on port 5173      (npm run dev)

STEP 1 — Start MongoDB (most people skip this)
  - Windows: Services app → start "MongoDB Server"
  - Or open MongoDB Compass; if it cannot connect, MongoDB is not running.

STEP 2 — Insert sample data (from project ROOT folder)

  npm run seed

  Success looks like:
    Inserted 3 products into database "SZABIST".
    - id 1: Orange Juice ($3.20)
    ...

  If you see ECONNREFUSED 127.0.0.1:27017 → MongoDB is NOT running (go back to Step 1).

STEP 3 — Start API (keep terminal open)

  npm run server

  Open in browser: http://localhost:5000/api/products
  You must see JSON with 3 products.

STEP 4 — Start React (second terminal)

  npm run dev

MANUAL INSERT (Compass) if seed fails but MongoDB works:
  - Database: SZABIST
  - Collection: products
  - Import file: backend/products.manual-insert.json

See also: docs/STUDENT_MERN_QUICK_REFERENCE.txt
