import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@assets/logo.png";
import "@styles/layout/Navbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <img src={logo} alt="Clinică" className="nav-logo" />
        <span className="nav-title">Admin Panel</span>
      </div>

      <ul className="navbar-links">
        <li><Link to="/dashboard-admin">Acasă</Link></li>
        <li><Link to="/admin/specialties">Specializări</Link></li>
        <li><Link to="/admin/doctors">Doctori</Link></li>
        <li><Link to="/admin/patients">Pacienți</Link></li>
        <li><Link to="/admin/appointments">Programări</Link></li>
        <li><Link to="/admin/add-user">Adaugă utilizator</Link></li>
        <li><Link to="/admin/reports">Rapoarte</Link></li>
      </ul>
    </nav>

  );
};

export default AdminNavbar;
