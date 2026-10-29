import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.join(__dirname, 'zox_store.json');
const VERCEL_DB_PATH = path.join('/tmp', 'zox_store.json');
const DB_PATH = process.env.VERCEL ? VERCEL_DB_PATH : LOCAL_DB_PATH;

// Supabase Cloud Database Client (Optional, active when environment variables are set)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

let dbMemory = null;
let lastSyncTime = 0;
const SYNC_INTERVAL_MS = 3000; // 3 seconds in-memory cache to minimize latency

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
  return {
    settings: DEFAULT_SETTINGS,
    users: DEFAULT_USERS,
    catalog: DEFAULT_CATALOG,
    customers: [],
    rentals: [],
    sales: [],
    invoice_sequences: {
      rental: 0,
      sale: 0
    }
  };
}

export async function initOrSyncDb(force = false) {
  const now = Date.now();
  if (!force && dbMemory && (now - lastSyncTime < SYNC_INTERVAL_MS)) {
    return dbMemory;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('zox_store')
        .select('data')
        .eq('id', 'main')
        .single();

      if (data && data.data) {
        dbMemory = data.data;
        lastSyncTime = now;
        return dbMemory;
      } else if (error && (error.code === 'PGRST116' || error.message?.includes('0 rows'))) {
        // Table exists but is empty; seed with clean data
        const initial = initData();
        await supabase.from('zox_store').upsert({ id: 'main', data: initial, updated_at: new Date().toISOString() });
        dbMemory = initial;
        lastSyncTime = now;
        return dbMemory;
      }
    } catch (err) {
      console.warn('Supabase sync warning, using local file cache:', err.message);
    }
  }

  return getDb();
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
      dbMemory.catalog = DEFAULT_CATALOG;
      if (!dbMemory.customers) dbMemory.customers = [];
      if (!dbMemory.rentals) dbMemory.rentals = [];
      if (!dbMemory.sales) dbMemory.sales = [];
      if (!dbMemory.invoice_sequences) dbMemory.invoice_sequences = { rental: 0, sale: 0 };
      lastSyncTime = Date.now();
      return dbMemory;
    } catch (e) {
      console.error('Error reading JSON db, re-initializing...', e);
    }
  }

  dbMemory = initData();
  saveDb(dbMemory);
  lastSyncTime = Date.now();
  return dbMemory;
}

export async function saveDb(data) {
  try {
    dbMemory = data;
    lastSyncTime = Date.now();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local DB:', err);
  }

  if (supabase) {
    try {
      await supabase
        .from('zox_store')
        .upsert({ id: 'main', data, updated_at: new Date().toISOString() });
    } catch (err) {
      console.error('Error saving to Supabase:', err.message);
    }
  }

  return true;
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
