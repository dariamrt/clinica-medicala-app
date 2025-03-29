import React, { useState } from "react";
import { MedicalHistoryService } from "@services";
import "@styles/layout/Modal.css"

const AddMedicalHistoryModal = ({ patientId, onClose, onSuccess }) => {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) return alert("Completează descrierea!");
    try {
      await MedicalHistoryService.addMedicalHistory(patientId, {
        description,
        date: new Date().toISOString().split("T")[0],
      });
      onSuccess();
      onClose();
    } catch (error) {
      alert("Eroare la salvare.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Adaugă fișă medicală</h3>
        <textarea
          rows="4"
          placeholder="Descriere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleSubmit}>Salvează</button>
        <button onClick={onClose}>Anulează</button>
      </div>
    </div>
  );
};

export default AddMedicalHistoryModal;
