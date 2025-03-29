import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NotificationService } from "@services";
import "@styles/layout/Navbar.css";
import logo from "../../assets/logo.png"

const DoctorNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotifs, setLatestNotifs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await NotificationService.getMyNotifications();
        setUnreadCount(notifs.filter((n) => !n.read).length);
        setLatestNotifs(notifs.slice(0, 5));
      } catch (error) {
        console.error("Eroare notificări:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <nav className="doctor-nav">
      <div className="doctor-nav-header">
        <div className="logo-block">
          <img src={logo} alt="Logo" className="nav-logo" />
          <span className="nav-title">Doctor Dashboard</span>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>



      <ul className={`doctor-nav-links ${menuOpen ? "open" : ""}`}>
        <li><NavLink to="/doctor/appointments">Programările mele</NavLink></li>
        <li><NavLink to="/doctor/patients">Pacienții mei</NavLink></li>

        <li
          className="notif-wrapper"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <NavLink to="/notifications" className="notif-link">
            Notificările mele
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </NavLink>

          {dropdownOpen && latestNotifs.length > 0 && (
            <div className="notif-dropdown">
              {latestNotifs.map((n) => (
                <div key={n.id} className={`notif-item ${n.read ? "read" : "unread"}`}>
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-message">{n.message.slice(0, 50)}...</p>
                </div>
              ))}
              <button className="notif-more" onClick={() => navigate("/notifications")}>
                Vezi toate
              </button>
            </div>
          )}
        </li>

        <li><NavLink to="/specialties">Specializări</NavLink></li>
      </ul>
    </nav>
  );
};

export default DoctorNavbar;
