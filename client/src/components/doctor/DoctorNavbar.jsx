import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import logo from "@assets/logo.png";
import { AuthService, NotificationService } from "@services";
import "@styles/layout/Navbar.css";

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

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

      <ul className="navbar-links">
        <li><Link to="/dashboard-doctor">Acasă</Link></li>
        <li><Link to="/doctor/appointments">Programări</Link></li>
        <li><Link to="/doctor/patients">Pacienți</Link></li>
        <li><Link to="/specialties">Specializări</Link></li>
        <li className="notif-wrapper">
          <Link to="/notifications">
            <Bell />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DoctorNavbar;
