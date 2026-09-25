const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('payremind_token');

export const clearAuth = () => {
  localStorage.removeItem('payremind_token');
  localStorage.removeItem('payremind_user');
};

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = data?.message || 'Something went wrong. Please try again.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (payload) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  me: () => request('/auth/me'),
};

const crud = (resource) => ({
  list: () => request(`/${resource}`),
  create: (payload) => request(`/${resource}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  update: (id, payload) => request(`/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  remove: (id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
});

export const customerApi = crud('customers');
export const paymentApi = crud('payments');
export const productApi = crud('products');
export const expenseApi = crud('expenses');
export const reminderApi = crud('reminders');

export const dashboardApi = {
  get: () => request('/dashboard'),
};
