// RegisterForm.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles/AuthDragon.css";

export default function RegisterForm({ switchToLogin }) {
  const [form, setForm] = useState({
    username: "",
    identifier: "",
    password: "",
    category: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Form field validation (Frontend)
    if (!form.username || !form.identifier || !form.password || !form.category) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", form);
      toast.success(res.data.message);
      switchToLogin();
    } catch (err) {
      console.log("Registration error:", err.response);
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="auth-box">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Email or Mobile"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Role</option>
          <option value="ngo_admin">NGO Admin</option>
          <option value="shg_leader">SHG Leader</option>
          <option value="shg_member">SHG Member</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <div className="switch-link">
        Already have an account?{" "}
        <button onClick={switchToLogin}>Login</button>
      </div>
    </div>
  );
}
