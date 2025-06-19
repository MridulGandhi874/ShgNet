import React from "react";

const Navbar = ({ username, onLogout }) => {
  return (
    <div className="navbar">
      <span className="user-email">👋 Hello, {username}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
