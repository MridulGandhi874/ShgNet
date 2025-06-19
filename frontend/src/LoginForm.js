import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles/AuthDragon.css";

export default function LoginForm({ onLogin, switchToRegister }) {
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.identifier || !form.password) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", form);
      toast.success(res.data.message || "Login successful!");
      onLogin(res.data.user);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong during login.";
      toast.error(msg);
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Mobile"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
      <div className="switch-link">
        Don't have an account?{" "}
        <button type="button" onClick={switchToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
