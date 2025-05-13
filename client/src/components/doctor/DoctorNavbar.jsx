import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import logo from "@assets/logo.png";
import { AuthService, NotificationService } from "@services";
import "@styles/layout/Navbar.css";

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await NotificationService.getMyNotifications();
        const unread = notifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Eroare la notificări:", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/");
  };

  return (
      <nav className="navbar">
        <div className="navbar-header">
          <img src={logo} alt="Clinică" className="nav-logo" />
          <span className="nav-title">Doctor Dashboard</span>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>

        <ul className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <li><Link to="/dashboard-doctor" onClick={() => setMenuOpen(false)}>Acasă</Link></li>
          <li><Link to="/doctor/schedule" onClick={() => setMenuOpen(false)}>Program</Link></li>
          <li><Link to="/doctor/patients" onClick={() => setMenuOpen(false)}>Pacienți</Link></li>
          <li><Link to="/specialties" onClick={() => setMenuOpen(false)}>Specializări</Link></li>
          <li>
            <Link to="/notifications" onClick={() => setMenuOpen(false)} className="notif-wrapper">
              <Bell />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </Link>
          </li>
        </ul>
      </nav>
  );
};

export default DoctorNavbar;
