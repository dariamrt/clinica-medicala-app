import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@services";

const RedirectToRoleDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user.role === "doctor") navigate("/dashboard-doctor");
        else if (user.role === "patient") navigate("/dashboard-patient");
        else if (user.role === "admin") navigate("/dashboard-admin");
        else navigate("/");
      } catch (err) {
        navigate("/");
      }
    };
    checkUser();
  }, []);

  return <p style={{ textAlign: "center" }}>Se încarcă...</p>;
};

export default RedirectToRoleDashboard;
