import React, { useEffect, useState } from "react";
import { NotificationService } from "@services";
import { NotificationItem } from "@components";
import "@styles/pages/NotificationsPage.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await NotificationService.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Eroare la încărcarea notificărilor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      fetchData();
    } catch {
      alert("Eroare la marcare ca citit!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ești sigur(ă) că vrei să ștergi această notificare?")) return;
    try {
      await NotificationService.deleteNotification(id);
      fetchData();
    } catch {
      alert("Eroare la ștergerea notificării!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="notifications-page">
        <h2 className="page-title">Notificările mele</h2>

        {loading ? (
          <p className="status-text">Se încarcă notificările...</p>
        ) : notifications.length === 0 ? (
          <p className="status-text">Nu ai notificări.</p>
        ) : (
          <div className="notification-list">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default MyNotifications;
