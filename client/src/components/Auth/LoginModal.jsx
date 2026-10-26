import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function LoginModal({ onLoginSuccess, settings }) {
  const [pinInput, setPinInput] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ pin: pinInput });
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Invalid Staff PIN');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ username, password });
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-charcoal border border-charcoal-border p-8 shadow-2xl text-center space-y-6">
        
        {/* Brand Logo & Seal */}
        <div className="w-14 h-14 mx-auto rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <span className="font-serif text-3xl font-bold tracking-widest text-offwhite uppercase block">
            {settings?.store_name || 'ZOX'}
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-champagne block mt-0.5">
            Store Management System
          </span>
          <p className="text-xs text-muted mt-2 font-light">
            Authorized store staff access for offline sales, rentals, and return tracking.
          </p>
        </div>

        {/* PIN Login Form */}
        {!usePassword ? (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-muted mb-1.5">
                Enter Staff PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setError('');
                }}
                placeholder="•••• (Default: 8888)"
                autoFocus
                className="w-full text-center bg-obsidian border border-charcoal-border focus:border-champagne text-offwhite text-lg tracking-widest font-mono py-2.5 rounded focus:outline-none"
              />
              {error && (
                <span className="text-[11px] text-red-400 block mt-1.5 font-mono">
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !pinInput}
              className="w-full py-2.5 bg-champagne hover:bg-champagne-dark text-obsidian font-bold text-xs tracking-widest uppercase transition-colors"
            >
              {loading ? 'Authenticating...' : 'Unlock Store System'}
            </button>

            {/* Quick Demo Unlock */}
            <button
              type="button"
              onClick={() => {
                setPinInput('8888');
                api.login({ pin: '8888' }).then(d => onLoginSuccess(d.user));
              }}
              className="text-xs text-champagne/80 hover:text-champagne font-mono underline block mx-auto"
            >
              [One-Click Quick Staff Unlock]
            </button>
          </form>
        ) : (
          /* Username / Password Form */
          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-obsidian border border-charcoal-border text-offwhite px-3 py-2 text-xs focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-muted mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Default: zox@admin2024"
                className="w-full bg-obsidian border border-charcoal-border text-offwhite px-3 py-2 text-xs focus:outline-none focus:border-champagne"
              />
            </div>
            {error && <span className="text-[11px] text-red-400 block font-mono">{error}</span>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-champagne hover:bg-champagne-dark text-obsidian font-bold text-xs tracking-widest uppercase transition-colors"
            >
              Sign In
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-charcoal-border">
          <button
            type="button"
            onClick={() => setUsePassword(!usePassword)}
            className="text-[11px] text-muted hover:text-offwhite underline"
          >
            {usePassword ? 'Use Staff PIN instead' : 'Sign in with Username & Password'}
          </button>
        </div>

      </div>
    </div>
  );
}
