import React from "react";
import "@styles/components/MedicalHistoryCard.css";

const PatientMedicalHistoryCard = ({ record, onAddPrescription, userRole }) => {
  // fallback robust pentru prescription.content (string sau object)
  let prescription = record.Prescription?.content;
  try {
    prescription = typeof prescription === "string" ? JSON.parse(prescription) : prescription;
  } catch {
    prescription = null;
  }

  const doctorName =
    record.Doctor?.first_name && record.Doctor?.last_name
      ? `${record.Doctor.first_name} ${record.Doctor.last_name}`
      : "Nespecificat";

  const medicamente = Array.isArray(prescription?.meds)
    ? prescription.meds.join(", ")
    : prescription?.meds || "Nespecificat";

  const instructiuni = prescription?.instructions || "Nespecificat";

  return (
    <div className="medical-history-card">
      <p><strong>Adăugată la:</strong> {new Date(record.createdAt).toLocaleDateString("ro-RO")}</p>
      <p><strong>Diagnostic:</strong> {record.diagnosis}</p>
      <p><strong>Observații:</strong> {record.notes}</p>

      <div className="prescription-info-box">
        <p><strong>Doctor:</strong> {doctorName}</p>

        {record.Prescription && (
          <>
            <p><strong>Medicamente:</strong> {medicamente}</p>
            <p><strong>Instrucțiuni:</strong> {instructiuni}</p>
          </>
        )}
      </div>

      {userRole === "doctor" && (
        <button className="small-btn" onClick={() => onAddPrescription(record.id)}>
          Adaugă rețetă
        </button>
      )}
    </div>
  );
};

export default PatientMedicalHistoryCard;
