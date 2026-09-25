import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { dashboardApi, reminderApi } from '../services/api';

const emptyData = {
  stats: { totalAmountDue: 0, dueToday: 0, amountCollected: 0, totalExpenses: 0 },
  reminders: [],
  highDebtCustomers: [],
};

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [data, setData] = useState(emptyData);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      setData(await dashboardApi.get());
    } catch (err) {
      if (err.status === 401) onLogout();
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const sendReminder = async () => {
    if (!selected) return;
    try {
      setSending(true);
      await reminderApi.create({
        customerId: selected.id,
        message: `Payment reminder for ${selected.name}`,
      });
      setSelected(null);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const stats = data.stats;

  return (
    <Layout onLogout={onLogout}>
      <section className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good morning, Admin</h1>
          <p className="muted">Here is today's business summary.</p>
        </div>
      </section>

      {error && <div className="form-error">{error}</div>}

      <div className="stats-grid">
        <StatCard label="Total Amount Due" value={money(stats.totalAmountDue)} icon="₹" />
        <StatCard label="Due Today" value={money(stats.dueToday)} icon="◷" tone="warning" />
        <StatCard label="Amount Collected" value={money(stats.amountCollected)} icon="✓" tone="success" />
        <StatCard label="Total Expenses" value={money(stats.totalExpenses)} icon="−" tone="danger" />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-title">
            <div><h2>Payment Reminders</h2><p className="muted">Customers who need attention</p></div>
            <span className="badge">{data.reminders.length}</span>
          </div>
          {loading ? <p className="muted">Loading...</p> : (
            <div className="reminder-list">
              {data.reminders.length ? data.reminders.map((r) => (
                <div className="reminder-row" key={r.id}>
                  <div><strong>{r.name}</strong><small>{r.status}</small></div>
                  <strong>{money(r.amount)}</strong>
                  <button className="secondary-btn" onClick={() => setSelected(r)}>Remind</button>
                </div>
              )) : <p className="empty">No pending payments.</p>}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-title">
            <div><h2>High Debt Alert</h2><p className="muted">Customers above ₹10,000</p></div>
            <span className="alert-icon">!</span>
          </div>
          {data.highDebtCustomers.length ? data.highDebtCustomers.slice(0, 5).map((customer) => (
            <div className="alert-box" key={customer._id}>
              <strong>{customer.name}</strong>
              <span>Outstanding: {money(customer.due)}</span>
              <button className="text-btn" onClick={() => navigate('/management')}>Manage →</button>
            </div>
          )) : <p className="empty">No customers above the high-debt limit.</p>}

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div>
              <button className="primary-btn" onClick={() => navigate('/management')}>+ Add Customer</button>
              <button className="secondary-btn" onClick={() => navigate('/management')}>+ Record Payment</button>
            </div>
          </div>
        </section>
      </div>

      {selected && <Modal title="Payment Reminder" onClose={() => setSelected(null)}>
        <p>Save a payment reminder for <strong>{selected.name}</strong> for <strong>{money(selected.amount)}</strong>.</p>
        <div className="modal-actions">
          <button className="secondary-btn" onClick={() => setSelected(null)}>Cancel</button>
          <button className="primary-btn" disabled={sending} onClick={sendReminder}>{sending ? 'Saving...' : 'Send Reminder'}</button>
        </div>
      </Modal>}
    </Layout>
  );
}
