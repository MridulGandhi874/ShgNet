import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles/AuthDragon.css";

export default function LoginForm({ onLogin, switchToRegister }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [fetchedUser, setFetchedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.identifier || !form.password) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", form);
      const user = res.data.user;

      if (!user.roles || user.roles.length === 0) {
        toast.error("No active roles associated with this account.");
        return;
      }

      if (user.roles.length === 1) {
        const role = user.roles[0];
        toast.success(`Logged in as ${role}`);
        onLogin(
          { ...user, role },
          { ...form, role } // ✅ Send credentials for refresh
        );
      } else {
        setFetchedUser(user);
        toast.info("Multiple roles found. Please select one.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        ...form,
        role: selectedRole,
      });

      const user = res.data.user;
      toast.success(`Logged in as ${selectedRole}`);
      onLogin(
        { ...user, role: selectedRole },
        { ...form, role: selectedRole } // ✅ Send credentials for refresh
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Role login failed.");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>

      {!fetchedUser && (
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
      )}

      {fetchedUser && fetchedUser.roles.length > 1 && (
        <div className="role-select">
          <label>Select Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">-- Select a role --</option>
            {fetchedUser.roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button onClick={handleRoleSelect}>Continue</button>
        </div>
      )}

      <div className="switch-link">
        Don't have an account?{" "}
        <button type="button" onClick={switchToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
