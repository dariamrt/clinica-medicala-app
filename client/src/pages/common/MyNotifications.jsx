import React, { useEffect, useState } from "react";
import { NotificationService } from "@services";
import { NotificationItem, DeleteConfirmModal } from "@components";
import "@styles/pages/NotificationsPage.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
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
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await NotificationService.deleteNotification(notificationToDelete);
      fetchData();
    } catch {
      alert("Eroare la ștergerea notificării!");
    } finally {
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="medical-page-container">
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

        {showDeleteModal && (
          <DeleteConfirmModal
            onCancel={() => {
              setShowDeleteModal(false);
              setNotificationToDelete(null);
            }}
            onConfirm={confirmDelete}
          />
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Înapoi
        </button>
      </div>
    </div>
  );
};

export default MyNotifications;
