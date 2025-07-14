import React from "react";
import "@styles/components/AppointmentItem.css";

const DoctorAppointmentItem = ({ appointment }) => {
  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <span className="appointment-label">Pacient:</span>
        <span>{appointment.Patients_Datum?.first_name} {appointment.Patients_Datum?.last_name}</span>
      </div>
      <div className="appointment-info">
        <span className="appointment-label">Email:</span>
        <span>{appointment.Patients_Datum?.User?.email}</span>
      </div>
      <div className="appointment-info">
        <span className="appointment-label">Data:</span>
        <span>{appointment.date}</span>
      </div>
      <div className="appointment-info">
        <span className="appointment-label">Interval:</span>
        <span>{appointment.start_time} - {appointment.end_time}</span>
      </div>
      <div className="appointment-info">
        <span className="appointment-label">Status:</span>
        <span className={`status-badge status-${appointment.status}`}>{appointment.status}</span>
      </div>
    </div>
  );
};

export default DoctorAppointmentItem;