import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@services";
import { UserProfileCard, SendNotificationCard } from "@components";
import "@styles/pages/Dashboard.css"; 

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Eroare la preluat user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content two-column-layout">
        <div className="left-panel">
          {user && (
            <UserProfileCard>
              <h2 className="profile-title">Profilul tău</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
            </UserProfileCard>
          )}
        </div>

        <div className="right-panel">
          <h1>
            Bine ai venit, Admine {" "}
            <span className="highlighted-name">
              {user?.first_name} {user?.last_name}
            </span>
            !
          </h1>
          <p>Alege o funcționalitate din meniu pentru a începe.</p>
          <SendNotificationCard />

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
