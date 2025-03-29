import React from "react";
import "@styles/layout/PatientCard.css";

const PatientCard = ({ patient, onClick }) => {
  return (
    <div className="patient-row" onClick={onClick}>
      <span>{patient.last_name}</span>
      <span>{patient.first_name}</span>
      <span>{patient.User?.email || "N/A"}</span>
      <span>{patient.phone || "Nespecificat"}</span>
    </div>
  );
};

export default PatientCard;
