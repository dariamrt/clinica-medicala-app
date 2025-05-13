import React from "react";
import "@styles/components/PatientCard.css";

const PatientCard = ({ patient, onClick }) => {
  return (
    <div className="patient-row" onClick={onClick}>
      <span>{patient.last_name}</span>
      <span>{patient.first_name}</span>
      <span>{patient.email || "N/A"}</span>
      <span>{patient.phone_number || "Nespecificat"}</span>
    </div>
  );
};

export default PatientCard;
