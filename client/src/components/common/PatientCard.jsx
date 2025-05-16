import React from "react";
import "@styles/components/PatientCard.css";

const PatientCard = ({ patient, detailView = false, onClick }) => {
  if (detailView) {
    return (
      <div className="patient-card">
        <div className="patient-info-row">
          <span className="info-label">Nume:</span>
          <span className="info-value">{patient.last_name || "Nespecificat"}</span>
        </div>
        <div className="patient-info-row">
          <span className="info-label">Prenume:</span>
          <span className="info-value">{patient.first_name || "Nespecificat"}</span>
        </div>
        <div className="patient-info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{patient.email || "N/A"}</span>
        </div>
        <div className="patient-info-row">
          <span className="info-label">Telefon:</span>
          <span className="info-value">{patient.phone_number || "Nespecificat"}</span>
        </div>
        {patient.cnp && (
          <div className="patient-info-row">
            <span className="info-label">CNP:</span>
            <span className="info-value">{patient.cnp}</span>
          </div>
        )}
        {patient.address && (
          <div className="patient-info-row">
            <span className="info-label">Adresă:</span>
            <span className="info-value">{patient.address}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="patient-row" 
      onClick={onClick} 
      role="button" 
      tabIndex={0} 
      aria-label={`Pacient ${patient.first_name} ${patient.last_name}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <span>{patient.last_name || "Nespecificat"}</span>
      <span>{patient.first_name || "Nespecificat"}</span>
      <span>{patient.email || "N/A"}</span>
      <span>{patient.phone_number || "Nespecificat"}</span>
    </div>
  );
};

export default PatientCard;