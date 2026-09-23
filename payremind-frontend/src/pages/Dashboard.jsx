import { useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';

const reminders = [
  { id:1, name:'Ravi Kumar', amount:8000, due:'Today', status:'Due today' },
  { id:2, name:'Sita Devi', amount:15000, due:'15 Sep', status:'Overdue' },
  { id:3, name:'Arjun', amount:5000, due:'20 Sep', status:'Upcoming' }
];

export default function Dashboard({ onLogout }) {
  const [selected, setSelected] = useState(null);
  return <Layout onLogout={onLogout}>
    <section className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Good morning, Admin</h1><p className="muted">Here is today's business summary.</p></div></section>
    <div className="stats-grid">
      <StatCard label="Total Amount Due" value="₹85,000" icon="₹" />
      <StatCard label="Due Today" value="₹12,500" icon="◷" tone="warning" />
      <StatCard label="Amount Collected" value="₹50,000" icon="✓" tone="success" />
      <StatCard label="Total Expenses" value="₹20,000" icon="−" tone="danger" />
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-title"><div><h2>Payment Reminders</h2><p className="muted">Customers who need attention</p></div><span className="badge">{reminders.length}</span></div>
        <div className="reminder-list">{reminders.map(r=><div className="reminder-row" key={r.id}><div><strong>{r.name}</strong><small>{r.status}</small></div><strong>₹{r.amount.toLocaleString('en-IN')}</strong><button className="secondary-btn" onClick={()=>setSelected(r)}>Remind</button></div>)}</div>
      </section>
      <section className="panel"><div className="panel-title"><div><h2>High Debt Alert</h2><p className="muted">Customers above ₹10,000</p></div><span className="alert-icon">!</span></div><div className="alert-box"><strong>Sita Devi</strong><span>Outstanding: ₹15,000</span><button className="text-btn" onClick={()=>setSelected(reminders[1])}>View customer →</button></div><div className="quick-actions"><h3>Quick Actions</h3><div><button className="primary-btn" onClick={()=>window.location.href='/management'}>+ Add Customer</button><button className="secondary-btn" onClick={()=>window.location.href='/management'}>+ Record Payment</button></div></div></section>
    </div>
    {selected && <Modal title="Payment Reminder" onClose={()=>setSelected(null)}><p>Send a reminder to <strong>{selected.name}</strong> for <strong>₹{selected.amount.toLocaleString('en-IN')}</strong>.</p><div className="modal-actions"><button className="secondary-btn" onClick={()=>setSelected(null)}>Cancel</button><button className="primary-btn" onClick={()=>setSelected(null)}>Reminder Sent</button></div></Modal>}
  </Layout>;
}
