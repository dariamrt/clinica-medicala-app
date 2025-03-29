import React from "react";
import "@styles/components/MedicalHistoryCard.css";

const MedicalHistoryCard = ({ record, userRole, onAddPrescription }) => {
  return (
    <div className="medical-history-card">
      <p><strong>Data:</strong> {record.date}</p>
      <p><strong>Diagnostic:</strong> {record.diagnosis}</p>
      <p><strong>Observații:</strong> {record.notes}</p>
      {userRole === "doctor" && (
        <button className="small-btn" onClick={() => onAddPrescription(record.id)}>
          Adaugă rețetă
        </button>
      )}
    </div>
  );
};

export default MedicalHistoryCard;
