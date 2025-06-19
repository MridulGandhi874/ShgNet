import React from "react";
import "../../styles/DashboardDragon.css";

export default function SuperAdminDashboard({ user }) {
  return (
    <div className="dashboard">
      <h1>Welcome, {user.username} (Super Admin)</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Manage NGO Admins</h3>
          <p>Add, view, and remove regional coordinators.</p>
        </div>
        <div className="dashboard-card">
          <h3>View Reports</h3>
          <p>Access SHG performance, funding analytics and state-wide data.</p>
        </div>
        <div className="dashboard-card">
          <h3>Approve Local Events</h3>
          <p>Approve health camps, skill training, and other programs.</p>
        </div>
        <div className="dashboard-card">
          <h3>Set AI Rules</h3>
          <p>Define custom AI filters for fund allocation and prioritization.</p>
        </div>
      </div>
    </div>
  );
}
