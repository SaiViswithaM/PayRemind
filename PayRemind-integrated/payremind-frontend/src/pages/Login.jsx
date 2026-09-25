import { useState } from 'react';
import { authApi } from '../services/api';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ businessName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = mode === 'login'
        ? await authApi.login({ email: formData.email, password: formData.password })
        : await authApi.register(formData);

      onLogin(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark large">P</span>
          <div>
            <h1>PayRemind</h1>
            <p>Business payment manager</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => switchMode('login')}>Login</button>
          <button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => switchMode('signup')}>Sign Up</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Business Name
              <input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter business name" required />
            </label>
          )}

          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" minLength={6} required />
          </label>

          <button type="submit" className="primary-btn full" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="text-btn" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
