const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('zox_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(payload) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('zox_auth_token', data.token);
      localStorage.setItem('zox_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('zox_auth_token');
    localStorage.removeItem('zox_user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('zox_user');
    return user ? JSON.parse(user) : null;
  },

  // Dashboard
  async getDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Rentals
  async getRentals(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/rentals${query ? `?${query}` : ''}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async getRental(id) {
    const res = await fetch(`${API_BASE}/rentals/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async createRental(data) {
    const res = await fetch(`${API_BASE}/rentals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateRental(id, data) {
    const res = await fetch(`${API_BASE}/rentals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async markRentalReturned(id, returnData) {
    const res = await fetch(`${API_BASE}/rentals/${id}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(returnData)
    });
    return handleResponse(res);
  },

  async updateRentalWhatsApp(id, status) {
    const res = await fetch(`${API_BASE}/rentals/${id}/whatsapp-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async deleteRental(id) {
    const res = await fetch(`${API_BASE}/rentals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Sales (Buyers)
  async getSales(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/sales${query ? `?${query}` : ''}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async getSale(id) {
    const res = await fetch(`${API_BASE}/sales/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async createSale(data) {
    const res = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateSale(id, data) {
    const res = await fetch(`${API_BASE}/sales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateSaleWhatsApp(id, status) {
    const res = await fetch(`${API_BASE}/sales/${id}/whatsapp-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async deleteSale(id) {
    const res = await fetch(`${API_BASE}/sales/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Return Reminders
  async getReturnReminders() {
    const res = await fetch(`${API_BASE}/returns/summary`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Customers
  async getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/customers${query ? `?${query}` : ''}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async getCustomer(id) {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async createCustomer(data) {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateCustomer(id, data) {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Invoices
  async getInvoices(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/invoices${query ? `?${query}` : ''}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async getInvoice(invoiceNumber) {
    const res = await fetch(`${API_BASE}/invoices/${invoiceNumber}`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  // Settings & Catalog
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  },

  async updateSettings(data) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getCatalog() {
    const res = await fetch(`${API_BASE}/settings/catalog`, {
      headers: getAuthHeader()
    });
    return handleResponse(res);
  }
};
