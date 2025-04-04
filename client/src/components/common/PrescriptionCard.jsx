import React from "react";
import "@styles/components/PrescriptionCard.css";

const PrescriptionCard = ({ content }) => {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    parsed = null;
  }

  if (!parsed) {
    return <div className="prescription-card">Conținut invalid</div>;
  }

  const { medicamente, durata, observatii } = parsed;

  return (
    <div className="prescription-card">
      <h3>Rețetă Medicală</h3>
      <p><strong>Medicamente:</strong> {medicamente.join(", ")}</p>
      <p><strong>Durată:</strong> {durata}</p>
      <p><strong>Observații:</strong> {observatii}</p>
    </div>
  );
};

export default PrescriptionCard;
