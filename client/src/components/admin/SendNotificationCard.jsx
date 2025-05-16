import React, { useEffect, useState } from "react";
import { NotificationService, UserService } from "@services";


const SendNotificationCard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await UserService.getAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (error) {
        console.error("Eroare la obtinerea userilor:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(lowerTerm) ||
          u.email.toLowerCase().includes(lowerTerm)
      )
    );
  }, [searchTerm, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserIds.length || !message.trim()) return;

    try {
      for (let userId of selectedUserIds) {
        await NotificationService.sendNotification({
          user_id: userId,
          message,
        });
      }
      setMessage("");
      setSelectedUserIds([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      alert("Eroare la trimiterea notificării!");
    }
  };

  return (
    <div className="notification-card">
      <h3>Trimite notificare</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Caută numele sau emailul..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>Utilizatori:</label>
        <select
          multiple
          value={selectedUserIds}
          onChange={(e) =>
            setSelectedUserIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
        >
        {filteredUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name} ({u.email})
            </option>
          ))}
        </select>

        <label>Mesaj:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Scrie mesajul aici..."
        />

        <button type="submit">Trimite notificarea</button>
        {success && <p className="success-msg">Notificările au fost trimise!</p>}
      </form>
    </div>
  );
};

export default SendNotificationCard;
