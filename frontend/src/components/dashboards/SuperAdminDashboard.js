import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/DashboardDragon.css";

export default function SuperAdminDashboard({ username, logout }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1 className="center-title">Welcome, {username} (Super Admin)</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/manage-ngo-admins")}>
          <h3>Manage NGO Admins</h3>
          <p>View and remove NGO Admin accounts.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/manage-shg-leaders")}>
          <h3>Manage SHG Leaders</h3>
          <p>View and manage SHG Leader accounts.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/restore-deleted-admins")}>
          <h3>Restore Deleted NGO Admins</h3>
          <p>Restore access to previously removed NGO Admins.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/restore-deleted-leaders")}>
          <h3>Restore Deleted SHG Leaders</h3>
          <p>Restore access to previously removed SHG Leaders.</p>
        </div>
      </div>

      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
