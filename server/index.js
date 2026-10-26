import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { getDb } from './database.js';
import authRoutes from './routes/auth.js';
import rentalsRoutes from './routes/rentals.js';
import salesRoutes from './routes/sales.js';
import returnsRoutes from './routes/returns.js';
import customersRoutes from './routes/customers.js';
import invoicesRoutes from './routes/invoices.js';
import dashboardRoutes from './routes/dashboard.js';
import settingsRoutes from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database
getDb();

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ZOX Store Management API', timestamp: new Date().toISOString() });
});

// Serve client build if available
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ZOX Store Management Server running on port ${PORT}`);
  });
}

export default app;
