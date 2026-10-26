import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// List all invoices (unified Rentals and Sales)
router.get('/', (req, res) => {
  const db = getDb();
  const rentals = db.rentals || [];
  const sales = db.sales || [];
  const { type, search, payment_status, date } = req.query;

  const rentalInvoices = rentals.map(r => ({
    id: `r-${r.id}`,
    transaction_id: r.id,
    invoice_number: r.invoice_number,
    transaction_type: 'Rental',
    customer_name: r.customer_name,
    customer_phone: r.customer_phone,
    customer_address: r.customer_address,
    invoice_date: r.rental_start,
    final_amount: r.total_amount,
    amount_paid: r.amount_paid,
    pending_balance: r.pending_amount,
    payment_status: r.pending_amount === 0 ? 'paid' : r.amount_paid > 0 ? 'partially_paid' : 'pending',
    payment_method: r.payment_method,
    invoice_generated: r.invoice_generated || 1,
    whatsapp_status: r.whatsapp_status || 'not_sent',
    item_summary: `${r.item_name} (${r.item_category}) - ${r.duration_days} Days`,
    created_at: r.created_at,
    raw: r
  }));

  const saleInvoices = sales.map(s => ({
    id: `s-${s.id}`,
    transaction_id: s.id,
    invoice_number: s.invoice_number,
    transaction_type: 'Sale',
    customer_name: s.customer_name,
    customer_phone: s.customer_phone,
    customer_address: s.customer_address,
    invoice_date: s.created_at.split('T')[0],
    final_amount: s.total_amount,
    amount_paid: s.amount_paid,
    pending_balance: s.pending_amount,
    payment_status: s.payment_status,
    payment_method: s.payment_method,
    invoice_generated: s.invoice_generated || 1,
    whatsapp_status: s.whatsapp_status || 'not_sent',
    item_summary: s.items.map(i => `${i.item_name} (x${i.quantity})`).join(', '),
    created_at: s.created_at,
    raw: s
  }));

  let all = [...rentalInvoices, ...saleInvoices];

  if (type && type !== 'all') {
    all = all.filter(inv => inv.transaction_type.toLowerCase() === type.toLowerCase());
  }

  if (payment_status && payment_status !== 'all') {
    all = all.filter(inv => inv.payment_status === payment_status);
  }

  if (date) {
    all = all.filter(inv => inv.invoice_date === date);
  }

  if (search) {
    const q = search.toLowerCase();
    all = all.filter(inv =>
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.customer_name.toLowerCase().includes(q) ||
      inv.customer_phone.includes(q) ||
      inv.item_summary.toLowerCase().includes(q)
    );
  }

  all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(all);
});

// Single invoice detail
router.get('/:invoiceNumber', (req, res) => {
  const db = getDb();
  const num = req.params.invoiceNumber;
  const settings = db.settings;

  const rental = (db.rentals || []).find(r => r.invoice_number === num);
  if (rental) {
    return res.json({
      type: 'Rental',
      invoice_number: rental.invoice_number,
      invoice_date: rental.rental_start,
      store: settings,
      customer: {
        name: rental.customer_name,
        phone: rental.customer_phone,
        address: rental.customer_address
      },
      rental_details: {
        item_name: rental.item_name,
        category: rental.item_category,
        quantity: rental.quantity,
        rental_start: rental.rental_start,
        rental_end: rental.rental_end,
        duration_days: rental.duration_days,
        rental_price: rental.rental_price,
        additional_charges: rental.additional_charges,
        status: rental.status
      },
      payment: {
        total_amount: rental.total_amount,
        amount_paid: rental.amount_paid,
        pending_amount: rental.pending_amount,
        payment_method: rental.payment_method,
        payment_status: rental.pending_amount === 0 ? 'paid' : rental.amount_paid > 0 ? 'partially_paid' : 'pending'
      },
      whatsapp_status: rental.whatsapp_status,
      footer: settings?.invoice_footer || 'Thank you for choosing ZOX.',
      created_at: rental.created_at
    });
  }

  const sale = (db.sales || []).find(s => s.invoice_number === num);
  if (sale) {
    return res.json({
      type: 'Sale',
      invoice_number: sale.invoice_number,
      invoice_date: sale.created_at.split('T')[0],
      store: settings,
      customer: {
        name: sale.customer_name,
        phone: sale.customer_phone,
        address: sale.customer_address
      },
      items: sale.items,
      totals: {
        total_original: sale.total_original,
        total_offer: sale.total_offer,
        total_discount: sale.total_discount,
        total_amount: sale.total_amount
      },
      payment: {
        total_amount: sale.total_amount,
        amount_paid: sale.amount_paid,
        pending_amount: sale.pending_amount,
        payment_method: sale.payment_method,
        payment_status: sale.payment_status
      },
      whatsapp_status: sale.whatsapp_status,
      footer: settings?.invoice_footer || 'Thank you for choosing ZOX.',
      created_at: sale.created_at
    });
  }

  res.status(404).json({ error: 'Invoice not found' });
});

export default router;
