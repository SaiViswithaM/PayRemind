import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { customerApi, expenseApi, paymentApi, productApi, reminderApi } from '../services/api';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function Management({ onLogout }) {
  const [tab, setTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [customerData, paymentData, productData, expenseData] = await Promise.all([
        customerApi.list(), paymentApi.list(), productApi.list(), expenseApi.list()
      ]);
      setCustomers(customerData);
      setPayments(paymentData);
      setProducts(productData);
      setExpenses(expenseData);
    } catch (err) {
      if (err.status === 401) onLogout();
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [customers, search]);

  const closeModal = () => { setModal(null); setEditing(null); };

  const showError = (err) => {
    if (err.status === 401) onLogout();
    else setError(err.message);
  };

  const submitCustomer = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const payload = { name: f.get('name'), phone: f.get('phone'), due: Number(f.get('due') || 0) };
    try {
      if (editing) await customerApi.update(editing._id, payload);
      else await customerApi.create(payload);
      closeModal();
      await loadAll();
    } catch (err) { showError(err); }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const payload = { name: f.get('name'), brand: f.get('brand'), qty: Number(f.get('qty') || 0), price: Number(f.get('price') || 0) };
    try {
      if (editing) await productApi.update(editing._id, payload);
      else await productApi.create(payload);
      closeModal();
      await loadAll();
    } catch (err) { showError(err); }
  };

  const submitExpense = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const payload = { date: f.get('date'), description: f.get('description'), category: f.get('category'), amount: Number(f.get('amount') || 0) };
    try {
      if (editing) await expenseApi.update(editing._id, payload);
      else await expenseApi.create(payload);
      closeModal();
      await loadAll();
    } catch (err) { showError(err); }
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const payload = {
      customerId: f.get('customerId'),
      amount: Number(f.get('amount') || 0),
      dueDate: f.get('dueDate') || undefined,
      paidAmount: Number(f.get('paidAmount') || 0),
      note: f.get('note') || ''
    };
    try {
      if (editing) await paymentApi.update(editing._id, payload);
      else await paymentApi.create(payload);
      closeModal();
      await loadAll();
    } catch (err) { showError(err); }
  };

  const deleteItem = async (api, id, label) => {
    if (!window.confirm(`Delete this ${label}?`)) return;
    try { await api.remove(id); await loadAll(); } catch (err) { showError(err); }
  };

  const sendReminder = async (customer) => {
    try {
      await reminderApi.create({ customerId: customer._id, message: `Payment reminder for ${customer.name}` });
      alert('Reminder saved successfully.');
    } catch (err) { showError(err); }
  };

  const markPaid = async (payment) => {
    try {
      await paymentApi.update(payment._id, { paidAmount: payment.amount });
      await loadAll();
    } catch (err) { showError(err); }
  };

  return (
    <Layout onLogout={onLogout}>
      <section className="page-heading">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h1>Business Management</h1>
          <p className="muted">Manage customers, payments, products and expenses in one place.</p>
        </div>
      </section>

      {error && <div className="form-error">{error}</div>}

      <div className="tabs">
        {['customers', 'payments', 'products', 'expenses'].map((t) => (
          <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <section className="panel table-panel">
        {loading ? <p className="muted">Loading your business data...</p> : <>
          {tab === 'customers' && <>
            <div className="panel-title">
              <div><h2>Customers</h2><p className="muted">Track customer balances and reminders.</p></div>
              <button className="primary-btn" onClick={() => setModal('customer')}>+ Add Customer</button>
            </div>
            <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer..." />
            <Table headers={['Name', 'Phone', 'Due', 'Status', 'Actions']} rows={filteredCustomers.map((c) => [
              <strong>{c.name}</strong>, c.phone, money(c.due), <span className={`status ${c.status.toLowerCase()}`}>{c.status}</span>,
              <div className="row-actions">
                <a href={`tel:${c.phone}`}>📞</a>
                {c.due > 0 && <button title="Send reminder" onClick={() => sendReminder(c)}>🔔</button>}
                <button title="Edit" onClick={() => { setEditing(c); setModal('customer'); }}>✏️</button>
                <button title="Delete" onClick={() => deleteItem(customerApi, c._id, 'customer')}>🗑️</button>
              </div>
            ])} />
          </>}

          {tab === 'payments' && <>
            <div className="panel-title">
              <div><h2>Payments</h2><p className="muted">Record and track customer payments.</p></div>
              <button className="primary-btn" onClick={() => setModal('payment')}>+ Record Payment</button>
            </div>
            <Table headers={['Customer', 'Amount', 'Paid', 'Due Date', 'Status', 'Action']} rows={payments.map((p) => [
              p.customer?.name || 'Unknown', money(p.amount), money(p.paidAmount), p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-IN') : '—',
              <span className={`status ${p.status.toLowerCase()}`}>{p.status}</span>,
              <div className="row-actions">
                {p.status !== 'Paid' && <button className="secondary-btn small" onClick={() => markPaid(p)}>Mark Paid</button>}
                <button title="Edit" onClick={() => { setEditing(p); setModal('payment'); }}>✏️</button>
                <button title="Delete" onClick={() => deleteItem(paymentApi, p._id, 'payment')}>🗑️</button>
              </div>
            ])} />
          </>}

          {tab === 'products' && <>
            <div className="panel-title">
              <div><h2>Products</h2><p className="muted">Keep a simple product list.</p></div>
              <button className="primary-btn" onClick={() => setModal('product')}>+ Add Product</button>
            </div>
            <Table headers={['Product', 'Brand', 'Quantity', 'Price', 'Action']} rows={products.map((p) => [
              p.name, p.brand, p.qty, money(p.price), <div className="row-actions"><button onClick={() => { setEditing(p); setModal('product'); }}>✏️</button><button onClick={() => deleteItem(productApi, p._id, 'product')}>🗑️</button></div>
            ])} />
          </>}

          {tab === 'expenses' && <>
            <div className="panel-title">
              <div><h2>Expenses</h2><p className="muted">Record essential business expenses.</p></div>
              <button className="primary-btn" onClick={() => setModal('expense')}>+ Add Expense</button>
            </div>
            <div className="expense-total">Total Expenses: <strong>{money(expenses.reduce((a, b) => a + Number(b.amount || 0), 0))}</strong></div>
            <Table headers={['Date', 'Description', 'Category', 'Amount', 'Action']} rows={expenses.map((x) => [
              x.date, x.description, x.category, money(x.amount), <div className="row-actions"><button onClick={() => { setEditing(x); setModal('expense'); }}>✏️</button><button onClick={() => deleteItem(expenseApi, x._id, 'expense')}>🗑️</button></div>
            ])} />
          </>}
        </>}
      </section>

      {modal === 'customer' && <Modal title={editing ? 'Edit Customer' : 'Add Customer'} onClose={closeModal}>
        <form className="modal-form" onSubmit={submitCustomer}>
          <label>Name<input name="name" defaultValue={editing?.name || ''} required /></label>
          <label>Phone<input name="phone" defaultValue={editing?.phone || ''} required /></label>
          <label>Amount Due<input name="due" type="number" min="0" defaultValue={editing?.due ?? 0} required /></label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn">Save Customer</button></div>
        </form>
      </Modal>}

      {modal === 'payment' && <Modal title={editing ? 'Edit Payment' : 'Record Payment'} onClose={closeModal}>
        <form className="modal-form" onSubmit={submitPayment}>
          <label>Customer
            <select name="customerId" defaultValue={editing?.customer?._id || editing?.customer || ''} required>
              <option value="">Select customer</option>
              {customers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>
          <label>Total Amount<input name="amount" type="number" min="0" defaultValue={editing?.amount ?? ''} required /></label>
          <label>Paid Amount<input name="paidAmount" type="number" min="0" defaultValue={editing?.paidAmount ?? 0} required /></label>
          <label>Due Date<input name="dueDate" type="date" defaultValue={editing?.dueDate ? new Date(editing.dueDate).toISOString().slice(0, 10) : ''} /></label>
          <label>Note<input name="note" defaultValue={editing?.note || ''} placeholder="Optional" /></label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn">Save Payment</button></div>
        </form>
      </Modal>}

      {modal === 'product' && <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={closeModal}>
        <form className="modal-form" onSubmit={submitProduct}>
          <label>Product<input name="name" defaultValue={editing?.name || ''} required /></label>
          <label>Brand<input name="brand" defaultValue={editing?.brand || ''} required /></label>
          <label>Quantity<input name="qty" type="number" min="0" defaultValue={editing?.qty ?? 0} required /></label>
          <label>Price<input name="price" type="number" min="0" defaultValue={editing?.price ?? 0} required /></label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn">Save Product</button></div>
        </form>
      </Modal>}

      {modal === 'expense' && <Modal title={editing ? 'Edit Expense' : 'Add Expense'} onClose={closeModal}>
        <form className="modal-form" onSubmit={submitExpense}>
          <label>Date<input name="date" type="date" defaultValue={editing?.date || ''} required /></label>
          <label>Description<input name="description" defaultValue={editing?.description || ''} required /></label>
          <label>Category<input name="category" defaultValue={editing?.category || ''} required /></label>
          <label>Amount<input name="amount" type="number" min="0" defaultValue={editing?.amount ?? 0} required /></label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn">Save Expense</button></div>
        </form>
      </Modal>}
    </Layout>
  );
}

function Table({ headers, rows }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.length ? rows.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>) : <tr><td colSpan={headers.length} className="empty">No records found.</td></tr>}</tbody></table></div>;
}
