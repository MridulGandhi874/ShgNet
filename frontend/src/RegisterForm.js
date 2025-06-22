import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles/AuthDragon.css";

export default function RegisterForm({ switchToLogin }) {
  const [form, setForm] = useState({
    username: "",
    identifier: "",
    password: "",
    role: "", // single selected role
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.username || !form.identifier || !form.password || !form.role) {
      toast.error("Please fill out all fields and select a role.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        ...form,
        roles: [form.role], // backend expects an array
      });
      toast.success(res.data.message);
      switchToLogin();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
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
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
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
        <button type="button" onClick={switchToLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
