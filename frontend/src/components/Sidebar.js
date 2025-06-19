import React, { useState } from "react";

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <div className="sidebar">
      <h3>SHGNet</h3>
      <ul>
        <li>🏠 Dashboard</li>
        <li>📊 Reports</li>
        <li>👥 Members</li>
      </ul>
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
};

export default Sidebar;
