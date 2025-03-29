import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@services";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user.role !== "admin") navigate("/");
        setUser(user);
      } catch (err) {
        navigate("/");
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <h2>Bun venit, {user?.first_name || "admin"}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardAdmin;
