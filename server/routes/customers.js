import express from 'express';
import { getDb, saveDb } from '../database.js';

const router = express.Router();

// List all customers
router.get('/', (req, res) => {
  const db = getDb();
  let customers = db.customers || [];
  const { search } = req.query;

  if (search) {
    const q = search.toLowerCase();
    customers = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  }

  // Enrich with totals
  const rentals = db.rentals || [];
  const sales = db.sales || [];

  const enriched = customers.map(c => {
    const custRentals = rentals.filter(r => r.customer_id === c.id || r.customer_phone === c.phone);
    const custSales = sales.filter(s => s.customer_id === c.id || s.customer_phone === c.phone);

    const pendingRentalBalance = custRentals.reduce((sum, r) => sum + (r.pending_amount || 0), 0);
    const pendingSaleBalance = custSales.reduce((sum, s) => sum + (s.pending_amount || 0), 0);

    return {
      ...c,
      total_rentals_count: custRentals.length,
      total_sales_count: custSales.length,
      active_rentals_count: custRentals.filter(r => r.status === 'active').length,
      pending_balance: pendingRentalBalance + pendingSaleBalance
    };
  });

  res.json(enriched);
});

// Single customer detail with full transaction history
router.get('/:id', (req, res) => {
  const db = getDb();
  const customer = (db.customers || []).find(c => String(c.id) === String(req.params.id) || c.phone === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const rentals = (db.rentals || []).filter(r => r.customer_id === customer.id || r.customer_phone === customer.phone);
  const sales = (db.sales || []).filter(s => s.customer_id === customer.id || s.customer_phone === customer.phone);

  const pendingRentalBalance = rentals.reduce((sum, r) => sum + (r.pending_amount || 0), 0);
  const pendingSaleBalance = sales.reduce((sum, s) => sum + (s.pending_amount || 0), 0);

  // Combined invoice history
  const invoices = [
    ...rentals.map(r => ({
      invoice_number: r.invoice_number,
      type: 'Rental',
      date: r.rental_start,
      item_summary: `${r.item_name} (${r.item_size || 'N/A'})`,
      amount: r.total_amount,
      paid: r.amount_paid,
      pending: r.pending_amount,
      status: r.status,
      created_at: r.created_at
    })),
    ...sales.map(s => ({
      invoice_number: s.invoice_number,
      type: 'Sale',
      date: s.created_at.split('T')[0],
      item_summary: s.items.map(i => `${i.item_name} x${i.quantity}`).join(', '),
      amount: s.total_amount,
      paid: s.amount_paid,
      pending: s.pending_amount,
      status: s.payment_status,
      created_at: s.created_at
    }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({
    customer,
    rentals,
    sales,
    invoices,
    stats: {
      total_transactions: rentals.length + sales.length,
      active_rentals: rentals.filter(r => r.status === 'active').length,
      total_spent: rentals.reduce((sum, r) => sum + r.amount_paid, 0) + sales.reduce((sum, s) => sum + s.amount_paid, 0),
      total_pending_balance: pendingRentalBalance + pendingSaleBalance
    }
  });
});

// Create customer
router.post('/', (req, res) => {
  const db = getDb();
  const { name, phone, address, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const existing = db.customers.find(c => c.phone.replace(/\D/g, '') === cleanPhone);
  if (existing) {
    return res.status(400).json({ error: 'A customer with this phone number already exists', customer: existing });
  }

  const newCust = {
    id: Date.now(),
    name: name.trim(),
    phone: cleanPhone,
    address: address || '',
    notes: notes || '',
    created_at: new Date().toISOString()
  };

  db.customers.unshift(newCust);
  saveDb(db);
  res.status(201).json(newCust);
});

// Update customer
router.put('/:id', (req, res) => {
  const db = getDb();
  const index = db.customers.findIndex(c => String(c.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });

  db.customers[index] = {
    ...db.customers[index],
    ...req.body
  };

  saveDb(db);
  res.json(db.customers[index]);
});

export default router;
