import express from 'express';
import { getDb, saveDb } from '../database.js';

const router = express.Router();

// Get settings
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.settings || {});
});

// Update settings
router.put('/', (req, res) => {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDb(db);
  res.json(db.settings);
});

// Get clothing catalog for fast autocomplete selection
router.get('/catalog', (req, res) => {
  const db = getDb();
  res.json(db.catalog || []);
});

// Add item to catalog
router.post('/catalog', (req, res) => {
  const db = getDb();
  const newItem = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category || 'Suit',
    default_size: req.body.default_size || '40R',
    rental_price: Number(req.body.rental_price) || 2500,
    sale_original: Number(req.body.sale_original) || 10000,
    sale_offer: Number(req.body.sale_offer) || 8500,
    security_deposit: Number(req.body.security_deposit) || 1500
  };
  if (!db.catalog) db.catalog = [];
  db.catalog.unshift(newItem);
  saveDb(db);
  res.status(201).json(newItem);
});

export default router;
