import React from "react";
import "@styles/components/AppointmentItem.css";

const PatientAppointmentItem = ({ doctorName, date, time, status }) => {
  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <span className="appointment-label">Doctor:</span>
        <span>{doctorName}</span>
      </div>
      <div className="appointment-info">
        <span className="appointment-label">Data:</span>
        <span>{date}</span>
      </div>
      <div className="appointment-info">
        <span className="appointment-label">Interval:</span>
        <span>{time}</span>
      </div>
      <div className="appointment-info">
        <span className="appointment-label">Status:</span>
        <span className={`appointment-status ${status}`}>{status}</span>
      </div>
    </div>
  );
};

export default PatientAppointmentItem;
