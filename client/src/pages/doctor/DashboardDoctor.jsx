import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, UserService } from "@services";
import { DoctorNavbar, EditableField, UserProfileCard } from "@components";
import doctorAvatar from "../../assets/doctor-avatar.png";
import "@styles/pages/DashboardDoctor.css";

const DashboardDoctor = () => {
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
        setEditedData({
          phone_number: currentUser.phone_number || "",
          address: currentUser.address || ""
        });
      } catch (err) {
        console.error("Eroare la preluarea utilizatorului:", err);
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

  const handleSave = async () => {
    try {
      const updated = await UserService.updateUserById(user.id, {
        phone_number: editedData.phone_number,
        address: editedData.address
      });

      setUser((prev) => ({
        ...prev,
        phone_number: updated.user?.phone_number || prev.phone_number,
        address: updated.user?.address || prev.address
      }));
      setEditing(false);
    } catch (error) {
      console.error("Eroare la actualizare:", error);
    }
  };

  return (
    <div className="doctor-dashboard">
      <DoctorNavbar />

      <div className="doctor-dashboard-main">
        <div className="profile-side">
          {user && (
            <UserProfileCard>
              <img className="profile-avatar" src={doctorAvatar} alt="Avatar" />
              <h2 className="profile-title">Profilul tău</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
              <p><strong>Nume:</strong> {user.first_name} {user.last_name}</p>

              {editing ? (
                <EditableField
                  label="Telefon"
                  value={editedData.phone_number}
                  name="phone_number"
                  isEditing={true}
                  onChange={(e) =>
                    setEditedData({ ...editedData, [e.target.name]: e.target.value })
                  }
                />
              ) : (
                <p>
                  <strong>Telefon:</strong> {user.phone_number || "N/A"}
                </p>
              )}

              <p><strong>Specialitate:</strong> {user.specialty || "N/A"}</p>

              {editing ? (
                <button className="profile-btn" onClick={handleSave}>Salvează</button>
              ) : (
                <button className="profile-btn" onClick={() => setEditing(true)}>Editează</button>
              )}
            </UserProfileCard>
          )}
        </div>

        <div className="welcome-side">
          <h1>
            Bine ai venit, Dr.{" "}
            <span className="highlighted-name">
              {user?.first_name} {user?.last_name}
            </span>
            !
          </h1>
          <p>Alege o funcționalitate din meniu pentru a începe.</p>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctor;
