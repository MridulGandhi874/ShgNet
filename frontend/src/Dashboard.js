import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";

const Dashboard = ({ username, onLogout }) => {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar username={username} onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Welcome, {username}</h2>
          <p>This is your SHGNet dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
