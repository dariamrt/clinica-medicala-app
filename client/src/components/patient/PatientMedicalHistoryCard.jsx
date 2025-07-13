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

      {record.Prescription && (
        <div className="prescriptions-section">
          <div className="prescriptions-list">
            <div className="prescription-card">
              <div className="prescription-meds">
                <strong>Medicamente:</strong>
                {medicamente.length > 0 ? (
                  <ul className="meds-list">
                    {medicamente.map((med, index) => (
                      <li key={index}>{med}</li>
                    ))}
                  </ul>
                ) : (
                  <span> Nespecificat</span>
                )}
              </div>
              
              <div className="prescription-instructions">
                <p><strong>Instrucțiuni:</strong> {instructiuni}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {userRole === "doctor" && (
        <button className="small-btn" onClick={() => onAddPrescription(record.id)}>
          Adaugă rețetă
        </button>
      )}
    </div>
  );
};

export default PatientMedicalHistoryCard;