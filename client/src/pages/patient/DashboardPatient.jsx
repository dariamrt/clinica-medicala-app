import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@services";

const DashboardPatient = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user.role !== "patient") navigate("/");
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
      <h1>Dashboard Patient</h1>
      <h2>Bun venit, {user?.first_name || "utilizator"}!</h2>
      <p>Aici vei putea vedea programările și fișele tale medicale.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPatient;
