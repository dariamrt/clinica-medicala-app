import "@styles/components/MedicalHistoryCard.css";

const PatientMedicalHistoryCard = ({ record, onAddPrescription, userRole }) => {
  let prescription = record.Prescription?.content;
  try {
    prescription = typeof prescription === "string" ? JSON.parse(prescription) : prescription;
  } catch {
    prescription = null;
  }

  console.log(record)
  const doctorName =
    record.Doctor?.first_name && record.Doctor?.last_name
      ? `${record.Doctor.first_name} ${record.Doctor.last_name}`
      : "Nespecificat";

  const medicamente = Array.isArray(prescription?.meds)
    ? prescription.meds
    : prescription?.meds ? [prescription.meds] : [];

  const instructiuni = prescription?.instructions || "Nespecificat";

  return (
    <div className="medical-history-card">
      <div className="medical-history-header">
        <p className="medical-history-date">
          {new Date(record.createdAt).toLocaleDateString("ro-RO")}
        </p>
        <p className="medical-history-doctor">Dr. {doctorName}</p>
      </div>

      <div className="medical-history-content">
        <p><strong>Diagnostic:</strong> {record.diagnosis}</p>
        <p><strong>Observații:</strong> {record.notes}</p>
      </div>
    </div>
  );
};

export default PatientMedicalHistoryCard;