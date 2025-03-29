import React from "react";
import "@styles/layout/Modal.css";

const DoctorInfoModal = ({ doctor, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{doctor.first_name} {doctor.last_name}</h3>
        <p><strong>Email:</strong> {doctor.User?.email || "N/A"}</p>
        <p><strong>Telefon:</strong> {doctor.phone_number || "N/A"}</p>
        <p><strong>Specializare:</strong> {doctor.Specialty?.name || "N/A"}</p>
        <button onClick={onClose}>Închide</button>
      </div>
    </div>
  );
};

export default DoctorInfoModal;
