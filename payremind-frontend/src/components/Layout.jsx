import { NavLink, useNavigate } from 'react-router-dom';

export default function Layout({ children, onLogout }) {
  const navigate = useNavigate();
  const logout = () => { onLogout(); navigate('/login'); };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">P</span><span>PayRemind</span></div>
        <nav className="nav-list">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>⌂ <span>Dashboard</span></NavLink>
          <NavLink to="/management" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>▦ <span>Management</span></NavLink>
        </nav>
        <button className="logout-btn" onClick={logout}>↪ <span>Logout</span></button>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="mobile-brand">PayRemind</div><div className="top-actions"><span className="notification">🔔</span><div className="avatar">A</div><span>Admin</span></div></header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
