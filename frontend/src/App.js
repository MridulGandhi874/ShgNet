import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SuperAdminDashboard from "./components/dashboards/SuperAdminDashboard";
import ManageNgoAdmins from "./components/dashboards/ManageNgoAdmins";
import ManageShgLeaders from "./components/dashboards/ManageShgLeaders";
import RestoreDeletedAdmins from "./components/dashboards/RestoreDeletedAdmins";
import RestoreDeletedShgLeaders from "./components/dashboards/RestoreDeletedShgLeaders";
import NGOAdminDashboard from "./components/dashboards/NGOAdminDashboard";
import NgoAdminProfileForm from "./components/dashboards/NgoAdminProfileForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function App() {
  const [user, setUser] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);
  const [mode, setMode] = useState("login");

  const afterLogin = (userData) => {
    setUser(userData);
    setAuthInfo({
      identifier: userData.identifier,
      password: userData.password, // temporarily assume it's included, else update LoginForm to pass it
      role: userData.role || userData.roles?.[0],
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAuthInfo(null);
    setMode("login");
  };

  const refreshUserProfile = async () => {
    if (!authInfo) return;
    try {
      const res = await axios.post("http://localhost:5000/login", authInfo);
      setUser(res.data.user);
    } catch {
      handleLogout();
    }
  };

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        {!user ? (
          <Route
            path="/"
            element={
              mode === "login" ? (
                <LoginForm
                  onLogin={afterLogin}
                  switchToRegister={() => setMode("register")}
                />
              ) : (
                <RegisterForm switchToLogin={() => setMode("login")} />
              )
            }
          />
        ) : user.roles?.includes("super_admin") ? (
          <>
            <Route path="/" element={<SuperAdminDashboard username={user.username} logout={handleLogout} />} />
            <Route path="/manage-ngo-admins" element={<ManageNgoAdmins />} />
            <Route path="/manage-shg-leaders" element={<ManageShgLeaders />} />
            <Route path="/restore-deleted-admins" element={<RestoreDeletedAdmins />} />
            <Route path="/restore-deleted-leaders" element={<RestoreDeletedShgLeaders />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : user.roles?.includes("ngo_admin") ? (
          <Route
            path="/"
            element={
              user && user.profile_filled !== undefined ? (
                user.profile_filled ? (
                  <NGOAdminDashboard username={user.username} logout={handleLogout} />
                ) : (
                  <NgoAdminProfileForm user={user} onProfileSubmit={refreshUserProfile} />
                )
              ) : (
                <div style={{ textAlign: "center", marginTop: "4rem" }}>
                  Loading...
                </div>
              )
            }
          />
        ) : (
          <Route
            path="/"
            element={
              <h2 style={{ textAlign: "center", marginTop: "4rem" }}>
                Welcome, {user.username}
              </h2>
            }
          />
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
