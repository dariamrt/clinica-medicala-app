import React from "react";
import "@styles/components/AppointmentItem.css";

const AppointmentItem = ({ appointment }) => {
  const patient = appointment.Patients_Datum;
  const fullName = `${patient?.first_name || "N/A"} ${patient?.last_name || ""}`;
  const email = patient?.User?.email || "N/A";

  return (
    <div className="appointment-item">
      <div className="appointment-row">
        <span className="label">Nume:</span>
        <span>{fullName}</span>
      </div>
      <div className="appointment-row">
        <span className="label">Email:</span>
        <span>{email}</span>
      </div>
      <div className="appointment-row">
        <span className="label">Data:</span>
        <span>{appointment.date}</span>
      </div>
      <div className="appointment-row">
        <span className="label">Interval:</span>
        <span>{appointment.start_time} – {appointment.end_time}</span>
      </div>
      <div className="appointment-row">
        <span className="label">Status:</span>
        <span className={`status ${appointment.status.toLowerCase()}`}>
          {appointment.status}
        </span>
      </div>
    </div>
  );
};

export default AppointmentItem;
