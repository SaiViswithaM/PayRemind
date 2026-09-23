import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "signup") {
      // Save demo account in browser
      localStorage.setItem(
        "payremind_user",
        JSON.stringify(formData)
      );

      alert("Account created successfully!");

      // Switch to Login
      setMode("login");
      return;
    }

    // Login
    onLogin();

    // Go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-brand">
          <span className="brand-mark large">P</span>

          <div>
            <h1>PayRemind</h1>
            <p>Business payment manager</p>
          </div>
        </div>

        {/* Login / Signup tabs */}
        <div className="auth-tabs">

          <button
            type="button"
            className={mode === "login" ? "selected" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "signup" ? "selected" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Business name only for signup */}
          {mode === "signup" && (
            <label>
              Business Name

              <input
                type="text"
                name="businessName"
                placeholder="Enter business name"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {/* Email */}
          <label>
            Email

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          {/* Password */}
          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="primary-btn full"
          >
            {mode === "login"
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">

          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="text-btn"
            onClick={() =>
              setMode(
                mode === "login"
                  ? "signup"
                  : "login"
              )
            }
          >
            {mode === "login"
              ? "Sign Up"
              : "Login"}
          </button>

        </p>

      </div>
    </div>
  );
}