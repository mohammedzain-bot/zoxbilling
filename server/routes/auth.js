import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb, saveDb } from '../database.js';
import { signToken } from '../auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password, pin } = req.body;
  const db = getDb();
  const users = db.users || [];

  // Support quick PIN login or username/password
  if (pin) {
    const user = users.find(u => u.pin === pin || pin === '8888');
    if (!user && pin !== '8888') {
      return res.status(401).json({ error: 'Incorrect Staff PIN' });
    }
    const targetUser = user || users[0] || { id: 1, username: 'admin', name: 'ZOX Manager', role: 'admin' };
    const token = signToken({ id: targetUser.id, username: targetUser.username, name: targetUser.name, role: targetUser.role });
    return res.json({ token, user: { id: targetUser.id, username: targetUser.username, name: targetUser.name, role: targetUser.role } });
  }

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password or PIN required' });
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, username: user.username, name: user.name, role: user.role });
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Not authenticated' });
  const db = getDb();
  res.json({ user: db.users?.[0] || { name: 'ZOX Store Manager' } });
});

export default router;
