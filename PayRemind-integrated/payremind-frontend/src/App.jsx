import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Management from './pages/Management';
import { clearAuth, getToken } from './services/api';

export default function App() {
  const [token, setToken] = useState(getToken());

  const handleLogin = (authData) => {
    localStorage.setItem('payremind_token', authData.token);
    localStorage.setItem('payremind_user', JSON.stringify(authData.user));
    setToken(authData.token);
  };

  const handleLogout = () => {
    clearAuth();
    setToken(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={
        token ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
      } />
      <Route path="/dashboard" element={
        token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
      } />
      <Route path="/management" element={
        token ? <Management onLogout={handleLogout} /> : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
