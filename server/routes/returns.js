import express from 'express';
import { getDb, getKolkataDate } from '../database.js';

const router = express.Router();

router.get('/summary', (req, res) => {
  const db = getDb();
  const rentals = db.rentals || [];
  const todayStr = getKolkataDate(0);
  const tomorrowStr = getKolkataDate(1);

  // Helper to calculate days diff
  const getDaysDiff = (dateStr) => {
    const today = new Date(todayStr + 'T00:00:00');
    const target = new Date(dateStr + 'T00:00:00');
    const diffTime = target - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const dueToday = [];
  const dueTomorrow = [];
  const upcoming = [];
  const overdue = [];
  const returned = [];

  rentals.forEach(r => {
    const daysDiff = getDaysDiff(r.rental_end);
    const enriched = {
      ...r,
      days_diff: daysDiff,
      is_overdue: r.status === 'active' && daysDiff < 0,
      days_overdue: daysDiff < 0 ? Math.abs(daysDiff) : 0,
      days_remaining: daysDiff > 0 ? daysDiff : 0
    };

    if (r.status === 'returned') {
      returned.push(enriched);
    } else if (r.status === 'active') {
      if (r.rental_end === todayStr) {
        dueToday.push(enriched);
      } else if (r.rental_end === tomorrowStr) {
        dueTomorrow.push(enriched);
      } else if (r.rental_end < todayStr) {
        overdue.push(enriched);
      } else {
        upcoming.push(enriched);
      }
    }
  });

  // Sort logically:
  // overdue: most overdue first
  overdue.sort((a, b) => a.rental_end.localeCompare(b.rental_end));
  // upcoming: soonest first
  upcoming.sort((a, b) => a.rental_end.localeCompare(b.rental_end));
  // returned: latest returned first
  returned.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  res.json({
    today_date: todayStr,
    counts: {
      due_today: dueToday.length,
      due_tomorrow: dueTomorrow.length,
      upcoming: upcoming.length,
      overdue: overdue.length,
      returned: returned.length,
      total_outstanding: dueToday.length + dueTomorrow.length + upcoming.length + overdue.length
    },
    sections: {
      dueToday,
      dueTomorrow,
      upcoming,
      overdue,
      returned
    }
  });
});

export default router;
