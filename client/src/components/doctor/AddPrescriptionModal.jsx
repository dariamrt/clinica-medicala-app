import React, { useState } from "react";
import { PatientService } from "@services";
import "@styles/layout/Modal.css"

const AddPrescriptionModal = ({ medicalHistoryId, onClose, onSuccess }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        medical_history_id: medicalHistoryId,
        content: { text: content },
      };
      const newPrescription = await PatientService.addPrescription(payload);
      onSuccess?.(newPrescription);
      onClose();
    } catch (err) {
      console.error("Eroare la adăugare rețetă:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Adaugă rețetă</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Conținut rețetă"
            rows={5}
            required
          />
          <div className="modal-actions">
            <button type="submit">Salvează</button>
            <button type="button" onClick={onClose}>Anulează</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;
