import React, { useEffect, useState } from "react";
import { AvailabilityService, AppointmentService } from "@services";
import "@styles/layout/Modal.css";;

const AppointmentEditModal = ({ appointmentId, doctorId, onClose, onSuccess }) => {
  const [availability, setAvailability] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await AvailabilityService.getDoctorAvailability(doctorId);
        const filtered = data.filter((slot) => !slot.appointment_id);
        setAvailability(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAvailability();
  }, [doctorId]);

  const handleSubmit = async () => {
    try {
      await AppointmentService.updateAppointment(appointmentId, selectedSlotId);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Eroare la actualizare programare.");
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Selectează un nou interval</h3>
        <div className="slot-list">
          {availability.map((slot) => (
            <button
              key={slot.id}
              className={`slot-btn ${selectedSlotId === slot.id ? "selected" : ""}`}
              onClick={() => setSelectedSlotId(slot.id)}
            >
              {slot.date} | {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
            </button>
          ))}
        </div>

        <div className="edit-actions">
          <button className="btn-confirm" onClick={handleSubmit} disabled={!selectedSlotId}>Confirmă</button>
          <button className="btn-cancel" onClick={onClose}>Anulează</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentEditModal;
