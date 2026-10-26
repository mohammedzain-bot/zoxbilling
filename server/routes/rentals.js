import express from 'express';
import { getDb, saveDb, generateInvoiceNumber, findOrCreateCustomer, getKolkataDate, VALID_CATEGORIES } from '../database.js';

const router = express.Router();

// Get all rentals
router.get('/', (req, res) => {
  const db = getDb();
  let rentals = db.rentals || [];
  const { status, search, date } = req.query;

  const todayStr = getKolkataDate(0);

  if (status && status !== 'all') {
    if (status === 'overdue') {
      rentals = rentals.filter(r => r.status === 'active' && r.rental_end < todayStr);
    } else if (status === 'due_today') {
      rentals = rentals.filter(r => r.status === 'active' && r.rental_end === todayStr);
    } else {
      rentals = rentals.filter(r => r.status === status);
    }
  }

  if (search) {
    const q = search.toLowerCase();
    rentals = rentals.filter(r =>
      r.invoice_number.toLowerCase().includes(q) ||
      r.customer_name.toLowerCase().includes(q) ||
      r.customer_phone.includes(q) ||
      r.item_name.toLowerCase().includes(q)
    );
  }

  if (date) {
    rentals = rentals.filter(r => r.rental_start === date || r.rental_end === date);
  }

  rentals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(rentals);
});

// Get single rental
router.get('/:id', (req, res) => {
  const db = getDb();
  const rental = (db.rentals || []).find(r => String(r.id) === String(req.params.id) || r.invoice_number === req.params.id);
  if (!rental) return res.status(404).json({ error: 'Rental record not found' });
  res.json(rental);
});

// Create new rental (strictly Suit, Pants, Shirt, T-Shirt, no size, no deposit)
router.post('/', (req, res) => {
  const db = getDb();
  const {
    customer_name,
    customer_phone,
    customer_address,
    item_name,
    item_category = 'Suit',
    quantity = 1,
    rental_price,
    additional_charges = 0,
    amount_paid = 0,
    payment_method = 'Cash',
    rental_start,
    rental_end,
    notes = ''
  } = req.body;

  if (!customer_name || !customer_phone) {
    return res.status(400).json({ error: 'Customer name and mobile number are required' });
  }
  if (!item_name) {
    return res.status(400).json({ error: 'Clothing item name is required' });
  }

  // Validate category to Suit, Pants, Shirt, T-Shirt
  const safeCategory = VALID_CATEGORIES.includes(item_category) ? item_category : 'Suit';

  // Validate dates
  const todayStr = getKolkataDate(0);
  const startDate = rental_start || todayStr;
  const endDate = rental_end || startDate;

  if (endDate < startDate) {
    return res.status(400).json({ error: 'Expected return date cannot be earlier than rental start date' });
  }

  // Calculate duration in days
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const diffTime = Math.abs(endD - startD);
  const duration_days = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Financials: No refundable deposit
  const price = Number(rental_price) || 0;
  const addCharges = Number(additional_charges) || 0;
  const total_amount = (price * (Number(quantity) || 1)) + addCharges;
  const paid = Number(amount_paid) || 0;
  const pending_amount = Math.max(0, total_amount - paid);

  const customer = findOrCreateCustomer(customer_name, customer_phone, customer_address);
  const invoice_number = generateInvoiceNumber('rental');

  const newRental = {
    id: Date.now(),
    invoice_number,
    customer_id: customer ? customer.id : null,
    customer_name: customer_name.trim(),
    customer_phone: String(customer_phone).trim(),
    customer_address: customer_address || '',
    item_name: item_name.trim(),
    item_category: safeCategory,
    quantity: Number(quantity) || 1,
    rental_price: price,
    additional_charges: addCharges,
    total_amount,
    amount_paid: paid,
    pending_amount,
    payment_method,
    rental_start: startDate,
    rental_end: endDate,
    duration_days,
    status: 'active',
    return_date_actual: null,
    return_condition: null,
    return_notes: null,
    approved_extra_charges: 0,
    invoice_generated: 1,
    whatsapp_status: 'not_sent',
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.rentals.unshift(newRental);
  saveDb(db);

  res.status(201).json(newRental);
});

// Update rental
router.put('/:id', (req, res) => {
  const db = getDb();
  const index = db.rentals.findIndex(r => String(r.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Rental not found' });

  const existing = db.rentals[index];
  const body = req.body;

  const total = body.total_amount !== undefined ? Number(body.total_amount) : existing.total_amount;
  const paid = body.amount_paid !== undefined ? Number(body.amount_paid) : existing.amount_paid;
  const pending = Math.max(0, total - paid);

  db.rentals[index] = {
    ...existing,
    ...body,
    total_amount: total,
    amount_paid: paid,
    pending_amount: pending,
    updated_at: new Date().toISOString()
  };

  saveDb(db);
  res.json(db.rentals[index]);
});

// Mark as Returned
router.post('/:id/return', (req, res) => {
  const db = getDb();
  const index = db.rentals.findIndex(r => String(r.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Rental not found' });

  const existing = db.rentals[index];
  const {
    actual_return_date = getKolkataDate(0),
    condition = 'Good',
    notes = '',
    approved_extra_charges = 0
  } = req.body;

  db.rentals[index] = {
    ...existing,
    status: 'returned',
    return_date_actual: actual_return_date,
    return_condition: condition,
    return_notes: notes,
    approved_extra_charges: Number(approved_extra_charges) || 0,
    updated_at: new Date().toISOString()
  };

  saveDb(db);
  res.json(db.rentals[index]);
});

// WhatsApp status patch
router.patch('/:id/whatsapp-status', (req, res) => {
  const db = getDb();
  const index = db.rentals.findIndex(r => String(r.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Rental not found' });

  db.rentals[index].whatsapp_status = req.body.status || 'whatsapp_opened';
  db.rentals[index].updated_at = new Date().toISOString();
  saveDb(db);

  res.json({ success: true, rental: db.rentals[index] });
});

// Delete rental
router.delete('/:id', (req, res) => {
  const db = getDb();
  db.rentals = db.rentals.filter(r => String(r.id) !== String(req.params.id));
  saveDb(db);
  res.json({ success: true });
});

export default router;
