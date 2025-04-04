import React, { useEffect, useState } from "react";
import { AuthService } from "@services";
import { DoctorNavbar, PatientNavbar } from "@components";

const RoleBasedNavbar = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setRole(user.role);
      } catch (err) {
        console.error("Eroare la determinarea rolului:", err);
      }
    };
    fetchRole();
  }, []);

  if (!role) return null;

  if (role === "doctor") return <DoctorNavbar />;
  if (role === "patient") return <PatientNavbar />;
  return null;
};

export default RoleBasedNavbar;
