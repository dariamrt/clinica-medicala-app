import React from "react";
import "@styles/layout/DoctorCard.css";

const DoctorCard = ({ doctor, showEmail = false, showPhone = false, onClick }) => {
  const fullName = `${doctor.first_name} ${doctor.last_name}`;

  return (
    <div className="doctor-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <h3 className="doctor-name">{fullName}</h3>
      <p className="doctor-specialty"><strong>Specializare:</strong> {doctor.specialty_name || doctor.specialty?.name || "Nespecificat"}</p>
      {showEmail && <p className="doctor-email"><strong>Email:</strong> {doctor.email || doctor?.User?.email || "N/A"}</p>}
      {showPhone && <p className="doctor-phone"><strong>Telefon:</strong> {doctor.phone_number || "N/A"}</p>}
    </div>
  );
};

export default DoctorCard;
