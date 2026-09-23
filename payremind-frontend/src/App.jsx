import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Management from "./pages/Management";

export default function App() {

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("payremind_auth") === "true"
  );

  const login = () => {
    localStorage.setItem("payremind_auth", "true");
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("payremind_auth");
    setLoggedIn(false);
  };

  return (
    <Routes>

      <Route
        path="/"
        element={
          loggedIn
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={
          <Login onLogin={login} />
        }
      />

      <Route
        path="/dashboard"
        element={
          loggedIn
            ? <Dashboard onLogout={logout} />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/management"
        element={
          loggedIn
            ? <Management onLogout={logout} />
            : <Navigate to="/login" replace />
        }
      />

    </Routes>
  );
}