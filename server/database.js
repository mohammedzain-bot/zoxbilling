import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.join(__dirname, 'zox_store.json');
const VERCEL_DB_PATH = path.join('/tmp', 'zox_store.json');
const DB_PATH = process.env.VERCEL ? VERCEL_DB_PATH : LOCAL_DB_PATH;

let dbMemory = null;

const DEFAULT_SETTINGS = {
  store_name: 'ZOX',
  store_address: '123 Luxury Fashion Boulevard, Fort, Mumbai 400001',
  store_phone: '+91 98765 43210',
  whatsapp_number: '919876543210',
  store_email: 'hello@zoxclothing.com',
  currency: '₹',
  timezone: 'Asia/Kolkata',
  invoice_prefix_rental: 'ZOX-RENT',
  invoice_prefix_sale: 'ZOX-SALE',
  invoice_footer: 'Thank you for choosing ZOX. We look forward to serving you again.',
  rental_reminder_template: 'Hello {name}, this is ZOX. This is a friendly reminder that your rented {item} is due to be returned on {date}. Please contact us if you need any assistance. Thank you for choosing ZOX.',
  rental_overdue_template: 'Hello {name}, this is ZOX. Our records show that your rented {item} was due for return on {date}. Please contact us to arrange its return. Thank you.'
};

const DEFAULT_USERS = [
  {
    id: 1,
    username: 'admin',
    password_hash: bcrypt.hashSync('zox@admin2024', 10),
    pin: '8888',
    name: 'ZOX Store Manager',
    role: 'admin'
  }
];

// Strictly 4 categories: Suit, Pants, Shirt, T-Shirt. No size, no deposit, no dress.
export const VALID_CATEGORIES = ['Suit', 'Pants', 'Shirt', 'T-Shirt'];

const DEFAULT_CATALOG = [
  { id: 1, name: 'Obsidian Black Peak Suit', category: 'Suit', rental_price: 2500, sale_original: 12000, sale_offer: 9500 },
  { id: 2, name: 'Royal Navy 3-Piece Wool Suit', category: 'Suit', rental_price: 2800, sale_original: 14000, sale_offer: 11000 },
  { id: 3, name: 'Charcoal Slim Formal Pants', category: 'Pants', rental_price: 800, sale_original: 3500, sale_offer: 2800 },
  { id: 4, name: 'Beige Pleated Chino Pants', category: 'Pants', rental_price: 700, sale_original: 3000, sale_offer: 2400 },
  { id: 5, name: 'Luxury Egyptian Cotton White Shirt', category: 'Shirt', rental_price: 600, sale_original: 2800, sale_offer: 2200 },
  { id: 6, name: 'Sky Blue French Cuff Formal Shirt', category: 'Shirt', rental_price: 650, sale_original: 3200, sale_offer: 2500 },
  { id: 7, name: 'Heavyweight Matte Black T-Shirt', category: 'T-Shirt', rental_price: 400, sale_original: 1800, sale_offer: 1400 },
  { id: 8, name: 'Supima Cotton Off-White T-Shirt', category: 'T-Shirt', rental_price: 400, sale_original: 1800, sale_offer: 1400 }
];

// Helper to get Kolkata date YYYY-MM-DD
export function getKolkataDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

function initData() {
  const today = getKolkataDate(0);
  const tomorrow = getKolkataDate(1);
  const yesterday = getKolkataDate(-1);
  const in3Days = getKolkataDate(3);
  const fiveDaysAgo = getKolkataDate(-5);

  const initialCustomers = [
    {
      id: 1,
      name: 'Vikram Malhotra',
      phone: '919820112233',
      address: 'Bandra West, Mumbai',
      notes: 'VIP customer. Often rents suits for corporate galas.',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 2,
      name: 'Ananya Deshmukh',
      phone: '919819887766',
      address: 'Juhu, Mumbai',
      notes: 'Purchases formal shirts and casual t-shirts.',
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 3,
      name: 'Rohan Mehra',
      phone: '919833445566',
      address: 'Nariman Point, Mumbai',
      notes: 'Corporate executive, purchases suits and pants.',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 4,
      name: 'Siddharth Rao',
      phone: '919870123456',
      address: 'Worli, Mumbai',
      notes: 'Wedding attendee.',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];

  const initialRentals = [
    {
      id: 1,
      invoice_number: 'ZOX-RENT-0001',
      customer_id: 1,
      customer_name: 'Vikram Malhotra',
      customer_phone: '919820112233',
      customer_address: 'Bandra West, Mumbai',
      item_name: 'Obsidian Black Peak Suit',
      item_category: 'Suit',
      quantity: 1,
      rental_price: 2500,
      additional_charges: 200,
      total_amount: 2700,
      amount_paid: 2700,
      pending_amount: 0,
      payment_method: 'UPI',
      rental_start: yesterday,
      rental_end: today, // DUE TODAY
      duration_days: 2,
      status: 'active',
      return_date_actual: null,
      return_condition: null,
      return_notes: null,
      approved_extra_charges: 0,
      invoice_generated: 1,
      whatsapp_status: 'shared_confirmed',
      notes: 'Annual Charity Gala.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      invoice_number: 'ZOX-RENT-0002',
      customer_id: 2,
      customer_name: 'Ananya Deshmukh',
      customer_phone: '919819887766',
      customer_address: 'Juhu, Mumbai',
      item_name: 'Luxury Egyptian Cotton White Shirt',
      item_category: 'Shirt',
      quantity: 1,
      rental_price: 600,
      additional_charges: 0,
      total_amount: 600,
      amount_paid: 400,
      pending_amount: 200,
      payment_method: 'Card',
      rental_start: today,
      rental_end: tomorrow, // DUE TOMORROW
      duration_days: 2,
      status: 'active',
      return_date_actual: null,
      return_condition: null,
      return_notes: null,
      approved_extra_charges: 0,
      invoice_generated: 1,
      whatsapp_status: 'whatsapp_opened',
      notes: 'Awards ceremony.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      invoice_number: 'ZOX-RENT-0003',
      customer_id: 4,
      customer_name: 'Siddharth Rao',
      customer_phone: '919870123456',
      customer_address: 'Worli, Mumbai',
      item_name: 'Charcoal Slim Formal Pants',
      item_category: 'Pants',
      quantity: 1,
      rental_price: 800,
      additional_charges: 0,
      total_amount: 800,
      amount_paid: 800,
      pending_amount: 0,
      payment_method: 'Cash',
      rental_start: fiveDaysAgo,
      rental_end: yesterday, // OVERDUE
      duration_days: 4,
      status: 'active',
      return_date_actual: null,
      return_condition: null,
      return_notes: null,
      approved_extra_charges: 0,
      invoice_generated: 1,
      whatsapp_status: 'not_sent',
      notes: 'Weekend event.',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      invoice_number: 'ZOX-RENT-0004',
      customer_id: 1,
      customer_name: 'Vikram Malhotra',
      customer_phone: '919820112233',
      customer_address: 'Bandra West, Mumbai',
      item_name: 'Royal Navy 3-Piece Wool Suit',
      item_category: 'Suit',
      quantity: 1,
      rental_price: 2800,
      additional_charges: 0,
      total_amount: 2800,
      amount_paid: 2800,
      pending_amount: 0,
      payment_method: 'UPI',
      rental_start: today,
      rental_end: in3Days, // UPCOMING
      duration_days: 4,
      status: 'active',
      return_date_actual: null,
      return_condition: null,
      return_notes: null,
      approved_extra_charges: 0,
      invoice_generated: 1,
      whatsapp_status: 'whatsapp_opened',
      notes: 'Upcoming business summit.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const initialSales = [
    {
      id: 1,
      invoice_number: 'ZOX-SALE-0001',
      customer_id: 3,
      customer_name: 'Rohan Mehra',
      customer_phone: '919833445566',
      customer_address: 'Nariman Point, Mumbai',
      items: [
        {
          item_name: 'Obsidian Black Peak Suit',
          category: 'Suit',
          quantity: 1,
          original_price: 12000,
          offer_price: 9500,
          discount: 2500,
          line_total: 9500
        },
        {
          item_name: 'Charcoal Slim Formal Pants',
          category: 'Pants',
          quantity: 1,
          original_price: 3500,
          offer_price: 2800,
          discount: 700,
          line_total: 2800
        }
      ],
      total_original: 15500,
      total_offer: 12300,
      total_discount: 3200,
      total_amount: 12300,
      amount_paid: 12300,
      pending_amount: 0,
      payment_method: 'Card',
      payment_status: 'paid',
      invoice_generated: 1,
      whatsapp_status: 'shared_confirmed',
      notes: 'Direct store purchase.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      invoice_number: 'ZOX-SALE-0002',
      customer_id: 4,
      customer_name: 'Siddharth Rao',
      customer_phone: '919870123456',
      customer_address: 'Worli, Mumbai',
      items: [
        {
          item_name: 'Heavyweight Matte Black T-Shirt',
          category: 'T-Shirt',
          quantity: 2,
          original_price: 1800,
          offer_price: 1400,
          discount: 800,
          line_total: 2800
        }
      ],
      total_original: 3600,
      total_offer: 2800,
      total_discount: 800,
      total_amount: 2800,
      amount_paid: 2000,
      pending_amount: 800,
      payment_method: 'UPI',
      payment_status: 'partially_paid',
      invoice_generated: 1,
      whatsapp_status: 'whatsapp_opened',
      notes: 'Remaining balance on next visit.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return {
    settings: DEFAULT_SETTINGS,
    users: DEFAULT_USERS,
    catalog: DEFAULT_CATALOG,
    customers: initialCustomers,
    rentals: initialRentals,
    sales: initialSales,
    invoice_sequences: {
      rental: 4,
      sale: 2
    }
  };
}

export function getDb() {
  if (dbMemory) return dbMemory;

  if (process.env.VERCEL && !fs.existsSync(VERCEL_DB_PATH)) {
    try {
      if (fs.existsSync(LOCAL_DB_PATH)) {
        fs.copyFileSync(LOCAL_DB_PATH, VERCEL_DB_PATH);
      }
    } catch (e) {
      console.warn('Could not copy seed DB to /tmp', e);
    }
  }

  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      dbMemory = JSON.parse(raw);
      if (!dbMemory.settings) dbMemory.settings = DEFAULT_SETTINGS;
      if (!dbMemory.users) dbMemory.users = DEFAULT_USERS;
      // Enforce the 4 requested categories in catalog
      dbMemory.catalog = DEFAULT_CATALOG;
      if (!dbMemory.customers) dbMemory.customers = [];
      if (!dbMemory.rentals) dbMemory.rentals = [];
      if (!dbMemory.sales) dbMemory.sales = [];
      if (!dbMemory.invoice_sequences) dbMemory.invoice_sequences = { rental: 0, sale: 0 };
      return dbMemory;
    } catch (e) {
      console.error('Error reading JSON db, re-initializing...', e);
    }
  }

  dbMemory = initData();
  saveDb(dbMemory);
  return dbMemory;
}

export function saveDb(data) {
  try {
    dbMemory = data;
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving DB:', err);
    return false;
  }
}

// Generate unique sequential invoice numbers
export function generateInvoiceNumber(type) {
  const db = getDb();
  const settings = db.settings || DEFAULT_SETTINGS;
  const prefix = type === 'rental'
    ? (settings.invoice_prefix_rental || 'ZOX-RENT')
    : (settings.invoice_prefix_sale || 'ZOX-SALE');

  if (!db.invoice_sequences) {
    db.invoice_sequences = { rental: 0, sale: 0 };
  }

  const currentNum = (db.invoice_sequences[type] || 0) + 1;
  db.invoice_sequences[type] = currentNum;
  saveDb(db);

  const numPadded = String(currentNum).padStart(4, '0');
  return `${prefix}-${numPadded}`;
}

export function findOrCreateCustomer(name, phone, address = '') {
  const db = getDb();
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  let customer = db.customers.find(c => c.phone.replace(/\D/g, '') === cleanPhone);

  if (!customer && (name || cleanPhone)) {
    customer = {
      id: Date.now(),
      name: name || 'Customer',
      phone: cleanPhone,
      address: address || '',
      notes: 'In-store client.',
      created_at: new Date().toISOString()
    };
    db.customers.unshift(customer);
    saveDb(db);
  } else if (customer && address && !customer.address) {
    customer.address = address;
    saveDb(db);
  }

  return customer;
}
