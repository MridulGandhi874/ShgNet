import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SuperAdminDashboard from "./components/dashboards/SuperAdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);

  const afterLogin = (data) => {
    setUser(data);
  };

  return (
    <>
      {user ? (
        user.category === "super_admin" ? (
          <SuperAdminDashboard user={user} />
        ) : (
          <h2 style={{ textAlign: "center", marginTop: "4rem" }}>
            Welcome, {user.username}
          </h2>
        )
      ) : mode === "login" ? (
        <LoginForm
          onLogin={afterLogin}
          switchToRegister={() => setMode("register")}
        />
      ) : (
        <RegisterForm switchToLogin={() => setMode("login")} />
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
