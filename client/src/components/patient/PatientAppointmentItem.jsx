import React, { useState } from "react";
import { cancelAppointment } from "@services/AppointmentService";
import "@styles/components/AppointmentItem.css";

const PatientAppointmentItem = ({ appointment, onCancel }) => {
  const [showModal, setShowModal] = useState(false);
  const doctorName = appointment.Doctors_Datum
    ? `${appointment.Doctors_Datum.first_name} ${appointment.Doctors_Datum.last_name}`
    : "N/A";

  const handleDelete = async () => {
    try {
      await cancelAppointment(appointment.id);
      setShowModal(false);
      if (onCancel) onCancel();
    } catch (err) {
      alert("Eroare la anularea programării.");
    }
  };

  return (
    <div className="appointment-item">
      <div className="appointment-info">
        <p><strong>Doctor:</strong> {doctorName}</p>
        <p><strong>Data:</strong> {appointment.date}</p>
        <p><strong>Ora:</strong> {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
      </div>
      {appointment.status === "confirmed" && (
        <button className="cancel-btn" onClick={() => setShowModal(true)}>Anulează</button>
      )}
      {showModal && (
        <div className="cancel-modal" onClick={() => setShowModal(false)}>
          <div className="cancel-box" onClick={(e) => e.stopPropagation()}>
            <p>Sigur dorești să anulezi programarea cu Dr. {doctorName} din {appointment.date}?</p>
            <p>Acțiunea nu poate fi anulată.</p>
            <div className="cancel-actions">
              <button onClick={handleDelete}>Confirmă anularea</button>
              <button className="cancel-secondary" onClick={() => setShowModal(false)}>Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentItem;
