import React from "react";
import "@styles/components/NotificationItem.css";
import { CheckCircle, Trash2 } from "lucide-react";

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  return (
    <div className={`notif-item-wrapper ${!notification.is_read ? "unread" : ""}`}>
      <div className="notif-main">
        <p className="notif-message">{notification.message}</p>
        <div className="notif-actions">
          {!notification.is_read && (
            <button className="notif-btn" onClick={() => onMarkAsRead(notification.id)}>
              <CheckCircle size={18} />
            </button>
          )}
          <button className="notif-btn" onClick={() => onDelete(notification.id)}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
