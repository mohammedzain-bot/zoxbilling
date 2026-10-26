import express from 'express';
import { getDb, saveDb, generateInvoiceNumber, findOrCreateCustomer, VALID_CATEGORIES } from '../database.js';

const router = express.Router();

// Get all sales
router.get('/', (req, res) => {
  const db = getDb();
  let sales = db.sales || [];
  const { search, payment_status } = req.query;

  if (payment_status && payment_status !== 'all') {
    sales = sales.filter(s => s.payment_status === payment_status);
  }

  if (search) {
    const q = search.toLowerCase();
    sales = sales.filter(s =>
      s.invoice_number.toLowerCase().includes(q) ||
      s.customer_name.toLowerCase().includes(q) ||
      s.customer_phone.includes(q) ||
      (s.items && s.items.some(i => i.item_name.toLowerCase().includes(q)))
    );
  }

  sales.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(sales);
});

// Get single sale
router.get('/:id', (req, res) => {
  const db = getDb();
  const sale = (db.sales || []).find(s => String(s.id) === String(req.params.id) || s.invoice_number === req.params.id);
  if (!sale) return res.status(404).json({ error: 'Sale record not found' });
  res.json(sale);
});

// Create new sale (strictly Suit, Pants, Shirt, T-Shirt, no size)
router.post('/', (req, res) => {
  const db = getDb();
  const {
    customer_name,
    customer_phone,
    customer_address,
    items = [],
    amount_paid = 0,
    payment_method = 'Cash',
    notes = ''
  } = req.body;

  if (!customer_name || !customer_phone) {
    return res.status(400).json({ error: 'Customer name and mobile number are required' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'At least one purchased clothing item is required' });
  }

  let total_original = 0;
  let total_offer = 0;
  let total_discount = 0;

  const processedItems = items.map(item => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const orig = Number(item.original_price) || 0;
    const off = Number(item.offer_price) !== undefined ? Number(item.offer_price) : orig;
    const discPerUnit = Math.max(0, orig - off);
    const discTotal = discPerUnit * qty;
    const lineTotal = off * qty;

    total_original += orig * qty;
    total_offer += lineTotal;
    total_discount += discTotal;

    const safeCategory = VALID_CATEGORIES.includes(item.category) ? item.category : 'Suit';

    return {
      item_name: item.item_name.trim(),
      category: safeCategory,
      quantity: qty,
      original_price: orig,
      offer_price: off,
      discount: discTotal,
      line_total: lineTotal
    };
  });

  const total_amount = total_offer;
  const paid = Number(amount_paid) || 0;
  const pending_amount = Math.max(0, total_amount - paid);

  let payment_status = 'pending';
  if (paid >= total_amount) {
    payment_status = 'paid';
  } else if (paid > 0) {
    payment_status = 'partially_paid';
  }

  const customer = findOrCreateCustomer(customer_name, customer_phone, customer_address);
  const invoice_number = generateInvoiceNumber('sale');

  const newSale = {
    id: Date.now(),
    invoice_number,
    customer_id: customer ? customer.id : null,
    customer_name: customer_name.trim(),
    customer_phone: String(customer_phone).trim(),
    customer_address: customer_address || '',
    items: processedItems,
    total_original,
    total_offer,
    total_discount,
    total_amount,
    amount_paid: paid,
    pending_amount,
    payment_method,
    payment_status,
    invoice_generated: 1,
    whatsapp_status: 'not_sent',
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.sales.unshift(newSale);
  saveDb(db);

  res.status(201).json(newSale);
});

// Update sale
router.put('/:id', (req, res) => {
  const db = getDb();
  const index = db.sales.findIndex(s => String(s.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Sale record not found' });

  const existing = db.sales[index];
  const body = req.body;

  const paid = body.amount_paid !== undefined ? Number(body.amount_paid) : existing.amount_paid;
  const pending = Math.max(0, existing.total_amount - paid);
  const payment_status = paid >= existing.total_amount ? 'paid' : paid > 0 ? 'partially_paid' : 'pending';

  db.sales[index] = {
    ...existing,
    ...body,
    amount_paid: paid,
    pending_amount: pending,
    payment_status,
    updated_at: new Date().toISOString()
  };

  saveDb(db);
  res.json(db.sales[index]);
});

// WhatsApp status patch
router.patch('/:id/whatsapp-status', (req, res) => {
  const db = getDb();
  const index = db.sales.findIndex(s => String(s.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Sale not found' });

  db.sales[index].whatsapp_status = req.body.status || 'whatsapp_opened';
  db.sales[index].updated_at = new Date().toISOString();
  saveDb(db);

  res.json({ success: true, sale: db.sales[index] });
});

// Delete sale
router.delete('/:id', (req, res) => {
  const db = getDb();
  db.sales = db.sales.filter(s => String(s.id) !== String(req.params.id));
  saveDb(db);
  res.json({ success: true });
});

export default router;
