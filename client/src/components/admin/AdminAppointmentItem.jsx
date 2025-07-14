import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppointmentService } from "@services";
import { AppointmentEditModal } from "@components"; 
import "@styles/components/AppointmentItem.css";

const AdminAppointmentItem = ({ appointment, onRefresh }) => {
  const [editOpen, setEditOpen] = useState(false);

  const doctorName = appointment.Doctors_Datum
  ? `${appointment.Doctors_Datum.first_name} ${appointment.Doctors_Datum.last_name}`
  : "N/A";

  const doctorEmail = appointment.Doctors_Datum?.User?.email || "N/A";

  const patientName = appointment.Patients_Datum
    ? `${appointment.Patients_Datum.first_name} ${appointment.Patients_Datum.last_name}`
    : "N/A";

  const patientEmail = appointment.Patients_Datum?.User?.email || "N/A";

  const handleCancel = async () => {
    const confirm = window.confirm("Sigur doriți să anulați această programare? Această acțiune este ireversibilă.");
    if (!confirm) return;

    try {
      await AppointmentService.deleteAppointment(appointment.id);
      alert("Programarea a fost anulată cu succes.");
      onRefresh?.();
    } catch {
      alert("A apărut o eroare la anularea programării.");
    }
  };

  return (
    <>
      <div className="appointment-card">
        <div className="appointment-info">
          <span className="appointment-label">Pacient:</span>
          <span><Link to={`/admin/patient/${appointment.patient_id}`}>{patientName}</Link> ({patientEmail})</span>
        </div>
        <div className="appointment-info">
          <span className="appointment-label">Doctor:</span>
          <span>{doctorName} ({doctorEmail})</span>
        </div>
        <div className="appointment-info">
          <span className="appointment-label">Dată:</span>
          <span>{appointment.date}</span>
        </div>
        <div className="appointment-info">
          <span className="appointment-label">Interval:</span>
          <span>{appointment.start_time?.slice(0, 5)} - {appointment.end_time?.slice(0, 5)}</span>
        </div>
        <div className="appointment-info">
          <span className="appointment-label">Status:</span>
          <span className={`status-badge status-${appointment.status}`}>{appointment.status}</span>
        </div>
        
        <div className="appointment-actions">
          <button className="action-btn edit" onClick={() => setEditOpen(true)}>Editează</button>
          <button className="action-btn cancel" onClick={handleCancel}>Anulează</button>
        </div>
      </div>

      {editOpen && (
        <AppointmentEditModal
          appointmentId={appointment.id}
          doctorId={appointment.doctor_id}
          onClose={() => setEditOpen(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

export default AdminAppointmentItem;