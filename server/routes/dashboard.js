import express from 'express';
import { getDb, getKolkataDate } from '../database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rentals = db.rentals || [];
  const sales = db.sales || [];
  const todayStr = getKolkataDate(0);

  // 1. Today's Sales (money received from sales today + total sale value today)
  const salesToday = sales.filter(s => s.created_at.startsWith(todayStr));
  const todaySalesAmount = salesToday.reduce((sum, s) => sum + s.total_amount, 0);
  const todaySalesReceived = salesToday.reduce((sum, s) => sum + s.amount_paid, 0);

  // 2. Active Rentals
  const activeRentals = rentals.filter(r => r.status === 'active');
  const activeRentalsCount = activeRentals.length;

  // 3. Returns Due Today
  const returnsDueTodayList = rentals.filter(r => r.status === 'active' && r.rental_end === todayStr);
  const returnsDueTodayCount = returnsDueTodayList.length;

  // 4. Pending Rental Returns (Overdue)
  const overdueReturnsList = rentals.filter(r => r.status === 'active' && r.rental_end < todayStr);
  const pendingRentalReturnsCount = overdueReturnsList.length;

  // Broader Financial Metrics for Reports:
  const totalSaleValue = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalRentalCharges = rentals.reduce((sum, r) => sum + r.total_amount, 0);
  const totalMoneyReceived =
    sales.reduce((sum, s) => sum + s.amount_paid, 0) +
    rentals.reduce((sum, r) => sum + r.amount_paid, 0);
  const totalPendingBalances =
    sales.reduce((sum, s) => sum + s.pending_amount, 0) +
    rentals.reduce((sum, r) => sum + r.pending_amount, 0);
  const totalRefundableDepositsHeld = activeRentals.reduce((sum, r) => sum + (r.security_deposit || 0), 0);

  // Recent Sales (top 5)
  const recentSales = [...sales].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  // Recent Rentals (top 5)
  const recentRentals = [...rentals].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  // Recent Invoices (top 5 combined)
  const recentInvoices = [
    ...rentals.map(r => ({
      invoice_number: r.invoice_number,
      type: 'Rental',
      customer_name: r.customer_name,
      customer_phone: r.customer_phone,
      date: r.rental_start,
      amount: r.total_amount,
      paid: r.amount_paid,
      pending: r.pending_amount,
      payment_status: r.pending_amount === 0 ? 'paid' : r.amount_paid > 0 ? 'partially_paid' : 'pending',
      whatsapp_status: r.whatsapp_status,
      created_at: r.created_at
    })),
    ...sales.map(s => ({
      invoice_number: s.invoice_number,
      type: 'Sale',
      customer_name: s.customer_name,
      customer_phone: s.customer_phone,
      date: s.created_at.split('T')[0],
      amount: s.total_amount,
      paid: s.amount_paid,
      pending: s.pending_amount,
      payment_status: s.payment_status,
      whatsapp_status: s.whatsapp_status,
      created_at: s.created_at
    }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);

  res.json({
    today_date: todayStr,
    stats: {
      todaySales: todaySalesAmount,
      todaySalesReceived,
      activeRentals: activeRentalsCount,
      returnsDueToday: returnsDueTodayCount,
      pendingRentalReturns: pendingRentalReturnsCount,
      totalSaleValue,
      totalRentalCharges,
      totalMoneyReceived,
      totalPendingBalances,
      totalRefundableDepositsHeld
    },
    activities: {
      recentSales,
      recentRentals,
      dueTodayCustomers: returnsDueTodayList,
      overdueReturns: overdueReturnsList,
      recentInvoices
    }
  });
});

export default router;
