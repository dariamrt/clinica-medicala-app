import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, UserService } from "@services";
import { EditableField, UserProfileCard } from "@components";
import patientAvatar from "@assets/patient-avatar.png";
import "@styles/pages/Dashboard.css";

const DashboardPatient = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({ phone_number: "", address: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        setEditedData({
          phone_number: currentUser.phone_number || "",
          address: currentUser.address || "",
        });
      } catch (error) {
        console.error("Eroare la preluarea utilizatorului:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/");
  };

  const handleSave = async () => {
    try {
      const updated = await UserService.updateUserById(user.id, editedData);
      setUser(prev => ({
        ...prev,
        phone_number: updated.user?.phone_number || prev.phone_number,
        address: updated.user?.address || prev.address,
      }));
      setEditing(false);
    } catch (error) {
      console.error("Eroare la salvare:", error);
    }
  };

  return (
      <div className="dashboard-content">
        <div className="profile-section">
          {user && (
            <UserProfileCard>
              <img src={patientAvatar} alt="Avatar" className="profile-avatar" />
              <h2 className="profile-title">Profilul tău</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
              <p><strong>Nume:</strong> {user.first_name} {user.last_name}</p>

              <EditableField
                label="Telefon"
                value={editedData.phone_number}
                name="phone_number"
                isEditing={editing}
                onChange={e => setEditedData({ ...editedData, phone_number: e.target.value })}
              />

              <EditableField
                label="Adresă"
                value={editedData.address}
                name="address"
                isEditing={editing}
                onChange={e => setEditedData({ ...editedData, address: e.target.value })}
              />

              <button className="profile-btn" onClick={editing ? handleSave : () => setEditing(true)}>
                {editing ? "Salvează" : "Editează"}
              </button>
            </UserProfileCard>
          )}
        </div>

        <div className="welcome-section">
          <h1 className="welcome-title">Bine ai venit, <span>{user?.first_name} {user?.last_name}</span>!</h1>
          <p className="welcome-subtitle">Alege o funcționalitate din meniu pentru a începe.</p>
          <button className="action-button" onClick={() => navigate("/patient/appointments/create")}>
            Fă o programare
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
  );
};

export default DashboardPatient;
