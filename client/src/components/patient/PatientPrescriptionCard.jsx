import "@styles/components/PrescriptionCard.css";

const PatientPrescriptionCard = ({ content, createdAt }) => {
  let parsed;

  try {
    parsed = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    parsed = null;
  }

  if (!parsed || typeof parsed !== "object") {
    return <div className="prescription-card">Conținut invalid</div>;
  }

  const medicamente = Array.isArray(parsed.meds)
    ? parsed.meds.join(", ")
    : parsed.meds || "Nespecificat";

  const instructiuni = parsed.instructions || "Nespecificat";

  return (
    <div className="prescription-card">
      <h3>Rețetă Medicală</h3>
      <p><strong>Data:</strong> {new Date(createdAt).toLocaleDateString("ro-RO")}</p>
      <p><strong>Medicamente:</strong> {medicamente}</p>
      <p><strong>Instrucțiuni:</strong> {instructiuni}</p>
    </div>
  );
};

export default PatientPrescriptionCard;
