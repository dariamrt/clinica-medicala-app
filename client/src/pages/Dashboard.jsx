import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/AuthService";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    navigate("/"); // back to login
  };

  return (
    <div>
      <h1>Bine ai venit în Dashboard!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
